// Living portraits: pre-rendered engraving loops for persona conversations.
// Each registered thinker ships public/living/<id>-idle.mp4 and
// public/living/<id>-speaking.mp4 (Higgsfield kling3_0_turbo animations of the
// engraved portrait; full-res originals archived outside the repo). The panel
// crossfades idle ↔ speaking with the voice. Register ids as clips land.
export const LIVING = new Set(['socrates'])

export const livingSrc = (id, kind) => `living/${id}-${kind}.mp4`
