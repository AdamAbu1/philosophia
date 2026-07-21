// "Ask Philosophia" — inline conversational panel below the globe.
// Modes: the resident guide (default) and persona conversations entered from a
// thinker's entry. BYOK: the user's Anthropic key lives in localStorage.
// Voice mode composes a spoken conversation entirely in the browser: mic →
// SpeechRecognition → persona chat → sentence-streamed speech (system voices,
// or ElevenLabs character voices when that key is present).
import { useEffect, useRef, useState } from 'react'
import { byId } from './data.js'
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
  contextIds,
  buildUserTurn,
  parseMarkers,
  streamReply,
} from './agent.js'
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

function Reply({ text, streaming, onSelect }) {
  return (
    <div className="agent-msg assistant">
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

  const streamRef = useRef(null)
  const speakerRef = useRef(null)
  const listenerRef = useRef(null)
  const logRef = useRef(null)
  const voiceOnRef = useRef(false)
  const busyRef = useRef(false)
  const personaRef = useRef(personaId)
  // The listener and speaker outlive renders; their callbacks must call the
  // CURRENT send/startListening, never the closure they were created in —
  // a cached stale send once routed spoken questions to the wrong persona.
  const sendRef = useRef(() => {})
  const startListeningRef = useRef(() => {})

  const persona = personaId ? byId[personaId] : null
  const support = voiceSupport()
  voiceOnRef.current = voiceOn
  busyRef.current = busy
  personaRef.current = personaId

  const quiesceVoice = () => {
    speakerRef.current?.stop()
    speakerRef.current = null
    listenerRef.current?.abort()
    listenerRef.current = null
    setSpeaking(false)
    setListening(false)
  }

  // Entering or leaving a persona starts a fresh conversation.
  useEffect(() => {
    streamRef.current?.abort()
    quiesceVoice()
    setMessages([])
    setError(null)
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
          sendRef.current(t)
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

  const send = async question => {
    question = (question ?? '').trim()
    if (!question || busyRef.current || !getApiKey()) return

    const wantSpeech = voiceOnRef.current
    // Resolve the persona at call time — spoken sends can arrive through
    // long-lived recognition callbacks, never trust their creation closure.
    const activePersonaId = personaRef.current
    const activePersona = activePersonaId ? byId[activePersonaId] : null
    const lastReply = [...messages].reverse().find(m => m.role === 'assistant')?.text ?? ''
    const ids = contextIds(question, { personaId: activePersonaId, selectedId, lastReply })
    const apiMessages = []
    for (const m of messages) {
      // Past user turns replay without their <records> to keep history lean.
      if (m.role === 'user') apiMessages.push({ role: 'user', content: m.question })
      else if (m.blocks) apiMessages.push({ role: 'assistant', content: m.blocks })
      else if (m.text) apiMessages.push({ role: 'assistant', content: m.text })
    }
    apiMessages.push({ role: 'user', content: buildUserTurn(question, ids) })

    setMessages(ms => [
      ...ms,
      { role: 'user', question },
      { role: 'assistant', text: '', blocks: null, streaming: true },
    ])
    setInput('')
    setBusy(true)
    busyRef.current = true
    setError(null)

    // Voice: resolve the speaker first (first ElevenLabs use fetches the
    // voice library; cached afterwards), so sentences can play as they land.
    speakerRef.current?.stop()
    let speaker = null
    if (wantSpeech) {
      speaker = await makeSpeaker(activePersonaId, {
        onStart: () => setSpeaking(true),
        onIdle: () => {
          setSpeaking(false)
          if (voiceOnRef.current && !busyRef.current && support.stt) startListeningRef.current()
        },
        onError: () => setError('Character voices unavailable — using system voices.'),
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

    const baseSystem = activePersona ? buildPersonaSystem(activePersona.id) : buildGuideSystem()
    const stream = streamReply({
      apiKey: getApiKey(),
      model,
      system: wantSpeech ? baseSystem + VOICE_REGISTER : baseSystem,
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
        { role: 'assistant', text, blocks: final.content, streaming: false },
      ])
      if (speaker) {
        const rest = flushRemainder(accumulated, spokenOffset)
        if (rest) speaker.enqueue(speakableText(rest))
        else if (speaker.pending <= 0) {
          setSpeaking(false)
          if (voiceOnRef.current && support.stt) {
            busyRef.current = false
            startListeningRef.current()
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

  sendRef.current = send
  startListeningRef.current = startListening

  const showForm = !keyed || showKeyForm
  const hasElKey = !!getElevenLabsKey()

  return (
    <section className="agent" aria-label="Ask Philosophia">
      <div className="agent-frame">
        <div className="agent-head">
          <img
            className={speaking ? 'agent-medallion speaking' : 'agent-medallion'}
            src={persona ? persona.thumb : 'portraits/philosophia.jpg'}
            alt={persona ? `Engraved portrait of ${persona.name}` : 'Lady Philosophia, engraved'}
          />
          <h2>ASK PHILOSOPHIA</h2>
          {persona ? (
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
            {keyed && !showKeyForm && (
              <button className="agent-link" onClick={() => setShowKeyForm(true)}>
                keys
              </button>
            )}
            {messages.length > 0 && (
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
        ) : (
          <>
            {messages.length === 0 && (
              <p className="agent-hint">
                {persona
                  ? voiceOn
                    ? `You stand before ${persona.name} — press the mic and speak.`
                    : `You stand before ${persona.name} — ask what you will.`
                  : 'Ask about any thinker, school, or idea — the guide answers from the atlas’s own entries, and every name it cites turns the globe.'}
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
                    <Reply key={i} text={m.text} streaming={m.streaming} onSelect={onSelect} />
                  ),
                )}
              </div>
            )}
            {error && <p className="agent-error">{error}</p>}
            <form
              className="agent-row"
              onSubmit={e => {
                e.preventDefault()
                send(input)
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
                    : persona
                      ? `Address ${persona.name}…`
                      : 'Ask the guide…'
                }
                aria-label="Your question"
              />
              <button
                type={busy ? 'button' : 'submit'}
                onClick={busy ? stopAll : undefined}
                disabled={!busy && !input.trim()}
              >
                {busy ? 'stop' : 'ask'}
              </button>
            </form>
            {voiceOn && !support.stt && (
              <p className="agent-note">
                Spoken replies are on; this browser has no speech recognition, so type your
                side of the conversation.
              </p>
            )}
          </>
        )}
      </div>
    </section>
  )
}
