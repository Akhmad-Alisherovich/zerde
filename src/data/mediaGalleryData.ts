export interface PhotoMediaItem {
  id: string;
  traditionId: string;
  traditionName: string;
  title: string;
  image: string;
  imageWebp?: string;
  description: string;
  significance: string;
  category: 'ceremony' | 'clothing' | 'object' | 'gathering';
  categoryLabel: string;
}

export interface VideoMediaItem {
  id: string;
  traditionId: string;
  traditionName: string;
  title: string;
  poster: string;
  videoUrl?: string;
  duration: string;
  description: string;
  culturalNote: string;
  status: 'ready' | 'in_production';
}

export const PHOTO_GALLERY_DATA: PhotoMediaItem[] = [
  // 1. Беташар
  {
    id: 'betashar-cover',
    traditionId: 'betashar',
    traditionName: 'Беташар',
    title: 'Сәукелелі келін мен ақын жыры',
    image: '/assets/cultural/betashar/betashar_cover.jpg',
    imageWebp: '/assets/cultural/betashar/betashar_cover.webp',
    description: 'Киіз үй ішіндегі Беташар рәсімі. Ақын домбырамен жыр төгіп, келінді жаңа шаңырақпен таныстырады.',
    significance: 'Үлкенді сыйлау, жаңа әулетке инабатпен кіру және отбасылық сабақтастық рәмізі.',
    category: 'ceremony',
    categoryLabel: 'Рәсім'
  },
  {
    id: 'betashar-saukele',
    traditionId: 'betashar',
    traditionName: 'Беташар',
    title: 'Қалыңдықтың сәукелесі мен күміс шекеліктері',
    image: '/assets/cultural/betashar/betashar_closeup_saukele.jpg',
    imageWebp: '/assets/cultural/betashar/betashar_closeup_saukele.webp',
    description: 'Қызыл барқыттан тігіліп, алтын зерлі қошқармүйіз оюларымен және ақық, бирюза тастармен көмкерілген биік сәукеле.',
    significance: 'Қазақ қолөнерінің шыңы; қыз баланың қадір-қасиеті мен абыройының айшығы.',
    category: 'clothing',
    categoryLabel: 'Ұлттық киім'
  },
  {
    id: 'betashar-dombra',
    traditionId: 'betashar',
    traditionName: 'Беташар',
    title: 'Ақынның қос ішекті қарағай домбырасы',
    image: '/assets/cultural/betashar/betashar_closeup_dombra.jpg',
    imageWebp: '/assets/cultural/betashar/betashar_closeup_dombra.webp',
    description: 'Табиғи ағаштан шабылған қос ішекті домбыра, орындаушының шебер саусақтары және оюлы шапан жеңі.',
    significance: 'Беташар жыры тек домбыра сазымен орындалып, халықтың ғасырлық өсиетін жеткізеді.',
    category: 'object',
    categoryLabel: 'Тұрмыстық мұра'
  },
  {
    id: 'betashar-salem',
    traditionId: 'betashar',
    traditionName: 'Беташар',
    title: 'Келіннің сәлем салу (тағзым) сәті',
    image: '/assets/cultural/betashar/betashar_keyframe_salem.jpg',
    imageWebp: '/assets/cultural/betashar/betashar_keyframe_salem.webp',
    description: 'Жырда аталған әрбір үлкенге келін иіліп ізет қылады, үлкендер мейірлене батасын арнайды.',
    significance: 'Үлкенге құрмет пен кішіпейілділіктің, ізгі әдептің мәдени көрінісі.',
    category: 'ceremony',
    categoryLabel: 'Рәсім'
  },
  {
    id: 'betashar-veil-reveal',
    traditionId: 'betashar',
    traditionName: 'Беташар',
    title: 'Домбыраның басымен желекті көтеру сәті',
    image: '/assets/cultural/betashar/betashar_keyframe_veil_reveal.jpg',
    imageWebp: '/assets/cultural/betashar/betashar_keyframe_veil_reveal.webp',
    description: 'Ақынның домбыра ұшымен ақ желекті ақырын көтеріп, келіннің жүзін көпшілікке ашуы.',
    significance: 'Жас келіннің жаңа өмірге қадам басуын және елдің оны толық қабылдауын білдіреді.',
    category: 'ceremony',
    categoryLabel: 'Рәсім'
  },

  // 2. Наурыз
  {
    id: 'nauryz-cover',
    traditionId: 'nauryz',
    traditionName: 'Наурыз',
    title: 'Мерекелік дастарқан басындағы басқосу',
    image: '/assets/cultural/nauryz/nauryz_cover.jpg',
    imageWebp: '/assets/cultural/nauryz/nauryz_cover.webp',
    description: 'Киіз үй төріндегі үш буын өкілдері: кимешекті әже, ақсақал қария, балалар мен жастар.',
    significance: 'Ұлыстың ұлы күніндегі бейбітшілік, татулық және отбасылық береке.',
    category: 'gathering',
    categoryLabel: 'Мереке'
  },
  {
    id: 'nauryz-serving-kozhe',
    traditionId: 'nauryz',
    traditionName: 'Наурыз',
    title: 'Ақсақалға Наурыз көже ұсыну әдебі',
    image: '/assets/cultural/nauryz/nauryz_serving_kozhe.jpg',
    imageWebp: '/assets/cultural/nauryz/nauryz_serving_kozhe.webp',
    description: 'Әженің оюлы ожаумен астаудан көже құйып, төрдегі қарияға қос қолдап тостаған ұсыну сәті.',
    significance: 'Үлкенге дәм ұсынудағы терең құрмет пен ұрпақтар сабақтастығы.',
    category: 'ceremony',
    categoryLabel: 'Рәсім'
  },
  {
    id: 'nauryz-closeup-kozhe',
    traditionId: 'nauryz',
    traditionName: 'Наурыз',
    title: 'Жеті дәмнен қайнаған көже және ағаш астау',
    image: '/assets/cultural/nauryz/nauryz_closeup_kozhe.jpg',
    imageWebp: '/assets/cultural/nauryz/nauryz_closeup_kozhe.webp',
    description: 'Ет, сүт, бидай, тұз, май, құрт, су секілді 7 қасиетті дәмнен пісірілген Наурыз көже.',
    significance: 'Молшылық, тоқшылық және келер жылға деген ізгі тілектің нышаны.',
    category: 'object',
    categoryLabel: 'Ұлттық дәм'
  },
  {
    id: 'nauryz-dastarkhan-table',
    traditionId: 'nauryz',
    traditionName: 'Наурыз',
    title: 'Ортақ дастарқан мен бауырсақтар',
    image: '/assets/nauryz_dastarkhan_ar.jpg',
    description: 'Дөңгелек ағаш үстел үстіндегі бауырсақтар, құрт, жемістер мен ыстық шәй дастарқаны.',
    significance: 'Қазақ қонақжайлылығы мен теңдік, ашық көңіл белгісі.',
    category: 'object',
    categoryLabel: 'Ұлттық дәм'
  },

  // 3. Асар
  {
    id: 'asar-cover',
    traditionId: 'asar',
    traditionName: 'Асар',
    title: 'Кең далада жұмыла киіз үй көтеру',
    image: '/assets/cultural/asar/asar_cover.jpg',
    imageWebp: '/assets/cultural/asar/asar_cover.webp',
    description: 'Ауыл азаматтарының өзара көмекке жиналып, кереге мен уықтарды бірігіп бекіту сәті.',
    significance: 'Ынтымақ пен бірлік; қауымның бір отбасыға шын жүректен тегін қолдау көрсетуі.',
    category: 'gathering',
    categoryLabel: 'Ынтымақ'
  },
  {
    id: 'asar-closeup-shanyraq',
    traditionId: 'asar',
    traditionName: 'Асар',
    title: 'Шаңырақ пен күлдіреуіш құрылымы',
    image: '/assets/cultural/asar/asar_closeup_shanyraq.jpg',
    imageWebp: '/assets/cultural/asar/asar_closeup_shanyraq.webp',
    description: 'Қайыңнан иілген шаңырақ шеңбері, күлдіреуіш қаламдықтары және өрнекті басқұр баулары.',
    significance: 'Шаңырақ — отбасының тұтастығы мен мемлекеттің басты киелі символы.',
    category: 'object',
    categoryLabel: 'Сәулет мұрасы'
  },
  {
    id: 'asar-keyframe-felt',
    traditionId: 'asar',
    traditionName: 'Асар',
    title: 'Ақ киіз туырлықтарды тарту кезеңі',
    image: '/assets/cultural/asar/asar_keyframe_felt.jpg',
    imageWebp: '/assets/cultural/asar/asar_keyframe_felt.webp',
    description: 'Киіз үй күмбезіне туырлық пен үзіктерді жауып, сыртынан өрнекті арқандармен тарту.',
    significance: 'Көп болып көтерген жүктің жеңілдігі мен ұжымдық еңбектің берекесі.',
    category: 'ceremony',
    categoryLabel: 'Еңбек рәсімі'
  },

  // 4. Тұсаукесер
  {
    id: 'tusaukeser-cover',
    traditionId: 'tusaukeser',
    traditionName: 'Тұсаукесер',
    title: 'Ақ жол төсеміндегі баланың алғашқы қадамы',
    image: '/assets/cultural/tusaukeser/tusaukeser_cover.jpg',
    imageWebp: '/assets/cultural/tusaukeser/tusaukeser_cover.webp',
    description: 'Тұсауы ала жіппен байланып, жүрісі жылдам қадірлі әженің кесуіне дайындалған бүлдіршін.',
    significance: '«Біреудің ала жібін аттамасын» деген адалдық ұстанымы мен өмір жолының ақ болуы.',
    category: 'ceremony',
    categoryLabel: 'Рәсім'
  },
  {
    id: 'tusaukeser-shoes',
    traditionId: 'tusaukeser',
    traditionName: 'Тұсаукесер',
    title: 'Ала жіп және балдырған мәсісі',
    image: '/assets/tusaukeser_shoes.jpg',
    description: 'Ақ пен қара жүннен өрілген қасиетті ала жіп және баланың алғашқы былғары аяқ киімі.',
    significance: 'Адалдық, әділдік және таза жолмен жүру тәрбиесінің бастауы.',
    category: 'object',
    categoryLabel: 'Тұрмыстық мұра'
  },

  // 5. Бесікке салу
  {
    id: 'besikke-salu-scene',
    traditionId: 'besikke-salu',
    traditionName: 'Бесікке салу',
    title: 'Сәбиді киелі бесікке бөлеу рәсімі',
    image: '/assets/scene_besikke_salu.png',
    description: 'Ағаштан ойылған оюлы бесік, жұмсақ төсеніштер және әулет әжесінің сәбиге арнаған бесік жыры.',
    significance: 'Жаңа туған сәбидің амандығы, өсіп-жетілуі және отбасылық мейірім.',
    category: 'ceremony',
    categoryLabel: 'Рәсім'
  },

  // 6. Сырға салу
  {
    id: 'syrga-salu-scene',
    traditionId: 'syrga-salu',
    traditionName: 'Сырға салу',
    title: 'Қалыңдыққа құдалық сырғасын тағу',
    image: '/assets/scene_syrga_salu.png',
    description: 'Құдаласқан екі әулеттің келісімін білдіретін асыл тасты күміс немесе алтын сырға тағу рәсімі.',
    significance: 'Екі отбасының өзара сенімі, келісімі және болашақ отауға деген ақ батасы.',
    category: 'ceremony',
    categoryLabel: 'Рәсім'
  },

  // 7. Бата беру
  {
    id: 'bata-beru-scene',
    traditionId: 'bata-beru',
    traditionName: 'Бата беру',
    title: 'Ақсақалдың алақан жайып бата беруі',
    image: '/assets/scene_bata_beru.png',
    description: 'Дастарқан басындағы қазыналы қарияның жиналған қауымға ізгі ниетпен ақ тілек арнауы.',
    significance: '«Батаменен ел көгерер»; рухани демеу мен халықтық даналықтың үзілмес жібі.',
    category: 'ceremony',
    categoryLabel: 'Рәсім'
  },

  // 8. Шашу
  {
    id: 'shashu-scene',
    traditionId: 'shashu',
    traditionName: 'Шашу',
    title: 'Мерекеде тәттілер мен тиын шашу',
    image: '/assets/scene_shashu.png',
    description: 'Үлкен қуанышта (той, келін түсу, баланың қадамы) жиналғандарға тәттілер мен құрт шашу сәті.',
    significance: 'Қуанышты бөлісу, көпке береке тілеу және қонақжайлық дәстүрі.',
    category: 'ceremony',
    categoryLabel: 'Рәсім'
  },

  // 9. Қымызмұрындық
  {
    id: 'qymyzmuryndyq-scene',
    traditionId: 'qymyzmuryndyq',
    traditionName: 'Қымызмұрындық',
    title: 'Маусымның алғашқы қымызынан дәм тату',
    image: '/assets/scene_qymyzmuryndyq.png',
    description: 'Жайлаудағы былғары саба, ағаш піспек және алғашқы қымызды сапырып тостағанмен ұсыну.',
    significance: 'Көктем мен жазғы еңбектің алғашқы өнімін ағайынмен бөлісу берекесі.',
    category: 'gathering',
    categoryLabel: 'Мереке'
  },

  // 10. Көрісу (Амал)
  {
    id: 'korisu-tradition',
    traditionId: 'korisu',
    traditionName: 'Көрісу (Амал)',
    title: '14 наурыз – Көрісу күніндегі амандық-саулық',
    image: '/assets/tradition_korisu.jpg',
    description: 'Қыстан аман шыққан ел-жұрттың қол алысып, төс қағысып, «Жасың құтты болсын!» деп амандық сұрасуы.',
    significance: 'Өкпе-ренішті ұмыту, сыйластықты нығайту және үлкенге сәлем беру салты.',
    category: 'gathering',
    categoryLabel: 'Мереке'
  },

  // 11. Ерулік
  {
    id: 'erulik-tradition',
    traditionId: 'erulik',
    traditionName: 'Ерулік',
    title: 'Жаңа көршіні қонаққа шақырып дәм татқызу',
    image: '/assets/tradition_erulik.jpg',
    description: 'Ауылға жаңадан көшіп келген отбасын жатырқамасын деп дәмге шақырып, ортаға бейімдеу дәстүрі.',
    significance: 'Бауырмалдық, жанашырлық және көршілік қарым-қатынастың мызғымас беріктігі.',
    category: 'gathering',
    categoryLabel: 'Дәстүр'
  }
];

export const VIDEO_GALLERY_DATA: VideoMediaItem[] = [
  {
    id: 'video-nauryz',
    traditionId: 'nauryz',
    traditionName: 'Наурыз',
    title: 'Наурыз: Дастарқан басында көже ұсыну',
    poster: '/media/nauryz/serving-kozhe-poster.webp',
    duration: '0:15',
    description: 'Кимешек киген қазақ әжесінің ағаш ожаумен астаудан буы бұрқыраған көжені тостағанға құйып, төрдегі қазыналы ақсақалға қос қолдап ұсыну сәті.',
    culturalNote: 'Үлкенге құрмет пен ұрпақтар сабақтастығының шынайы көрінісі.',
    status: 'in_production'
  },
  {
    id: 'video-betashar',
    traditionId: 'betashar',
    traditionName: 'Беташар',
    title: 'Беташар: Ақынның желекті домбырамен ашу сәті',
    poster: '/assets/cultural/betashar/betashar_cover.webp',
    duration: '0:18',
    description: 'Ақынның домбыра сазымен келіннің ақ жібек жамылғысын байыппен көтеріп, келіннің күлімдеген жүзін әулетке паш етуі.',
    culturalNote: 'UNESCO материалдық емес мәдени мұрасы тізіміндегі некелік салт.',
    status: 'in_production'
  },
  {
    id: 'video-asar',
    traditionId: 'asar',
    traditionName: 'Асар',
    title: 'Асар: Шаңырақты бақанмен көтеру',
    poster: '/assets/cultural/asar/asar_cover.webp',
    duration: '0:20',
    description: 'Бірнеше жігіттің ашалы бақанмен ауыр қайың шаңырақты аспанға көтеріп, уықтарды шеңберге шаншып бекітудегі үйлесімді қимылы.',
    culturalNote: 'Қазақ киіз үйін бірлесіп көтерудегі дәстүрлі ынтымақтастық.',
    status: 'in_production'
  },
  {
    id: 'video-tusaukeser',
    traditionId: 'tusaukeser',
    traditionName: 'Тұсаукесер',
    title: 'Тұсаукесер: Ала жіпті қиып, ақ жолға бағыттау',
    poster: '/assets/cultural/tusaukeser/tusaukeser_cover.webp',
    duration: '0:14',
    description: 'Абыройлы әженің баланың аяғына байланған ала жіпті қайшымен қиып, бүлдіршіннің ақ төсем үстімен алғашқы қадам жасауы.',
    culturalNote: 'Адалдық ұстанымы мен өмір жолының сәтті болуына арналған халықтық тілек.',
    status: 'in_production'
  },
  {
    id: 'video-besikke-salu',
    traditionId: 'besikke-salu',
    traditionName: 'Бесікке салу',
    title: 'Бесікке салу: Сәбиді бөлеу және бесік жыры',
    poster: '/assets/scene_besikke_salu.png',
    duration: '0:16',
    description: 'Жаңа туған сәбиді ағаш бесікке жатқызып, тартпа бауларын байлау және әженің баяу тербетіп бесік жырын орындауы.',
    culturalNote: 'Ана мейірімі мен сәби денсаулығына арналған көне халықтық ғұрып.',
    status: 'in_production'
  },
  {
    id: 'video-bata-beru',
    traditionId: 'bata-beru',
    traditionName: 'Бата беру',
    title: 'Бата беру: Ақсақалдың дастарқан батасы',
    poster: '/assets/scene_bata_beru.png',
    duration: '0:15',
    description: 'Ақсақал қарияның екі алақанын жайып ізгі тілек айтуы және соңында барлығының бірге «Әумин» деп бетін сипауы.',
    culturalNote: 'Үлкенді құрметтеу мен ізгі ниеттің рухани күші.',
    status: 'in_production'
  }
];

export const ALL_TRADITION_FILTERS = [
  { id: 'all', label: 'Барлық дәстүрлер' },
  { id: 'nauryz', label: 'Наурыз' },
  { id: 'betashar', label: 'Беташар' },
  { id: 'asar', label: 'Асар' },
  { id: 'tusaukeser', label: 'Тұсаукесер' },
  { id: 'besikke-salu', label: 'Бесікке салу' },
  { id: 'syrga-salu', label: 'Сырға салу' },
  { id: 'bata-beru', label: 'Бата беру' },
  { id: 'shashu', label: 'Шашу' },
  { id: 'qymyzmuryndyq', label: 'Қымызмұрындық' },
  { id: 'korisu', label: 'Көрісу' },
  { id: 'erulik', label: 'Ерулік' }
];
