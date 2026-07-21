// Itineraries: curated journeys across the globe. Each stop carries one line
// of connecting narration shown in the itinerary bar on arrival — the globe
// flies, the entry opens, the line explains why you are here now.
export const ITINERARIES = [
  {
    id: 'translation-road',
    name: 'The Translation Road',
    blurb: 'How Greek thought survived — carried through Baghdad and Córdoba back into Latin Europe.',
    stops: [
      { id: 'aristotle', line: 'Athens, 4th century BCE. The corpus is written — logic, physics, ethics — and then the schools that kept it begin to close.' },
      { id: 'alkindi', line: 'Baghdad’s House of Wisdom: al-Kindi superintends the first great wave of Greek into Arabic.' },
      { id: 'alfarabi', line: 'Al-Farabi earns the title “the Second Teacher” — second, that is, to Aristotle.' },
      { id: 'avicenna', line: 'In Bukhara, Avicenna memorizes the Metaphysics and writes the system Europe will argue with for centuries.' },
      { id: 'alghazali', line: 'Baghdad again: al-Ghazali’s Incoherence puts philosophy itself on trial.' },
      { id: 'averroes', line: 'Córdoba answers. Averroes writes commentary so definitive the Latins will call him simply “the Commentator.”' },
      { id: 'maimonides', line: 'Also of Córdoba, Maimonides carries the reconciliation of reason and scripture into Hebrew letters.' },
      { id: 'aquinas', line: 'Paris, 13th century. Aquinas reads Aristotle through Averroes and Maimonides — Greek thought is home, transformed.' },
    ],
  },
  {
    id: 'axial-awakening',
    name: 'The Axial Awakening',
    blurb: 'One astonishing century — and philosophy begins in three civilizations at once.',
    stops: [
      { id: 'thales', line: 'Miletus, where someone first asks what everything is made of — and answers without the gods.' },
      { id: 'pythagoras', line: 'In Croton, number becomes the secret order of the cosmos.' },
      { id: 'heraclitus', line: 'Ephesus: all is flux, held together by a hidden logos.' },
      { id: 'buddha', line: 'The same century, a world away — under the Bodhi tree, suffering is diagnosed and a cure prescribed.' },
      { id: 'mahavira', line: 'Mahavira walks the Ganges plain, teaching harmlessness as an absolute.' },
      { id: 'confucius', line: 'In Lu, Confucius rebuilds a broken world from ritual and virtue outward.' },
      { id: 'laozi', line: 'And somewhere on the road west, Laozi leaves five thousand characters about the Way. The awakening was everywhere at once.' },
    ],
  },
  {
    id: 'empiricists-chain',
    name: 'The Empiricists’ Chain',
    blurb: 'Knowledge from experience alone — an island argument, link by link.',
    stops: [
      { id: 'bacon', line: 'London: knowledge must be wrung from nature by experiment, not spun from the armchair.' },
      { id: 'locke', line: 'Locke wipes the slate clean — every idea traced back to experience.' },
      { id: 'berkeley', line: 'Berkeley calls the bluff: if all we have is experience, matter itself dissolves.' },
      { id: 'hume', line: 'Edinburgh, where empiricism meets its honest limit — custom, not reason, binds cause to effect.' },
      { id: 'mill', line: 'Mill inherits the tradition and turns it on society, liberty, and logic itself.' },
      { id: 'james', line: 'The chain crosses the Atlantic: James takes experience whole — stream, will, and all.' },
    ],
  },
  {
    id: 'women-of-the-canon',
    name: 'The Women of the Canon',
    blurb: 'From Alexandria to Oxford — the thinkers the tradition tried hardest to forget.',
    stops: [
      { id: 'hypatia', line: 'Alexandria: Hypatia teaches the heavens, and dies for a city’s fear.' },
      { id: 'conway', line: 'Anne Conway writes a metaphysics that Leibniz will quietly mine.' },
      { id: 'wollstonecraft', line: 'London, 1792: the rights of man are unfinished until they are the rights of woman.' },
      { id: 'arendt', line: 'Arendt answers totalitarianism with natality — every birth, a new beginning.' },
      { id: 'weil', line: 'Weil thinks with her whole life: attention as prayer, affliction as fact.' },
      { id: 'beauvoir', line: 'Paris: one is not born, but rather becomes, a woman.' },
      { id: 'anscombe', line: 'Oxford: Anscombe rebuilds intention — and with it, modern moral philosophy.' },
    ],
  },
  {
    id: 'existential-line',
    name: 'The Existential Line',
    blurb: 'From the wager to the absurd — existence confronting itself.',
    stops: [
      { id: 'pascal', line: 'Paris: the heart has its reasons — and the eternal silence of infinite spaces frightens.' },
      { id: 'kierkegaard', line: 'Copenhagen: truth is subjectivity, and faith a leap over seventy thousand fathoms.' },
      { id: 'nietzsche', line: 'God is dead — and the task now is to become what you are.' },
      { id: 'heidegger', line: 'Being itself returns as a question, asked by the one being that knows it must die.' },
      { id: 'sartre', line: 'Paris again: existence precedes essence; we are condemned to be free.' },
      { id: 'beauvoir', line: 'Freedom is situated — and always entangled with the freedom of others.' },
      { id: 'camus', line: 'Algiers to Paris: the absurd, met with revolt — one must imagine Sisyphus happy.' },
    ],
  },
]

export const itineraryById = Object.fromEntries(ITINERARIES.map(r => [r.id, r]))
