// "Ask Philosophia" — inline conversational panel below the globe.
// Two modes: the resident guide (default) and persona conversations entered
// from a thinker's entry. BYOK: the user's Anthropic key lives in localStorage.
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
  const [model, setModelState] = useState(() => getModel())
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const streamRef = useRef(null)
  const logRef = useRef(null)

  const persona = personaId ? byId[personaId] : null

  // Entering or leaving a persona starts a fresh conversation.
  useEffect(() => {
    streamRef.current?.abort()
    setMessages([])
    setError(null)
  }, [personaId])

  useEffect(() => () => streamRef.current?.abort(), [])

  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  const saveKey = e => {
    e.preventDefault()
    const k = keyDraft.trim()
    if (!k) return
    setApiKey(k)
    setKeyed(true)
    setShowKeyForm(false)
    setKeyDraft('')
    setError(null)
  }

  const pickModel = e => {
    setModel(e.target.value)
    setModelState(e.target.value)
  }

  const clearConversation = () => {
    streamRef.current?.abort()
    setMessages([])
    setError(null)
  }

  const stop = () => streamRef.current?.abort()

  const send = async e => {
    e.preventDefault()
    const question = input.trim()
    if (!question || busy || !getApiKey()) return

    const lastReply = [...messages].reverse().find(m => m.role === 'assistant')?.text ?? ''
    const ids = contextIds(question, { personaId, selectedId, lastReply })
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
    setError(null)

    const stream = streamReply({
      apiKey: getApiKey(),
      model,
      system: persona ? buildPersonaSystem(persona.id) : buildGuideSystem(),
      messages: apiMessages,
      onText: delta =>
        setMessages(ms => {
          const last = ms[ms.length - 1]
          return [...ms.slice(0, -1), { ...last, text: last.text + delta }]
        }),
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
    } catch (err) {
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
      streamRef.current = null
    }
  }

  const showForm = !keyed || showKeyForm

  return (
    <section className="agent" aria-label="Ask Philosophia">
      <div className="agent-frame">
        <div className="agent-head">
          <img
            className="agent-medallion"
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
            {keyed && !showKeyForm && (
              <button className="agent-link" onClick={() => setShowKeyForm(true)}>
                key
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
                placeholder="sk-ant-…"
                autoComplete="off"
                aria-label="Anthropic API key"
              />
              <button type="submit" disabled={!keyDraft.trim()}>
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
                  ? `You stand before ${persona.name} — ask what you will.`
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
            <form className="agent-row" onSubmit={send}>
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={persona ? `Address ${persona.name}…` : 'Ask the guide…'}
                aria-label="Your question"
              />
              <button type={busy ? 'button' : 'submit'} onClick={busy ? stop : undefined} disabled={!busy && !input.trim()}>
                {busy ? 'stop' : 'ask'}
              </button>
            </form>
          </>
        )}
      </div>
    </section>
  )
}
