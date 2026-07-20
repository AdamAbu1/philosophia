// Curated Wikipedia article for each work, keyed by philosopher id and the
// EXACT work string from details.js. Works absent here (lost texts, minor
// collections with no article) fall back to a Wikipedia search lookup.
// Every URL below is verified live by scripts/check-links (run in CI of one).
const A = t => `https://en.wikipedia.org/wiki/${t}`

export const WORK_LINKS = {
  parmenides: {
    'On Nature (fragments of the poem survive)': A('On_Nature_(Parmenides)'),
  },
  plato: {
    'Republic (c. 375 BCE)': A('Republic_(Plato)'),
    'Symposium': A('Symposium_(Plato)'),
    'Phaedo': A('Phaedo'),
    'Apology': A('Apology_(Plato)'),
    'Timaeus': A('Timaeus_(dialogue)'),
  },
  aristotle: {
    'Nicomachean Ethics': A('Nicomachean_Ethics'),
    'Politics': A('Politics_(Aristotle)'),
    'Metaphysics': A('Metaphysics_(Aristotle)'),
    'Organon': A('Organon'),
    'Poetics': A('Poetics_(Aristotle)'),
  },
  epicurus: {
    'Letter to Menoeceus': A('Letter_to_Menoeceus'),
    'Principal Doctrines': A('Principal_Doctrines'),
  },
  zeno: {
    'Republic of Zeno and other treatises (all lost, known by report)': A('Republic_(Zeno)'),
  },
  marcus: {
    'Meditations (written c. 170–180 CE)': A('Meditations'),
  },
  plotinus: {
    'Enneads (edited by Porphyry, c. 270 CE)': A('Enneads'),
  },
  augustine: {
    'Confessions (c. 397–400)': A('Confessions_(Augustine)'),
    'The City of God (413–426)': A('The_City_of_God'),
    'On the Trinity': A('On_the_Trinity'),
  },
  anselm: {
    'Proslogion (1077–78)': A('Proslogion'),
    'Cur Deus Homo (1098)': A('Cur_Deus_Homo'),
  },
  aquinas: {
    'Summa Theologiae (1265–1274, unfinished)': A('Summa_Theologica'),
    'Summa contra Gentiles': A('Summa_contra_Gentiles'),
    'On Being and Essence': A('De_ente_et_essentia'),
  },
  ockham: {
    'Summa Logicae (c. 1323)': A('Sum_of_Logic'),
  },
  machiavelli: {
    'The Prince (1513, pub. 1532)': A('The_Prince'),
    'Discourses on Livy (c. 1517)': A('Discourses_on_Livy'),
    'The Art of War (1521)': A('The_Art_of_War_(Machiavelli)'),
  },
  bacon: {
    'The Advancement of Learning (1605)': A('The_Advancement_of_Learning'),
    'Novum Organum (1620)': A('Novum_Organum'),
    'New Atlantis (1626)': A('New_Atlantis'),
  },
  hobbes: {
    'Leviathan (1651)': A('Leviathan_(Hobbes_book)'),
    'De Cive (1642)': A('De_Cive'),
    'Behemoth (1681)': A('Behemoth_(Hobbes_book)'),
  },
  descartes: {
    'Discourse on the Method (1637)': A('Discourse_on_the_Method'),
    'Meditations on First Philosophy (1641)': A('Meditations_on_First_Philosophy'),
    'Principles of Philosophy (1644)': A('Principles_of_Philosophy'),
  },
  spinoza: {
    'Ethics (1677, posthumous)': A('Ethics_(Spinoza_book)'),
    'Theological-Political Treatise (1670, anonymous)': A('Tractatus_Theologico-Politicus'),
    'On the Improvement of the Understanding': A('Tractatus_de_Intellectus_Emendatione'),
  },
  locke: {
    'An Essay Concerning Human Understanding (1689)': A('An_Essay_Concerning_Human_Understanding'),
    'Two Treatises of Government (1689)': A('Two_Treatises_of_Government'),
    'A Letter Concerning Toleration (1689)': A('A_Letter_Concerning_Toleration'),
  },
  leibniz: {
    'Discourse on Metaphysics (1686)': A('Discourse_on_Metaphysics'),
    'Theodicy (1710)': A('Th%C3%A9odic%C3%A9e'),
    'Monadology (1714)': A('Monadology'),
  },
  berkeley: {
    'A Treatise Concerning the Principles of Human Knowledge (1710)': A('A_Treatise_Concerning_the_Principles_of_Human_Knowledge'),
    'Three Dialogues between Hylas and Philonous (1713)': A('Three_Dialogues_between_Hylas_and_Philonous'),
  },
  hume: {
    'A Treatise of Human Nature (1739–40)': A('A_Treatise_of_Human_Nature'),
    'An Enquiry Concerning Human Understanding (1748)': A('An_Enquiry_Concerning_Human_Understanding'),
    'Dialogues Concerning Natural Religion (1779, posthumous)': A('Dialogues_Concerning_Natural_Religion'),
  },
  rousseau: {
    'Discourse on Inequality (1755)': A('Discourse_on_Inequality'),
    'The Social Contract (1762)': A('The_Social_Contract'),
    'Emile (1762)': A('Emile,_or_On_Education'),
    'Confessions (1782, posthumous)': A('Confessions_(Rousseau)'),
  },
  kant: {
    'Critique of Pure Reason (1781/87)': A('Critique_of_Pure_Reason'),
    'Groundwork of the Metaphysics of Morals (1785)': A('Groundwork_of_the_Metaphysics_of_Morals'),
    'Critique of Practical Reason (1788)': A('Critique_of_Practical_Reason'),
    'Critique of Judgment (1790)': A('Critique_of_Judgment'),
  },
  bentham: {
    'An Introduction to the Principles of Morals and Legislation (1789)': A('An_Introduction_to_the_Principles_of_Morals_and_Legislation'),
    'Panopticon writings (1787)': A('Panopticon'),
    'A Fragment on Government (1776)': A('A_Fragment_on_Government'),
  },
  wollstonecraft: {
    'A Vindication of the Rights of Men (1790)': A('A_Vindication_of_the_Rights_of_Men'),
    'A Vindication of the Rights of Woman (1792)': A('A_Vindication_of_the_Rights_of_Woman'),
    'Letters Written in Sweden, Norway, and Denmark (1796)': A('Letters_Written_in_Sweden,_Norway,_and_Denmark'),
  },
  hegel: {
    'Phenomenology of Spirit (1807)': A('Phenomenology_of_Spirit'),
    'Science of Logic (1812–16)': A('Science_of_Logic'),
    'Elements of the Philosophy of Right (1821)': A('Elements_of_the_Philosophy_of_Right'),
  },
  schopenhauer: {
    'The World as Will and Representation (1818/1844)': A('The_World_as_Will_and_Representation'),
    'On the Fourfold Root of the Principle of Sufficient Reason (1813)': A('On_the_Fourfold_Root_of_the_Principle_of_Sufficient_Reason'),
    'Parerga and Paralipomena (1851)': A('Parerga_and_Paralipomena'),
  },
  mill: {
    'A System of Logic (1843)': A('A_System_of_Logic'),
    'On Liberty (1859)': A('On_Liberty'),
    'Utilitarianism (1861)': A('Utilitarianism_(book)'),
    'The Subjection of Women (1869)': A('The_Subjection_of_Women'),
  },
  kierkegaard: {
    'Either/Or (1843)': A('Either/Or'),
    'Fear and Trembling (1843)': A('Fear_and_Trembling'),
    'The Concept of Anxiety (1844)': A('The_Concept_of_Anxiety'),
    'The Sickness unto Death (1849)': A('The_Sickness_unto_Death'),
  },
  marx: {
    'Economic and Philosophic Manuscripts (1844)': A('Economic_and_Philosophic_Manuscripts_of_1844'),
    'The Communist Manifesto (1848, with Engels)': A('The_Communist_Manifesto'),
    'Capital, vol. 1 (1867)': A('Das_Kapital'),
  },
  james: {
    'The Principles of Psychology (1890)': A('The_Principles_of_Psychology'),
    'The Will to Believe (1897)': A('The_Will_to_Believe'),
    'The Varieties of Religious Experience (1902)': A('The_Varieties_of_Religious_Experience'),
    'Pragmatism (1907)': A('Pragmatism'),
  },
  nietzsche: {
    'The Birth of Tragedy (1872)': A('The_Birth_of_Tragedy'),
    'Thus Spoke Zarathustra (1883–85)': A('Thus_Spoke_Zarathustra'),
    'Beyond Good and Evil (1886)': A('Beyond_Good_and_Evil'),
    'On the Genealogy of Morality (1887)': A('On_the_Genealogy_of_Morality'),
  },
  russell: {
    'Principia Mathematica (1910–13, with Whitehead)': A('Principia_Mathematica'),
    '"On Denoting" (1905)': A('On_Denoting'),
    'The Problems of Philosophy (1912)': A('The_Problems_of_Philosophy'),
    'A History of Western Philosophy (1945)': A('A_History_of_Western_Philosophy'),
  },
  wittgenstein: {
    'Tractatus Logico-Philosophicus (1921)': A('Tractatus_Logico-Philosophicus'),
    'Philosophical Investigations (1953, posthumous)': A('Philosophical_Investigations'),
    'On Certainty (1969, posthumous)': A('On_Certainty'),
  },
  heidegger: {
    'Being and Time (1927)': A('Being_and_Time'),
    '"What Is Metaphysics?" (1929)': A('What_Is_Metaphysics%3F'),
    '"The Question Concerning Technology" (1954)': A('The_Question_Concerning_Technology'),
  },
  sartre: {
    'Nausea (1938)': A('Nausea_(novel)'),
    'Being and Nothingness (1943)': A('Being_and_Nothingness'),
    'Existentialism Is a Humanism (1946)': A('Existentialism_Is_a_Humanism'),
    'Critique of Dialectical Reason (1960)': A('Critique_of_Dialectical_Reason'),
  },
  arendt: {
    'The Origins of Totalitarianism (1951)': A('The_Origins_of_Totalitarianism'),
    'The Human Condition (1958)': A('The_Human_Condition_(Arendt_book)'),
    'Eichmann in Jerusalem (1963)': A('Eichmann_in_Jerusalem'),
    'On Revolution (1963)': A('On_Revolution'),
  },
  beauvoir: {
    'The Ethics of Ambiguity (1947)': A('The_Ethics_of_Ambiguity'),
    'The Second Sex (1949)': A('The_Second_Sex'),
    'The Mandarins (1954)': A('The_Mandarins'),
    'The Coming of Age (1970)': A('The_Coming_of_Age_(book)'),
  },
  camus: {
    'The Stranger (1942)': A('The_Stranger_(Camus_novel)'),
    'The Myth of Sisyphus (1942)': A('The_Myth_of_Sisyphus'),
    'The Plague (1947)': A('The_Plague_(novel)'),
    'The Rebel (1951)': A('The_Rebel_(book)'),
  },
  rawls: {
    'A Theory of Justice (1971)': A('A_Theory_of_Justice'),
    'Political Liberalism (1993)': A('Political_Liberalism'),
    'The Law of Peoples (1999)': A('The_Law_of_Peoples'),
  },
  foucault: {
    'Madness and Civilization (1961)': A('Madness_and_Civilization'),
    'The Order of Things (1966)': A('The_Order_of_Things'),
    'Discipline and Punish (1975)': A('Discipline_and_Punish'),
    'The History of Sexuality (1976–84)': A('The_History_of_Sexuality'),
  },
  searle: {
    'Speech Acts (1969)': A('Speech_Acts_(book)'),
    '"Minds, Brains, and Programs" (1980)': A('Chinese_room'),
  },
  kripke: {
    '"A Completeness Theorem in Modal Logic" (1959)': A('Kripke_semantics'),
    'Naming and Necessity (1972/1980)': A('Naming_and_Necessity'),
    'Wittgenstein on Rules and Private Language (1982)': A('Wittgenstein_on_Rules_and_Private_Language'),
  },
  confucius: {
    'Analects (compiled by disciples, c. 475–221 BCE)': A('Analects'),
  },
  laozi: {
    'Daodejing (Tao Te Ching)': A('Tao_Te_Ching'),
  },
  mozi: {
    'Mozi (the book, compiled by his school)': A('Mozi_(book)'),
  },
  mencius: {
    'Mencius (the book)': A('Mencius_(book)'),
  },
  zhuangzi: {
    'Zhuangzi (the book, inner chapters c. 4th century BCE)': A('Zhuangzi_(book)'),
  },
  xunzi: {
    'Xunzi (the book)': A('Xunzi_(book)'),
  },
  zhuxi: {
    'Commentaries on the Four Books (1190)': A('Four_Books_and_Five_Classics'),
  },
  buddha: {
    'Teachings preserved orally, written down in the Pali Canon (c. 1st century BCE)': A('Pali_Canon'),
  },
  mahavira: {
    'Teachings preserved in the Jain Agamas': A('Jain_Agamas'),
  },
  nagarjuna: {
    'Mūlamadhyamakakārikā (Fundamental Verses on the Middle Way)': A('M%C5%ABlamadhyamakak%C4%81rik%C4%81'),
  },
  shankara: {
    'Brahmasutra Bhashya (commentary on the Brahma Sutras)': A('Brahma_Sutras'),
    'Upadesasahasri (A Thousand Teachings)': A('Upadesasahasri'),
  },
  ramanuja: {
    'Sri Bhashya (commentary on the Brahma Sutras)': A('Sri_Bhashya'),
    'Vedarthasangraha': A('Vedarthasamgraha'),
  },
  avicenna: {
    'The Book of Healing': A('The_Book_of_Healing'),
    'The Canon of Medicine (1025)': A('The_Canon_of_Medicine'),
  },
  alghazali: {
    'The Incoherence of the Philosophers (c. 1095)': A('The_Incoherence_of_the_Philosophers'),
    'The Revival of the Religious Sciences': A('The_Revival_of_the_Religious_Sciences'),
  },
  averroes: {
    'The Incoherence of the Incoherence (c. 1180)': A('The_Incoherence_of_the_Incoherence'),
    'Decisive Treatise': A('The_Decisive_Treatise'),
  },
  ibnkhaldun: {
    'Muqaddimah (1377)': A('Muqaddimah'),
    'Kitab al-Ibar (universal history)': A('Kitab_al-Ibar'),
  },
  maimonides: {
    'Mishneh Torah (1180)': A('Mishneh_Torah'),
    'The Guide for the Perplexed (1190)': A('The_Guide_for_the_Perplexed'),
  },
  epictetus: {
    'Discourses (transcribed by Arrian, c. 108)': A('Discourses_of_Epictetus'),
    'Enchiridion (the Handbook)': A('Enchiridion_of_Epictetus'),
  },
  boethius: {
    'The Consolation of Philosophy (c. 524)': A('The_Consolation_of_Philosophy'),
  },
  montaigne: {
    'Essays (1580–1595)': A('Essays_(Montaigne)'),
  },
  pascal: {
    'Provincial Letters (1656–57)': A('Lettres_provinciales'),
    'Pensées (1670, posthumous)': A('Pens%C3%A9es'),
  },
  zerayacob: {
    'Hatata (1667)': A('Hatata'),
  },
  frege: {
    'Begriffsschrift (1879)': A('Begriffsschrift'),
    'The Foundations of Arithmetic (1884)': A('The_Foundations_of_Arithmetic'),
    '"On Sense and Reference" (1892)': A('Sense_and_reference'),
  },
  husserl: {
    'Logical Investigations (1900–01)': A('Logical_Investigations'),
    'Cartesian Meditations (1931)': A('Cartesian_Meditations'),
    'The Crisis of European Sciences (1936)': A('The_Crisis_of_European_Sciences_and_Transcendental_Phenomenology'),
  },
  dogen: {
    'Shōbōgenzō (1231–1253)': A('Sh%C5%8Db%C5%8Dgenz%C5%8D'),
  },
  nishida: {
    'An Inquiry into the Good (1911)': A('An_Inquiry_into_the_Good'),
  },
  popper: {
    'The Logic of Scientific Discovery (1934)': A('The_Logic_of_Scientific_Discovery'),
    'The Open Society and Its Enemies (1945)': A('The_Open_Society_and_Its_Enemies'),
    'Conjectures and Refutations (1963)': A('Conjectures_and_Refutations'),
  },
  quine: {
    '"Two Dogmas of Empiricism" (1951)': A('Two_Dogmas_of_Empiricism'),
    'Word and Object (1960)': A('Word_and_Object'),
  },
  weil: {
    'Gravity and Grace (1947, posthumous)': A('Gravity_and_Grace'),
    'The Need for Roots (1949)': A('The_Need_for_Roots'),
    'Waiting for God (1950)': A('Waiting_for_God'),
  },
  anscombe: {
    '"Modern Moral Philosophy" (1958)': A('Modern_Moral_Philosophy'),
  },
}
