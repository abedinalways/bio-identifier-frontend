import type { ISnake, IPest, IEmergencyHospital } from '../interfaces';

export const MOCK_SNAKES: ISnake[] = [
  {
    id: 'russells-viper',
    scientificName: 'Daboia russelii',
    family: 'Viperidae',
    commonName: {
      en: "Russell's Viper",
      bn: 'চন্দ্রবোড়া / রাসেলস ভাইপার',
      hi: 'दबोइया / रसेल वाइपर',
      ur: 'ڈبوئیا وائپر',
      zh: '圆斑蝰',
      th: 'งูแมวเซา',
    },
    venomProfile: {
      isVenomous: true,
      dangerLevel: 'deadly',
      venomCategory: 'hemotoxic',
      antivenomRequired: true,
      antivenomType: 'Polyvalent Anti-Snake Venom (ASV) Serum',
      commercialBrands: [
        'Incepta Antivenom (Bangladesh)',
        'Bharat Serums Polyvalent ASV (India)',
        'Haffkine Institute ASV',
        'VINS Bio-Products ASV',
      ],
      targetToxins: [
        'Procoagulants',
        'Phospholipase A2',
        'Hemorrhagins (causes acute renal failure and internal bleeding)',
      ],
      lethalityRisk:
        'Extremely Critical - Leading cause of snakebite fatalities and kidney necrosis across South Asia',
    },
    habitat:
      'Agricultural open fields, paddy fields, tall grasses, rodent burrows near rural settlements.',
    distribution: [
      'Bangladesh (Rajshahi, Khulna, Faridpur, Manikganj)',
      'India (Widespread)',
      'Pakistan (Punjab, Sindh)',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80',
    firstAidSteps: [
      'Immobilize the bitten limb immediately with a splint. Avoid movement.',
      'Do NOT tie tight tourniquets; this accelerates local tissue necrosis.',
      'Rush immediately to an Upazila Health Complex or District Hospital with ASV facilities.',
      'Monitor urine output and coagulation profile (20WBCT).',
    ],
    mythsDebunked: [
      "Myth: Russell's Viper chases humans. Fact: They hiss loudly as a defensive warning when cornered; they do not pursue victims.",
      'Myth: Cutting the wound bleeds the poison out. Fact: Cutting causes uncontrollable hemorrhage due to defibrinogenation.',
    ],
    ecologicalImportance:
      'Controls agricultural rodent populations that destroy food grains.',
  },
  {
    id: 'spectacled-cobra',
    scientificName: 'Naja naja',
    family: 'Elapidae',
    commonName: {
      en: 'Spectacled Cobra / Indian Cobra',
      bn: 'খৈয়া গোখরা / পদ্ম গোখরা',
      hi: 'नाग / भारतीय कोबरा',
      ur: 'کوبرا سانپ',
      zh: '印度眼镜蛇',
      th: 'งูเห่าอินเดีย',
    },
    venomProfile: {
      isVenomous: true,
      dangerLevel: 'deadly',
      venomCategory: 'neurotoxic',
      antivenomRequired: true,
      antivenomType: 'Polyvalent Anti-Snake Venom (ASV) Serum',
      commercialBrands: [
        'Incepta Antivenom',
        'Serum Institute of India ASV',
        'Bharat Serums ASV',
      ],
      targetToxins: [
        'Post-synaptic neurotoxins',
        'Cardiotoxins (causes respiratory arrest and neuromuscular paralysis)',
      ],
      lethalityRisk:
        'Critical - Can induce complete respiratory failure within 30 to 120 minutes without antivenom.',
    },
    habitat:
      'Agricultural fields, grain storage bins, old brick piles, abandoned termite mounds.',
    distribution: [
      'Bangladesh (All divisions)',
      'India (All states)',
      'Pakistan',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1549488344-cbb6c34cf08b?auto=format&fit=crop&w=800&q=80',
    firstAidSteps: [
      'Keep patient resting flat, calm and still.',
      'Immobilize limb with broad bandage and rigid splint.',
      'Prepare for emergency airway and artificial ventilation support upon arrival at hospital.',
    ],
    mythsDebunked: [
      'Myth: Cobras drink milk. Fact: Snakes are strict carnivores; milk can cause fatal digestive tract infections.',
      'Myth: Cobras remember who hurt them and take revenge. Fact: Snakes have no emotional grudge mechanisms.',
    ],
    ecologicalImportance:
      'Apex reptile predator keeping rat and rodent pests in check.',
  },
  {
    id: 'common-krait',
    scientificName: 'Bungarus caeruleus',
    family: 'Elapidae',
    commonName: {
      en: 'Common Krait',
      bn: 'কালাচ / শঙ্খিনী / ডোমনা চিতি',
      hi: 'करैत / कॉमन करैत',
      ur: 'عام کریت',
      zh: '印度金环蛇 / 印度银环蛇',
      th: 'งูสามเหลี่ยมอินเดีย',
    },
    venomProfile: {
      isVenomous: true,
      dangerLevel: 'deadly',
      venomCategory: 'neurotoxic',
      antivenomRequired: true,
      antivenomType: 'Polyvalent Anti-Snake Venom (ASV) Serum',
      commercialBrands: [
        'Incepta Antivenom',
        'Bharat Serums ASV',
        'VINS Bio-Products',
      ],
      targetToxins: [
        'Pre-synaptic neurotoxins (Beta-bungarotoxin)',
        'Causes irreversible motor end-plate blockade',
      ],
      lethalityRisk:
        'Extremely Lethal - Bite is painless with almost no swelling, often occurring while victims sleep on ground mats.',
    },
    habitat:
      'Rural huts, thatched roof huts, mud houses, rat holes near kitchens and beds.',
    distribution: ['Bangladesh', 'India', 'Pakistan', 'Nepal'],
    imageUrl:
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    firstAidSteps: [
      'If waking up with abdominal pain, heaviness of eyelids (ptosis), or voice change in a rural room, suspect krait bite immediately!',
      'Rush straight to a tertiary hospital with ventilator/ICU facilities.',
      'Immobilize limb and keep airway clear.',
    ],
    mythsDebunked: [
      'Myth: Kraits smell sweet. Fact: Kraits have no distinctive fragrance.',
      'Myth: Kraits lick off human breath. Fact: Complete myth; they hunt geckos and small snakes.',
    ],
    ecologicalImportance:
      'Ophiophagous (eats other snakes, maintaining balanced reptile populations).',
  },
  {
    id: 'oriental-rat-snake',
    scientificName: 'Ptyas mucosa',
    family: 'Colubridae',
    commonName: {
      en: 'Oriental Rat Snake / Dhaman',
      bn: 'দাঁড়াশ সাপ / ধামান',
      hi: 'धामन / चूहा साँप',
      ur: 'دھامن سانپ',
      zh: '滑鼠蛇',
      th: 'งูสิงดง',
    },
    venomProfile: {
      isVenomous: false,
      dangerLevel: 'harmless',
      venomCategory: 'non_venomous',
      antivenomRequired: false,
      antivenomType: 'None (Safe)',
      commercialBrands: [],
      targetToxins: [],
      lethalityRisk:
        'Completely Non-Venomous - Poses zero toxic danger to humans.',
    },
    habitat: 'Forests, wetlands, farmland, gardens, roofs hunting rats.',
    distribution: [
      'Widespread throughout all South and Southeast Asian countries.',
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
    firstAidSteps: [
      'Clean superficial bite punctures with antiseptic soap and water.',
      'Administer standard Tetanus Toxoid injection if due.',
      'Reassure victim that NO antivenom is required.',
    ],
    mythsDebunked: [
      'Myth: Rat snakes whip humans with their tails. Fact: They have no whipping mechanism; their tail is used for climbing and balance.',
      'Myth: Rat snakes mate with cobras. Fact: Scientifically impossible; they belong to completely distinct families.',
    ],
    ecologicalImportance:
      "THE FARMER'S BEST FRIEND. A single adult rat snake consumes over 20-30 destructive field rats every month!",
  },
  {
    id: 'checkered-keelback',
    scientificName: 'Fowlea piscator',
    family: 'Colubridae',
    commonName: {
      en: 'Checkered Keelback',
      bn: 'ঢোড়া সাপ / জল ঢোড়া',
      hi: 'पानी का साँप / ढोरिया',
      ur: 'پانی کا سانپ',
      zh: '草腹链蛇',
      th: 'งูลายสอ',
    },
    venomProfile: {
      isVenomous: false,
      dangerLevel: 'harmless',
      venomCategory: 'non_venomous',
      antivenomRequired: false,
      antivenomType: 'None (Safe)',
      commercialBrands: [],
      targetToxins: [],
      lethalityRisk:
        'Non-Venomous - Highly aggressive flattener when cornered, but completely non-toxic.',
    },
    habitat: 'Ponds, lakes, flooded paddy fields, canals, riverbanks.',
    distribution: ['Bangladesh', 'India', 'Pakistan', 'Sri Lanka', 'Thailand'],
    imageUrl:
      'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=800&q=80',
    firstAidSteps: [
      'Wash bite marks with normal saline or soap water.',
      'No antivenom or hospital admission necessary.',
    ],
    mythsDebunked: [
      'Myth: Water snakes have venom on their tails. Fact: Zero venom glands exist in this species.',
    ],
    ecologicalImportance:
      'Controls invasive small fish, tadpole, and aquatic insect populations in agricultural waterways.',
  },
  {
    id: 'monocled-cobra',
    scientificName: 'Naja kaouthia',
    family: 'Elapidae',
    commonName: {
      en: 'Monocled Cobra',
      bn: 'পদ্ম গোখরা / কেউটে',
      hi: 'मोनोकल्ड कोबरा',
      ur: 'مونوکلڈ کوبرا',
      zh: '孟加拉眼镜蛇',
      th: 'งูเห่าหม้อ',
    },
    venomProfile: {
      isVenomous: true,
      dangerLevel: 'deadly',
      venomCategory: 'neurotoxic',
      antivenomRequired: true,
      antivenomType: 'Polyvalent Anti-Snake Venom (ASV) Serum',
      commercialBrands: [
        'Incepta Antivenom',
        'Bharat Serums ASV',
        'Serum Institute of India ASV',
      ],
      targetToxins: [
        'Post-synaptic Alpha-neurotoxins',
        'Cardiotoxins and Necrotoxins',
      ],
      lethalityRisk:
        'Extremely Critical - Rapid neurological deterioration and respiratory paralysis within 60 minutes.',
    },
    habitat: 'Paddy fields, wetlands, swamps, bamboo groves, village outskirts.',
    distribution: ['Bangladesh (Everywhere)', 'India (Eastern States)', 'Nepal', 'Thailand'],
    imageUrl:
      'https://images.unsplash.com/photo-1531386151447-fd76ad50012f?auto=format&fit=crop&w=800&q=80',
    firstAidSteps: [
      'Keep patient resting completely still and reassure them.',
      'Splint the bitten limb with a rigid bamboo or wooden support.',
      'Rush immediately to an Upazila or District Hospital with ASV and oxygen.',
    ],
    mythsDebunked: [
      'Myth: Keute/Cobra can spray venom into eyes. Fact: Monocled cobra bites inject venom; spitting cobras are rare in this region.',
    ],
    ecologicalImportance:
      'Crucial predator controlling destructive rodent populations near human settlements.',
  },
  {
    id: 'banded-krait',
    scientificName: 'Bungarus fasciatus',
    family: 'Elapidae',
    commonName: {
      en: 'Banded Krait',
      bn: 'ডোরা শঙ্খিনী / শাঁখামুটি',
      hi: 'धारीदार करैत / अहिराज',
      ur: 'بینڈڈ کریت',
      zh: '金环蛇',
      th: 'งูสามเหลี่ยม',
    },
    venomProfile: {
      isVenomous: true,
      dangerLevel: 'deadly',
      venomCategory: 'neurotoxic',
      antivenomRequired: true,
      antivenomType: 'Polyvalent Anti-Snake Venom (ASV) Serum',
      commercialBrands: ['Incepta Antivenom', 'Bharat Serums ASV'],
      targetToxins: [
        'Pre-synaptic and Post-synaptic Neurotoxins',
        'Acetylcholinesterase inhibitors',
      ],
      lethalityRisk:
        'Extremely Dangerous - Neurotoxic paralysis, though less aggressive by day than common krait.',
    },
    habitat: 'Agricultural terrain, open countryside, village drains, termite hills.',
    distribution: ['Bangladesh', 'India', 'Bhutan', 'Myanmar', 'Thailand'],
    imageUrl:
      'https://images.unsplash.com/photo-1583852085732-b0a68894df55?auto=format&fit=crop&w=800&q=80',
    firstAidSteps: [
      'Immobilize the bitten limb; do not move.',
      'Do NOT cut or suck the bite site.',
      'Transfer immediately to hospital equipped with Polyvalent ASV.',
    ],
    mythsDebunked: [
      'Myth: Yellow and black bands mean non-venomous. Fact: Highly venomous elapid requiring immediate emergency treatment.',
    ],
    ecologicalImportance:
      'Ophiophagous - naturally hunts other venomous snakes like cobras and kraits.',
  },
  {
    id: 'common-wolf-snake',
    scientificName: 'Lycodon aulicus',
    family: 'Colubridae',
    commonName: {
      en: 'Common Wolf Snake',
      bn: 'ঘরগিন্নি সাপ / উদয়কাল',
      hi: 'भेड़िया साँप',
      ur: 'بھیڑیا سانپ',
      zh: '白环蛇',
      th: 'งูสร้อยศร',
    },
    venomProfile: {
      isVenomous: false,
      dangerLevel: 'harmless',
      venomCategory: 'non_venomous',
      antivenomRequired: false,
      antivenomType: 'None (Safe)',
      commercialBrands: [],
      targetToxins: [],
      lethalityRisk:
        'Completely Harmless - Often mistakenly killed because its crossbands mimic the deadly Common Krait.',
    },
    habitat: 'Human residences, kitchen walls, brick crevices, roofs hunting geckos.',
    distribution: ['Bangladesh', 'India', 'Pakistan', 'Nepal', 'Sri Lanka'],
    imageUrl:
      'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=800&q=80',
    firstAidSteps: [
      'Wash bite site with soap and water.',
      'Apply antiseptic lotion; no antivenom or hospital stay needed.',
    ],
    mythsDebunked: [
      'Myth: It is a young krait. Fact: It is an adult harmless wolf snake with distinct white bands and no vertebral ridge.',
    ],
    ecologicalImportance:
      'Controls household lizards, mice, and indoor pests inside villages.',
  },
  {
    id: 'green-vine-snake',
    scientificName: 'Ahaetulla nasuta',
    family: 'Colubridae',
    commonName: {
      en: 'Asian Green Vine Snake',
      bn: 'লাউডগা সাপ / সুতানলি',
      hi: 'हरा बेल साँप',
      ur: 'سبز بیل سانپ',
      zh: '绿瘦蛇',
      th: 'งูเขียวหัวจิ้งจก',
    },
    venomProfile: {
      isVenomous: true,
      dangerLevel: 'mild',
      venomCategory: 'cytotoxic',
      antivenomRequired: false,
      antivenomType: 'None (Mild / Non-lethal to humans)',
      commercialBrands: [],
      targetToxins: ['Mild rear-fanged salivary secretions'],
      lethalityRisk:
        'Mild - Causes minor local swelling or numbness for a few hours. Poses zero lethal threat to humans.',
    },
    habitat: 'Trees, shrubs, banana gardens, betel nut plantations, dense foliage.',
    distribution: ['Bangladesh', 'India', 'Sri Lanka', 'Southeast Asia'],
    imageUrl:
      'https://images.unsplash.com/photo-1508817628294-5a453fa0b8fb?auto=format&fit=crop&w=800&q=80',
    firstAidSteps: [
      'Wash wound thoroughly with clean water and mild soap.',
      'Reassure victim that it is NOT a deadly viper; antivenom is NOT needed.',
      'Apply cold compress if local swelling occurs.',
    ],
    mythsDebunked: [
      'Myth: Green vine snakes peck at human eyes. Fact: Completely false superstition; they only open their mouth in defensive posture.',
    ],
    ecologicalImportance:
      'Keeps orchard insects, tree frogs, and garden lizards in ecological balance.',
  },
];

export const MOCK_PESTS: IPest[] = [
  {
    id: 'mango-hopper',
    scientificName: 'Idioscopus clypealis',
    commonName: {
      en: 'Mango Leaf Hopper',
      bn: 'আমের হপার পোকা',
      hi: 'आम का फुदका कीट',
      ur: 'آم کا ہاپر',
      zh: '芒果扁喙叶蝉',
      th: 'เพลี้ยจั๊กจั่นมะม่วง',
    },
    damageProfile: {
      affectedCrops: ['mango'],
      severity: 'critical',
      symptoms: [
        'Nymphs and adults suck sap from tender leaves, inflorescences, and fruit stalks.',
        'Secretes sticky honeydew attracting sooty mould fungus (Capnodium mangiferae), turning leaves pitch black.',
        'Severe premature flower drop and withered young mangoes.',
      ],
      damageMechanism:
        'Sap depletion during flowering season prevents fruit set, causing up to 60-80% yield loss.',
      yieldLossPotential:
        '50% - 80% loss in untreated orchards during flowering (January-March)',
    },
    treatments: [
      {
        id: 'mh-bio',
        type: 'organic',
        title: 'Neem Seed Kernel Extract (NSKE) 5% / Bio-Soap',
        activeIngredient: 'Azadirachtin (Neem alkaloid)',
        dosagePerLiter: 4, // 4 ml per 1 liter
        dosageUnit: 'ml',
        commercialExamples: ['EcoNeem 1500ppm', 'Bioneem', 'Nimbecidine'],
        optimalTiming:
          'Spray at initial panicle emergence before flowers fully open.',
        preHarvestIntervalDays: 3,
        safetyInstructions:
          'Safe for honeybees when sprayed after sunset. Natural biodegradable deterrent.',
      },
      {
        id: 'mh-chem',
        type: 'chemical',
        title: 'Imidacloprid 17.8% SL',
        activeIngredient: 'Imidacloprid (Systemic Neonicotinoid)',
        dosagePerLiter: 0.35, // 0.35 ml per 1 liter of water
        dosageUnit: 'ml',
        commercialExamples: ['Confidor 200SL', 'Admire', 'Imitaf', 'Tiddo'],
        optimalTiming:
          'Single spray at bud burst stage. Do NOT spray during full bloom to safeguard pollinators.',
        preHarvestIntervalDays: 21,
        safetyInstructions:
          'Toxic to bees. Wear full protective gloves, mask, and spray in early morning calm wind.',
      },
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1521747116042-5a810fda9664?auto=format&fit=crop&w=800&q=80',
    category: 'crop_pest',
  },
  {
    id: 'litchi-fruit-borer',
    scientificName: 'Conopomorpha sinensis',
    category: 'crop_pest',
    commonName: {
      en: 'Litchi Fruit Borer',
      bn: 'লিচুর ফল ছিদ্রকারী পোকা',
      hi: 'लीची फल बेधक कीट',
      ur: 'لیچی فروٹ بورر',
      zh: '荔枝蒂蛀虫',
      th: 'หนอนเจาะขั้วผลลิ้นจี่',
    },
    damageProfile: {
      affectedCrops: ['litchi'],
      severity: 'critical',
      symptoms: [
        'Larva bores into the stalk end of developing litchi fruits.',
        'Dark frass (insect excreta) visible at the fruit pedicel upon peeling.',
        'Premature fruit drop and unmarketable decayed pulp.',
      ],
      damageMechanism:
        'Tunneling near seed stalk destroys nutrient supply to aril and exposes pulp to fungal decay.',
      yieldLossPotential: '30% - 60% post-harvest market rejection',
    },
    treatments: [
      {
        id: 'lfb-bio',
        type: 'organic',
        title: 'Pheromone Trap + Trichogramma Wasp Release',
        activeIngredient: 'Beneficial Parasitoid Trichogramma chilonis',
        dosagePerLiter: 5,
        dosageUnit: 'ml',
        commercialExamples: [
          'Delta Pheromone Lures',
          'Trichocards (50,000 eggs/acre)',
        ],
        optimalTiming: 'Hang pheromone traps 30 days before fruit coloring.',
        preHarvestIntervalDays: 0,
        safetyInstructions: '100% biological control. Zero chemical residues.',
      },
      {
        id: 'lfb-chem',
        type: 'chemical',
        title: 'Cypermethrin 10% EC / Chlorantraniliprole 18.5% SC',
        activeIngredient: 'Chlorantraniliprole (Anthranilic diamide)',
        dosagePerLiter: 0.4, // 0.4 ml per 1 liter
        dosageUnit: 'ml',
        commercialExamples: ['Coragen 18.5 SC', 'Ripcord', 'Cymbush'],
        optimalTiming:
          'Apply when fruits reach pea size, repeated 15 days later.',
        preHarvestIntervalDays: 14,
        safetyInstructions:
          'Must stop spraying at least 14 days before harvest. Wear respirator.',
      },
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'rice-stem-borer',
    scientificName: 'Scirpophaga incertulas',
    commonName: {
      en: 'Yellow Stem Borer of Paddy',
      bn: 'ধানের হলুদ মাজরা পোকা',
      hi: 'धान का पीला तना छेदक',
      ur: 'دھان کا تنہ بورر',
      zh: '水稻三化螟',
      th: 'หนอนกอข้าวสีครีม',
    },
    damageProfile: {
      affectedCrops: ['rice'],
      severity: 'critical',
      symptoms: [
        '"Deadheart" in tillering stage (central shoot dries and dies).',
        '"Whitehead" in panicle stage (panicles emerge completely white and empty of grains).',
        'Caterpillar tunnels inside the hollow stem of the rice plant.',
      ],
      damageMechanism:
        'Destruction of internal vascular tissues prevents grain filling.',
      yieldLossPotential: '20% - 40% reduction in milled rice yield',
    },
    treatments: [
      {
        id: 'rsb-bio',
        type: 'organic',
        title: 'Perching + Light Traps',
        activeIngredient: 'Physical biological perches for insectivorous birds',
        dosagePerLiter: 0,
        dosageUnit: 'g',
        commercialExamples: [
          'Bamboo perches (30 per acre)',
          'Solar Light Traps',
        ],
        optimalTiming:
          'Install perches immediately after seedling transplanting.',
        preHarvestIntervalDays: 0,
        safetyInstructions:
          'Eco-friendly, attracts drongos and swallows that feast on adult moths.',
      },
      {
        id: 'rsb-chem',
        type: 'chemical',
        title: 'Cartap Hydrochloride 50% SP / Fipronil 5% SC',
        activeIngredient: 'Cartap Hydrochloride (Nereistoxin analogue)',
        dosagePerLiter: 1.5, // 1.5 g per liter
        dosageUnit: 'g',
        commercialExamples: ['Padan 50SP', 'Sunvep', 'Regent 5SC'],
        optimalTiming:
          'Apply when egg masses exceed 1 per square meter or 5% deadhearts noticed.',
        preHarvestIntervalDays: 21,
        safetyInstructions:
          'Ensure water level in paddy field is 2-3 inches. Do not release drainage into fish ponds.',
      },
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    category: 'crop_pest',
  },
  {
    id: 'asian-giant-hornet',
    scientificName: 'Vespa mandarinia / Vespa orientalis',
    commonName: {
      en: 'Asian Giant Hornet / Yellow Wasp',
      bn: 'ভীমরুল / বোলতা / বল্লা',
      hi: 'एशियाई विशालकाय हॉर्नेट / ततैया',
      ur: 'ایشیائی بڑی بھڑ',
      zh: '金环胡蜂 / 大虎头蜂',
      th: 'ต่อยักษ์เอเชีย',
    },
    category: 'stinging_insect',
    damageProfile: {
      affectedCrops: ['mango', 'litchi'],
      severity: 'critical',
      symptoms: [
        'Potent venom injected through smooth stinger that can sting repeatedly.',
        'Intense searing pain, massive localized swelling, and tissue necrosis.',
        'High risk of severe anaphylactic shock and renal failure in multiple stings.',
      ],
      damageMechanism:
        'Venom contains mastoparan peptide and phospholipase triggering histamine storm and cytolysis.',
      yieldLossPotential:
        'Also decimates honeybee hives and damages ripe fruit crops before harvest.',
    },
    stingRemedy:
      'Apply ice pack immediately. Elevate the area. If patient experiences breathlessness, throat tightness, or dizziness, rush to emergency for adrenaline/epinephrine immediately.',
    treatments: [
      {
        id: 'agh-trap',
        type: 'organic',
        title: 'Yeast & Sugar Vinegar Bottle Traps',
        activeIngredient: 'Physical non-chemical pheromone & fermentation attractant',
        dosagePerLiter: 0,
        dosageUnit: 'ml',
        commercialExamples: ['Vespa-Trap', 'Wasp Bane Attractant'],
        optimalTiming: 'Hang on orchard perimeter in early spring when queens establish nests.',
        preHarvestIntervalDays: 0,
        safetyInstructions: 'Hang away from picnic areas. Do not approach active nests without professional protective suits.',
      },
      {
        id: 'agh-spray',
        type: 'chemical',
        title: 'Permethrin / Cypermethrin Residual Foam',
        activeIngredient: 'Synthetic Pyrethroid',
        dosagePerLiter: 2,
        dosageUnit: 'ml',
        commercialExamples: ['Raid Wasp & Hornet', 'Wasp-Freeze II'],
        optimalTiming: 'Target nest entrances strictly at nighttime when all hornets are dormant inside.',
        preHarvestIntervalDays: 7,
        safetyInstructions: 'Never spray during daylight hours. Use red light torches as hornets cannot detect red spectrum.',
      },
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1590452237887-8820c5ba53ae?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'giant-centipede',
    scientificName: 'Scolopendra subspinipes',
    commonName: {
      en: 'Asian Forest Centipede',
      bn: 'বিচ্ছু / কানখাজুরা / শতপদী',
      hi: 'कनखजूरा / गोजर',
      ur: 'ہزار پا / کنکھجورا',
      zh: '少棘蜈蚣',
      th: 'ตะขาบบ้านขายาว',
    },
    category: 'stinging_insect',
    damageProfile: {
      affectedCrops: ['rice'],
      severity: 'moderate',
      symptoms: [
        'Extremely agonizing bite via modified front claws (forcipules).',
        'Severe burning pain radiating through limb, erythema, and edema.',
        'Headache, nausea, and mild fever may develop in sensitive individuals.',
      ],
      damageMechanism:
        'Cardiotoxic peptide toxins acting on voltage-gated potassium and sodium channels.',
      yieldLossPotential: 'Accidental human bites in rural huts, straw piles, and firewood stacks.',
    },
    stingRemedy:
      'Immerse bite in hot water (40-45°C / comfortably bearable) for 20-30 mins to denature heat-labile venom proteins. Take pain relievers and apply antiseptic.',
    treatments: [
      {
        id: 'gc-barrier',
        type: 'organic',
        title: 'Diatomaceous Earth & Neem Barrier',
        activeIngredient: 'Natural amorphous silica + Azadirachtin',
        dosagePerLiter: 10,
        dosageUnit: 'g',
        commercialExamples: ['Food Grade DE Powder', 'Bio-Barrier'],
        optimalTiming: 'Sprinkle around hut perimeter, doors, and beneath sleeping mats.',
        preHarvestIntervalDays: 0,
        safetyInstructions: 'Completely non-toxic to children and pets.',
      },
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1582845512747-e42001c95638?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'fall-armyworm',
    scientificName: 'Spodoptera frugiperda',
    commonName: {
      en: 'Fall Armyworm',
      bn: 'ফল আর্মিওয়ার্ম পোকা',
      hi: 'फॉल आर्मीवर्म',
      ur: 'فال آرمی ورم',
      zh: '草地贪夜蛾',
      th: 'หนอนกระทู้ข้าวโพดลายจุด',
    },
    category: 'crop_pest',
    damageProfile: {
      affectedCrops: ['rice', 'mango'],
      severity: 'critical',
      symptoms: [
        'Caterpillars voraciously chew leaves causing window-pane damage.',
        'Deep whorl feeding leaving moist sawdust-like frass.',
        'Total defoliation of crop within days if left unchecked.',
      ],
      damageMechanism:
        'Rapid larval chewing strips vegetative canopy, destroying photosynthetic capability.',
      yieldLossPotential: 'Up to 70% yield devastation in grain and cereal crops.',
    },
    treatments: [
      {
        id: 'faw-bio',
        type: 'organic',
        title: 'Bacillus thuringiensis (Bt) kurstaki',
        activeIngredient: 'Bacterial endotoxin Cry1Ac/Cry1Ab',
        dosagePerLiter: 2,
        dosageUnit: 'g',
        commercialExamples: ['Dipel 2X', 'Biolep', 'Halt'],
        optimalTiming: 'Apply late evening targeting early instar larvae in whorls.',
        preHarvestIntervalDays: 1,
        safetyInstructions: 'Safe for predatory spiders, ladybird beetles, and pollinators.',
      },
      {
        id: 'faw-chem',
        type: 'chemical',
        title: 'Emamectin Benzoate 5% SG',
        activeIngredient: 'Emamectin Benzoate (Avermectin derivative)',
        dosagePerLiter: 0.4,
        dosageUnit: 'g',
        commercialExamples: ['Proclaim 5SG', 'Affirm', 'EmaStar'],
        optimalTiming: 'Direct nozzle spray into leaf whorls early morning.',
        preHarvestIntervalDays: 14,
        safetyInstructions: 'Wear protective goggles and respirator during mixing.',
      },
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'mustard-aphid',
    scientificName: 'Lipaphis erysimi',
    commonName: {
      en: 'Mustard & Vegetable Aphid',
      bn: 'সরিষার জাব পোকা',
      hi: 'सरसों का माहू (एफिड)',
      ur: 'سرسوں کا سست تیلا',
      zh: '萝卜蚜',
      th: 'เพลี้ยอ่อนผัก',
    },
    category: 'crop_pest',
    damageProfile: {
      affectedCrops: ['mango', 'rice'],
      severity: 'moderate',
      symptoms: [
        'Thousands of tiny green-black insects congregating on shoots and flowers.',
        'Leaf curling, yellowing, stunted pod growth, and honeydew mold.',
      ],
      damageMechanism:
        'Continuous sap sucking dries out plant moisture and transmits viral plant diseases.',
      yieldLossPotential: '25% - 40% reduction in oilseed and seed yield.',
    },
    treatments: [
      {
        id: 'aph-bio',
        type: 'organic',
        title: 'Potassium Salt of Fatty Acids / Liquid Soap Spray',
        activeIngredient: 'Insecticidal soap + Neem oil',
        dosagePerLiter: 5,
        dosageUnit: 'ml',
        commercialExamples: ['NeemGuard Bio-Wash', 'Safer Soap'],
        optimalTiming: 'Apply at first cluster sighting on flowering branches.',
        preHarvestIntervalDays: 0,
        safetyInstructions: 'Harmless to humans. Breaks down waxy insect cuticle upon contact.',
      },
    ],
    imageUrl:
      'https://images.unsplash.com/photo-1521747116042-5a810fda9664?auto=format&fit=crop&w=800&q=80',
  },
];

export const MOCK_HOSPITALS: IEmergencyHospital[] = [
  {
    id: 'dhaka-dmch',
    name: 'Dhaka Medical College Hospital (Toxicology Unit)',
    name: 'Dhaka Medical College Hospital (DMCH)',
    country: 'BD',
    district: 'Dhaka',
    division: 'Dhaka',
    hotline: '+880255165088',
    hasAntivenomStock: true,
    address: 'Secretariat Road, Dhaka 1000, Bangladesh',
    latitude: 23.7258,
    longitude: 90.3976,
    emergencyUnit: 'One-Stop Emergency & Toxicology Ward',
    icuAvailable: true,
  },
  {
    id: 'dhaka-mitford',
    name: 'Sir Salimullah Medical College & Mitford Hospital',
    country: 'BD',
    district: 'Dhaka',
    division: 'Dhaka',
    hotline: '+880257316521',
    hasAntivenomStock: true,
    address: 'Mitford Road, Old Dhaka 1100, Bangladesh',
    latitude: 23.7099,
    longitude: 90.4026,
    emergencyUnit: 'Emergency Snakebite & ASV Unit',
    icuAvailable: true,
  },
  {
    id: 'rajshahi-rmch',
    name: 'Rajshahi Medical College Hospital (Snakebite Ward)',
    name: 'Rajshahi Medical College Hospital (RMCH)',
    country: 'BD',
    district: 'Rajshahi',
    division: 'Rajshahi',
    hotline: '+880721772150',
    hasAntivenomStock: true,
    address: 'Laxmipur, Rajshahi 6000, Bangladesh',
    latitude: 24.3725,
    longitude: 88.5835,
    emergencyUnit: 'Dedicated Snakebite Ward & Dialysis Center (High Viper Envenomation Zone)',
    icuAvailable: true,
  },
  {
    id: 'chittagong-cmch',
    name: 'Chattogram Medical College Hospital (Venom Research Centre)',
    name: 'Chattogram Medical College Hospital (CMCH)',
    country: 'BD',
    district: 'Chattogram',
    division: 'Chattogram',
    hotline: '+88031619400',
    hasAntivenomStock: true,
    address: 'KB Fazlul Kader Road, Chattogram, Bangladesh',
    latitude: 22.3592,
    longitude: 91.8215,
    emergencyUnit: 'Venom Research Centre & ICU Casualty',
    icuAvailable: true,
  },
  {
    id: 'sylhet-mag-osmani',
    name: 'Sylhet MAG Osmani Medical College Hospital',
    country: 'BD',
    district: 'Sylhet',
    division: 'Sylhet',
    hotline: '+880821713487',
    hasAntivenomStock: true,
    address: 'Medical Road, Kajolshah, Sylhet 3100, Bangladesh',
    latitude: 24.8988,
    longitude: 91.8546,
    emergencyUnit: 'Emergency ASV & Respiratory Support',
    icuAvailable: true,
  },
  {
    id: 'khulna-kmch',
    name: 'Khulna Medical College Hospital (KMCH)',
    country: 'BD',
    district: 'Khulna',
    division: 'Khulna',
    hotline: '+88041760350',
    hasAntivenomStock: true,
    address: 'Boyra, Khulna 9000, Bangladesh',
    latitude: 22.8290,
    longitude: 89.5406,
    emergencyUnit: 'Emergency Department & Antivenom Depository',
    icuAvailable: true,
  },
  {
    id: 'barishal-sbmch',
    name: 'Sher-e-Bangla Medical College Hospital (SBMCH)',
    country: 'BD',
    district: 'Barishal',
    division: 'Barishal',
    hotline: '+880431217355',
    hasAntivenomStock: true,
    address: 'Band Road, Barishal 8200, Bangladesh',
    latitude: 22.6896,
    longitude: 90.3601,
    emergencyUnit: 'Coastal Snakebite & Emergency Care',
    icuAvailable: true,
  },
  {
    id: 'rangpur-rmch',
    name: 'Rangpur Medical College Hospital (RpMCH)',
    country: 'BD',
    district: 'Rangpur',
    division: 'Rangpur',
    hotline: '+88052163456',
    hasAntivenomStock: true,
    address: 'Medical College Road, Rangpur 5400, Bangladesh',
    latitude: 25.7533,
    longitude: 89.2372,
    emergencyUnit: '24/7 Acute Poisoning & Antivenom Unit',
    icuAvailable: true,
  },
  {
    id: 'mymensingh-mmch',
    name: 'Mymensingh Medical College Hospital (MMCH)',
    country: 'BD',
    district: 'Mymensingh',
    division: 'Mymensingh',
    hotline: '+8809166063',
    hasAntivenomStock: true,
    address: 'Charpara, Mymensingh 2200, Bangladesh',
    latitude: 24.7438,
    longitude: 90.4109,
    emergencyUnit: 'Emergency & Trauma Care Unit',
    icuAvailable: true,
  },
  {
    id: 'faridpur-bsmmc',
    name: 'Bangabandhu Sheikh Mujib Medical College Hospital',
    country: 'BD',
    district: 'Faridpur',
    division: 'Dhaka',
    hotline: '+88063162544',
    hasAntivenomStock: true,
    address: 'West Alipur, Faridpur 7800, Bangladesh',
    latitude: 23.5973,
    longitude: 89.8324,
    emergencyUnit: "Specialized Russell's Viper Emergency Care",
    icuAvailable: true,
  },
  {
    id: 'kolkata-rgkar',
    name: 'R. G. Kar Medical College & Hospital',
    country: 'IN',
    district: 'Kolkata, West Bengal',
    division: 'West Bengal',
    hotline: '+913325557656',
    hasAntivenomStock: true,
    address: '1, Khudiram Bose Sarani, Kolkata, West Bengal 700004, India',
    latitude: 22.6044,
    longitude: 88.3745,
    emergencyUnit: 'Toxicology & Antivenom Ward',
    icuAvailable: true,
  },
  {
    id: 'delhi-aiims',
    name: 'AIIMS National Poisons Information Centre',
    country: 'IN',
    district: 'New Delhi',
    division: 'Delhi',
    hotline: '+911126593677',
    hasAntivenomStock: true,
    address: 'Ansari Nagar, New Delhi 110029, India',
    latitude: 28.5672,
    longitude: 77.2100,
    emergencyUnit: 'National Poison Center Hotline & Emergency',
    icuAvailable: true,
  },
  {
    id: 'lahore-mayo',
    name: 'Mayo Hospital Emergency Department',
    country: 'PK',
    district: 'Lahore, Punjab',
    division: 'Punjab',
    hotline: '+924299211129',
    hasAntivenomStock: true,
    address: 'Hospital Road, Anarkali Bazaar, Lahore, Pakistan',
    latitude: 31.5746,
    longitude: 74.3142,
    emergencyUnit: 'Trauma & Emergency Care',
    icuAvailable: true,
  },
];
