// OAuth 1.0a (HMAC-SHA1) request signing for the X (Twitter) API.
//
// Portable: uses the Web Crypto API (`crypto.subtle`), present in Cloudflare
// Workers, Node 20+, and browsers — no host imports. Pure except for the HMAC;
// nonce and timestamp are injected so signatures are verifiable against known
// vectors. test/x-oauth.test.js asserts the canonical OAuth Core 1.0a example
// (Appendix A.5.2) character-for-character, base string and signature both.

// RFC 3986 percent-encoding — stricter than encodeURIComponent (also escapes
// ! * ' ( )), as OAuth 1.0a requires.
export function percentEncode(str) {
  return encodeURIComponent(String(str)).replace(
    /[!*'()]/g,
    c => '%' + c.charCodeAt(0).toString(16).toUpperCase(),
  )
}

// The signature base string: METHOD & encoded-URL & encoded-sorted-params.
// `params` holds the oauth_* fields plus any query params — NOT multipart or
// JSON body fields, which OAuth 1.0a excludes from the signature.
export function signatureBaseString(method, url, params) {
  const normalized = Object.keys(params)
    .map(k => [percentEncode(k), percentEncode(params[k])])
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : 0))
    .map(([k, v]) => `${k}=${v}`)
    .join('&')
  return [method.toUpperCase(), percentEncode(url), percentEncode(normalized)].join('&')
}

async function hmacSha1Base64(key, message) {
  const enc = new TextEncoder()
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(key),
    { name: 'HMAC', hash: 'SHA-1' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', cryptoKey, enc.encode(message))
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
}

// Signs and returns the base64 oauth_signature. `params` = query params +
// oauth_* fields. Exposed for vector testing.
export function signRequest(method, url, params, consumerSecret, tokenSecret) {
  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(tokenSecret)}`
  return hmacSha1Base64(signingKey, signatureBaseString(method, url, params))
}

const randomNonce = () => {
  const bytes = crypto.getRandomValues(new Uint8Array(16))
  return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('')
}

// Builds the full `Authorization: OAuth ...` header value for a request.
// creds: { consumerKey, consumerSecret, token, tokenSecret }.
// queryParams: any params in the URL's query string (empty for our calls).
// opts.nonce / opts.timestamp are injected in tests; random / now otherwise.
export async function authHeader(method, url, queryParams, creds, opts = {}) {
  const oauth = {
    oauth_consumer_key: creds.consumerKey,
    oauth_nonce: opts.nonce ?? randomNonce(),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: String(opts.timestamp ?? Math.floor(Date.now() / 1000)),
    oauth_token: creds.token,
    oauth_version: '1.0',
  }
  const signature = await signRequest(
    method,
    url,
    { ...queryParams, ...oauth },
    creds.consumerSecret,
    creds.tokenSecret,
  )
  const header = { ...oauth, oauth_signature: signature }
  return (
    'OAuth ' +
    Object.keys(header)
      .sort()
      .map(k => `${percentEncode(k)}="${percentEncode(header[k])}"`)
      .join(', ')
  )
}
