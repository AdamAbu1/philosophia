// "Ask Philosophia" — inline conversational panel below the globe.
// Three modes: the resident guide (default), persona conversations entered
// from a thinker's entry, and the symposium — two personas debating with the
// owner as questioner and third chair. BYOK: the user's Anthropic key lives in
// localStorage. Voice mode composes a spoken conversation entirely in the
// browser: mic → SpeechRecognition → persona chat → sentence-streamed speech.
import { useEffect, useRef, useState } from 'react'
import { byId, PHILOSOPHERS } from './data.js'
import {
  Anthropic,
  MODELS,
  getApiKey,
  setApiKey,
  clearApiKey,
  getModel,
  setModel,
  buildGuideSystem,
  buildPersonaSystem,
  buildSymposiumSystem,
  symposiumMessages,
  contextIds,
  buildUserTurn,
  parseMarkers,
  streamReply,
} from './agent.js'
import { LIVING, livingSrc } from './living.js'
import { sessionFromMessages, renderBroadsheet, transcriptText, tweetUrl } from './broadsheet.js'
import {
  voiceSupport,
  makeSpeaker,
  makeListener,
  speakableText,
  nextSentences,
  flushRemainder,
  getElevenLabsKey,
  setElevenLabsKey,
  VOICE_REGISTER,
} from './voice.js'

const ROSTER = [...PHILOSOPHERS].sort((a, b) => a.name.localeCompare(b.name))

function Reply({ text, streaming, onSelect, label }) {
  return (
    <div className="agent-msg assistant">
      {label && <span className="speaker-label">{label}</span>}
      {parseMarkers(text, { streaming }).map((seg, i) =>
        seg.type === 'chip' ? (
          <button key={i} className="tchip" onClick={() => onSelect(seg.id)}>
            {byId[seg.id].name}
          </button>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
      {streaming && <span className="cursor">▍</span>}
    </div>
  )
}

function Chair({ id, speaking }) {
  const p = byId[id]
  return (
    <figure className="chair">
      {LIVING.has(id) ? (
        <div className="living-stage chair-stage" aria-hidden="true">
          <video
            className={speaking ? 'living' : 'living on'}
            src={livingSrc(id, 'idle')}
            poster={p.portrait}
            autoPlay
            muted
            loop
            playsInline
          />
          <video
            className={speaking ? 'living on' : 'living'}
            src={livingSrc(id, 'speaking')}
            autoPlay
            muted
            loop
            playsInline
          />
        </div>
      ) : (
        <div className={speaking ? 'living-stage chair-stage speaking' : 'living-stage chair-stage'}>
          <img className="chair-still" src={p.portrait} alt={`Engraved portrait of ${p.name}`} />
        </div>
      )}
      <figcaption className="nameplate">{p.name}</figcaption>
    </figure>
  )
}

export default function AgentPanel({ personaId, onExitPersona, selectedId, onSelect }) {
  const [keyed, setKeyed] = useState(() => !!getApiKey())
  const [showKeyForm, setShowKeyForm] = useState(false)
  const [keyDraft, setKeyDraft] = useState('')
  const [elDraft, setElDraft] = useState('')
  const [model, setModelState] = useState(() => getModel())
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [voiceOn, setVoiceOn] = useState(false)
  const [listening, setListening] = useState(false)
  const [speaking, setSpeaking] = useState(false)
  const [symp, setSymp] = useState(null) // {a, b} while a symposium sits
  const [sympSetup, setSympSetup] = useState(false)
  const [sympDraft, setSympDraft] = useState({ a: 'socrates', b: 'nietzsche', q: '' })
  const [shareMenu, setShareMenu] = useState(null)
  const [publishing, setPublishing] = useState(false)
  const tapeRef = useRef([]) // mp3 blobs of a voiced symposium, in play order

  const streamRef = useRef(null)
  const speakerRef = useRef(null)
  const listenerRef = useRef(null)
  const logRef = useRef(null)
  const voiceOnRef = useRef(false)
  const busyRef = useRef(false)
  const sympRef = useRef(null)
  const messagesRef = useRef([])

  const persona = personaId ? byId[personaId] : null
  const support = voiceSupport()
  voiceOnRef.current = voiceOn
  busyRef.current = busy
  sympRef.current = symp
  messagesRef.current = messages

  const quiesceVoice = () => {
    speakerRef.current?.stop()
    speakerRef.current = null
    listenerRef.current?.abort()
    setSpeaking(false)
    setListening(false)
  }

  const closeShareMenu = () => {
    setShareMenu(menu => {
      if (menu) {
        URL.revokeObjectURL(menu.pngUrl)
        if (menu.mp3Url) URL.revokeObjectURL(menu.mp3Url)
      }
      return null
    })
  }

  // Entering or leaving a persona resets the panel — including any symposium.
  useEffect(() => {
    streamRef.current?.abort()
    quiesceVoice()
    setSymp(null)
    setSympSetup(false)
    setMessages([])
    setError(null)
    tapeRef.current = []
    closeShareMenu()
  }, [personaId])

  useEffect(
    () => () => {
      streamRef.current?.abort()
      speakerRef.current?.stop()
      listenerRef.current?.abort()
    },
    [],
  )

  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  const saveKey = e => {
    e.preventDefault()
    const k = keyDraft.trim()
    if (k) {
      setApiKey(k)
      setKeyed(true)
    }
    if (elDraft.trim()) setElevenLabsKey(elDraft.trim())
    if (k || getApiKey()) setShowKeyForm(false)
    setKeyDraft('')
    setElDraft('')
    setError(null)
  }

  const pickModel = e => {
    setModel(e.target.value)
    setModelState(e.target.value)
  }

  const clearConversation = () => {
    streamRef.current?.abort()
    quiesceVoice()
    setMessages([])
    setError(null)
  }

  const adjourn = () => {
    streamRef.current?.abort()
    quiesceVoice()
    setSymp(null)
    setSympSetup(false)
    setMessages([])
    setError(null)
    tapeRef.current = []
    closeShareMenu()
  }

  const stopAll = () => {
    streamRef.current?.abort()
    quiesceVoice()
  }

  const toggleVoice = () => {
    if (voiceOn) {
      quiesceVoice()
      setVoiceOn(false)
    } else {
      // A user-gesture utterance unlocks speech on iOS before the first
      // streamed sentence arrives outside a gesture context.
      if (support.tts) {
        try {
          speechSynthesis.speak(new SpeechSynthesisUtterance(''))
          speechSynthesis.cancel()
        } catch { /* fine */ }
      }
      setVoiceOn(true)
    }
  }

  const startListening = () => {
    if (!support.stt || busyRef.current) return
    speakerRef.current?.stop()
    setSpeaking(false)
    if (!listenerRef.current) {
      listenerRef.current = makeListener({
        onInterim: t => setInput(t),
        onFinal: t => {
          setInput('')
          if (sympRef.current) interject(t)
          else send(t)
        },
        onEnd: () => setListening(false),
        onError: e => {
          if (e !== 'no-speech' && e !== 'aborted')
            setError(
              e === 'not-allowed'
                ? 'The microphone was blocked — allow it in the browser and try again.'
                : `Microphone: ${e}`,
            )
        },
      })
      if (!listenerRef.current) return
    }
    setError(null)
    setListening(true)
    listenerRef.current.start()
  }

  const micPress = () => {
    if (listening) listenerRef.current?.stop()
    else startListening()
  }

  // ---- shared streaming core -----------------------------------------------

  // Streams one reply. `speakerId` labels symposium turns (null = guide or
  // persona); `system`/`apiMessages` are fully built by the caller.
  const runStream = async ({ system, apiMessages, speakerId, voicePersona, autoListen, onClip }) => {
    setMessages(ms => [
      ...ms,
      { role: 'assistant', text: '', blocks: null, streaming: true, speakerId },
    ])
    setBusy(true)
    busyRef.current = true
    setError(null)

    const wantSpeech = voiceOnRef.current
    speakerRef.current?.stop()
    let speaker = null
    if (wantSpeech) {
      speaker = await makeSpeaker(voicePersona, {
        onStart: () => setSpeaking(true),
        onIdle: () => {
          setSpeaking(false)
          if (autoListen && voiceOnRef.current && !busyRef.current && support.stt) startListening()
        },
        onError: () => setError('Character voices unavailable — using system voices.'),
        onClip,
      })
      speakerRef.current = speaker
    }

    let accumulated = ''
    let spokenOffset = 0
    const speakNew = () => {
      if (!speaker) return
      const { sentences, offset } = nextSentences(accumulated, spokenOffset)
      spokenOffset = offset
      for (const s of sentences) speaker.enqueue(speakableText(s))
    }

    const stream = streamReply({
      apiKey: getApiKey(),
      model,
      system: wantSpeech ? system + VOICE_REGISTER : system,
      effort: wantSpeech ? 'low' : undefined,
      messages: apiMessages,
      onText: delta => {
        accumulated += delta
        setMessages(ms => {
          const last = ms[ms.length - 1]
          return [...ms.slice(0, -1), { ...last, text: last.text + delta }]
        })
        speakNew()
      },
    })
    streamRef.current = stream

    try {
      const final = await stream.finalMessage()
      const text = final.content
        .filter(b => b.type === 'text')
        .map(b => b.text)
        .join('')
      setMessages(ms => [
        ...ms.slice(0, -1),
        { role: 'assistant', text, blocks: final.content, streaming: false, speakerId },
      ])
      if (speaker) {
        const rest = flushRemainder(accumulated, spokenOffset)
        if (rest) speaker.enqueue(speakableText(rest))
        else if (speaker.pending <= 0) {
          setSpeaking(false)
          if (autoListen && voiceOnRef.current && support.stt) {
            busyRef.current = false
            startListening()
          }
        }
      }
    } catch (err) {
      speaker?.stop()
      setSpeaking(false)
      // Keep whatever streamed before the failure; drop an empty placeholder.
      setMessages(ms => {
        const last = ms[ms.length - 1]
        if (last?.role === 'assistant' && last.streaming)
          return last.text
            ? [...ms.slice(0, -1), { ...last, streaming: false }]
            : ms.slice(0, -1)
        return ms
      })
      if (err instanceof Anthropic.APIUserAbortError) {
        // user pressed stop — not an error
      } else if (err instanceof Anthropic.AuthenticationError) {
        clearApiKey()
        setKeyed(false)
        setError('That key was refused — paste it again.')
      } else if (err instanceof Anthropic.RateLimitError) {
        setError('Rate limited — give it a moment, then ask again.')
      } else if (err instanceof Anthropic.APIConnectionError) {
        setError('Could not reach api.anthropic.com — are you offline?')
      } else {
        setError(err?.message ?? 'Something went wrong.')
      }
    } finally {
      setBusy(false)
      busyRef.current = false
      streamRef.current = null
    }
  }

  // ---- guide & persona -----------------------------------------------------

  const send = async question => {
    question = (question ?? '').trim()
    if (!question || busyRef.current || !getApiKey()) return
    const prior = messagesRef.current
    const lastReply = [...prior].reverse().find(m => m.role === 'assistant')?.text ?? ''
    const ids = contextIds(question, { personaId, selectedId, lastReply })
    const apiMessages = []
    for (const m of prior) {
      // Past user turns replay without their <records> to keep history lean.
      if (m.role === 'user') apiMessages.push({ role: 'user', content: m.question })
      else if (m.blocks) apiMessages.push({ role: 'assistant', content: m.blocks })
      else if (m.text) apiMessages.push({ role: 'assistant', content: m.text })
    }
    apiMessages.push({ role: 'user', content: buildUserTurn(question, ids) })
    setMessages(ms => [...ms, { role: 'user', question }])
    setInput('')
    await runStream({
      system: persona ? buildPersonaSystem(persona.id) : buildGuideSystem(),
      apiMessages,
      speakerId: null,
      voicePersona: personaId,
      autoListen: true,
    })
  }

  // ---- symposium -----------------------------------------------------------

  const toEvents = msgs =>
    msgs
      .filter(m => (m.role === 'user' ? true : !!m.text))
      .map(m =>
        m.role === 'user'
          ? { who: 'user', text: m.question }
          : { who: m.speakerId, text: m.text, blocks: m.blocks },
      )

  const nextSpeaker = () => {
    const s = sympRef.current
    if (!s) return null
    const last = [...messagesRef.current].reverse().find(m => m.role === 'assistant' && m.speakerId)
    return last?.speakerId === s.a ? s.b : s.a
  }

  const runTurn = async (speakerId, events) => {
    const s = sympRef.current
    if (!s || busyRef.current || !getApiKey()) return
    const otherId = speakerId === s.a ? s.b : s.a
    const lastHeard = [...events].reverse().find(e => e.who !== speakerId)
    const lastOwnRival = [...events].reverse().find(e => e.who === otherId)
    const ids = contextIds(lastHeard?.text ?? '', {
      personaId: speakerId,
      selectedId: otherId,
      lastReply: lastOwnRival?.text ?? '',
    })
    await runStream({
      system: buildSymposiumSystem(speakerId, otherId),
      apiMessages: symposiumMessages(events, speakerId, ids),
      speakerId,
      voicePersona: speakerId,
      autoListen: false,
      onClip: b => tapeRef.current.push(b),
    })
  }

  const publish = async () => {
    const s = sympRef.current
    if (!s || publishing) return
    setPublishing(true)
    try {
      const session = sessionFromMessages(messagesRef.current, s)
      const pngBlob = await renderBroadsheet(session)
      const files = [new File([pngBlob], 'symposium.png', { type: 'image/png' })]
      let mp3Blob = null
      if (tapeRef.current.length) {
        mp3Blob = new Blob(tapeRef.current, { type: 'audio/mpeg' })
        files.push(new File([mp3Blob], 'symposium.mp3', { type: 'audio/mpeg' }))
      }
      const payload = {
        files,
        title: 'A symposium in Philosophia',
        text: `“${session.question}” — ${byId[s.a].name} & ${byId[s.b].name}`,
      }
      if (navigator.canShare?.(payload)) {
        await navigator.share(payload)
      } else {
        closeShareMenu()
        setShareMenu({
          pngUrl: URL.createObjectURL(pngBlob),
          mp3Url: mp3Blob ? URL.createObjectURL(mp3Blob) : null,
          transcript: transcriptText(session),
          tweet: tweetUrl(session),
        })
      }
    } catch (err) {
      if (err?.name !== 'AbortError') setError(err?.message ?? 'Could not publish the proceedings.')
    } finally {
      setPublishing(false)
    }
  }

  const convene = e => {
    e.preventDefault()
    const { a, b, q } = sympDraft
    const question = q.trim()
    if (!question || a === b || busyRef.current) return
    const seat = { a, b }
    setSymp(seat)
    sympRef.current = seat
    setSympSetup(false)
    const opening = [{ role: 'user', question }]
    setMessages(opening)
    messagesRef.current = opening
    setSympDraft(d => ({ ...d, q: '' }))
    runTurn(a, toEvents(opening))
  }

  const interject = text => {
    text = (text ?? '').trim()
    if (!text || busyRef.current) return
    const speakerId = nextSpeaker()
    const withUser = [...messagesRef.current, { role: 'user', question: text }]
    setMessages(withUser)
    messagesRef.current = withUser
    setInput('')
    runTurn(speakerId, toEvents(withUser))
  }

  const continueTurn = () => runTurn(nextSpeaker(), toEvents(messagesRef.current))

  // ---- render --------------------------------------------------------------

  const showForm = !keyed || showKeyForm
  const hasElKey = !!getElevenLabsKey()
  const activeSpeakerId = [...messages].reverse().find(m => m.role === 'assistant')?.speakerId
  const nextName = symp ? byId[nextSpeaker()]?.name : null

  const openSetup = () => {
    setSympSetup(true)
    setSympDraft(d => ({
      ...d,
      a: personaId ?? selectedId ?? d.a,
      b: (personaId ?? selectedId) === d.b ? (d.b === 'nietzsche' ? 'buddha' : 'nietzsche') : d.b,
    }))
  }

  return (
    <section className="agent" aria-label="Ask Philosophia">
      <div className="agent-frame">
        <div className="agent-head">
          {!symp && (
            <img
              className={speaking ? 'agent-medallion speaking' : 'agent-medallion'}
              src={persona ? persona.thumb : 'portraits/philosophia.jpg'}
              alt={persona ? `Engraved portrait of ${persona.name}` : 'Lady Philosophia, engraved'}
            />
          )}
          <h2>ASK PHILOSOPHIA</h2>
          {symp ? (
            <span className="agent-mode">
              symposium: {byId[symp.a].name} &amp; {byId[symp.b].name}
              <button className="agent-exit" onClick={adjourn}>
                ✕ adjourn
              </button>
            </span>
          ) : persona ? (
            <span className="agent-mode">
              conversing with {persona.name}
              <button className="agent-exit" onClick={onExitPersona}>
                ✕ back to the guide
              </button>
            </span>
          ) : (
            <span className="agent-mode">the resident guide</span>
          )}
          <span className="agent-tools">
            <select value={model} onChange={pickModel} aria-label="Model">
              {MODELS.map(m => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
            {support.tts && !showForm && (
              <button
                className={voiceOn ? 'agent-link voice-on' : 'agent-link'}
                onClick={toggleVoice}
                aria-pressed={voiceOn}
              >
                {voiceOn ? 'voice on' : 'voice off'}
              </button>
            )}
            {!showForm && !symp && !sympSetup && (
              <button className="agent-link" onClick={openSetup}>
                symposium
              </button>
            )}
            {symp && messages.some(m => m.role === 'assistant' && m.text && !m.streaming) && (
              <button className="agent-link" onClick={publish} disabled={publishing}>
                {publishing ? 'publishing…' : 'publish'}
              </button>
            )}
            {keyed && !showKeyForm && (
              <button className="agent-link" onClick={() => setShowKeyForm(true)}>
                keys
              </button>
            )}
            {messages.length > 0 && !symp && (
              <button className="agent-link" onClick={clearConversation}>
                clear
              </button>
            )}
          </span>
        </div>

        {showForm ? (
          <form className="agent-keyform" onSubmit={saveKey}>
            <p className="agent-note">
              Paste your Anthropic API key to wake the guide. It is stored only in this
              browser and sent only to api.anthropic.com — questions cost a few cents each
              on your own account.
            </p>
            {error && <p className="agent-error">{error}</p>}
            <div className="agent-row">
              <input
                type="password"
                value={keyDraft}
                onChange={e => setKeyDraft(e.target.value)}
                placeholder={keyed ? 'Anthropic key (saved — blank keeps it)' : 'sk-ant-…'}
                autoComplete="off"
                aria-label="Anthropic API key"
              />
            </div>
            <div className="agent-row">
              <input
                type="password"
                value={elDraft}
                onChange={e => setElDraft(e.target.value)}
                placeholder={
                  hasElKey
                    ? 'ElevenLabs key (saved — blank keeps it)'
                    : 'ElevenLabs key — optional, for character voices'
                }
                autoComplete="off"
                aria-label="ElevenLabs API key (optional)"
              />
              <button type="submit" disabled={!keyDraft.trim() && !elDraft.trim() && !keyed}>
                save
              </button>
              {keyed && (
                <button type="button" onClick={() => setShowKeyForm(false)}>
                  cancel
                </button>
              )}
            </div>
          </form>
        ) : sympSetup ? (
          <form className="symp-setup" onSubmit={convene}>
            <p className="agent-note">
              Seat two thinkers across from each other, pose the opening question, and
              moderate — or simply listen. You may interject at any time.
            </p>
            <div className="agent-row symp-chairs">
              <select
                value={sympDraft.a}
                onChange={e => setSympDraft(d => ({ ...d, a: e.target.value }))}
                aria-label="First chair"
              >
                {ROSTER.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              <span className="symp-amp">&amp;</span>
              <select
                value={sympDraft.b}
                onChange={e => setSympDraft(d => ({ ...d, b: e.target.value }))}
                aria-label="Second chair"
              >
                {ROSTER.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            {sympDraft.a === sympDraft.b && (
              <p className="agent-error">A symposium needs two different thinkers.</p>
            )}
            <div className="agent-row">
              <input
                value={sympDraft.q}
                onChange={e => setSympDraft(d => ({ ...d, q: e.target.value }))}
                placeholder="Pose the opening question…"
                aria-label="Opening question"
              />
              <button type="submit" disabled={!sympDraft.q.trim() || sympDraft.a === sympDraft.b}>
                convene
              </button>
              <button type="button" onClick={() => setSympSetup(false)}>
                cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="agent-body">
            {!symp && persona && LIVING.has(persona.id) && (
              <div className="living-stage" aria-hidden="true">
                <video
                  className={speaking ? 'living' : 'living on'}
                  src={livingSrc(persona.id, 'idle')}
                  poster={persona.portrait}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
                <video
                  className={speaking ? 'living on' : 'living'}
                  src={livingSrc(persona.id, 'speaking')}
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              </div>
            )}
            <div className="agent-chat">
              {symp && (
                <div className="symposium-stage">
                  <Chair id={symp.a} speaking={speaking && activeSpeakerId === symp.a} />
                  <Chair id={symp.b} speaking={speaking && activeSpeakerId === symp.b} />
                </div>
              )}
              {messages.length === 0 && (
                <p className="agent-hint">
                  {persona
                    ? voiceOn
                      ? `You stand before ${persona.name} — press the mic and speak.`
                      : `You stand before ${persona.name} — ask what you will.`
                    : 'Ask about any thinker, school, or idea — the guide answers from the atlas’s own entries, and every name it cites turns the globe. Or convene a symposium and let two of them argue.'}
                </p>
              )}
              {messages.length > 0 && (
                <div className="agent-log" ref={logRef}>
                  {messages.map((m, i) =>
                    m.role === 'user' ? (
                      <div className="agent-msg user" key={i}>
                        {m.question}
                      </div>
                    ) : (
                      <Reply
                        key={i}
                        text={m.text}
                        streaming={m.streaming}
                        onSelect={onSelect}
                        label={symp && m.speakerId ? byId[m.speakerId].name : null}
                      />
                    ),
                  )}
                </div>
              )}
              {shareMenu && (
                <p className="share-menu">
                  the proceedings are ready —{' '}
                  <a className="agent-link" href={shareMenu.pngUrl} download="symposium.png">
                    download broadsheet
                  </a>
                  {shareMenu.mp3Url && (
                    <>
                      {' · '}
                      <a className="agent-link" href={shareMenu.mp3Url} download="symposium.mp3">
                        download audio
                      </a>
                    </>
                  )}
                  {' · '}
                  <button
                    className="agent-link"
                    onClick={() => navigator.clipboard?.writeText(shareMenu.transcript)}
                  >
                    copy transcript
                  </button>
                  {' · '}
                  <a className="agent-link" href={shareMenu.tweet} target="_blank" rel="noopener noreferrer">
                    compose tweet
                  </a>
                  {' · '}
                  <button className="agent-link" onClick={closeShareMenu}>
                    ✕
                  </button>
                </p>
              )}
              {error && <p className="agent-error">{error}</p>}
              <form
                className="agent-row"
                onSubmit={e => {
                  e.preventDefault()
                  if (symp) input.trim() ? interject(input) : continueTurn()
                  else send(input)
                }}
              >
                {voiceOn && support.stt && (
                  <button
                    type="button"
                    className={listening ? 'micbtn listening' : 'micbtn'}
                    onClick={micPress}
                    aria-label={listening ? 'Stop listening' : 'Speak'}
                    title={listening ? 'listening — tap to stop' : 'tap to speak'}
                  >
                    ◉
                  </button>
                )}
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder={
                    listening
                      ? 'listening…'
                      : symp
                        ? 'Interject — or press return to let them continue…'
                        : persona
                          ? `Address ${persona.name}…`
                          : 'Ask the guide…'
                  }
                  aria-label="Your question"
                />
                <button
                  type={busy ? 'button' : 'submit'}
                  onClick={busy ? stopAll : undefined}
                  disabled={!busy && !symp && !input.trim()}
                >
                  {busy ? 'stop' : symp ? (input.trim() ? 'interject' : `${nextName} responds`) : 'ask'}
                </button>
              </form>
              {voiceOn && !support.stt && (
                <p className="agent-note">
                  Spoken replies are on; this browser has no speech recognition, so type your
                  side of the conversation.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
