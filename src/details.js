// Long-form content per philosopher, merged into PHILOSOPHERS in data.js.
// Shape: { bio, ideas: [{title, text}], works: [string], legacy }
export const DETAILS = {
  thales: {
    bio: 'A merchant-sage of Miletus on the Ionian coast, Thales reportedly predicted the solar eclipse of 585 BCE, measured the pyramids by their shadows, and once cornered the olive-press market to prove philosophers could be rich if they cared to be. None of his writings survive — we know him through Aristotle and Herodotus.',
    ideas: [
      { title: 'Natural explanation', text: 'Events have natural causes that human reason can discover — not the moods of gods. This single move opens the entire scientific tradition.' },
      { title: 'A first principle', text: 'All things derive from one underlying stuff, which he identified as water — wrong answer, epochal question.' },
      { title: 'A living cosmos', text: 'He held that "all things are full of gods" — matter itself has animating power, as the magnet shows by moving iron.' },
    ],
    works: ['No writings survive — known through Aristotle, Herodotus, and Diogenes Laertius'],
    legacy: 'Every philosopher and scientist since is downstream of the bet that the world explains itself.',
  },
  anaximander: {
    bio: 'Thales’ younger associate in Miletus, Anaximander wrote the first known Greek prose treatise, drew the first known map of the inhabited world, and set up a gnomon to mark solstices. One haunting fragment of his book survives.',
    ideas: [
      { title: 'The apeiron', text: 'The source of everything cannot be any ordinary stuff like water — it must be the boundless and indefinite, from which worlds separate out and to which they return.' },
      { title: 'Cosmic justice', text: 'Things "pay penalty and retribution to each other for their injustice according to the assessment of time" — nature as a lawful balance of opposites.' },
      { title: 'Proto-evolution', text: 'The first humans could not have survived as helpless infants, so life must have begun in the sea and changed form — a stunning guess at descent with modification.' },
    ],
    works: ['On Nature (lost; one fragment survives — the first Greek prose book)'],
    legacy: 'First to argue that the deepest explanation must go beyond anything we can see — the ancestor of every unobservable posited by science.',
  },
  pythagoras: {
    bio: 'Born on Samos, Pythagoras emigrated to Croton in southern Italy and founded a secretive community that was part school, part religious order — sworn to silence, bound by strange rules, and open to women. He wrote nothing; his followers attributed their discoveries to him.',
    ideas: [
      { title: 'Number is the nature of things', text: 'Musical harmony reduces to ratios of string lengths — so perhaps everything, from the seasons to the soul, is structured by number and proportion.' },
      { title: 'Transmigration of souls', text: 'The soul is immortal and reborn across lives, human and animal — so philosophy is a purification, a training for the soul’s release.' },
      { title: 'The cosmos', text: 'The Pythagoreans were among the first to call the world a kosmos — an ordered, beautiful arrangement open to mathematical insight.' },
    ],
    works: ['No writings — doctrines transmitted (and embellished) by his school'],
    legacy: 'The faith that mathematics is the language of reality runs from his school through Plato to modern physics.',
  },
  heraclitus: {
    bio: 'An aristocrat of Ephesus who renounced political office, Heraclitus wrote a single book of compressed, oracular sayings and deposited it in the temple of Artemis. Antiquity nicknamed him "the Obscure" and "the weeping philosopher."',
    ideas: [
      { title: 'Flux', text: 'Everything flows; stability is an illusion of scale. The river you step into is never the same river — and neither are you.' },
      { title: 'Unity of opposites', text: 'Day and night, war and peace, up and down — opposites define each other and are held together in tension, like the bow and the lyre.' },
      { title: 'Logos', text: 'Beneath the flux runs a common rational order, the logos, which most people sleep through even while awake.' },
    ],
    works: ['On Nature (lost; ~130 fragments survive)'],
    legacy: 'Hegel built dialectic on his tensions, Nietzsche claimed him as an ancestor, and process philosophy still carries his river.',
  },
  parmenides: {
    bio: 'The great man of Elea in southern Italy, Parmenides set out his philosophy in a hexameter poem in which a goddess reveals the way of truth. Plato honored him with a dialogue; his student Zeno of Elea defended him with the famous paradoxes of motion.',
    ideas: [
      { title: 'Being is', text: 'What is, is; what is not, cannot even be thought. From this austere logic he concluded that coming-to-be, perishing, and change are impossible.' },
      { title: 'Reason over the senses', text: 'If logic and appearance conflict, so much the worse for appearance — the first uncompromising rationalism.' },
      { title: 'Two ways', text: 'His poem separates the Way of Truth from the Way of Opinion — the world as it must be from the world as mortals describe it.' },
    ],
    works: ['On Nature (fragments of the poem survive)'],
    legacy: 'He forced every later philosopher — Plato and Aristotle above all — to explain how change is possible at all, and split metaphysics from appearance for good.',
  },
  socrates: {
    bio: 'A stonemason’s son who fought bravely as a hoplite and then spent his life questioning Athenians in the marketplace, Socrates wrote nothing and charged nothing. In 399 BCE, at seventy, he was tried for impiety and corrupting the young, refused to grovel, was condemned, and drank the hemlock among his friends.',
    ideas: [
      { title: 'The examined life', text: 'The proper business of a human being is examining how one ought to live — everything else is housekeeping.' },
      { title: 'The elenchus', text: 'His method: profess ignorance, ask for a definition, and question it until the confident interlocutor discovers he never knew what he meant by courage, justice, or piety.' },
      { title: 'Virtue is knowledge', text: 'No one does wrong willingly — wrongdoing is ignorance of the good, so the cure for vice is understanding, not punishment.' },
    ],
    works: ['Wrote nothing — known through Plato, Xenophon, and Aristophanes’ satire'],
    legacy: 'The martyr-founder of moral philosophy; every ethics seminar and every cross-examination descends from his street conversations.',
  },
  democritus: {
    bio: 'Born to wealth in Abdera, Democritus reportedly spent his inheritance traveling to Egypt and Persia in pursuit of knowledge, and antiquity remembered him as the "laughing philosopher" for his cheerfulness. He wrote some seventy works on everything from cosmology to ethics; all are lost.',
    ideas: [
      { title: 'Atomism', text: 'Reality is unsplittable particles moving in the void; their shapes and collisions compose everything, and worlds form and perish without design.' },
      { title: 'Appearance vs reality', text: '"By convention sweet, by convention bitter — in reality atoms and void." The qualities we perceive are products of our senses, not of things themselves.' },
      { title: 'Euthymia', text: 'The goal of life is cheerful tranquility, won by moderation and by not envying what others have.' },
    ],
    works: ['~70 treatises, all lost (fragments survive, mostly ethical)'],
    legacy: 'The boldest guess in ancient science — vindicated two millennia later — and, through Epicurus, the seed of a whole ethics of tranquility.',
  },
  plato: {
    bio: 'An Athenian aristocrat who saw his teacher Socrates executed by the democracy, Plato channeled his grief into dialogues that made philosophy literature, and founded the Academy — the West’s first enduring school — around 387 BCE. Three misadventures advising the tyrants of Syracuse cured him of practical politics.',
    ideas: [
      { title: 'The Forms', text: 'Particular beautiful things fade, but Beauty itself — the intelligible Form — is eternal. The visible world participates in, and falls short of, these perfect originals.' },
      { title: 'The tripartite soul', text: 'Reason, spirit, and appetite each pull in their own direction; justice, in a soul as in a city, is each part doing its own work under reason’s rule.' },
      { title: 'The cave', text: 'Ordinary experience is shadows on a cave wall; education is the painful turning of the whole soul toward the light — and the freed prisoner owes the cave a return trip.' },
    ],
    works: ['Republic (c. 375 BCE)', 'Symposium', 'Phaedo', 'Apology', 'Timaeus'],
    legacy: 'Whitehead’s quip stands: the European philosophical tradition is a series of footnotes to Plato.',
  },
  diogenes: {
    bio: 'Exiled from Sinope over a currency scandal, Diogenes took philosophy to its limit as street performance: he lived in a storage jar, carried a lamp in daylight "looking for an honest man," and when Alexander the Great offered him anything he wished, asked him to step out of his sunlight. Plato called him "Socrates gone mad."',
    ideas: [
      { title: 'Virtue needs nothing', text: 'Happiness requires only virtue, and virtue only self-mastery — so possessions, status, and reputation are chains pretending to be goods.' },
      { title: 'Shamelessness as argument', text: 'By living publicly like a dog (kynikos — the origin of "Cynic"), he made his life a standing refutation of convention.' },
      { title: 'Cosmopolitanism', text: 'Asked where he was from, he coined a word: kosmopolitês, citizen of the world — allegiance to humanity over any city.' },
    ],
    works: ['Nothing survives — anecdotes preserved by Diogenes Laertius'],
    legacy: 'The Stoics traced their lineage through him, and every ascetic, protester, and satirist who shames power by example walks in his footsteps.',
  },
  aristotle: {
    bio: 'Son of the Macedonian court physician, Aristotle spent twenty years in Plato’s Academy, tutored the young Alexander the Great, and returned to Athens to found the Lyceum, where he lectured while walking. When anti-Macedonian feeling surged after Alexander’s death, he fled so Athens would not "sin twice against philosophy."',
    ideas: [
      { title: 'Form in matter', text: 'Against Plato: the form of a thing is not in another world but in the thing itself — to understand nature, study natures, from squids to cities.' },
      { title: 'Virtue as habit', text: 'We become just by doing just acts. Excellence is a settled disposition, the mean between extremes, built by practice and aimed at eudaimonia — flourishing.' },
      { title: 'Four causes and logic', text: 'To know something is to know its matter, form, origin, and purpose; and he built the first formal logic — the syllogism — to discipline all such knowing.' },
    ],
    works: ['Nicomachean Ethics', 'Politics', 'Metaphysics', 'Organon', 'Poetics'],
    legacy: 'For two thousand years "the Philosopher" meant Aristotle; biology, logic, ethics, and political science all begin as chapters of his notebooks.',
  },
  pyrrho: {
    bio: 'A painter turned philosopher from Elis, Pyrrho marched east with Alexander’s expedition and encountered the "naked wise men" of India. He wrote nothing and reportedly lived his skepticism with unnerving calm; his admirer Timon preserved his outlook in verse.',
    ideas: [
      { title: 'Equipollence', text: 'For every argument there is an equal opposing argument; things are by nature indeterminable by us.' },
      { title: 'Epochē', text: 'Since certainty is unavailable, suspend judgment — say "it appears" rather than "it is."' },
      { title: 'Ataraxia', text: 'Tranquility follows suspension like a shadow: it is opinions about good and bad, not things, that torment us.' },
    ],
    works: ['Wrote nothing — known through Timon and later through Sextus Empiricus'],
    legacy: 'Skepticism became philosophy’s permanent conscience — revived by Sextus, it later jolted Montaigne, Descartes, and Hume awake.',
  },
  epicurus: {
    bio: 'Born on Samos to Athenian parents, Epicurus bought a house and garden in Athens around 306 BCE and founded a community that scandalized the city by admitting women and slaves as equals. He suffered kidney stones for years and died praising the pleasures of remembered friendship.',
    ideas: [
      { title: 'Pleasure as absence of pain', text: 'The goal is not indulgence but aponia and ataraxia — a body without pain and a mind without turmoil; bread, water, and friends nearly suffice.' },
      { title: 'Death is nothing to us', text: 'Where we are, death is not; where death is, we are not. Sensation ends, so there is nothing bad left to happen to us.' },
      { title: 'Atoms and the swerve', text: 'He adopted Democritus’ atoms but let them swerve unpredictably — dissolving both divine management and iron fate.' },
    ],
    works: ['Letter to Menoeceus', 'Principal Doctrines', 'On Nature (37 books, fragments)'],
    legacy: 'Lucretius carried his gospel into Latin verse, and every secular therapy for the fear of death still borrows his arguments.',
  },
  zeno: {
    bio: 'A Phoenician merchant from Citium in Cyprus, Zeno was shipwrecked near Athens, wandered into a bookshop, read about Socrates, and asked where such men could be found. After studying with the Cynics he began teaching at the Painted Stoa — giving Stoicism its name.',
    ideas: [
      { title: 'Virtue alone suffices', text: 'Health, wealth, and reputation are "preferred indifferents" — worth pursuing, but only virtue is good, so happiness is invulnerable to fortune.' },
      { title: 'Live according to nature', text: 'The cosmos is pervaded by rational order; a good life is one that agrees with it, accepting what it assigns.' },
      { title: 'A system in three parts', text: 'He organized philosophy into logic, physics, and ethics — a garden whose fence is logic, soil is physics, and fruit is ethics.' },
    ],
    works: ['Republic of Zeno and other treatises (all lost, known by report)'],
    legacy: 'The school he founded ran five hundred years, counseled emperors and slaves alike, and its exercises are practiced today under new names.',
  },
  marcus: {
    bio: 'Adopted into the imperial succession as a boy, Marcus Aurelius ruled Rome through flood, plague, and endless frontier war — and spent his nights on the Danube writing private Greek notes to himself that he never intended anyone to read. They survived as the Meditations.',
    ideas: [
      { title: 'The inner citadel', text: 'Externals cannot touch the mind unless judgment lets them in; take away the opinion "I am harmed," and the harm goes with it.' },
      { title: 'Impermanence', text: 'Emperors and their flatterers alike are a day’s smoke; seeing how quickly everything is swallowed by time deflates both fear and ambition.' },
      { title: 'Duty to the whole', text: 'What is not good for the hive is not good for the bee — we are made for cooperation, like rows of teeth.' },
    ],
    works: ['Meditations (written c. 170–180 CE)'],
    legacy: 'The rare proof that philosophy can hold power to account from the inside — and still the most read Stoic text on earth.',
  },
  plotinus: {
    bio: 'Born in Roman Egypt, Plotinus studied in Alexandria under the mysterious Ammonius Saccas, followed a military expedition east hoping to learn Persian and Indian wisdom, and settled in Rome, where senators attended his seminars. He was so ashamed of being embodied that he refused to sit for a portrait. His student Porphyry edited his lectures into the Enneads.',
    ideas: [
      { title: 'The One', text: 'Beyond all being and thought stands an absolutely simple source; everything that exists is an overflow — an emanation — of its unity.' },
      { title: 'Levels of reality', text: 'From the One proceeds Intellect (where the Forms live), from Intellect proceeds Soul, and from Soul the sensible world — a cascade of diminishing unity.' },
      { title: 'The return', text: 'The soul’s task is to turn inward and upward, purifying itself until, rarely and briefly, it touches the One in mystical union.' },
    ],
    works: ['Enneads (edited by Porphyry, c. 270 CE)'],
    legacy: 'Neoplatonism became late antiquity’s operating system — Augustine read Plato through his eyes, and Christian, Jewish, and Islamic mysticism all drank from him.',
  },
  augustine: {
    bio: 'Born in Roman North Africa to a pagan father and Christian mother, Augustine chased career and pleasure through Carthage, Rome, and Milan — praying famously for chastity "but not yet" — until a child’s voice chanting "take up and read" broke him open in a Milan garden in 386. As bishop of Hippo he wrote against every heresy of his age and died as the Vandals besieged his city.',
    ideas: [
      { title: 'The restless heart', text: 'Humans are made toward God, and every finite love is a longing misdirected; hence the Confessions’ cry: our heart is restless until it rests in you.' },
      { title: 'Inwardness', text: 'Truth is found by descending into memory and self — "do not go outward; return within yourself" — making him the first great psychologist of the will.' },
      { title: 'Grace and the two cities', text: 'The will is too damaged to heal itself; salvation is unearned grace. History is the entangled story of the earthly city, built on self-love, and the City of God.' },
    ],
    works: ['Confessions (c. 397–400)', 'The City of God (413–426)', 'On the Trinity'],
    legacy: 'He set the terms of Western Christianity — sin, grace, will, interiority — and his Confessions invented the introspective autobiography.',
  },
  anselm: {
    bio: 'An Italian from Aosta who crossed the Alps to the Norman monastery of Bec, Anselm rose from monk to Archbishop of Canterbury in 1093, where he fought kings over the church’s independence and was twice driven into exile. His motto: faith seeking understanding.',
    ideas: [
      { title: 'The ontological argument', text: 'God is that than which nothing greater can be conceived; a God existing only in the mind would be less great than one existing in reality — so God must exist. Debated ever since, refuted less often than announced.' },
      { title: 'Faith seeking understanding', text: 'Belief is not the end of inquiry but its engine — reason works from within faith to grasp what it already trusts.' },
      { title: 'Satisfaction', text: 'In Cur Deus Homo he argued the incarnation was rationally necessary: only a God-man could repay the infinite debt of sin.' },
    ],
    works: ['Proslogion (1077–78)', 'Monologion', 'Cur Deus Homo (1098)'],
    legacy: 'Father of scholasticism — and his strange, beautiful argument still forces philosophers to say exactly what "exists" means.',
  },
  aquinas: {
    bio: 'Born to nobility near Naples, Thomas joined the upstart Dominican beggar-friars against his family’s will — his brothers kidnapped and imprisoned him for a year to break his resolve. He studied under Albert the Great, taught in Paris, and dictated to several secretaries at once. After a mystical experience in 1273 he stopped writing: "all I have written seems like straw."',
    ideas: [
      { title: 'Reason and faith', text: 'Truth cannot contradict truth: philosophy proves what it can (that God exists), revelation supplies what it cannot (what God is like), and neither should fear the other.' },
      { title: 'The Five Ways', text: 'Five arguments from motion, causation, contingency, degrees, and purpose, each ending: "and this everyone understands to be God."' },
      { title: 'Natural law', text: 'Ethics is built into human nature — reason can read off the basic goods (life, knowledge, society) that law must serve, whether or not the lawgiver is pious.' },
    ],
    works: ['Summa Theologiae (1265–1274, unfinished)', 'Summa contra Gentiles', 'On Being and Essence'],
    legacy: 'He baptized Aristotle so thoroughly that Catholic philosophy is still officially Thomist, and secular natural-law theory still runs on his chassis.',
  },
  ockham: {
    bio: 'An English Franciscan trained at Oxford, William was summoned to the papal court at Avignon to answer charges of heresy — and while there concluded that the pope himself was the heretic, over the question of Franciscan poverty. He fled to the emperor’s protection in Munich in 1328 and spent his last years writing political theory against papal absolutism.',
    ideas: [
      { title: 'The razor', text: 'Do not multiply entities beyond necessity — of two adequate explanations, prefer the leaner. Not his invention, but his relentless practice.' },
      { title: 'Nominalism', text: 'Universals like "humanity" are not things in the world but names and concepts; only individuals exist. Metaphysics slims down, and logic and language move to center stage.' },
      { title: 'Separating powers', text: 'Against Avignon he argued that imperial power does not derive from the pope — an early wedge between spiritual and secular authority.' },
    ],
    works: ['Summa Logicae (c. 1323)', 'Ordinatio', 'Work of Ninety Days'],
    legacy: 'His razor became science’s favorite tool, and his nominalism cracked the medieval synthesis, clearing ground for empiricism.',
  },
  machiavelli: {
    bio: 'For fourteen years Machiavelli ran Florence’s diplomacy and citizen militia, observing Cesare Borgia up close. When the Medici returned in 1512 he was dismissed, tortured on the rack, and exiled to his farm — where, he wrote, he would put on courtly clothes each evening and converse with the ancients in his study. The Prince was his job application back into politics; it circulated for years and was printed only after his death.',
    ideas: [
      { title: 'Effectual truth', text: 'Study what people do, not what they ought to do; a ruler who practices goodness in a world that is not good "brings about his own ruin."' },
      { title: 'Virtù and fortuna', text: 'Politics is a contest between skillful boldness and fortune’s flood; fortune governs half our actions but leaves the other half to be seized.' },
      { title: 'Republican liberty', text: 'The Discourses show his deeper allegiance: free republics endure when institutions channel the healthy conflict between elites and people.' },
    ],
    works: ['The Prince (1513, pub. 1532)', 'Discourses on Livy (c. 1517)', 'The Art of War (1521)'],
    legacy: 'He founded political science by divorcing it from moral philosophy — and his name became an adjective his republicanism does not deserve.',
  },
  bacon: {
    bio: 'Lawyer, essayist, and eventually Lord Chancellor of England, Bacon rose to the summit of Jacobean politics and fell in 1621 to a bribery conviction. Legend has him dying of a chill caught while stuffing a chicken with snow to test refrigeration — a fittingly experimental end.',
    ideas: [
      { title: 'Idols of the mind', text: 'Four systematic distortions — of the tribe, the cave, the marketplace, and the theater — corrupt understanding; method exists to discipline them.' },
      { title: 'Organized inquiry', text: 'Knowledge should be built cooperatively, from patient experiment upward — not deduced from inherited authority. His New Atlantis imagines a state research institute.' },
      { title: 'Knowledge as power', text: 'Nature, to be commanded, must be obeyed: understanding her workings is how humanity relieves its estate.' },
    ],
    works: ['The Advancement of Learning (1605)', 'Novum Organum (1620)', 'New Atlantis (1626)'],
    legacy: 'The Royal Society claimed him as founding prophet; the research university and the grant proposal are both distantly his.',
  },
  hobbes: {
    bio: 'Born prematurely in 1588 as the Spanish Armada approached — "my mother gave birth to twins: myself and fear" — Hobbes was a tutor to the Cavendish family, discovered geometry at forty by falling in love with a proof of Pythagoras, and fled to Paris for eleven years during the English Civil War. He lived, combatively, to ninety-one.',
    ideas: [
      { title: 'The state of nature', text: 'Without a common power to keep all in awe, roughly equal humans competing for scarce goods fall into a war of every man against every man — and life is solitary, poor, nasty, brutish, and short.' },
      { title: 'The social contract', text: 'Rational agents escape by covenanting to surrender their right of self-government to a sovereign — the Leviathan — whose absolute authority is justified by the peace it secures.' },
      { title: 'Materialism', text: 'Everything, including thought, is matter in motion; he wanted a science of politics as rigorous as geometry.' },
    ],
    works: ['Leviathan (1651)', 'De Cive (1642)', 'Behemoth (1681)'],
    legacy: 'Modern political philosophy starts here: every social-contract theory since — Locke, Rousseau, Rawls — is an amendment to Hobbes.',
  },
  descartes: {
    bio: 'Educated by Jesuits at La Flèche, Descartes soldiered through Europe, and on November 10, 1619, shut in a stove-heated room in Germany, had the visions that set his life’s program: rebuild knowledge on foundations he could not doubt. He published cautiously — Galileo’s condemnation spooked him — and died in Stockholm’s brutal winter of 1650, tutoring Queen Christina at five in the morning.',
    ideas: [
      { title: 'Methodic doubt', text: 'Doubt everything that can be doubted — senses, mathematics, even the world’s existence against a deceiving demon — until something survives.' },
      { title: 'Cogito ergo sum', text: 'One thing survives: doubting is thinking, and thinking requires a thinker. "I think, therefore I am" is the unshakeable first foundation.' },
      { title: 'Mind–body dualism', text: 'Mind is unextended thinking substance, body extended mechanical substance — a split that created both modern consciousness studies and their hardest problem.' },
    ],
    works: ['Discourse on the Method (1637)', 'Meditations on First Philosophy (1641)', 'Principles of Philosophy (1644)'],
    legacy: '"Father of modern philosophy" is the standard title; analytic geometry, the mind-body problem, and the primacy of the knowing subject are all his estate.',
  },
  spinoza: {
    bio: 'Born to Portuguese-Jewish refugees in Amsterdam, Spinoza was expelled from his community at twenty-three by a herem of unusual violence, whose exact cause remains unknown. He changed his name to Benedict, ground lenses for a living, declined a Heidelberg professorship to keep his independence, and died at forty-four, likely of glass dust in his lungs.',
    ideas: [
      { title: 'One substance', text: 'There is only one infinite substance — call it God or Nature. Minds and bodies are not things but modes, ways the one reality expresses itself.' },
      { title: 'Necessity', text: 'Everything follows from the divine nature as necessarily as theorems from axioms; contingency is an illusion of limited knowledge.' },
      { title: 'Freedom as understanding', text: 'We are enslaved by passions grounded in confused ideas; freedom is transforming them through understanding, culminating in the intellectual love of God.' },
    ],
    works: ['Ethics (1677, posthumous)', 'Theological-Political Treatise (1670, anonymous)', 'On the Improvement of the Understanding'],
    legacy: 'Reviled for a century as an atheist, then canonized by the Romantics as "God-intoxicated" — the patron saint of naturalistic reverence and biblical criticism.',
  },
  locke: {
    bio: 'Oxford-trained physician and secretary to the Earl of Shaftesbury, Locke was implicated in Whig plots and spent the 1680s in Dutch exile, returning after the Glorious Revolution of 1688 whose principles his Two Treatises seemed written to justify. He published his masterpieces in a single astonishing year, 1689.',
    ideas: [
      { title: 'The blank slate', text: 'No innate ideas: the mind begins like white paper, and all knowledge is built from experience — sensation and reflection.' },
      { title: 'Government by consent', text: 'People are born free and equal with natural rights to life, liberty, and property; government is a trust to protect them, and a trust betrayed may be dissolved.' },
      { title: 'Toleration', text: 'Belief cannot be compelled by force, so civil power has no business enforcing religion — a load-bearing wall of the liberal state.' },
    ],
    works: ['An Essay Concerning Human Understanding (1689)', 'Two Treatises of Government (1689)', 'A Letter Concerning Toleration (1689)'],
    legacy: 'The Declaration of Independence paraphrases him; empiricist psychology and liberal constitutionalism are both Lockean projects.',
  },
  leibniz: {
    bio: 'A Leipzig prodigy with a law degree at twenty, Leibniz spent his career as librarian, historian, and diplomat to the House of Hanover while conducting a one-man republic of letters — some 15,000 surviving missives. He invented calculus independently of Newton (our notation is his), built calculating machines, and died in 1716 with his employer newly crowned King of England and himself pointedly left behind.',
    ideas: [
      { title: 'Monads', text: 'Reality consists of infinitely many simple, mind-like substances, each mirroring the whole universe from its own point of view, with no windows between them — coordinated by pre-established harmony.' },
      { title: 'Sufficient reason', text: 'Nothing is so without a reason why it is so and not otherwise — including the deepest question of all: why is there something rather than nothing?' },
      { title: 'The best of all possible worlds', text: 'God, choosing among all possible worlds, actualized the one with maximal richness and order — a claim Voltaire mocked in Candide but never quite answered.' },
    ],
    works: ['Discourse on Metaphysics (1686)', 'Theodicy (1710)', 'Monadology (1714)'],
    legacy: 'Calculus notation, binary arithmetic, symbolic logic’s dream, and possible-worlds metaphysics — analytic philosophy and computer science both owe him quiet royalties.',
  },
  berkeley: {
    bio: 'A Trinity College Dublin fellow who published his revolutionary idealism by twenty-five, Berkeley spent years promoting a utopian college in Bermuda — sailing as far as Rhode Island before the funding collapsed — and ended as the beloved Bishop of Cloyne, where he championed tar-water as universal medicine.',
    ideas: [
      { title: 'To be is to be perceived', text: 'A material world existing outside all perception is not just unknowable but incoherent: what could "unperceived color" even mean? Objects are stable bundles of ideas.' },
      { title: 'God as sustainer', text: 'Things persist when no human perceives them because they are perpetually perceived by God — idealism as an argument for theism.' },
      { title: 'Against abstraction', text: 'His critique of "abstract ideas" and of Newton’s infinitesimals made him empiricism’s sharpest internal auditor.' },
    ],
    works: ['A Treatise Concerning the Principles of Human Knowledge (1710)', 'Three Dialogues between Hylas and Philonous (1713)'],
    legacy: 'The permanent proof of how far rigorous empiricism can be pushed — every phenomenalism and every "reality is information" conjecture replays him.',
  },
  hume: {
    bio: 'Edinburgh-born Hume wrote his Treatise in France by twenty-six and watched it fall "dead-born from the press." Twice rejected for professorships on suspicion of atheism, he made his fortune instead with essays and a bestselling History of England, charmed Paris as le bon David, and met his own death in 1776 with a serenity that scandalized the pious.',
    ideas: [
      { title: 'Causation as custom', text: 'We never perceive necessary connection — only constant conjunction. Causal inference is habit, not insight, and induction has no non-circular justification.' },
      { title: 'Reason serves passion', text: 'Reason alone moves nothing; it is and ought only to be the slave of the passions. Morality rests on sentiment — and you cannot derive an ought from an is.' },
      { title: 'The bundle self', text: 'Introspect and you find perceptions, never a self that has them: personal identity is a bundle united by memory and imagination.' },
    ],
    works: ['A Treatise of Human Nature (1739–40)', 'An Enquiry Concerning Human Understanding (1748)', 'Dialogues Concerning Natural Religion (1779, posthumous)'],
    legacy: 'Kant credited him with breaking his dogmatic slumber; cognitive science’s picture of the mind as associative habit is Hume vindicated.',
  },
  rousseau: {
    bio: 'A Genevan watchmaker’s son who ran away at fifteen, Rousseau vaulted to fame in 1750 by arguing that the arts and sciences corrupt morals. His Emile and Social Contract were burned in Paris and Geneva alike in 1762, sending him into paranoid wandering — including a disastrous stay with Hume. He gave his five children to a foundling hospital, a fact that has shadowed his educational theory ever since.',
    ideas: [
      { title: 'Natural goodness', text: 'Humans are born good and free; inequality and vice are artifacts of society, property, and comparison — "the first man who enclosed a piece of ground and said this is mine" founded civil society and its crimes.' },
      { title: 'The general will', text: 'Legitimate law is what citizens will together as citizens, aiming at the common good — obedience to law we prescribe ourselves is freedom.' },
      { title: 'Education by nature', text: 'Emile argues children should learn from experience and necessity, not rote and fear — protecting natural development from social corruption.' },
    ],
    works: ['Discourse on Inequality (1755)', 'The Social Contract (1762)', 'Emile (1762)', 'Confessions (1782, posthumous)'],
    legacy: 'The French Revolution carried him to the Panthéon; Romanticism, progressive education, and every critique of civilization since keep him current.',
  },
  kant: {
    bio: 'Kant never left the vicinity of Königsberg, where neighbors reportedly set their watches by his afternoon walk. A decade of silence in his fifties ended with the Critique of Pure Reason, and the "all-crushing" system that followed made a Prussian professor the hinge of modern thought. The king censored his religious writings; Kant complied — until the king died.',
    ideas: [
      { title: 'The Copernican revolution', text: 'Objects conform to our modes of knowing: space, time, and causality are the mind’s own forms. We know appearances, never things-in-themselves — which is precisely why science is certain and metaphysics overreaches.' },
      { title: 'The categorical imperative', text: 'Act only on maxims you could will as universal law; treat humanity always as an end, never merely as a means. Morality is reason legislating for itself.' },
      { title: 'Autonomy and enlightenment', text: 'Enlightenment is emergence from self-incurred immaturity — sapere aude, dare to use your own understanding — and human dignity rests on self-legislation.' },
    ],
    works: ['Critique of Pure Reason (1781/87)', 'Groundwork of the Metaphysics of Morals (1785)', 'Critique of Practical Reason (1788)', 'Critique of Judgment (1790)'],
    legacy: 'Philosophy divides into before and after Kant; human-rights doctrine, constructivist ethics, and cognitive science all argue on his terrain.',
  },
  bentham: {
    bio: 'A prodigy who entered Oxford at twelve and found law a "demon of chicane," Bentham spent his life drafting rational codes for any nation that would listen. He designed the Panopticon prison, championed causes from universal suffrage to decriminalizing homosexuality, and left his body to science — his clothed skeleton, the "auto-icon," still sits in University College London.',
    ideas: [
      { title: 'The greatest happiness', text: 'Right actions maximize pleasure and minimize pain, counted impartially — "everybody to count for one, nobody for more than one."' },
      { title: 'The felicific calculus', text: 'Pleasures and pains can in principle be scored by intensity, duration, certainty, and extent — ethics as accounting, legislation as engineering.' },
      { title: 'Against fictions', text: 'Natural rights are "nonsense upon stilts"; law is real only as commands and sanctions, and should be judged solely by its effects. And the question about animals "is not, Can they reason? but, Can they suffer?"' },
    ],
    works: ['An Introduction to the Principles of Morals and Legislation (1789)', 'Panopticon writings (1787)', 'A Fragment on Government (1776)'],
    legacy: 'The godfather of policy analysis, welfare economics, and animal-welfare ethics — and, via Foucault’s reading of the Panopticon, of surveillance critique too.',
  },
  wollstonecraft: {
    bio: 'Self-educated escapee from an abusive household, Wollstonecraft ran a school, worked as a governess, and then did the unheard-of: lived by her pen in London. She answered Burke on the French Revolution within weeks, went to Paris to watch the Revolution devour itself, and died in 1797 giving birth to the daughter who would write Frankenstein.',
    ideas: [
      { title: 'Reason has no sex', text: 'If women appear frivolous, it is because education designed for ornament makes them so — deny any group cultivation of reason and you manufacture the inferiority you cite.' },
      { title: 'Virtue requires independence', text: 'Character built on dependence is corrupted at the root; women need education, property, and civil existence to be moral equals, not merely pleasing companions.' },
      { title: 'The critique of sensibility', text: 'The cult of delicate feminine feeling, she argued, is a gilded cage — sentiment untethered from reason degrades both women and men.' },
    ],
    works: ['A Vindication of the Rights of Men (1790)', 'A Vindication of the Rights of Woman (1792)', 'Letters Written in Sweden, Norway, and Denmark (1796)'],
    legacy: 'Feminist philosophy’s founding text — a century ahead of the movements that finally caught up with her arguments.',
  },
  hegel: {
    bio: 'Hegel finished the Phenomenology of Spirit in Jena in 1806 as Napoleon’s cannons sounded — and described the emperor riding through town as "the world-soul on horseback." After years as a newspaper editor and headmaster he ascended to the Berlin chair where his lectures, delivered in a notorious mumble, became the intellectual weather of Europe.',
    ideas: [
      { title: 'Dialectic', text: 'Thought and history move by contradiction: a position generates its opposition, and their conflict resolves into a richer whole that preserves both — aufgehoben, cancelled and kept at once.' },
      { title: 'Spirit', text: 'Mind is not private but social and historical — Geist comes to know itself through language, institutions, art, religion, and philosophy; history is "the progress of the consciousness of freedom."' },
      { title: 'Master and slave', text: 'Self-consciousness needs recognition by another; the master who wins it by domination gets recognition from someone he does not recognize — and so loses. The slave, transforming the world through work, carries history forward.' },
    ],
    works: ['Phenomenology of Spirit (1807)', 'Science of Logic (1812–16)', 'Elements of the Philosophy of Right (1821)'],
    legacy: 'Marxism, existentialism, and critical theory are all quarrels among his heirs; "the owl of Minerva flies at dusk" remains philosophy’s best self-description.',
  },
  schopenhauer: {
    bio: 'Heir to a Danzig merchant fortune, Schopenhauer published his masterpiece at thirty to near-total silence, then scheduled his Berlin lectures opposite Hegel’s — and spoke to empty rooms. He kept the Upanishads on his nightstand, a sequence of poodles at his feet, and his contempt for academic philosophy in print, until fame finally arrived in his sixties.',
    ideas: [
      { title: 'The world as will', text: 'Behind the world of representations lies not reason but Will — blind, endless striving. Your intellect is its servant, and desire’s satisfaction only breeds new desire; hence life swings "like a pendulum between pain and boredom."' },
      { title: 'Aesthetic release', text: 'In art, above all in music, we contemplate without desiring — the one temporary exit from the Will’s treadmill.' },
      { title: 'Compassion', text: 'Since all individuals are one Will, another’s suffering is metaphysically your own; ethics begins not in reason but in Mitleid — compassion.' },
    ],
    works: ['The World as Will and Representation (1818/1844)', 'On the Fourfold Root of the Principle of Sufficient Reason (1813)', 'Parerga and Paralipomena (1851)'],
    legacy: 'The first Western system built on Indian thought; Nietzsche, Wagner, Freud, and half of modern pessimism are footnotes to his diagnosis of desire.',
  },
  mill: {
    bio: 'Raised by his father and Bentham as a utilitarian experiment — Greek at three, logic at twelve — Mill broke down at twenty and credited Wordsworth’s poetry with his recovery, a lesson he folded back into his philosophy. His decades-long intellectual partnership with Harriet Taylor shaped his best work; as an MP he made the first parliamentary motion for women’s suffrage in 1867.',
    ideas: [
      { title: 'Refined utilitarianism', text: 'Happiness is the measure, but pleasures differ in quality: better Socrates dissatisfied than a fool satisfied — the judges being those who know both.' },
      { title: 'The harm principle', text: 'Power may be exercised over someone against their will only to prevent harm to others; over himself, over his own body and mind, the individual is sovereign.' },
      { title: 'Liberty of thought', text: 'Silencing an opinion robs everyone: if it is true we lose truth, if false we lose the sharper grasp of truth that comes from its collision with error.' },
    ],
    works: ['A System of Logic (1843)', 'On Liberty (1859)', 'Utilitarianism (1861)', 'The Subjection of Women (1869)'],
    legacy: 'The house philosopher of liberal democracy — free speech, personal liberty, and equality arguments still begin from his pages.',
  },
  kierkegaard: {
    bio: 'Son of a wealthy, guilt-haunted Copenhagen merchant, Kierkegaard broke his engagement to Regine Olsen in 1841 — a wound he turned into an authorship, publishing under a carnival of pseudonyms who argue with each other. He spent his last years attacking the established Danish church as counterfeit Christianity, collapsed in the street, and died at forty-two.',
    ideas: [
      { title: 'Truth is subjectivity', text: 'On the ultimate questions, what matters is not objective proof but how you hold what you hold — the passionate inwardness of commitment. An objectively uncertain truth grasped with infinite passion is faith.' },
      { title: 'The three stages', text: 'The aesthetic life pursues interesting experience and ends in despair; the ethical life chooses duty and commitment; the religious life stands alone before God — reachable only by a leap.' },
      { title: 'Anxiety and despair', text: 'Anxiety is "the dizziness of freedom" — dread before one’s own possibility. Despair is the sickness unto death: failing to become the self one is meant to be.' },
    ],
    works: ['Either/Or (1843)', 'Fear and Trembling (1843)', 'The Concept of Anxiety (1844)', 'The Sickness unto Death (1849)'],
    legacy: 'Existentialism’s fountainhead — Heidegger, Sartre, and modern psychology of anxiety all draw water from his wells.',
  },
  marx: {
    bio: 'A Rhineland lawyer’s son radicalized by Hegel and censorship in equal measure, Marx was expelled from Prussia, France, and Belgium before settling in London, where he wrote in the British Museum by day while Engels’s factory income kept his family barely afloat. Three of his children died in poverty; volume one of Capital appeared in 1867, the rest posthumously.',
    ideas: [
      { title: 'Historical materialism', text: 'The engine of history is not ideas but the mode of production; legal, political, and cultural forms rise on economic foundations, and class struggle drives epochal change.' },
      { title: 'Alienation', text: 'Under capitalism the worker’s own product, activity, and species-life confront him as alien powers — labor that should express humanity instead empties it.' },
      { title: 'Critique of ideology', text: 'The ruling ideas of an age are the ideas of its ruling class; religion, the "opium of the people," is both protest against suffering and its sedative.' },
    ],
    works: ['Economic and Philosophic Manuscripts (1844)', 'The Communist Manifesto (1848, with Engels)', 'Capital, vol. 1 (1867)'],
    legacy: 'No philosopher’s ideas have been claimed by more states, movements, and counter-movements; social science still works in the crater of his questions.',
  },
  james: {
    bio: 'Son of an eccentric Swedenborgian and brother of the novelist Henry, James trained as a physician, survived a suicidal depression by an act of willed belief in free will, and taught Harvard’s first psychology course — remarking that the first lecture on the subject he ever heard was his own. He wrote philosophy in prose so alive it embarrassed the profession.',
    ideas: [
      { title: 'Pragmatism', text: 'The meaning of an idea is the difference it makes in practice; truth is what proves itself in experience — "the cash-value" of a belief. Ideas become true insofar as they help us cope.' },
      { title: 'The will to believe', text: 'When evidence cannot decide a live, forced, momentous option — faith, friendship, free will — we have the right to believe at our own risk; waiting forever is itself a choice.' },
      { title: 'Stream of consciousness', text: 'Experience is not beads on a string but a flowing stream with fringes and halos — a description that transformed both psychology and the novel.' },
    ],
    works: ['The Principles of Psychology (1890)', 'The Will to Believe (1897)', 'The Varieties of Religious Experience (1902)', 'Pragmatism (1907)'],
    legacy: 'America’s signature philosophy is his; psychology of religion, functionalist cognitive science, and therapeutic culture all cite him as founder.',
  },
  nietzsche: {
    bio: 'A Lutheran pastor’s son made full professor of philology at Basel at twenty-four, Nietzsche resigned in broken health at thirty-four and wrote his books in boarding houses across the Alps and the Riviera, nearly blind, largely unread. In January 1889 he collapsed in Turin — legend says embracing a beaten horse — and spent his last eleven years insane, while his antisemitic sister curated his archive into shapes he would have despised.',
    ideas: [
      { title: 'The death of God', text: 'European culture has killed its own foundation and not yet noticed; without the Christian God, its morality and meaning must either collapse into nihilism or be created anew.' },
      { title: 'Genealogy of morals', text: 'Our "good" began as the self-affirmation of the strong; "evil" was invented by the resentful weak to condemn them. Morality has a history, and ressentiment is its engine.' },
      { title: 'Amor fati and eternal recurrence', text: 'The test: could you will your life, unchanged, again and forever? To say yes — to love fate — is the affirmation that overcomes nihilism.' },
    ],
    works: ['The Birth of Tragedy (1872)', 'Thus Spoke Zarathustra (1883–85)', 'Beyond Good and Evil (1886)', 'On the Genealogy of Morality (1887)'],
    legacy: 'The seismograph of modernity: existentialism, psychoanalysis, and postmodernism all begin by answering him, and his diagnosis of nihilism still reads like tomorrow’s news.',
  },
  russell: {
    bio: 'Grandson of a prime minister and godson of J. S. Mill, Russell discovered at eleven that geometry rested on unproven axioms and spent decades trying to fix that — producing, with Whitehead, the three volumes of Principia Mathematica and discovering on the way the paradox that bears his name. Jailed for pacifism in 1918 and again, briefly, at eighty-nine, he won the Nobel Prize in Literature and spent his last years campaigning against nuclear weapons.',
    ideas: [
      { title: 'Logic as method', text: 'Philosophy’s job is logical analysis: translate misleading grammar into logical form and pseudo-problems dissolve. His theory of descriptions — unpacking "the present King of France is bald" — became the model of the method.' },
      { title: 'Logicism', text: 'Mathematics is logic in disguise: arithmetic can, with heroic effort, be derived from purely logical foundations.' },
      { title: 'Liberal skepticism', text: 'It is undesirable to believe a proposition when there is no ground whatever for supposing it true — a rule he applied to religion, nationalism, and received sexual morality alike.' },
    ],
    works: ['Principia Mathematica (1910–13, with Whitehead)', '"On Denoting" (1905)', 'The Problems of Philosophy (1912)', 'A History of Western Philosophy (1945)'],
    legacy: 'Co-founder of analytic philosophy — and proof that a logician can also be a public moralist with a prison record.',
  },
  wittgenstein: {
    bio: 'Born into one of Vienna’s richest families — three of his four brothers died by suicide — Wittgenstein studied engineering, then stormed into Russell’s rooms in Cambridge. He finished the Tractatus as a soldier and POW in the First World War, gave away his fortune, and quit philosophy for village schoolteaching, believing he had solved it. He returned in 1929 to dismantle his own earlier system.',
    ideas: [
      { title: 'Picture theory (early)', text: 'Propositions picture facts; what cannot be pictured — ethics, God, the meaning of life — cannot be said, only shown. "Whereof one cannot speak, thereof one must be silent."' },
      { title: 'Language-games (late)', text: 'Meaning is not naming but use: language is a motley of games woven into forms of life — ordering, joking, praying, measuring — with no single essence.' },
      { title: 'Philosophy as therapy', text: 'Philosophical problems arise "when language goes on holiday"; the task is not theory but untying knots — showing the fly the way out of the fly-bottle.' },
    ],
    works: ['Tractatus Logico-Philosophicus (1921)', 'Philosophical Investigations (1953, posthumous)', 'On Certainty (1969, posthumous)'],
    legacy: 'The only philosopher to found two rival movements and demolish the first himself; both halves of analytic philosophy claim him.',
  },
  heidegger: {
    bio: 'A sexton’s son from the Black Forest trained for the priesthood, Heidegger became Husserl’s assistant and then, with Being and Time, the most influential philosopher in Europe — writing much of it in a mountain hut at Todtnauberg. In 1933 he joined the Nazi party and became rector of Freiburg, a commitment he never adequately renounced — the permanent stain and problem of his legacy.',
    ideas: [
      { title: 'The question of Being', text: 'Philosophy has forgotten its founding question — not what things are, but what it means for anything to be at all. Human existence (Dasein) is the place where that question opens.' },
      { title: 'Being-toward-death', text: 'We are thrown into a world, defined by care and by time; owning one’s mortality, rather than fleeing into the anonymous "they," is the condition of authentic existence.' },
      { title: 'The technological enframing', text: 'Modern technology is not tools but a way of revealing that reduces everything — rivers, forests, humans — to standing-reserve, resources on call. The danger is that no other way of seeing survives.' },
    ],
    works: ['Being and Time (1927)', '"What Is Metaphysics?" (1929)', '"The Question Concerning Technology" (1954)'],
    legacy: 'Existentialism, hermeneutics, deconstruction, and eco-philosophy all descend from him — a philosophical inheritance forever entangled with his politics.',
  },
  sartre: {
    bio: 'A tiny, wall-eyed graduate of the École Normale who failed his first agrégation and topped it the next year, Sartre was captured in 1940 and wrote in a POW camp; Being and Nothingness appeared under the Occupation. After the war he ran Les Temps Modernes with Beauvoir, declined the 1964 Nobel Prize on principle, and drew fifty thousand people to his funeral.',
    ideas: [
      { title: 'Existence precedes essence', text: 'There is no human nature written in advance; we exist first and define ourselves by choosing. We are "condemned to be free" — and responsible without excuse.' },
      { title: 'Bad faith', text: 'The waiter who is nothing but a waiter, the lover who says "I can’t help it" — bad faith is freedom lying to itself, playing at being a thing.' },
      { title: 'The Look', text: 'Under another’s gaze I become an object in their world; shame, pride, and conflict are built into being seen. "Hell is other people" — not because others are bad, but because their gaze fixes us.' },
    ],
    works: ['Nausea (1938)', 'Being and Nothingness (1943)', 'Existentialism Is a Humanism (1946)', 'Critique of Dialectical Reason (1960)'],
    legacy: 'The model of the engaged public intellectual — existentialism’s slogan-maker, whose vocabulary of freedom, authenticity, and bad faith entered the language itself.',
  },
  arendt: {
    bio: 'A Königsberg-born Jewish student (and briefly lover) of Heidegger who fled Germany in 1933, was interned in France, and escaped to New York in 1941, Arendt made the wreckage of her century her subject. Her Eichmann in Jerusalem — coining "the banality of evil" for a bureaucrat who had simply stopped thinking — ignited a controversy that cost her friendships for the rest of her life. She insisted she was a political theorist, not a philosopher.',
    ideas: [
      { title: 'Totalitarianism', text: 'Total domination is a novel regime form: terror plus ideology, aimed at making humans superfluous — proving that "everything is possible" and that rightlessness begins when one loses "the right to have rights."' },
      { title: 'The banality of evil', text: 'The greatest crimes may require not monsters but thoughtlessness — functionaries who never examine what they are doing. Thinking itself becomes a moral bulwark.' },
      { title: 'Action and natality', text: 'Against labor and work, action — appearing among others in speech and deed — is the highest human activity; every birth brings the capacity to begin something new into the world.' },
    ],
    works: ['The Origins of Totalitarianism (1951)', 'The Human Condition (1958)', 'Eichmann in Jerusalem (1963)', 'On Revolution (1963)'],
    legacy: 'The essential theorist of the twentieth century’s political catastrophes — read anew with every authoritarian revival.',
  },
  beauvoir: {
    bio: 'The youngest agrégée in France at twenty-one — placed second to Sartre by judges who privately thought her the truer philosopher — Beauvoir taught, wrote novels, and formed with Sartre a lifelong open partnership that scandalized and fascinated. The Second Sex (1949) was placed on the Vatican’s Index; in 1971 she headlined the "Manifesto of the 343" demanding abortion rights, and won the Prix Goncourt for The Mandarins.',
    ideas: [
      { title: 'Woman as Other', text: 'Man is cast as the default human, woman as the Other — defined relative to him. "One is not born, but rather becomes, a woman": femininity is made by situation, not decreed by biology.' },
      { title: 'Situated freedom', text: 'We are free, but always in circumstances that enable or strangle freedom; oppression is the systematic confinement of a person to immanence, and liberation must be material, not just mental.' },
      { title: 'The ethics of ambiguity', text: 'Existence has no given meaning, and we are both subjects and objects — an ambiguity to be assumed, not escaped. My freedom requires willing the freedom of others.' },
    ],
    works: ['The Ethics of Ambiguity (1947)', 'The Second Sex (1949)', 'The Mandarins (1954)', 'The Coming of Age (1970)'],
    legacy: 'The founding text of modern feminist philosophy is hers; gender theory, care ethics, and existentialism itself all stand corrected by her.',
  },
  camus: {
    bio: 'Born to a poor, illiterate widow in French Algeria, Camus rose on scholarships, played goalkeeper until tuberculosis intervened, and edited the Resistance paper Combat under the Occupation. The Rebel broke his friendship with Sartre over communism; the Nobel came at forty-four; a car crash killed him at forty-six, an unused train ticket in his pocket.',
    ideas: [
      { title: 'The absurd', text: 'The absurd is a divorce: our hunger for meaning meets the universe’s unreasonable silence. It must be neither denied nor escaped — by suicide or by leaps of faith — but kept alive and lived against.' },
      { title: 'Revolt', text: 'The answer to absurdity is defiant lucidity: "one must imagine Sisyphus happy," pushing his rock in full knowledge, and the rebel who says no to injustice affirms a human dignity worth more than doctrine.' },
      { title: 'Limits', text: 'Against revolutionaries who justify murder by history, The Rebel argues for measure: any cause that requires killing innocents has refuted itself.' },
    ],
    works: ['The Stranger (1942)', 'The Myth of Sisyphus (1942)', 'The Plague (1947)', 'The Rebel (1951)'],
    legacy: 'The century’s conscience in a trench coat — proof that lucidity without hope need not curdle into cruelty.',
  },
  rawls: {
    bio: 'Two of Rawls’s brothers died of diseases caught from him in childhood — a lottery of fate he never forgot. He served as an infantryman in the Pacific, saw the aftermath of Hiroshima, declined an officer’s commission, and lost his faith. At Harvard he spent twenty years quietly building one book, and when A Theory of Justice appeared in 1971 it single-handedly revived political philosophy.',
    ideas: [
      { title: 'The veil of ignorance', text: 'Principles of justice are those you would choose not knowing your place in society — rich or poor, talented or not, majority or minority. Fairness is built in by subtracting self-interest’s information.' },
      { title: 'The two principles', text: 'First, equal basic liberties for all; second, inequalities are permissible only if attached to open positions and — the difference principle — only if they benefit the least advantaged.' },
      { title: 'Public reason', text: 'In a society of permanent moral pluralism, political power must be justified in terms all reasonable citizens could accept — an overlapping consensus, not a victory of one creed.' },
    ],
    works: ['A Theory of Justice (1971)', 'Political Liberalism (1993)', 'The Law of Peoples (1999)'],
    legacy: 'Contemporary political philosophy is, to a first approximation, the debate his book started; "the veil of ignorance" became moral common property.',
  },
  foucault: {
    bio: 'A psychiatrist’s son who worked in mental hospitals before turning on their history, Foucault held a Collège de France chair he named "History of Systems of Thought," founded a prisoners’ rights group, and filled lecture halls to overflowing. He died in 1984 of AIDS-related illness — among the first prominent French figures whose death forced the epidemic into public view.',
    ideas: [
      { title: 'Power/knowledge', text: 'Power is not merely repressive but productive: it manufactures categories, norms, and truths. Every regime of knowledge — psychiatry, criminology, medicine — is also a regime of power.' },
      { title: 'Discipline', text: 'Modern power works less by spectacular punishment than by surveillance, examination, and normalization — Bentham’s Panopticon as the diagram of schools, barracks, hospitals, and offices.' },
      { title: 'Genealogy', text: 'Write "the history of the present": show that what seems natural and necessary — madness, sexuality, the self — was assembled, and can therefore be otherwise.' },
    ],
    works: ['Madness and Civilization (1961)', 'The Order of Things (1966)', 'Discipline and Punish (1975)', 'The History of Sexuality (1976–84)'],
    legacy: 'The most cited author in the humanities; every analysis of surveillance, normalization, and identity’s history speaks his dialect.',
  },
  searle: {
    bio: 'Denver-born and Oxford-trained under J. L. Austin, Searle taught at Berkeley from 1959, where he was an early faculty voice in the Free Speech Movement. In 2019 the university revoked his emeritus status after determining he had violated its sexual-harassment policies — a finding that shadows five decades at the center of philosophy of mind and language.',
    ideas: [
      { title: 'Speech acts', text: 'Saying is doing: promising, ordering, and christening are actions performed in words, governed by constitutive rules — a theory that reshaped linguistics and law.' },
      { title: 'The Chinese Room', text: 'A person following rules to shuffle Chinese symbols produces perfect answers while understanding nothing. Syntax alone cannot generate semantics — the most contested thought experiment in the debate over machine minds.' },
      { title: 'Institutional reality', text: 'Money, property, and governments exist because we collectively accept that X counts as Y in context C — a social ontology built out of status functions.' },
    ],
    works: ['Speech Acts (1969)', '"Minds, Brains, and Programs" (1980)', 'Intentionality (1983)', 'The Construction of Social Reality (1995)'],
    legacy: 'The Chinese Room still frames every argument about whether machines understand anything — newly urgent in the age of language models.',
  },
  kripke: {
    bio: 'An Omaha rabbi’s son born on Long Island, Kripke proved a completeness theorem for modal logic while still in high school — legend has an inquiry from Harvard answered that his mother said he should finish school first. In 1970 at Princeton he delivered the three Naming and Necessity lectures without a page of notes; by his death in 2022 he was routinely ranked among the most influential philosophers of the past century.',
    ideas: [
      { title: 'Rigid designation', text: 'A name picks out the same individual in every possible world, its reference fixed by a historical chain of use rather than by descriptions in the head. The reigning theory of names since Frege and Russell fell in an afternoon.' },
      { title: 'The necessary a posteriori', text: 'That water is H2O is necessary — yet it took science to discover it. Necessity belongs to the world and apriority to knowers, and prying the two apart relaunched metaphysics.' },
      { title: 'Kripkenstein', text: 'His reading of Wittgenstein: no fact about you fixes that by "plus" you ever meant addition — a skeptical paradox about meaning itself, answered only in communal practice.' },
    ],
    works: ['"A Completeness Theorem in Modal Logic" (1959)', 'Naming and Necessity (1972/1980)', 'Wittgenstein on Rules and Private Language (1982)', 'Philosophical Troubles (2011)'],
    legacy: 'Analytic metaphysics exists again because of him; debates about reference, essence, and consciousness still argue in his vocabulary.',
  },
  confucius: {
    bio: 'Born to a fallen aristocratic family in Qufu during the collapse of the Zhou order, Confucius spent years wandering between courts seeking a ruler who would govern by virtue, failed by his own reckoning, and taught instead. His students recorded his conversations; within centuries the Analects had shaped every East Asian institution.',
    ideas: [
      { title: 'Ren — humaneness', text: 'The highest excellence is cultivated benevolence: becoming fully human through how you treat others. Its measure is reciprocity — do not impose what you would not wish.' },
      { title: 'Ritual as formation', text: 'Li — ceremony, manners, the forms of respect — is not empty show but the practice that trains feeling into virtue, as music trains the ear.' },
      { title: 'Government by example', text: 'A ruler who is upright commands without orders; one who is not, orders without being obeyed. Legitimacy is moral before it is legal.' },
    ],
    works: ['Analects (compiled by disciples, c. 475–221 BCE)'],
    legacy: 'Two and a half millennia of East Asian ethics, education, and statecraft trace to his classroom — arguably no one has taught more people how to live.',
  },
  laozi: {
    bio: 'Tradition makes Laozi an archivist of the Zhou court who despaired of civilization, rode west on an ox, and wrote the Daodejing’s five thousand characters at the border keeper’s request before vanishing. Scholars doubt nearly every detail, including his existence — fittingly, for the philosopher of the unnameable.',
    ideas: [
      { title: 'The Dao', text: 'Beneath names and categories runs the Way — the source and pattern of everything, graspable only by those who stop grasping.' },
      { title: 'Wu wei', text: 'Effortless action: the skillful life aligns with the grain of things rather than forcing them. Water, softest of all, defeats stone.' },
      { title: 'The value of emptiness', text: 'A wheel works because of the hole at its hub; a vessel because of its hollow. What is not there does the work — a rebuke to every philosophy of accumulation.' },
    ],
    works: ['Daodejing (Tao Te Ching)'],
    legacy: 'Daoism’s fountainhead and, after the Bible, perhaps the most translated book on earth — the permanent counter-voice to Confucian order.',
  },
  mozi: {
    bio: 'A craftsman — likely a carpenter or fortification engineer — who rose from the artisan class, Mozi built a disciplined movement that raced between besieged cities to defend them, since defense served the people and aggression never did. For two centuries Mohism rivaled Confucianism, then vanished under the Qin.',
    ideas: [
      { title: 'Impartial care', text: 'The world’s harms come from partiality — my family, my state, first. Care for all impartially, he argued, and war and cruelty lose their root.' },
      { title: 'The test of benefit', text: 'Judge every doctrine and ritual by whether it enriches the people, orders the state, and feeds the many — consequences over custom, two millennia before utilitarianism.' },
      { title: 'Against fatalism and lavish ritual', text: 'Elaborate funerals and belief in fate paralyze effort; heaven’s will is known by what benefits the living.' },
    ],
    works: ['Mozi (the book, compiled by his school)'],
    legacy: 'China’s road not taken: rediscovered in the twentieth century as the classical tradition’s scientist, logician, and consequentialist.',
  },
  mencius: {
    bio: 'Raised by a mother whose devotion to his education became proverbial — she moved house three times to find the right neighborhood — Mencius carried Confucianism through the Warring States period, debating kings with a boldness that got him politely ignored. The Neo-Confucians later canonized him as the tradition’s second sage.',
    ideas: [
      { title: 'The four sprouts', text: 'Anyone who sees a child about to fall into a well feels alarm — proof that compassion, shame, deference, and judgment are innate sprouts, needing only cultivation to become full virtues.' },
      { title: 'Human nature is good', text: 'Water can be splashed uphill, but it flows down by nature; people can be made bad, but goodness is their grain.' },
      { title: 'The right of revolution', text: 'A king who savages his people has forfeited Heaven’s mandate and is no king — killing such a tyrant is not regicide but justice.' },
    ],
    works: ['Mencius (the book)'],
    legacy: 'The optimistic wing of Confucian ethics; his mandate-of-heaven argument haunted every Chinese dynasty and still frames debates about legitimate rule.',
  },
  zhuangzi: {
    bio: 'A minor official at a lacquer garden who refused the prime ministership of Chu — better, he said, to be a turtle dragging its tail in the mud than honored bones in a shrine. His book’s inner chapters are the most brilliant prose in classical Chinese: parables, jokes, talking animals, and vertigo.',
    ideas: [
      { title: 'The butterfly dream', text: 'He dreamt he was a butterfly, woke, and could not say which he was — a puzzle about knowledge and identity posed as a story, unanswerable by design.' },
      { title: 'The equality of perspectives', text: 'Every judgment is made from somewhere: the cicada laughs at the giant bird. Categories are nets we throw over a world that owes them nothing.' },
      { title: 'Free and easy wandering', text: 'The sage rides the transformations of things rather than resisting them — useful trees get cut down; the gnarled, useless one lives out its years.' },
    ],
    works: ['Zhuangzi (the book, inner chapters c. 4th century BCE)'],
    legacy: 'Chan (Zen) Buddhism, Chinese poetry and painting, and every philosophy of perspective owe him; the West’s closest cousin is a funnier Heraclitus.',
  },
  xunzi: {
    bio: 'The last great classical Confucian, Xunzi taught at the Jixia Academy — the ancient world’s greatest think tank — and lived to see the Warring States devour each other. Two of his students became architects of the Legalist Qin state, a fact held against him for two thousand years.',
    ideas: [
      { title: 'Human nature is crooked', text: 'Against Mencius: we are born with appetites that unchecked become strife. Goodness is artifice — the greatest of human inventions, like agriculture, and as unnatural.' },
      { title: 'Ritual as technology', text: 'The sage-kings designed ritual the way engineers design dikes: to channel desire into forms that let everyone’s life go better.' },
      { title: 'Heaven is just nature', text: 'The sky does not answer prayers or send omens; rain falls on the just and unjust. Order your own conduct and the state — that is the human portion.' },
    ],
    works: ['Xunzi (the book)'],
    legacy: 'The realist wing of Confucianism and a startlingly modern naturalist; his student Han Fei turned the hard edges into Legalism.',
  },
  zhuxi: {
    bio: 'A prodigy who passed the highest imperial examination at eighteen, Zhu Xi spent his life mostly declining office to teach, write, and rebuild the White Deer Grotto Academy. His synthesis was condemned as false learning in his lifetime — and made state orthodoxy, tested on every civil-service examination, within decades of his death.',
    ideas: [
      { title: 'Principle and vital force', text: 'Everything is li — pattern, principle — embodied in qi, vital stuff. The Great Ultimate is the principle of all principles, present whole in every thing, as the moon is mirrored in every river.' },
      { title: 'The investigation of things', text: 'Knowledge grows by studying the principle in each thing and affair — books, rites, plants, government — until one dawn the patterns cohere.' },
      { title: 'The examined heart-mind', text: 'Human nature is principle and thus good; selfish qi obscures it. Learning is polishing the mirror — reverent attention, quiet sitting, daily renewal.' },
    ],
    works: ['Commentaries on the Four Books (1190)', 'Reflections on Things at Hand (1175, with Lü Zuqian)'],
    legacy: 'The most influential Chinese philosopher of the last millennium: his curriculum trained the elites of China, Korea, Japan, and Vietnam for six centuries.',
  },
  wangyangming: {
    bio: 'Statesman, general who suppressed rebellions with armies he improvised, and philosopher who found enlightenment in exile at a postal relay station in Guizhou: the principle he had sought in bamboo for seven fruitless days was in the mind all along. He taught between campaigns; his sayings were compiled by disciples.',
    ideas: [
      { title: 'Mind is principle', text: 'Against Zhu Xi: the moral pattern is not out in things awaiting investigation — the heart-mind itself, when unobscured, is the principle. Look inward, not into bamboo.' },
      { title: 'The unity of knowledge and action', text: 'To know filial piety and not practice it is not yet to know it. Knowledge is the beginning of action; action, the completion of knowledge.' },
      { title: 'Innate moral knowing', text: 'Everyone possesses liangzhi — spontaneous good knowing, prior to study. The sage differs from the commoner only in never letting it be smothered.' },
    ],
    works: ['Instructions for Practical Living (Chuanxilu, compiled 1518–1527)'],
    legacy: 'The great heretic of Neo-Confucianism; his activist idealism fired reformers from Tokugawa Japan to twentieth-century China.',
  },
  buddha: {
    bio: 'Siddhartha Gautama was born a prince at Lumbini and, tradition says, shielded from all suffering until four sights — an old man, a sick man, a corpse, a renunciant — broke the spell. Six years of asceticism failed; a night of meditation under the Bodhi tree did not. He taught for forty-five years across the Gangetic plain and died at eighty, telling his monks to be lamps unto themselves.',
    ideas: [
      { title: 'The Four Noble Truths', text: 'Existence involves suffering; suffering arises from craving; craving can be extinguished; the Eightfold Path — right view through right concentration — is the way to its end.' },
      { title: 'No-self', text: 'Search the body and mind and you find processes, not an owner: the "self" is a bundle of changing aggregates, and clinging to it is the deepest root of suffering.' },
      { title: 'Dependent origination', text: 'Nothing arises alone; everything comes to be conditioned by something else. The middle way between "it exists" and "it does not" — later Buddhism’s deepest mine.' },
    ],
    works: ['Teachings preserved orally, written down in the Pali Canon (c. 1st century BCE)'],
    legacy: 'Founder of a 2,500-year tradition spanning half of Asia — and of a psychology of craving and attention that secular therapy is still rediscovering.',
  },
  mahavira: {
    bio: 'An elder contemporary of the Buddha born near Vaishali, Mahavira renounced his princely house at thirty, wandered naked and possessionless for twelve years of extreme austerity, and attained omniscience by Jain account. He organized an ancient path into the Jain community that survives unbroken today.',
    ideas: [
      { title: 'Ahimsa', text: 'Absolute nonviolence toward every being that breathes — human, animal, insect — as the first and highest duty; Jain monks still sweep the path before their feet.' },
      { title: 'Many-sidedness', text: 'Anekantavada: reality is many-sided and every assertion true only from a standpoint — the blind men and the elephant is a Jain parable of epistemic humility.' },
      { title: 'Karma as substance', text: 'Karma is fine matter that adheres to the soul through action; liberation is burning off the accumulation through discipline until the soul rises weightless.' },
    ],
    works: ['Teachings preserved in the Jain Agamas'],
    legacy: 'The most rigorous ethics of nonviolence ever practiced — Gandhi absorbed ahimsa from Jain neighbors, and through him it reshaped the twentieth century.',
  },
  nagarjuna: {
    bio: 'Almost nothing certain is known of the man — a South Indian monk of the second century, later abbot of Nalanda by legend — but the Mūlamadhyamakakārikā is the sharpest blade in Buddhist philosophy. Every school after him, in India, Tibet, China, and Japan, positioned itself relative to his emptiness.',
    ideas: [
      { title: 'Emptiness', text: 'Nothing possesses svabhava — own-being, independent essence. Things exist the way a chariot does: as dependent assemblies, real enough to function, empty of core.' },
      { title: 'The tetralemma', text: 'For every metaphysical thesis he refutes all four corners — is, is not, both, neither — not to install a rival view but to exhaust the craving for views.' },
      { title: 'Two truths', text: 'Conventional truth (chariots, persons, karma) and ultimate truth (emptiness) — and the crucial move: emptiness itself is empty, so nirvana and samsara do not differ in nature.' },
    ],
    works: ['Mūlamadhyamakakārikā (Fundamental Verses on the Middle Way)'],
    legacy: 'Buddhism’s second Buddha by reputation; his dialectic reads uncannily like deconstruction eighteen centuries early, and Tibetan philosophy is largely commentary on him.',
  },
  shankara: {
    bio: 'Born in Kerala and dead by thirty-two, Shankara took monastic vows as a boy, walked the length of India several times, defeated rivals in public debate, wrote the tradition’s definitive commentaries, and founded four monasteries at the subcontinent’s corners that still operate. Hindu tradition ranks no philosopher higher.',
    ideas: [
      { title: 'Non-dualism', text: 'Brahman — the absolute — alone is real, and atman, the innermost self, is identical with it: tat tvam asi, "you are that." Multiplicity is misperception.' },
      { title: 'Maya and superimposition', text: 'The world of difference is like a rope mistaken for a snake at dusk: not nothing, but not what it seems — appearance superimposed on the real by ignorance.' },
      { title: 'Liberation by knowledge', text: 'Since bondage is a mistake, freedom comes not from works or even devotion but from knowledge — the direct realization that the self was never bound.' },
    ],
    works: ['Brahmasutra Bhashya (commentary on the Brahma Sutras)', 'Upadesasahasri (A Thousand Teachings)'],
    legacy: 'Advaita Vedānta became Hinduism’s most prestigious philosophy and, through Vivekananda, the face it showed the modern West.',
  },
  ramanuja: {
    bio: 'A Tamil Brahmin whose teacher, sensing heterodoxy, allegedly tried three times to be rid of him, Ramanuja became the great theologian of the Sri Vaishnava community at Srirangam — tradition credits him with 120 years. Where Shankara’s absolute was impersonal, Ramanuja’s was a God you could love.',
    ideas: [
      { title: 'Qualified non-dualism', text: 'The world and souls are real, not illusion — they are the body of Brahman, who is their inner self. Unity with difference, against Shankara’s unity instead of it.' },
      { title: 'Devotion as the path', text: 'Liberation comes through bhakti — loving surrender to a personal God — not through bare knowledge; philosophy exists to make love intelligible.' },
      { title: 'God with attributes', text: 'A Brahman without qualities cannot be worshipped, known, or gracious. The absolute is supremely personal: all-merciful, all-beautiful, accessible.' },
    ],
    works: ['Sri Bhashya (commentary on the Brahma Sutras)', 'Vedarthasangraha'],
    legacy: 'The philosopher of Hindu devotionalism: the bhakti movements that shaped popular Hinduism for a millennium stand on his arguments.',
  },
  alkindi: {
    bio: 'Born to the governor of Kufa and educated in Baghdad, Al-Kindi led the circle translating Aristotle, Euclid, and Ptolemy into Arabic at the House of Wisdom, wrote some 260 treatises from optics to cryptography, and endured the confiscation of his library in a court intrigue. He is remembered as the first philosopher of the Arabic tradition.',
    ideas: [
      { title: 'Truth has no nationality', text: 'We should never be ashamed to accept truth from whatever source — even foreign peoples and past ages. The manifesto of the translation movement.' },
      { title: 'Philosophy in service of faith', text: 'Reason and revelation both come from God and teach one truth; philosophy demonstrates what prophecy announces.' },
      { title: 'The eternity question', text: 'Against Aristotle he argued the world cannot be eternal — an actual infinite past is impossible — an argument that traveled through the centuries into Kant’s antinomies.' },
    ],
    works: ['On First Philosophy', 'On the Intellect'],
    legacy: 'Opened the door through which Greek philosophy entered Arabic — and thus, three centuries later, returned to Europe.',
  },
  alfarabi: {
    bio: 'Born on the Central Asian frontier and trained in Baghdad by Christian Aristotelians, Al-Farabi lived simply — legend has him a night watchman in a garden, writing by lamplight — and earned the title "Second Teacher," second only to Aristotle. His harmonization of Plato and Aristotle set the agenda for everyone after.',
    ideas: [
      { title: 'The virtuous city', text: 'Plato’s Republic rethought for a prophetic religion: the ideal ruler unites philosopher and lawgiver, and cities are ranked by the truth of what their citizens believe about happiness.' },
      { title: 'Religion as philosophy’s image', text: 'Religion presents in symbols and stories, for everyone, the same truths philosophy demonstrates for the few — neither is dispensable.' },
      { title: 'The hierarchy of intellect', text: 'From the First Cause emanate the intelligences of the spheres down to the Active Intellect, from which human minds receive their light — the cosmology Avicenna and Maimonides inherited.' },
    ],
    works: ['The Virtuous City', 'The Attainment of Happiness'],
    legacy: 'The architect of Islamic political philosophy; Avicenna said he only understood Aristotle’s Metaphysics after finding Al-Farabi’s little treatise on its aims.',
  },
  avicenna: {
    bio: 'A Persian prodigy who had memorized the Quran by ten and mastered medicine by sixteen, Avicenna wrote through a life of court intrigue, imprisonment, and flight — often composing at night after a day of vizier’s work. His Canon of Medicine taught European doctors for six hundred years; his metaphysics taught their theologians.',
    ideas: [
      { title: 'Essence and existence', text: 'What a thing is and that it is are distinct; in everything but God, existence is received. God alone is the Necessary Existent, whose essence is to be.' },
      { title: 'The floating man', text: 'Imagine yourself created adult, suspended in void, senseless — you would still affirm "I am." Self-awareness is immediate and immaterial: an argument Descartes echoed six centuries on.' },
      { title: 'Proof from contingency', text: 'Contingent things borrow existence; a chain of borrowers cannot run forever without a lender — there must be something necessary in itself.' },
    ],
    works: ['The Book of Healing', 'The Canon of Medicine (1025)', 'Remarks and Admonitions'],
    legacy: 'The greatest philosopher of the Islamic world by common consent: Aquinas’s metaphysics of being and centuries of European medicine both run on Avicennian rails.',
  },
  alghazali: {
    bio: 'At thirty-three, Al-Ghazali held the most prestigious chair in Baghdad; at thirty-seven, a crisis of certainty broke his health, and he walked away from position, wealth, and name to wander a decade as a Sufi. His autobiography, Deliverance from Error, reads like Descartes avant la lettre — doubt pushed to the foundations, then rebuilt on experience of God.',
    ideas: [
      { title: 'The incoherence of the philosophers', text: 'Twenty theses of the falasifa examined and three condemned — an eternal world, God ignorant of particulars, no bodily resurrection — using philosophy’s own logic against its pretensions.' },
      { title: 'Occasionalism', text: 'Fire does not burn cotton; God creates the burning at the fire’s presence, by habit not necessity. Causation is custom — Hume’s problem, posed six centuries before Hume.' },
      { title: 'Knowledge by tasting', text: 'Beyond doctrine stands dhawq — direct experiential knowledge of the divine, won by the purified heart; theology describes water, the Sufi drinks.' },
    ],
    works: ['The Incoherence of the Philosophers (c. 1095)', 'The Revival of the Religious Sciences', 'Deliverance from Error'],
    legacy: 'Redirected Islamic civilization toward Sufi-inflected orthodoxy, and his causal skepticism reads today like Hume with a minaret.',
  },
  averroes: {
    bio: 'Judge of Seville and Córdoba, court physician, and scion of three generations of jurists, Averroes was commissioned by the Almohad caliph to explain Aristotle — and produced commentaries so thorough that Europe called him simply "the Commentator." He died in Marrakesh in 1198 after a late fall from favor; within decades his books were setting Paris on fire.',
    ideas: [
      { title: 'The incoherence of the Incoherence', text: 'His point-by-point reply to Al-Ghazali: to deny natural causation is to deny knowledge itself, for to know a thing is to know it through its causes.' },
      { title: 'One truth, two languages', text: 'The Decisive Treatise argues law itself obliges the capable to philosophize; demonstration for the few and rhetoric for the many teach one truth in different registers.' },
      { title: 'The unity of intellect', text: 'The material intellect is one for all humanity — individual minds share it as one light through many windows — the thesis Aquinas spent a treatise refuting.' },
    ],
    works: ['The Incoherence of the Incoherence (c. 1180)', 'Decisive Treatise', 'Long Commentaries on Aristotle'],
    legacy: 'Latin Averroism forced Christian Europe to reckon with autonomous reason; Aquinas is unthinkable without the Commentator to build on and against.',
  },
  ibnkhaldun: {
    bio: 'A Tunis-born diplomat who served and betrayed half the courts of North Africa and Spain, was jailed, shipwrecked, and widowed by plague, Ibn Khaldun retreated to a desert fortress in 1375 and wrote the Muqaddimah — the introduction to a history of the world that founded a science no one had imagined. He ended as Cairo’s chief judge, and once negotiated with Tamerlane outside Damascus.',
    ideas: [
      { title: 'Asabiyyah', text: 'Group solidarity is the engine of power: hardy peripheries cohere, conquer soft centers, luxuriate, dissolve — and are conquered in turn, in a cycle of roughly four generations.' },
      { title: 'A science of civilization', text: 'History’s reports must be tested against the laws of social organization — economics, geography, group psychology — not just chains of transmission: historiography becomes social science.' },
      { title: 'Economics before economics', text: 'Prices, taxes, and specialization follow patterns: excessive taxation kills the revenue it seeks — an argument twentieth-century economists rediscovered and named after themselves.' },
    ],
    works: ['Muqaddimah (1377)', 'Kitab al-Ibar (universal history)'],
    legacy: 'Sociology, historiography, and economics each claim him as an ancestor; no medieval mind anywhere looks more modern.',
  },
  maimonides: {
    bio: 'Born in Córdoba and driven across the Mediterranean by the Almohad persecutions, Maimonides settled in Cairo as physician to Saladin’s vizier, leading the Jewish community by day and answering the world’s queries by night — he complained he barely had time to be ill. His codification of Jewish law and his philosophy each would have made a lesser man immortal.',
    ideas: [
      { title: 'Negative theology', text: 'God’s essence exceeds every predicate: to say God is wise is only to deny ignorance. We speak most truly of God by unsaying — a discipline against idolatry of the mind.' },
      { title: 'Torah and Aristotle', text: 'Scripture read rightly and reason argued rightly cannot conflict; where the letter clashes with demonstration, the letter is parable. The Guide teaches the perplexed to hold both.' },
      { title: 'The welfare of body and soul', text: 'Divine law aims at two perfections — social order for the body politic, true opinions for the soul — and every commandment serves one or both.' },
    ],
    works: ['Mishneh Torah (1180)', 'The Guide for the Perplexed (1190)'],
    legacy: '"From Moses to Moses there arose none like Moses": Jewish thought is divided by him, and Aquinas cites "Rabbi Moses" as a master.',
  },
}
