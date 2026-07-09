// Real seed data for EduMaster Africa, sourced from the frontend mock data.
// This module is self-contained so the seed script can run without depending on the frontend build.

export interface SeedLesson {
  title: string;
  type: "reading" | "practice" | "quiz";
  minutes: number;
  summary: string;
  content: string;
  exercise?: { question: string; options: string[]; answer: number; explanation: string };
}

export interface SeedCourse {
  id: number;
  title: string;
  category: string;
  subject: string;
  lessons: number;
  enrolled: number;
  rating: number;
  badge: string | null;
  color: string;
  instructor: string;
  price: string;
  description: string;
  lessonList: SeedLesson[];
}

export interface SeedQuestion {
  id: string;
  subject: string;
  topic: string;
  text: string;
  options: { id: string; text: string }[];
  correct: string;
  explanation: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface SeedSchool {
  name: string;
  state: string;
  licenseKey: string;
}

export interface SeedLeaderboard {
  name: string;
  xp: number;
  school: string;
  state: string;
  avatar: string;
  streak: number;
}

export const SCHOOLS: SeedSchool[] = [
  { name: "King's College Lagos", state: "Lagos", licenseKey: "LIC-ABC-123" },
  { name: "FGGC Bwari", state: "FCT", licenseKey: "LIC-XYZ-789" },
  { name: "GGSS Kano", state: "Kano", licenseKey: "LIC-GGS-001" },
  { name: "CHS Ibadan", state: "Oyo", licenseKey: "LIC-CHS-001" },
  { name: "Queens College Lagos", state: "Lagos", licenseKey: "LIC-QCL-001" },
  { name: "FGC Enugu", state: "Enugu", licenseKey: "LIC-FGE-001" },
  { name: "Govt Sec Sch Kaduna", state: "Kaduna", licenseKey: "LIC-GSS-001" },
  { name: "CMS Grammar Bariga", state: "Lagos", licenseKey: "LIC-CMS-001" },
];

const TOPIC_POOLS: Record<string, string[]> = {
  Mathematics: ["Algebra Fundamentals", "Quadratic Equations", "Geometry & Angles", "Trigonometry", "Statistics & Probability", "Number Bases", "Indices & Logarithms", "Sets & Venn Diagrams", "Mensuration", "Sequences & Series"],
  Biology: ["Cell Structure", "Photosynthesis", "Genetics & Heredity", "Ecology & Ecosystems", "Circulatory System", "Nutrition in Plants & Animals", "Reproduction", "Classification of Living Things", "Plant Transport", "Hormones & Homeostasis"],
  Chemistry: ["Acids, Bases & Salts", "Atomic Structure", "The Periodic Table", "Organic Chemistry", "Electrolysis", "Chemical Bonding", "Stoichiometry", "Redox Reactions", "Rates of Reaction", "Energy Changes"],
  Physics: ["Motion & Speed", "Forces & Newton's Laws", "Electricity & Circuits", "Energy & Power", "Waves & Sound", "Heat & Temperature", "Magnetism", "Optics & Light", "Simple Machines", "Pressure"],
  English: ["Parts of Speech", "Tenses & Agreement", "Comprehension Strategies", "Vocabulary & Synonyms", "Idioms & Figures of Speech", "Letter Writing", "Essay Structure", "Phrasal Verbs", "Punctuation", "Summary Writing"],
  Literature: ["Elements of Poetry", "Drama & Stagecraft", "Prose Fiction", "Figures of Speech", "Oral Literature", "Character Analysis", "Themes & Motifs", "Setting & Atmosphere", "Narrative Voice", "Literary Appreciation"],
};

const DESCRIPTIONS: Record<string, string> = {
  WAEC: "Full WAEC syllabus coverage with past-question practice and AI-marked mock exams.",
  JAMB: "JAMB-style CBT practice modelled on recent UTME papers, with timed exam mode.",
  NECO: "Complete NECO preparation with topic-by-topic lessons and mock exams.",
  "Post-UTME": "Crash course for university post-UTME screening with school-specific question packs.",
  Primary: "Foundation lessons that build confidence for common entrance examinations.",
  International: "Internationally recognised exam prep (SAT, IELTS) with expert tutors.",
};

function subjectForCourse(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("math")) return "Mathematics";
  if (t.includes("biol")) return "Biology";
  if (t.includes("chem")) return "Chemistry";
  if (t.includes("phys")) return "Physics";
  if (t.includes("english") || t.includes("lit")) return t.includes("lit") ? "Literature" : "English";
  if (t.includes("sat") || t.includes("ielts")) return "English";
  if (t.includes("science")) return "Biology";
  return "Mathematics";
}

function buildContent(topic: string, subject: string): string {
  return [
    `Welcome to "${topic}". In this lesson we build a clear, exam-ready understanding of the key ideas in ${subject} around this topic.`,
    `We start with the core definitions and why they matter, then work through the standard methods examiners expect you to use. Pay attention to the worked examples — they mirror the style of real WAEC, JAMB and NECO questions.`,
    `By the end of this lesson you should be able to: define the key terms, apply the standard method to solve problems, and avoid the common mistakes students make under time pressure.`,
    `Tip: write out each formula or rule in your own words, then attempt the practice exercise before reading the explanation. Active recall is the fastest way to lock in marks.`,
  ].join("\n\n");
}

function pickExercise(subject: string, questions: SeedQuestion[], index: number): SeedLesson["exercise"] | undefined {
  const qs = questions.filter((q) => q.subject === subject);
  if (qs.length === 0) return undefined;
  const q = qs[index % qs.length];
  return {
    question: q.text,
    options: q.options.map((o) => o.text),
    answer: q.options.findIndex((o) => o.id === q.correct),
    explanation: q.explanation,
  };
}

function buildLessons(subject: string, count: number, questions: SeedQuestion[]): SeedLesson[] {
  const pool = TOPIC_POOLS[subject] || ["Introduction", "Core Concepts", "Worked Examples", "Common Mistakes", "Exam Practice", "Revision", "Mock Questions", "Summary"];
  const lessons: SeedLesson[] = [];
  for (let i = 0; i < count; i++) {
    const topic = pool[i % pool.length];
    const type: SeedLesson["type"] = i > 0 && i % 5 === 0 ? "quiz" : i % 3 === 0 ? "practice" : "reading";
    lessons.push({
      title: topic,
      type,
      minutes: 8 + ((i * 7) % 18),
      summary: `Master ${topic} with clear explanations and exam-style practice.`,
      content: buildContent(topic, subject),
      exercise: type !== "reading" ? pickExercise(subject, questions, i) : undefined,
    });
  }
  return lessons;
}

export const QUESTION_BANK: SeedQuestion[] = [
  // ---------------- Mathematics ----------------
  { id: "m1", subject: "Mathematics", topic: "Algebra", difficulty: "Easy", text: "If 2x + 3 = 11, what is the value of x?", options: [{ id: "A", text: "3" }, { id: "B", text: "4" }, { id: "C", text: "5" }, { id: "D", text: "7" }], correct: "B", explanation: "2x + 3 = 11 → 2x = 8 → x = 4. Isolate the variable with inverse operations." },
  { id: "m2", subject: "Mathematics", topic: "Algebra", difficulty: "Medium", text: "Simplify: (3x²)(4x³)", options: [{ id: "A", text: "7x⁵" }, { id: "B", text: "12x⁵" }, { id: "C", text: "12x⁶" }, { id: "D", text: "7x⁶" }], correct: "B", explanation: "Multiply coefficients (3×4=12) and add powers of x (2+3=5): 12x⁵." },
  { id: "m3", subject: "Mathematics", topic: "Geometry", difficulty: "Medium", text: "The area of a circle with radius 7 cm is (take π = 22/7):", options: [{ id: "A", text: "44 cm²" }, { id: "B", text: "154 cm²" }, { id: "C", text: "308 cm²" }, { id: "D", text: "22 cm²" }], correct: "B", explanation: "Area = πr² = (22/7) × 7 × 7 = 22 × 7 = 154 cm²." },
  { id: "m4", subject: "Mathematics", topic: "Statistics", difficulty: "Easy", text: "Find the mean of 4, 8, 6, 10, 12.", options: [{ id: "A", text: "7" }, { id: "B", text: "8" }, { id: "C", text: "9" }, { id: "D", text: "10" }], correct: "B", explanation: "Sum = 40, count = 5, mean = 40/5 = 8." },
  { id: "m5", subject: "Mathematics", topic: "Trigonometry", difficulty: "Hard", text: "If sin θ = 3/5 in a right-angled triangle, what is cos θ?", options: [{ id: "A", text: "4/5" }, { id: "B", text: "3/4" }, { id: "C", text: "5/4" }, { id: "D", text: "1/5" }], correct: "A", explanation: "By Pythagoras, adjacent = 4, so cos θ = adjacent/hypotenuse = 4/5." },
  { id: "m6", subject: "Mathematics", topic: "Algebra", difficulty: "Medium", text: "Factorise: x² − 9", options: [{ id: "A", text: "(x − 3)(x − 3)" }, { id: "B", text: "(x + 3)(x + 3)" }, { id: "C", text: "(x − 3)(x + 3)" }, { id: "D", text: "x(x − 9)" }], correct: "C", explanation: "Difference of two squares: x² − 9 = (x − 3)(x + 3)." },
  { id: "m7", subject: "Mathematics", topic: "Number Base", difficulty: "Medium", text: "Convert binary 1011 to base ten.", options: [{ id: "A", text: "9" }, { id: "B", text: "11" }, { id: "C", text: "13" }, { id: "D", text: "15" }], correct: "B", explanation: "1011₂ = 1×8 + 0×4 + 1×2 + 1×1 = 8+2+1 = 11." },
  { id: "m8", subject: "Mathematics", topic: "Probability", difficulty: "Easy", text: "A fair die is rolled. What is the probability of rolling an even number?", options: [{ id: "A", text: "1/6" }, { id: "B", text: "1/3" }, { id: "C", text: "1/2" }, { id: "D", text: "2/3" }], correct: "C", explanation: "Even numbers: {2,4,6} → 3 outcomes out of 6 = 1/2." },
  { id: "m9", subject: "Mathematics", topic: "Calculus", difficulty: "Hard", text: "Differentiate y = 3x² + 2x − 5 with respect to x.", options: [{ id: "A", text: "6x + 2" }, { id: "B", text: "3x + 2" }, { id: "C", text: "6x² + 2" }, { id: "D", text: "3x² + 2" }], correct: "A", explanation: "dy/dx = 3·2x + 2 = 6x + 2." },
  { id: "m10", subject: "Mathematics", topic: "Geometry", difficulty: "Medium", text: "The angles of a triangle add up to:", options: [{ id: "A", text: "90°" }, { id: "B", text: "180°" }, { id: "C", text: "270°" }, { id: "D", text: "360°" }], correct: "B", explanation: "The interior angles of any triangle sum to 180°." },

  // ---------------- Biology ----------------
  { id: "b1", subject: "Biology", topic: "Nutrition", difficulty: "Easy", text: "The process by which plants manufacture their own food using sunlight, water, and carbon dioxide is called:", options: [{ id: "A", text: "Respiration" }, { id: "B", text: "Photosynthesis" }, { id: "C", text: "Transpiration" }, { id: "D", text: "Osmosis" }], correct: "B", explanation: "Photosynthesis occurs in chloroplasts. Light energy converts CO₂ + H₂O → glucose + O₂." },
  { id: "b2", subject: "Biology", topic: "Cell Biology", difficulty: "Medium", text: "Which organelle is known as the 'powerhouse of the cell' and is responsible for ATP production?", options: [{ id: "A", text: "Chloroplast" }, { id: "B", text: "Nucleus" }, { id: "C", text: "Mitochondria" }, { id: "D", text: "Ribosome" }], correct: "C", explanation: "Mitochondria carry out cellular respiration, converting glucose and oxygen into ATP." },
  { id: "b3", subject: "Biology", topic: "Genetics", difficulty: "Medium", text: "The basic unit of heredity is the:", options: [{ id: "A", text: "Chromosome" }, { id: "B", text: "Gene" }, { id: "C", text: "Nucleus" }, { id: "D", text: "Ribosome" }], correct: "B", explanation: "A gene is a segment of DNA that codes for a heritable trait." },
  { id: "b4", subject: "Biology", topic: "Ecology", difficulty: "Easy", text: "Which of these is a producer in an ecosystem?", options: [{ id: "A", text: "Lion" }, { id: "B", text: "Grass" }, { id: "C", text: "Fungus" }, { id: "D", text: "Eagle" }], correct: "B", explanation: "Grass is a green plant that produces its own food via photosynthesis, forming the base of the food chain." },
  { id: "b5", subject: "Biology", topic: "Circulatory System", difficulty: "Medium", text: "The blood vessel that carries oxygenated blood from the lungs to the heart is the:", options: [{ id: "A", text: "Pulmonary artery" }, { id: "B", text: "Aorta" }, { id: "C", text: "Pulmonary vein" }, { id: "D", text: "Vena cava" }], correct: "C", explanation: "The pulmonary vein is the only vein that carries oxygenated blood (from lungs to left atrium)." },
  { id: "b6", subject: "Biology", topic: "Nutrition", difficulty: "Hard", text: "In photosynthesis, the light-independent reactions (Calvin cycle) occur in the:", options: [{ id: "A", text: "Thylakoid membrane" }, { id: "B", text: "Stroma" }, { id: "C", text: "Mitochondrial matrix" }, { id: "D", text: "Cytoplasm" }], correct: "B", explanation: "The Calvin cycle fixes CO₂ into glucose in the stroma of the chloroplast." },
  { id: "b7", subject: "Biology", topic: "Reproduction", difficulty: "Easy", text: "The fusion of male and female gametes is called:", options: [{ id: "A", text: "Fission" }, { id: "B", text: "Budding" }, { id: "C", text: "Fertilisation" }, { id: "D", text: "Cloning" }], correct: "C", explanation: "Fertilisation is the union of sperm and egg to form a zygote." },
  { id: "b8", subject: "Biology", topic: "Classification", difficulty: "Medium", text: "The binomial naming system uses which two taxonomic ranks?", options: [{ id: "A", text: "Kingdom and Phylum" }, { id: "B", text: "Genus and Species" }, { id: "C", text: "Order and Family" }, { id: "D", text: "Class and Order" }], correct: "B", explanation: "Binomial nomenclature names organisms by Genus + Species, e.g. Homo sapiens." },
  { id: "b9", subject: "Biology", topic: "Plant Transport", difficulty: "Medium", text: "Loss of water vapour from plant leaves is called:", options: [{ id: "A", text: "Transpiration" }, { id: "B", text: "Respiration" }, { id: "C", text: "Guttation" }, { id: "D", text: "Photosynthesis" }], correct: "A", explanation: "Transpiration is the loss of water vapour mainly through stomata in leaves." },
  { id: "b10", subject: "Biology", topic: "Cell Biology", difficulty: "Hard", text: "Which structure is present in plant cells but absent in animal cells?", options: [{ id: "A", text: "Mitochondria" }, { id: "B", text: "Cell membrane" }, { id: "C", text: "Cell wall" }, { id: "D", text: "Nucleus" }], correct: "C", explanation: "Plant cells have a rigid cellulose cell wall; animal cells do not." },

  // ---------------- Chemistry ----------------
  { id: "c1", subject: "Chemistry", topic: "Acids & Bases", difficulty: "Easy", text: "What is the chemical formula for sulfuric acid?", options: [{ id: "A", text: "HCl" }, { id: "B", text: "H₂SO₃" }, { id: "C", text: "H₂SO₄" }, { id: "D", text: "H₂S" }], correct: "C", explanation: "Sulfuric acid is H₂SO₄, a strong diprotic acid." },
  { id: "c2", subject: "Chemistry", topic: "Atomic Structure", difficulty: "Medium", text: "The atomic number of an element is equal to its number of:", options: [{ id: "A", text: "Neutrons" }, { id: "B", text: "Electrons + Neutrons" }, { id: "C", text: "Protons" }, { id: "D", text: "Neutrons + Protons" }], correct: "C", explanation: "Atomic number = number of protons in the nucleus." },
  { id: "c3", subject: "Chemistry", topic: "Periodic Table", difficulty: "Easy", text: "Which of these is a noble gas?", options: [{ id: "A", text: "Oxygen" }, { id: "B", text: "Neon" }, { id: "C", text: "Nitrogen" }, { id: "D", text: "Chlorine" }], correct: "B", explanation: "Neon (Ne) is a noble gas, inert with a full outer shell." },
  { id: "c4", subject: "Chemistry", topic: "Organic Chemistry", difficulty: "Medium", text: "The general formula of alkanes is:", options: [{ id: "A", text: "CₙH₂ₙ" }, { id: "B", text: "CₙH₂ₙ₊₂" }, { id: "C", text: "CₙH₂ₙ₋₂" }, { id: "D", text: "CₙH₂ₙ₊₁" }], correct: "B", explanation: "Alkanes are saturated hydrocarbons with formula CₙH₂ₙ₊₂ (e.g. methane CH₄)." },
  { id: "c5", subject: "Chemistry", topic: "Electrochemistry", difficulty: "Hard", text: "During electrolysis of brine (NaCl solution), the gas produced at the cathode is:", options: [{ id: "A", text: "Chlorine" }, { id: "B", text: "Oxygen" }, { id: "C", text: "Hydrogen" }, { id: "D", text: "Nitrogen" }], correct: "C", explanation: "At the cathode, H⁺ ions are reduced to hydrogen gas: 2H⁺ + 2e⁻ → H₂." },
  { id: "c6", subject: "Chemistry", topic: "Bonding", difficulty: "Medium", text: "A bond formed by the transfer of electrons is called:", options: [{ id: "A", text: "Covalent" }, { id: "B", text: "Ionic" }, { id: "C", text: "Metallic" }, { id: "D", text: "Hydrogen" }], correct: "B", explanation: "Ionic bonds form by transfer of electrons (e.g. Na → Na⁺, Cl → Cl⁻)." },
  { id: "c7", subject: "Chemistry", topic: "Stoichiometry", difficulty: "Medium", text: "What is the molar mass of H₂O? (H = 1, O = 16)", options: [{ id: "A", text: "16 g/mol" }, { id: "B", text: "17 g/mol" }, { id: "C", text: "18 g/mol" }, { id: "D", text: "20 g/mol" }], correct: "C", explanation: "H₂O = 2(1) + 16 = 18 g/mol." },
  { id: "c8", subject: "Chemistry", topic: "Acids & Bases", difficulty: "Easy", text: "A substance with pH 2 is:", options: [{ id: "A", text: "Strongly acidic" }, { id: "B", text: "Neutral" }, { id: "C", text: "Weakly basic" }, { id: "D", text: "Strongly basic" }], correct: "A", explanation: "pH < 7 is acidic; pH 2 is strongly acidic." },
  { id: "c9", subject: "Chemistry", topic: "Redox", difficulty: "Hard", text: "In the reaction Zn + Cu²⁺ → Zn²⁺ + Cu, which species is oxidised?", options: [{ id: "A", text: "Cu²⁺" }, { id: "B", text: "Zn" }, { id: "C", text: "Cu" }, { id: "D", text: "None" }], correct: "B", explanation: "Zn loses electrons (Zn → Zn²⁺ + 2e⁻), so it is oxidised." },
  { id: "c10", subject: "Chemistry", topic: "States of Matter", difficulty: "Easy", text: "Which process changes a liquid to a gas?", options: [{ id: "A", text: "Condensation" }, { id: "B", text: "Freezing" }, { id: "C", text: "Evaporation" }, { id: "D", text: "Sublimation" }], correct: "C", explanation: "Evaporation is liquid → gas at the surface below boiling point." },

  // ---------------- Physics ----------------
  { id: "p1", subject: "Physics", topic: "Motion", difficulty: "Easy", text: "A car travels 120 km in 2 hours. What is its average speed?", options: [{ id: "A", text: "40 km/h" }, { id: "B", text: "60 km/h" }, { id: "C", text: "80 km/h" }, { id: "D", text: "100 km/h" }], correct: "B", explanation: "Average speed = distance / time = 120 km / 2 h = 60 km/h." },
  { id: "p2", subject: "Physics", topic: "Electricity", difficulty: "Medium", text: "Ohm's law states that V = ?", options: [{ id: "A", text: "I × R" }, { id: "B", text: "I / R" }, { id: "C", text: "R / I" }, { id: "D", text: "I + R" }], correct: "A", explanation: "Ohm's law: V = IR (voltage = current × resistance)." },
  { id: "p3", subject: "Physics", topic: "Energy", difficulty: "Easy", text: "The SI unit of power is the:", options: [{ id: "A", text: "Joule" }, { id: "B", text: "Watt" }, { id: "C", text: "Newton" }, { id: "D", text: "Pascal" }], correct: "B", explanation: "Power = energy/time; its unit is the watt (W)." },
  { id: "p4", subject: "Physics", topic: "Waves", difficulty: "Medium", text: "The distance between two successive crests of a wave is its:", options: [{ id: "A", text: "Amplitude" }, { id: "B", text: "Frequency" }, { id: "C", text: "Wavelength" }, { id: "D", text: "Period" }], correct: "C", explanation: "Wavelength is the distance between adjacent crests (or troughs)." },
  { id: "p5", subject: "Physics", topic: "Mechanics", difficulty: "Hard", text: "A 2 kg object accelerates at 3 m/s². The force applied is:", options: [{ id: "A", text: "5 N" }, { id: "B", text: "6 N" }, { id: "C", text: "1.5 N" }, { id: "D", text: "9 N" }], correct: "B", explanation: "F = ma = 2 kg × 3 m/s² = 6 N." },
  { id: "p6", subject: "Physics", topic: "Heat", difficulty: "Medium", text: "The process by which heat travels through a metal rod is:", options: [{ id: "A", text: "Convection" }, { id: "B", text: "Radiation" }, { id: "C", text: "Conduction" }, { id: "D", text: "Evaporation" }], correct: "C", explanation: "Conduction transfers heat through direct contact in solids." },
  { id: "p7", subject: "Physics", topic: "Magnetism", difficulty: "Easy", text: "The lines of force around a magnet leave the:", options: [{ id: "A", text: "South pole" }, { id: "B", text: "North pole" }, { id: "C", text: "Center" }, { id: "D", text: "Equator" }], correct: "B", explanation: "Magnetic field lines emerge from the north pole and enter the south pole." },
  { id: "p8", subject: "Physics", topic: "Optics", difficulty: "Medium", text: "A concave mirror can produce a:", options: [{ id: "A", text: "Real, inverted image" }, { id: "B", text: "Only virtual image" }, { id: "C", text: "Only blurred image" }, { id: "D", text: "No image" }], correct: "A", explanation: "Depending on object position, a concave mirror forms real inverted images (and virtual when close)." },
  { id: "p9", subject: "Physics", topic: "Motion", difficulty: "Medium", text: "Acceleration is defined as the rate of change of:", options: [{ id: "A", text: "Distance" }, { id: "B", text: "Velocity" }, { id: "C", text: "Force" }, { id: "D", text: "Mass" }], correct: "B", explanation: "Acceleration = change in velocity / time." },
  { id: "p10", subject: "Physics", topic: "Electricity", difficulty: "Hard", text: "Two resistors of 4 Ω and 6 Ω are connected in parallel. Total resistance is:", options: [{ id: "A", text: "10 Ω" }, { id: "B", text: "2.4 Ω" }, { id: "C", text: "5 Ω" }, { id: "D", text: "24 Ω" }], correct: "B", explanation: "1/R = 1/4 + 1/6 = 5/12 → R = 12/5 = 2.4 Ω." },

  // ---------------- English ----------------
  { id: "e1", subject: "English", topic: "Grammar", difficulty: "Easy", text: "Choose the correct word: 'Neither of the boys ___ present.'", options: [{ id: "A", text: "were" }, { id: "B", text: "was" }, { id: "C", text: "are" }, { id: "D", text: "have" }], correct: "B", explanation: "'Neither' is singular, so 'was' is correct." },
  { id: "e2", subject: "English", topic: "Vocabulary", difficulty: "Easy", text: "The word 'benevolent' means:", options: [{ id: "A", text: "Cruel" }, { id: "B", text: "Kind and generous" }, { id: "C", text: "Lazy" }, { id: "D", text: "Wealthy" }], correct: "B", explanation: "Benevolent describes someone well-meaning and kindly." },
  { id: "e3", subject: "English", topic: "Comprehension", difficulty: "Medium", text: "Which of these is a synonym of 'abundant'?", options: [{ id: "A", text: "Scarce" }, { id: "B", text: "Plentiful" }, { id: "C", text: "Tiny" }, { id: "D", text: "Rare" }], correct: "B", explanation: "Abundant means existing in large quantities; plentiful is a synonym." },
  { id: "e4", subject: "English", topic: "Grammar", difficulty: "Medium", text: "Identify the part of speech of the underlined word: 'She sang BEAUTIFULLY.'", options: [{ id: "A", text: "Noun" }, { id: "B", text: "Adjective" }, { id: "C", text: "Adverb" }, { id: "D", text: "Verb" }], correct: "C", explanation: "'Beautifully' modifies the verb 'sang' → adverb." },
  { id: "e5", subject: "English", topic: "Idioms", difficulty: "Medium", text: "The idiom 'to bite the bullet' means to:", options: [{ id: "A", text: "Eat quickly" }, { id: "B", text: "Face a painful situation bravely" }, { id: "C", text: "Cheat someone" }, { id: "D", text: "Speak rudely" }], correct: "B", explanation: "To 'bite the bullet' is to endure a difficult or unpleasant task with courage." },
  { id: "e6", subject: "English", topic: "Grammar", difficulty: "Hard", text: "Which sentence is grammatically correct?", options: [{ id: "A", text: "He don't like rice." }, { id: "B", text: "He doesn't likes rice." }, { id: "C", text: "He doesn't like rice." }, { id: "D", text: "He don't likes rice." }], correct: "C", explanation: "Third-person singular negative: 'doesn't' + base verb 'like'." },
  { id: "e7", subject: "English", topic: "Vocabulary", difficulty: "Easy", text: "An 'epitome' is best described as:", options: [{ id: "A", text: "A summary or perfect example" }, { id: "B", text: "A mistake" }, { id: "C", text: "A long speech" }, { id: "D", text: "A type of animal" }], correct: "A", explanation: "Epitome means a person or thing that is a perfect example or embodying a quality." },
  { id: "e8", subject: "English", topic: "Letter Writing", difficulty: "Medium", text: "A formal letter to an unknown recipient should begin with:", options: [{ id: "A", text: "Dear Friend," }, { id: "B", text: "My dear," }, { id: "C", text: "Dear Sir/Madam," }, { id: "D", text: "Hey," }], correct: "C", explanation: "When the recipient is unknown, use 'Dear Sir/Madam,' in formal letters." },

  // ---------------- Literature ----------------
  { id: "l1", subject: "Literature", topic: "Poetry", difficulty: "Easy", text: "A poem of fourteen lines written in iambic pentameter is called a:", options: [{ id: "A", text: "Sonnet" }, { id: "B", text: "Ballad" }, { id: "C", text: "Epic" }, { id: "D", text: "Ode" }], correct: "A", explanation: "A sonnet has 14 lines, traditionally in iambic pentameter." },
  { id: "l2", subject: "Literature", topic: "Drama", difficulty: "Medium", text: "In a play, the written instructions about setting and action are called:", options: [{ id: "A", text: "Dialogue" }, { id: "B", text: "Stage directions" }, { id: "C", text: "Monologue" }, { id: "D", text: "Prologue" }], correct: "B", explanation: "Stage directions guide actors and are usually in italics/parentheses." },
  { id: "l3", subject: "Literature", topic: "Prose", difficulty: "Easy", text: "A long work of fiction is generally called a:", options: [{ id: "A", text: "Novella only" }, { id: "B", text: "Novel" }, { id: "C", text: "Poem" }, { id: "D", text: "Article" }], correct: "B", explanation: "A novel is a long narrative work of fiction." },
  { id: "l4", subject: "Literature", topic: "Poetry", difficulty: "Medium", text: "The repetition of initial consonant sounds is called:", options: [{ id: "A", text: "Assonance" }, { id: "B", text: "Alliteration" }, { id: "C", text: "Metaphor" }, { id: "D", text: "Simile" }], correct: "B", explanation: "Alliteration is the repetition of beginning consonant sounds (e.g. 'she sells sea shells')." },
  { id: "l5", subject: "Literature", topic: "Figures of Speech", difficulty: "Medium", text: "'He is as brave as a lion' is an example of a:", options: [{ id: "A", text: "Metaphor" }, { id: "B", text: "Simile" }, { id: "C", text: "Personification" }, { id: "D", text: "Hyperbole" }], correct: "B", explanation: "A simile compares using 'as' or 'like'." },
];

export const SUBJECTS: string[] = Array.from(new Set(QUESTION_BANK.map((q) => q.subject)));

export function getQuestionsForSubject(subject: string): SeedQuestion[] {
  return QUESTION_BANK.filter((q) => q.subject === subject);
}

const RAW_COURSES = [
  { id: 1, title: "WAEC Mathematics Complete", category: "WAEC", lessons: 48, enrolled: 12400, rating: 4.9, badge: "Bestseller", color: "#0c6438", instructor: "Dr. Akin Okafor", price: "Free" },
  { id: 2, title: "JAMB Biology Masterclass", category: "JAMB", lessons: 36, enrolled: 8900, rating: 4.8, badge: "Top Rated", color: "#7c3aed", instructor: "Prof. Ngozi Eze", price: "₦2,500/mo" },
  { id: 3, title: "English Language & Lit", category: "WAEC", lessons: 40, enrolled: 10200, rating: 4.7, badge: null, color: "#2563eb", instructor: "Mrs. Adaku Bello", price: "Free" },
  { id: 4, title: "NECO Chemistry Deep Dive", category: "NECO", lessons: 32, enrolled: 5600, rating: 4.6, badge: null, color: "#e84545", instructor: "Mr. Seun Adeyemi", price: "₦1,500/mo" },
  { id: 5, title: "Physics: From Basics to JAMB", category: "JAMB", lessons: 44, enrolled: 7300, rating: 4.8, badge: "New", color: "#f5a623", instructor: "Mr. Ibrahim Musa", price: "₦2,000/mo" },
  { id: 6, title: "Post-UTME Crash Course", category: "Post-UTME", lessons: 20, enrolled: 15000, rating: 4.9, badge: "Bestseller", color: "#0891b2", instructor: "Team EduMaster", price: "₦3,000" },
  { id: 7, title: "Common Entrance Prep", category: "Primary", lessons: 28, enrolled: 4200, rating: 4.5, badge: null, color: "#16a34a", instructor: "Mrs. Patience Obi", price: "Free" },
  { id: 8, title: "SAT & Scholarship Prep", category: "International", lessons: 52, enrolled: 3100, rating: 4.7, badge: "New", color: "#db2777", instructor: "Dr. Chuka Nweze", price: "₦5,000/mo" },
  { id: 9, title: "WAEC Chemistry Mastery", category: "WAEC", lessons: 38, enrolled: 6800, rating: 4.6, badge: null, color: "#d97706", instructor: "Dr. Kunle Bello", price: "Free" },
  { id: 10, title: "JAMB Mathematics 2025", category: "JAMB", lessons: 50, enrolled: 9400, rating: 4.9, badge: "Bestseller", color: "#0c6438", instructor: "Prof. Emeka Osei", price: "₦2,500/mo" },
  { id: 11, title: "NECO Biology Essentials", category: "NECO", lessons: 30, enrolled: 4100, rating: 4.5, badge: null, color: "#7c3aed", instructor: "Mrs. Amara Nwosu", price: "₦1,000/mo" },
  { id: 12, title: "IELTS Preparation Course", category: "International", lessons: 45, enrolled: 2800, rating: 4.8, badge: "Top Rated", color: "#2563eb", instructor: "Mr. Dave Eze", price: "₦6,000/mo" },
];

export const COURSES: SeedCourse[] = RAW_COURSES.map((c) => {
  const subject = subjectForCourse(c.title);
  return {
    ...c,
    subject,
    description: DESCRIPTIONS[c.category] || "Expert-led lessons with practice questions and AI feedback.",
    lessonList: buildLessons(subject, c.lessons, QUESTION_BANK),
  };
});

export const LEADERBOARD_SEED: SeedLeaderboard[] = [
  { name: "Chisom Adeyemi", xp: 12840, school: "FGGC Bwari", state: "FCT", avatar: "CA", streak: 32 },
  { name: "Emeka Osei", xp: 11720, school: "King's College Lagos", state: "Lagos", avatar: "EO", streak: 28 },
  { name: "Fatimah Bello", xp: 10950, school: "GGSS Kano", state: "Kano", avatar: "FB", streak: 21 },
  { name: "Tunde Adesanya", xp: 10400, school: "CHS Ibadan", state: "Oyo", avatar: "TA", streak: 19 },
  { name: "Demo Student", xp: 9880, school: "Queens College Lagos", state: "Lagos", avatar: "DS", streak: 14 },
  { name: "Amara Nwosu", xp: 9650, school: "FGC Enugu", state: "Enugu", avatar: "AN", streak: 11 },
  { name: "Suleiman Garba", xp: 9340, school: "Govt Sec Sch Kaduna", state: "Kaduna", avatar: "SG", streak: 9 },
  { name: "Taiwo Adewale", xp: 9120, school: "CMS Grammar Bariga", state: "Lagos", avatar: "TW", streak: 15 },
];

export const PLANS = [
  { id: "free", name: "Free", price: 0, interval: "forever", badge: "Get Started", features: ["Access to 5,000+ past questions", "3 free courses", "Basic AI tutor (10 asks/day)", "Community leaderboard", "Mobile app access"], highlighted: false },
  { id: "pro", name: "Pro", price: 2500, interval: "month", badge: "Most Popular", features: ["Unlimited CBT practice", "All courses unlocked", "Unlimited AI tutor", "Personalised study plan", "Performance analytics", "Downloadable notes", "Weekly progress report"], highlighted: true },
  { id: "premium", name: "Premium", price: 6000, interval: "month", badge: "Best Value", features: ["Everything in Pro", "Live classes with top tutors", "1-on-1 AI study coach", "Mock exam grading & feedback", "Scholarship alerts", "Certificate of completion", "Priority support"], highlighted: false },
];
