// Philosophia publishing proxy — the project's only backend.
//
// A single POST endpoint that posts a broadsheet (image + caption) to the
// project's X account. It exists because X's API refuses browser CORS and
// requires server-held OAuth credentials; a static GitHub Pages site cannot
// call it directly. The app stays keyless — this Worker holds the four X
// OAuth 1.0a secrets, set via `wrangler secret put` (never in code):
//   X_CONSUMER_KEY  X_CONSUMER_SECRET  X_ACCESS_TOKEN  X_ACCESS_SECRET
// plus PUBLISH_TOKEN, the shared secret the app sends so the public URL can't
// post as you. Optional X_HANDLE makes the returned link canonical.
import { authHeader } from './x-oauth.js'

const UPLOAD_URL = 'https://upload.twitter.com/1.1/media/upload.json'
const TWEET_URL = 'https://api.twitter.com/2/tweets'
const MAX_IMAGE_BYTES = 5 * 1024 * 1024 // X's simple-upload image ceiling

const ALLOWED_ORIGINS = new Set([
  'https://adamabu1.github.io',
  'http://localhost:5173',
  'http://localhost:4173',
])

const corsHeaders = origin => ({
  'Access-Control-Allow-Origin': ALLOWED_ORIGINS.has(origin) ? origin : 'https://adamabu1.github.io',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Max-Age': '86400',
  Vary: 'Origin',
})

const json = (body, status, origin) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
  })

// Length-safe comparison so a wrong token can't be probed by timing.
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

const credsFrom = env => ({
  consumerKey: env.X_CONSUMER_KEY,
  consumerSecret: env.X_CONSUMER_SECRET,
  token: env.X_ACCESS_TOKEN,
  tokenSecret: env.X_ACCESS_SECRET,
})

async function uploadMedia(bytes, creds) {
  const form = new FormData()
  form.append('media', new Blob([bytes]), 'broadsheet.png')
  const header = await authHeader('POST', UPLOAD_URL, {}, creds)
  const res = await fetch(UPLOAD_URL, { method: 'POST', headers: { Authorization: header }, body: form })
  const text = await res.text()
  if (!res.ok) throw { stage: 'media', status: res.status, body: text }
  return JSON.parse(text).media_id_string
}

async function createTweet(text, mediaId, creds) {
  const payload = mediaId ? { text, media: { media_ids: [mediaId] } } : { text }
  const header = await authHeader('POST', TWEET_URL, {}, creds)
  const res = await fetch(TWEET_URL, {
    method: 'POST',
    headers: { Authorization: header, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const body = await res.text()
  if (!res.ok) throw { stage: 'tweet', status: res.status, body }
  return JSON.parse(body).data
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || ''
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders(origin) })
    if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405, origin)

    // Gate: the app must present the shared publish token.
    const auth = request.headers.get('Authorization') || ''
    const bearer = auth.startsWith('Bearer ') ? auth.slice(7) : ''
    if (!env.PUBLISH_TOKEN || !safeEqual(bearer, env.PUBLISH_TOKEN)) {
      return json({ error: 'Unauthorized' }, 401, origin)
    }

    let text, image
    try {
      const form = await request.formData()
      text = (form.get('text') || '').toString().slice(0, 280)
      const file = form.get('image')
      if (file && typeof file.arrayBuffer === 'function') image = new Uint8Array(await file.arrayBuffer())
    } catch {
      return json({ error: 'Expected multipart form-data with text and optional image' }, 400, origin)
    }
    if (!text) return json({ error: 'Missing caption text' }, 400, origin)
    if (image && image.byteLength > MAX_IMAGE_BYTES) {
      return json({ error: 'Image exceeds 5MB' }, 413, origin)
    }

    const creds = credsFrom(env)
    try {
      const mediaId = image ? await uploadMedia(image, creds) : null
      const tweet = await createTweet(text, mediaId, creds)
      const handle = env.X_HANDLE || 'i/web'
      return json({ id: tweet.id, url: `https://x.com/${handle}/status/${tweet.id}` }, 200, origin)
    } catch (err) {
      // Pass X's own status/message through so the app can fall back knowingly
      // (e.g. a 403 on media upload = image posting needs a paid X tier).
      const status = err?.status || 502
      return json({ error: `X ${err?.stage || 'request'} failed`, status, detail: err?.body?.slice?.(0, 500) }, status, origin)
    }
  },
}
