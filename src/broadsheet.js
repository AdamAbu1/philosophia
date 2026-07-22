// The broadsheet: renders a finished symposium or solo conversation as an
// engraved, shareable PNG in the house style, entirely client-side, plus the
// plain-text transcript. Cast: {a, b} = symposium; {solo: id|null} = a persona
// conversation (null = the guide, Lady Philosophia).
import { byId, eraById } from './data.js'
import { fmtRange } from './format.js'
import { speakableText } from './voice.js'

export const SITE = 'adamabu1.github.io/philosophia'

const PAPER = '#f3ecdb'
const INK = '#2b2620'
const SOFT = '#4a4237'
const FADED = '#7a6f5d'
const RULE = '#c9bda4'

// ---- pure helpers (tested) --------------------------------------------------

// The guide has no canon id; she appears in sessions under this sentinel.
export const GUIDE = 'philosophia'

// Extracts the session from the panel's message list.
// cast: {a, b} for a symposium, {solo: thinkerId|null} for a conversation.
export function sessionFromMessages(messages, cast) {
  const solo = 'solo' in cast
  const question = messages.find(m => m.role === 'user')?.question ?? ''
  const turns = messages
    .filter(m => (m.role === 'user' ? m.question !== question : !!m.text))
    .map(m =>
      m.role === 'user'
        ? { who: 'user', text: m.question }
        : {
            who: solo ? (cast.solo ?? GUIDE) : m.speakerId,
            text: speakableText(m.text),
          },
    )
  return solo
    ? { solo: cast.solo ?? GUIDE, question, turns }
    : { a: cast.a, b: cast.b, question, turns }
}

// Greedy word wrap with an injected measure function (px width of a string).
export function wrapLines(text, maxWidth, measure) {
  const lines = []
  for (const rawLine of text.split('\n')) {
    const words = rawLine.split(/\s+/).filter(Boolean)
    let line = ''
    for (const w of words) {
      const candidate = line ? `${line} ${w}` : w
      if (measure(candidate) <= maxWidth || !line) line = candidate
      else {
        lines.push(line)
        line = w
      }
    }
    lines.push(line)
  }
  return lines.filter((l, i, arr) => l !== '' || i !== arr.length - 1)
}

const speakerName = who =>
  who === 'user' ? 'The Questioner' : who === GUIDE ? 'Lady Philosophia' : byId[who].name

// Largest letter-spacing (from `steps`, widest first) at which the title fits
// maxWidth. `measureAt(spacing)` returns the rendered width at that spacing.
// Falls back to the tightest step so a long title never overflows the frame.
export function fitTitleSpacing(measureAt, maxWidth, steps = [10, 8, 6, 4, 2]) {
  for (const s of steps) if (measureAt(s) <= maxWidth) return s
  return steps[steps.length - 1]
}

const portraitFor = who =>
  who === GUIDE ? 'portraits/philosophia.jpg' : byId[who].portrait

// "A SYMPOSIUM — X & Y" or "A CONVERSATION — with X"
const castLabel = session =>
  'solo' in session
    ? { kind: 'A CONVERSATION', names: `with ${speakerName(session.solo)}` }
    : { kind: 'A SYMPOSIUM', names: `${byId[session.a].name} & ${byId[session.b].name}` }

export function transcriptText(session) {
  const { kind, names } = castLabel(session)
  const head = `PHILOSOPHIA · ${kind}\n${names}\n“${session.question}”`
  const body = session.turns
    .map(t => `${speakerName(t.who).toUpperCase()} — ${t.text}`)
    .join('\n\n')
  return `${head}\n\n${body}\n\n${SITE}`
}

// X's weighted character count: most characters weigh 1, but CJK and other
// ranges outside twitter-text's weight-1 set weigh 2, so a Chinese-language
// question can blow past 280 while looking short by code-unit length.
const isLightWeight = cp =>
  (cp >= 0 && cp <= 4351) ||
  (cp >= 8192 && cp <= 8205) ||
  (cp >= 8208 && cp <= 8223) ||
  (cp >= 8242 && cp <= 8247)

export function weightedLength(str) {
  let n = 0
  for (const ch of str) n += isLightWeight(ch.codePointAt(0)) ? 1 : 2
  return n
}

// Trims text so that `text` (or `text…` when it must be cut) fits within
// `budget` weighted characters. The ellipsis itself is weight-2, so its cost
// is reserved from the target.
export function trimToWeight(text, budget) {
  if (weightedLength(text) <= budget) return text
  const target = budget - weightedLength('…')
  let out = '',
    w = 0
  for (const ch of text) {
    const cw = weightedLength(ch)
    if (w + cw > target) break
    out += ch
    w += cw
  }
  return out.trimEnd() + '…'
}

// The post caption for direct publishing — question, cast, and link, kept
// within X's weighted 280-limit (the question is trimmed by weight if needed).
export function captionFor(session) {
  const { names } = castLabel(session)
  const what = 'solo' in session ? `a conversation ${names}` : `${names}, a symposium`
  const tail = ` — ${what} in Philosophia\nhttps://${SITE}`
  const budget = 280 - weightedLength(tail) - 2 // 2 = the curly quotes
  return `“${trimToWeight(session.question, budget)}”${tail}`
}

export const tweetUrl = session =>
  `https://twitter.com/intent/tweet?text=${encodeURIComponent(captionFor(session))}`

// ---- canvas rendering -------------------------------------------------------

const loadImage = src =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })

function drawMedallion(ctx, img, cx, cy, r) {
  ctx.save()
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.clip()
  const scale = Math.max((2 * r) / img.width, (2 * r) / img.height)
  const w = img.width * scale
  const h = img.height * scale
  ctx.drawImage(img, cx - w / 2, cy - h * 0.42, w, h)
  ctx.restore()
  ctx.lineWidth = 3
  ctx.strokeStyle = SOFT
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.stroke()
  ctx.lineWidth = 1
  ctx.strokeStyle = RULE
  ctx.beginPath()
  ctx.arc(cx, cy, r + 6, 0, Math.PI * 2)
  ctx.stroke()
}

// Renders the session to a PNG blob. All layout is measured first, then drawn.
export async function renderBroadsheet(session) {
  const W = 1200
  const M = 96
  const bodyWidth = W - 2 * M

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  const fonts = {
    title: '600 30px Georgia, serif',
    question: 'italic 46px Georgia, serif',
    name: '600 24px Georgia, serif',
    label: '600 21px Georgia, serif',
    body: '29px Georgia, serif',
    bodyItalic: 'italic 29px Georgia, serif',
    footer: 'italic 24px Georgia, serif',
  }
  const measure = font => s => {
    ctx.font = font
    return ctx.measureText(s).width
  }

  // measure pass
  const qLines = wrapLines(session.question, bodyWidth, measure(fonts.question))
  const blocks = session.turns.map(t => ({
    who: t.who,
    lines: wrapLines(t.text, t.who === 'user' ? bodyWidth - 40 : bodyWidth, measure(t.who === 'user' ? fonts.bodyItalic : fonts.body)),
  }))
  const LH = 46
  let height = 88 // top rule + title
  height += 40 + qLines.length * 64 + 30 // question
  height += 300 // medallions + names
  for (const b of blocks) height += 44 + b.lines.length * LH + 26
  height += 110 // footer

  canvas.width = W
  canvas.height = height

  // paper
  ctx.fillStyle = PAPER
  ctx.fillRect(0, 0, W, height)
  for (const [x, y, r] of [
    [W * 0.18, height * 0.1, W * 0.5],
    [W * 0.85, height * 0.9, W * 0.45],
  ]) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, 'rgba(140,110,60,.07)')
    g.addColorStop(1, 'rgba(140,110,60,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, height)
  }
  // frame
  ctx.strokeStyle = SOFT
  ctx.lineWidth = 2
  ctx.strokeRect(26, 26, W - 52, height - 52)
  ctx.strokeStyle = RULE
  ctx.lineWidth = 1
  ctx.strokeRect(34, 34, W - 68, height - 68)

  let y = 96
  ctx.textAlign = 'center'
  ctx.fillStyle = INK
  const solo = 'solo' in session
  const titleText = solo
    ? 'P H I L O S O P H I A · A  C O N V E R S A T I O N'
    : 'P H I L O S O P H I A · A  S Y M P O S I U M'
  ctx.font = fonts.title
  const titleSpacing = fitTitleSpacing(s => {
    try { ctx.letterSpacing = `${s}px` } catch { /* older engines */ }
    return ctx.measureText(titleText).width
  }, W - 80)
  try { ctx.letterSpacing = `${titleSpacing}px` } catch { /* older engines */ }
  ctx.fillText(titleText, W / 2, y)
  try { ctx.letterSpacing = '0px' } catch { /* older engines */ }

  y += 78
  ctx.font = fonts.question
  ctx.fillStyle = SOFT
  // Open the quotation on the first wrapped line, close it on the last, so a
  // multi-line question reads as one quote rather than quoting every line.
  qLines.forEach((line, i) => {
    const open = i === 0 ? '“' : ''
    const close = i === qLines.length - 1 ? '”' : ''
    ctx.fillText(`${open}${line}${close}`, W / 2, y)
    y += 64
  })

  // medallions: the pair in symposium, one centered chair in conversation
  y += 30
  const r = 105
  const cy = y + r
  if (solo) {
    const img = await loadImage(portraitFor(session.solo))
    drawMedallion(ctx, img, W / 2, cy, r)
    ctx.font = fonts.name
    ctx.fillStyle = INK
    ctx.fillText(speakerName(session.solo), W / 2, cy + r + 44)
  } else {
    const [imgA, imgB] = await Promise.all([
      loadImage(byId[session.a].portrait),
      loadImage(byId[session.b].portrait),
    ])
    drawMedallion(ctx, imgA, W / 2 - 190, cy, r)
    drawMedallion(ctx, imgB, W / 2 + 190, cy, r)
    ctx.font = fonts.name
    ctx.fillStyle = INK
    ctx.fillText(byId[session.a].name, W / 2 - 190, cy + r + 44)
    ctx.fillText(byId[session.b].name, W / 2 + 190, cy + r + 44)
    ctx.font = fonts.footer
    ctx.fillStyle = FADED
    ctx.fillText('&', W / 2, cy + 10)
  }
  y = cy + r + 84

  // turns
  ctx.textAlign = 'left'
  for (const b of blocks) {
    const isUser = b.who === 'user'
    ctx.font = fonts.label
    ctx.fillStyle = FADED
    try { ctx.letterSpacing = '3px' } catch { /* older engines */ }
    ctx.fillText(speakerName(b.who).toUpperCase(), M + (isUser ? 40 : 0), y)
    try { ctx.letterSpacing = '0px' } catch { /* older engines */ }
    y += 40
    ctx.font = isUser ? fonts.bodyItalic : fonts.body
    ctx.fillStyle = isUser ? SOFT : INK
    const x = M + (isUser ? 40 : 0)
    const yTop = y
    for (const line of b.lines) {
      ctx.fillText(line, x, y)
      y += LH
    }
    if (isUser) {
      ctx.strokeStyle = RULE
      ctx.lineWidth = 3
      ctx.beginPath()
      ctx.moveTo(M + 14, yTop - 30)
      ctx.lineTo(M + 14, y - 28)
      ctx.stroke()
    }
    y += 30
  }

  // footer
  ctx.strokeStyle = RULE
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(M, y)
  ctx.lineTo(W - M, y)
  ctx.moveTo(M, y + 5)
  ctx.lineTo(W - M, y + 5)
  ctx.stroke()
  ctx.textAlign = 'center'
  ctx.font = fonts.footer
  ctx.fillStyle = FADED
  ctx.fillText(SITE, W / 2, y + 52)

  return new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
}

// ---- the day's line card ----------------------------------------------------

// The caption for posting a day's line — quote + name + link, within X's
// weighted 280-limit (the quote is trimmed by weight if it must be).
export function dailyCaptionFor(p) {
  const tail = ` — ${p.name}\nhttps://${SITE}`
  const budget = 280 - weightedLength(tail) - 2 // 2 = the curly quotes
  return `“${trimToWeight(p.line, budget)}”${tail}`
}

// Renders the day's line as an engraved 16:9 card (centered medallion, the
// signature quote, name and dates) — the shareable form of the header line.
export async function renderDailyCard(p) {
  const W = 1200
  const H = 675
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')

  // paper + washes
  ctx.fillStyle = PAPER
  ctx.fillRect(0, 0, W, H)
  for (const [x, y, r] of [
    [W * 0.16, H * 0.12, W * 0.5],
    [W * 0.84, H * 0.88, W * 0.45],
  ]) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, 'rgba(140,110,60,.07)')
    g.addColorStop(1, 'rgba(140,110,60,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, W, H)
  }
  // frame
  ctx.strokeStyle = SOFT
  ctx.lineWidth = 2
  ctx.strokeRect(26, 26, W - 52, H - 52)
  ctx.strokeStyle = RULE
  ctx.lineWidth = 1
  ctx.strokeRect(34, 34, W - 68, H - 68)

  // header
  ctx.textAlign = 'center'
  ctx.fillStyle = INK
  const header = 'P H I L O S O P H I A'
  ctx.font = '600 26px Georgia, serif'
  const hs = fitTitleSpacing(s => {
    try { ctx.letterSpacing = `${s}px` } catch { /* older engines */ }
    return ctx.measureText(header).width
  }, W - 120)
  try { ctx.letterSpacing = `${hs}px` } catch { /* older engines */ }
  ctx.fillText(header, W / 2, 84)
  try { ctx.letterSpacing = '0px' } catch { /* older engines */ }
  ctx.font = 'italic 21px Georgia, serif'
  ctx.fillStyle = FADED
  ctx.fillText('the day’s line', W / 2, 116)

  // medallion
  const img = await loadImage(p.portrait)
  const r = 96
  const cy = 240
  drawMedallion(ctx, img, W / 2, cy, r)

  // quote — one opening/closing quotation across wrapped lines
  const measure = font => s => {
    ctx.font = font
    return ctx.measureText(s).width
  }
  const qFont = 'italic 42px Georgia, serif'
  const qLines = wrapLines(p.line, W - 260, measure(qFont))
  ctx.font = qFont
  ctx.fillStyle = INK
  let qy = cy + r + 78
  qLines.forEach((line, i) => {
    const open = i === 0 ? '“' : ''
    const close = i === qLines.length - 1 ? '”' : ''
    ctx.fillText(`${open}${line}${close}`, W / 2, qy)
    qy += 56
  })

  // attribution
  ctx.font = '600 26px Georgia, serif'
  ctx.fillStyle = SOFT
  try { ctx.letterSpacing = '3px' } catch { /* older engines */ }
  ctx.fillText(p.name.toUpperCase(), W / 2, qy + 22)
  try { ctx.letterSpacing = '0px' } catch { /* older engines */ }
  ctx.font = 'italic 21px Georgia, serif'
  ctx.fillStyle = FADED
  ctx.fillText(`${fmtRange(p)} · ${p.place.name} · ${eraById[p.era].name}`, W / 2, qy + 54)

  // footer
  ctx.strokeStyle = RULE
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(W / 2 - 260, H - 78)
  ctx.lineTo(W / 2 + 260, H - 78)
  ctx.stroke()
  ctx.font = 'italic 20px Georgia, serif'
  ctx.fillStyle = FADED
  ctx.fillText(SITE, W / 2, H - 46)

  return new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
}
