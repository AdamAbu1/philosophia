import { describe, it, expect } from 'vitest'
import {
  percentEncode,
  signatureBaseString,
  signRequest,
  authHeader,
} from '../worker/x-oauth.js'

// Canonical vector — OAuth Core 1.0a, Appendix A.5.2. This is the protocol
// spec's own worked example, so passing it proves the signer is correct.
const VECTOR = {
  method: 'GET',
  url: 'http://photos.example.net/photos',
  params: {
    file: 'vacation.jpg',
    size: 'original',
    oauth_consumer_key: 'dpf43f3p2l4k3l03',
    oauth_nonce: 'kllo9940pd9333jh',
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp: '1191242096',
    oauth_token: 'nnch734d00sl2jdk',
    oauth_version: '1.0',
  },
  consumerSecret: 'kd94hf93k423kf44',
  tokenSecret: 'pfkkdhi9sl3r4s00',
  baseString:
    'GET&http%3A%2F%2Fphotos.example.net%2Fphotos&file%3Dvacation.jpg%26oauth_consumer_key%3Ddpf43f3p2l4k3l03%26oauth_nonce%3Dkllo9940pd9333jh%26oauth_signature_method%3DHMAC-SHA1%26oauth_timestamp%3D1191242096%26oauth_token%3Dnnch734d00sl2jdk%26oauth_version%3D1.0%26size%3Doriginal',
  signature: 'tR3+Ty81lMeYAr/Fid0kMTYa/WM=',
}

describe('percentEncode', () => {
  it('escapes the RFC-3986 sub-delims that encodeURIComponent leaves', () => {
    expect(percentEncode("a!b*c'd(e)f")).toBe('a%21b%2Ac%27d%28e%29f')
  })
  it('escapes spaces and reserved characters', () => {
    expect(percentEncode('Ladies + Gentlemen')).toBe('Ladies%20%2B%20Gentlemen')
    expect(percentEncode('a&b=c')).toBe('a%26b%3Dc')
  })
})

describe('OAuth 1.0a canonical vector (spec A.5.2)', () => {
  it('reproduces the exact signature base string', () => {
    expect(signatureBaseString(VECTOR.method, VECTOR.url, VECTOR.params)).toBe(VECTOR.baseString)
  })

  it('reproduces the exact HMAC-SHA1 signature', async () => {
    const sig = await signRequest(
      VECTOR.method,
      VECTOR.url,
      VECTOR.params,
      VECTOR.consumerSecret,
      VECTOR.tokenSecret,
    )
    expect(sig).toBe(VECTOR.signature)
  })
})

describe('authHeader', () => {
  const creds = {
    consumerKey: 'dpf43f3p2l4k3l03',
    consumerSecret: 'kd94hf93k423kf44',
    token: 'nnch734d00sl2jdk',
    tokenSecret: 'pfkkdhi9sl3r4s00',
  }

  it('embeds the vector signature and all oauth fields, quoted and sorted', async () => {
    const header = await authHeader(
      VECTOR.method,
      VECTOR.url,
      { file: 'vacation.jpg', size: 'original' },
      creds,
      { nonce: 'kllo9940pd9333jh', timestamp: 1191242096 },
    )
    expect(header.startsWith('OAuth ')).toBe(true)
    expect(header).toContain('oauth_signature="tR3%2BTy81lMeYAr%2FFid0kMTYa%2FWM%3D"')
    expect(header).toContain('oauth_consumer_key="dpf43f3p2l4k3l03"')
    expect(header).toContain('oauth_nonce="kllo9940pd9333jh"')
    expect(header).toContain('oauth_version="1.0"')
    // fields appear in sorted order
    expect(header.indexOf('oauth_consumer_key')).toBeLessThan(header.indexOf('oauth_nonce'))
    expect(header.indexOf('oauth_signature=')).toBeLessThan(header.indexOf('oauth_signature_method'))
  })

  it('does not leak query params into the header', async () => {
    const header = await authHeader(VECTOR.method, VECTOR.url, { file: 'vacation.jpg' }, creds, {
      nonce: 'n',
      timestamp: 1,
    })
    expect(header).not.toContain('file')
    expect(header).not.toContain('vacation')
  })
})
