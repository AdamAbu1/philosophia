// Optional one-tap posting to the project's X account, via the Philosophia
// publishing Worker (worker/). BYOK-shaped: the user pastes the Worker's URL
// and the shared publish token into the keys form; both live only in this
// browser's localStorage. Unset → the app keeps using the native share sheet.
const ENDPOINT = 'philosophia.publishEndpoint'
const TOKEN = 'philosophia.publishToken'

const store = {
  get(k) {
    try { return localStorage.getItem(k) } catch { return null }
  },
  set(k, v) {
    try { v ? localStorage.setItem(k, v) : localStorage.removeItem(k) } catch { /* private mode */ }
  },
}

export const getPublishEndpoint = () => store.get(ENDPOINT)
export const setPublishEndpoint = v => store.set(ENDPOINT, v && v.trim())
export const getPublishToken = () => store.get(TOKEN)
export const setPublishToken = v => store.set(TOKEN, v && v.trim())
export const isPublishConfigured = () => !!(getPublishEndpoint() && getPublishToken())

// Posts image + caption through the Worker. Resolves { id, url } on success;
// throws with the Worker/X message on failure so the caller can fall back.
export async function postToX({ image, text }) {
  const endpoint = getPublishEndpoint()
  const token = getPublishToken()
  if (!endpoint || !token) throw new Error('Publishing endpoint not configured')

  const form = new FormData()
  if (image) form.append('image', image, 'broadsheet.png')
  form.append('text', text)

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const detail = data.detail ? ` — ${data.detail}` : ''
    throw new Error(`${data.error || `Publish failed (${res.status})`}${detail}`)
  }
  return data
}
