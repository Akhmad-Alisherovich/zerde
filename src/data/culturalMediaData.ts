export interface CulturalCloseup {
  id: string;
  title: string;
  description: string;
  image: string;
  imageWebp: string;
  culturalDetails: string;
  aspectRatio?: '4:3' | '16:9' | '1:1';
}

export interface CulturalKeyframe {
  id: string;
  stageIndex: number; // Corresponds to 3D stage (0, 1, 2...)
  title: string;
  stageLabel: string;
  description: string;
  image: string;
  imageWebp: string;
  actionDetails: string;
  promptNote: string;
}

export interface VeoMotionSpec {
  posterUrl: string;
  posterWebp: string;
  videoUrl?: string; // Optional real MP4/WebM clip if generated
  durationSeconds: number;
  title: string;
  actionDescription: string;
  cameraMotion: string;
  prompt: string;
  framerate?: number;
}

export interface CulturalMediaItem {
  id: string;
  traditionId: string;
  name: string;
  subtitle: string;
  coverImage: string;
  coverImageWebp: string;
  altText: string;
  overviewNarrative: string;
  closeups: CulturalCloseup[];
  keyframes: CulturalKeyframe[];
  veoMotion: VeoMotionSpec;
  provenance: {
    generator: string;
    synthIdNoted: boolean;
    researchSources: string[];
    disclaimer: string;
  };
}

export const CULTURAL_MEDIA_DATA: Record<string, CulturalMediaItem> = {
  betashar: {
    id: 'betashar',
    traditionId: 'betashar',
    name: 'Беташар',
    subtitle: 'Әулетпен таныстыру және отбасылық сабақтастық',
    coverImage: '/assets/cultural/betashar/betashar_cover.jpg',
    coverImageWebp: '/assets/cultural/betashar/betashar_cover.webp',
    altText: 'Беташар дәстүрі – ақын домбырамен жыр айтып, келін сәлем салады',
    overviewNarrative: 'Беташар — қазақ халқының қалыңдықты жаңа шаңырақпен, ата-енесімен және барлық туыстарымен таныстыратын ең маңызды үйлену тойы рәсімдерінің бірі. Мұнда ақынның жыры арқылы отбасылық береке мен үлкенді сыйлау өсиеттері жеткізіледі.',
    closeups: [
      {
        id: 'saukele',
        title: 'Сәукеле мен шекелік',
        description: 'Қалыңдықтың салтанатты бас киімі – алтын зерлі қошқармүйіз оюлары, күміс шекелік және мөлдір жібек желек.',
        image: '/assets/cultural/betashar/betashar_closeup_saukele.jpg',
        imageWebp: '/assets/cultural/betashar/betashar_closeup_saukele.webp',
        culturalDetails: 'Сәукеле — қазақ қолөнерінің шыңы. Биік конус пішінді сәукеле қызыл барқыттан тігіліп, алтын жіппен, асыл тастармен (бирюза, маржан) безендіріледі. Екі жағынан төгілетін күміс шекеліктер қыздың абыройы мен көркін айшықтайды.',
        aspectRatio: '4:3'
      },
      {
        id: 'dombra',
        title: 'Ақын домбырасы мен пернесі',
        description: 'Қос ішекті шанақты домбыра, орындаушының шебер саусақтары және оюлы барқыт шапан жеңі.',
        image: '/assets/cultural/betashar/betashar_closeup_dombra.jpg',
        imageWebp: '/assets/cultural/betashar/betashar_closeup_dombra.webp',
        culturalDetails: 'Беташарды дәстүр бойынша шешен, сөзге ұста ақын-жыршы ғана орындайды. Оның қолындағы қос ішекті ағаш домбыра (қайың немесе қарағай шанақты) күй мен жырдың ырғағын ұстап, рәсімге ерекше салтанат пен рух береді.',
        aspectRatio: '4:3'
      }
    ],
    keyframes: [
      {
        id: 'stage-1',
        stageIndex: 0,
        title: 'Келінді қарсы алу & Ақын жыры',
        stageLabel: '1-кезең: Келінді қарсы алу',
        description: 'Келін екі жеңгесінің жетелеуімен киіз үй төріне келеді. Ақын домбыра қағып, сәлем сөзін бастайды.',
        image: '/assets/cultural/betashar/betashar_cover.jpg',
        imageWebp: '/assets/cultural/betashar/betashar_cover.webp',
        actionDetails: 'Ақын жайлы ырғақпен отырып, домбырамен беташар жырын төгеді. Келін ақ жібек жамылғының астында инабаттылық сақтап тұр.',
        promptNote: 'Nano Banana master keyframe: Yurt gathering, akyn playing dombra, bride in red saukele.'
      },
      {
        id: 'stage-2',
        stageIndex: 1,
        title: 'Сәлем салу (Иілу рәсімі)',
        stageLabel: '2-кезең: Ақын жыры мен сәлем',
        description: 'Жырда әрбір ата-ене, аға-бауыр аталған сайын келін ізетпен иіліп, сәлем қылады.',
        image: '/assets/cultural/betashar/betashar_keyframe_salem.jpg',
        imageWebp: '/assets/cultural/betashar/betashar_keyframe_salem.webp',
        actionDetails: 'Келін екі қолын алдына ұстап, байыппен тағзым етеді. Жанындағы абысындары демеп, үлкендер мейірлене батасын айтады.',
        promptNote: 'Nano Banana keyframe 2: Bride performing traditional salem salu bow, family members reacting with warmth.'
      },
      {
        id: 'stage-3',
        stageIndex: 2,
        title: 'Бетті ашу (Шарықтау сәті)',
        stageLabel: '3-кезең: Бетті ашу',
        description: 'Ақын домбырасының басымен желекті жеңіл көтеріп, келіннің жүзін көпке көрсетеді.',
        image: '/assets/cultural/betashar/betashar_keyframe_veil_reveal.jpg',
        imageWebp: '/assets/cultural/betashar/betashar_keyframe_veil_reveal.webp',
        actionDetails: 'Ақ жібек жамылғы жоғары көтеріліп, келіннің күлімдеген жүзі ашылады. Жиналған жұрт қол соғып, шашу шашылады.',
        promptNote: 'Nano Banana keyframe 3: Akyn lifting the veil with dombra neck, revealing the smiling bride.'
      }
    ],
    veoMotion: {
      posterUrl: '/assets/cultural/betashar/betashar_cover.jpg',
      posterWebp: '/assets/cultural/betashar/betashar_cover.webp',
      durationSeconds: 8,
      title: 'Беташар: Желекті ашу кинематикасы',
      actionDescription: 'Ақын домбыра сазын әуелете отырып, аспаптың ұшымен келіннің ақ жібек жамылғысын байыппен жоғары сырғытады. Келін басын көтеріп, биязы жымиыспен алғыс сәлемін жасайды; кимешекті әжелер мен қауым қол соғып, шаттана қабылдайды.',
      cameraMotion: 'Байыпты алға жылжу (Slow push-in dolly), шаңырақтан түскен жұмсақ күн сәулесі, маталардың шынайы желбіреуі.',
      prompt: 'Cinematic realistic Kazakh cultural ritual Betashar inside a warm felt yurt. A Kazakh akyn in ornate embroidered dark blue velvet chapan gently lifts a translucent white silk bridal veil using the top peg of a traditional two-string dombra. Underneath, a graceful young Kazakh bride in a tall red velvet saukele adorned with filigree silver pendants and turquoise beads smiles warmly and performs a gentle, dignified bow (salem salu). Surrounding family members, elderly women in white kimeshek and men in traditional hats applaud with sincere festive joy. Warm daylight filtering down from the wooden shanyraq roof, authentic felt tekemet carpets with red qoşqarmüiz motifs, high-detail textile physics, natural fluid human motion, 24fps film look, 4K photorealistic.'
    },
    provenance: {
      generator: 'Nano Banana (Gemini Image Model)',
      synthIdNoted: true,
      researchSources: [
        'UNESCO. Betashar, traditional wedding ritual. Representative List of Intangible Cultural Heritage, 2024.',
        'ҚР Ұлттық музейі. «Қазақтың дәстүрлі киім-кешегі» қоры мен этнографиялық каталогы.',
        'UNESCO. Kazakh traditional art of Dombra kuyleri (00996).'
      ],
      disclaimer: 'Бұл визуализация – бекітілген этнографиялық зерттеулерге сүйене отырып, Nano Banana арқылы синтезделген білім беру реконструкциясы. Ол тарихи деректі хроника емес, 3D GLB үлгілеріне көрнекі қосымша болып табылады.'
    }
  },

  asar: {
    id: 'asar',
    traditionId: 'asar',
    name: 'Асар',
    subtitle: 'Бірлескен көмек және ынтымақтастық',
    coverImage: '/assets/cultural/asar/asar_cover.jpg',
    coverImageWebp: '/assets/cultural/asar/asar_cover.webp',
    altText: 'Асар дәстүрі – далада ауыл адамдарының киіз үйді бірлесіп көтеруі',
    overviewNarrative: 'Асар — ауыл қауымының күш біріктіріп, бір отбасының немесе жалпы қауымның ауыр шаруасын (үй көтеру, киіз басу) тегін, ынтымақпен атқару дәстүрі. Бұл қазақ қоғамындағы өзара көмек пен жанашырлықтың биік үлгісі.',
    closeups: [
      {
        id: 'shanyraq-uyk',
        title: 'Шаңырақ пен уық түйісуі',
        description: 'Қайың ағашынан ию арқылы жасалған шаңырақ шеңбері, күлдіреуіштер және уық қаламдығы кіретін көздер.',
        image: '/assets/cultural/asar/asar_closeup_shanyraq.jpg',
        imageWebp: '/assets/cultural/asar/asar_closeup_shanyraq.webp',
        culturalDetails: 'Шаңырақ — киіз үйдің төбесі ғана емес, әулеттің, ұрпақтың және бейбітшіліктің қасиетті белгісі. Шеңбер жиегіне уықтардың сүйір бастары кіргізіліп, оюлы басқұр баулармен біртұтас күмбезге бекітіледі.',
        aspectRatio: '4:3'
      }
    ],
    keyframes: [
      {
        id: 'stage-1',
        stageIndex: 0,
        title: 'Керегені құру және сықырлауық',
        stageLabel: '1-кезең: Керегені құру',
        description: 'Ауыл азаматтары жиналмалы торлы қабырғаны (кереге) шеңбер бойымен жайып, ағаш есікке (сықырлауық) байлайды.',
        image: '/assets/cultural/asar/asar_cover.jpg',
        imageWebp: '/assets/cultural/asar/asar_cover.webp',
        actionDetails: 'Сағанақтар қайыспен бекітіліп, берік шеңбер құрады. Ақсақал дұрыс бағыт пен шеңбер теңдігін бақылайды.',
        promptNote: 'Nano Banana master: Yurt wall frame assembly by men in steppe.'
      },
      {
        id: 'stage-2',
        stageIndex: 1,
        title: 'Шаңырақты бақанмен көтеру',
        stageLabel: '2-кезең: Шаңырақты көтеру',
        description: 'Ортада күшті жігіт ашалы бақанмен шаңырақты жоғары көтереді. Бұл — аса жауапты және салтанатты сәт.',
        image: '/assets/cultural/asar/asar_cover.jpg',
        imageWebp: '/assets/cultural/asar/asar_cover.webp',
        actionDetails: 'Шаңырақ тік ұсталып, бірінші негізгі төрт уық төрт тараптан шаңырақ көздеріне сұғылып, тепе-теңдік орнайды.',
        promptNote: 'Nano Banana keyframe 2: Raising the shanyraq wheel with a central pole.'
      },
      {
        id: 'stage-3',
        stageIndex: 3,
        title: 'Киізбен жабу (Туырлық пен үзік)',
        stageLabel: '4-кезең: Киізбен жабу',
        description: 'Ағаш қаңқа біткен соң, әйелдер мен ерлер ақ қой жүнінен басылған қалың киіздерді үй үстіне тартады.',
        image: '/assets/cultural/asar/asar_keyframe_felt.jpg',
        imageWebp: '/assets/cultural/asar/asar_keyframe_felt.webp',
        actionDetails: 'Туырлық қабырғаны, үзік төбені жабады, сыртынан өрнекті басқұрлармен тартылып, киіз үй толық дайын болады.',
        promptNote: 'Nano Banana keyframe 3: Covering the assembled dome with white sheep wool felt.'
      }
    ],
    veoMotion: {
      posterUrl: '/assets/cultural/asar/asar_cover.jpg',
      posterWebp: '/assets/cultural/asar/asar_cover.webp',
      durationSeconds: 8,
      title: 'Асар: Шаңырақ көтеру және киіз жабу',
      actionDescription: 'Екі жігіт ашалы ағаш бақанмен ауыр шаңырақ шеңберін аспанға қарай тік көтереді, бірнеше жігіт бір сәтте уықтардың ұшын шеңбер тесіктеріне сұғып байлайды. Дала желі киімдерді желпіп, қария ризашылықпен қарап тұр.',
      cameraMotion: 'Кең панорамадан орталық бақанға қарай баяу төменнен жоғары көтерілу (Low-angle tilt up), табиғи күн нұры.',
      prompt: 'Cinematic 4K video of authentic Kazakh community Asar ritual on the wide open green steppe. Several strong Kazakh men in traditional leather boots, linen tunics, and felt vests cooperatively raise a heavy circular wooden shanyraq roof wheel into the air using a notched wooden bakan pole. Synchronously, two other men fit curved birch uyk rafter poles into the radial mortises. A wise village elder leaning on a carved walking stick smiles with deep satisfaction. In the background, horses graze quietly and rolling hills stretch under a vast blue sky. Smooth camera crane tilt-up, authentic wood tension, photorealistic film look.'
    },
    provenance: {
      generator: 'Nano Banana (Gemini Image Model)',
      synthIdNoted: true,
      researchSources: [
        'UNESCO. Traditional knowledge and skills in making Kyrgyz and Kazakh yurts (02284).',
        'ҚР Ұлттық музейі. «Қазақтың киіз үйі мен оның жабдықтары» этнографиялық зерттеулері.'
      ],
      disclaimer: 'Бұл визуализация — киіз үй көтеру этнографиясына негізделген білім беру реконструкциясы. 3D GLB моделінің кезеңдік анимациясын тереңірек түсіну үшін әзірленген.'
    }
  },

  nauryz: {
    id: 'nauryz',
    traditionId: 'nauryz',
    name: 'Наурыз',
    subtitle: 'Жаңару мен татулық мерекесі',
    coverImage: '/assets/cultural/nauryz/nauryz_cover.jpg',
    coverImageWebp: '/assets/cultural/nauryz/nauryz_cover.webp',
    altText: 'Наурыз мерекесі – киіз үйдегі мерекелік дастарқан және Наурыз көже',
    overviewNarrative: 'Наурыз — көктемнің келуі мен жаңа жылдың басталуын, бірлік пен татулықты паш ететін халықтық мереке. Мерекенің басты нышаны — жеті түрлі дәмнен әзірленетін молшылықтың дәмі Наурыз көже.',
    closeups: [
      {
        id: 'nauryz-kozhe',
        title: 'Наурыз көже және ағаш ожау',
        description: 'Жеті дәмнен (ет, сүт, бидай, тұз, май, құрт, су) қайнатылған Наурыз көже, оюлы ағаш астау және қызуы басылмаған бауырсақ.',
        image: '/assets/cultural/nauryz/nauryz_closeup_kozhe.jpg',
        imageWebp: '/assets/cultural/nauryz/nauryz_closeup_kozhe.webp',
        culturalDetails: 'Наурыз көженің 7 дәмі өмірдің жеті қасиетін (өсу, бақыт, байлық, денсаулық, парасат, абырой, қамқорлық) білдіреді. Ағаштан ойылған астау мен ожау — ежелгі қазақ асханасының экологиялық таза бұйымдары.',
        aspectRatio: '4:3'
      },
      {
        id: 'nauryz-serving',
        title: 'Ақсақалға көже ұсыну әдебі',
        description: 'Кимешекті әженің оюлы ожаумен астаудан көже алып, төрдегі қазыналы ақсақалға қос қолдап тостаған ұсыну сәті.',
        image: '/assets/cultural/nauryz/nauryz_serving_kozhe.jpg',
        imageWebp: '/assets/cultural/nauryz/nauryz_serving_kozhe.webp',
        culturalDetails: 'Қазақ әдебінде үлкенге ас ұсыну ерекше құрметпен атқарылады. Отанасы дәмді екі қолдап береді, ал ақсақал екі қолын тосып қабылдап, ризашылықпен батасын дайындайды.',
        aspectRatio: '1:1'
      }
    ],
    keyframes: [
      {
        id: 'stage-1',
        stageIndex: 0,
        title: 'Мерекелік дастарқан басындағы басқосу',
        stageLabel: '1-кезең: Ортақ дастарқан',
        description: 'Киіз үй ішіндегі дөңгелек дастарқан басына үш буын өкілдері жиналып, бір-біріне жаңа жылдық ізгі тілектерін айтады.',
        image: '/assets/cultural/nauryz/nauryz_cover.jpg',
        imageWebp: '/assets/cultural/nauryz/nauryz_cover.webp',
        actionDetails: 'Ақ кимешекті әже ожаумен ыстық көжені тостағандарға құяды, жасы үлкен ата төрде батасын береді.',
        promptNote: 'Nano Banana master: Family gathering in yurt around festive dastarkhan.'
      },
      {
        id: 'stage-2',
        stageIndex: 1,
        title: 'Көже ұсыну және ақсақалға құрмет',
        stageLabel: '2-кезең: Көже ұсыну',
        description: 'Әже ағаш ожаумен астаудан буы бұрқыраған көжені тостағанға құйып, қос қолымен ақсақалға ұсынады.',
        image: '/assets/cultural/nauryz/nauryz_serving_kozhe.jpg',
        imageWebp: '/assets/cultural/nauryz/nauryz_serving_kozhe.webp',
        actionDetails: 'Ақсақал риза көңілмен екі қолын жайып тостағанды қабылдайды; дастарқанда бауырсақтар мен ұлттық дәмдер қойылған.',
        promptNote: 'Nano Banana reference: Grandmother gracefully serving Nauryz kozhe to elder grandfather.'
      }
    ],
    veoMotion: {
      posterUrl: '/media/nauryz/serving-kozhe-poster.webp',
      posterWebp: '/media/nauryz/serving-kozhe-poster.webp',
      durationSeconds: 7,
      title: 'Наурыз: Көже ұсыну және бата',
      actionDescription: 'Кимешек киген қазақ әжесі ағаш ожаумен астаудан буы бұрқыраған Наурыз көжені алып, ағаш тостағанға байыппен құяды да, қос қолымен төрдегі ақсақалға ұсынады. Ата ризашылықпен екі қолын жайып, жылы күлімдейді.',
      cameraMotion: 'Дастарқан деңгейіндегі жұмсақ жақындау (Slow tracking push-in), ыстық тағам буының табиғи қозғалысы.',
      prompt: 'Cinematic authentic Kazakh family celebrating Nauryz inside a colorful decorated felt yurt. A dignified elderly Kazakh grandmother in an immaculate white embroidered kimeshek headdress gently ladles rich steaming Nauryz kozhe with a hand-carved wooden ozhau into a wooden bowl (tostagan). She hands the bowl with both hands in deep cultural respect to a smiling grandfather with a white beard wearing a velvet embroidered chapan. Beside them, children eat fresh golden baursaks. Soft warm morning daylight filtering through yurt lattice, steam rising from food, photorealistic textures, 4K 24fps.'
    },
    provenance: {
      generator: 'Nano Banana (Gemini Image Model)',
      synthIdNoted: true,
      researchSources: [
        'UNESCO. Nawrouz Representative List of the Intangible Cultural Heritage of Humanity, 2024.',
        'ҚР Мәдениет министрлігі. «Наурыз мейрамының тұжырымдамасы мен ұлттық тағамдар дәстүрі».'
      ],
      disclaimer: 'Бұл визуализация — Наурыз мерекесінің дәстүрлі дастарқан мәдениетін көрсететін оқу реконструкциясы.'
    }
  },

  tusaukeser: {
    id: 'tusaukeser',
    traditionId: 'tusaukeser',
    name: 'Тұсаукесер',
    subtitle: 'Ақ жол тілеу және адалдық ұстанымы',
    coverImage: '/assets/cultural/tusaukeser/tusaukeser_cover.jpg',
    coverImageWebp: '/assets/cultural/tusaukeser/tusaukeser_cover.webp',
    altText: 'Тұсаукесер рәсімі – баланың аяғындағы ала жіпті кесу және алғашқы қадамдар',
    overviewNarrative: 'Тұсаукесер — тәй-тәй баса бастаған сәбидің жүрісі жылдам, аяғы жеңіл, өмір жолы ақ болсын деген тілекпен өткізілетін рәсім. Ала жіпті кесу — өмірде біреудің хақысын жемесін, адал болсын деген халықтық өсиет.',
    closeups: [
      {
        id: 'ala-zhip-detail',
        title: 'Ала жіп және ақ жол',
        description: 'Ақ және қара жүннен өрілген ала жіп — адалдықтың белгісі. Ақ жол матасы баланың болашағы жарық болсын деген ниетті білдіреді.',
        image: '/assets/cultural/tusaukeser/tusaukeser_cover.jpg',
        imageWebp: '/assets/cultural/tusaukeser/tusaukeser_cover.webp',
        culturalDetails: 'Қазақта «Біреудің ала жібін аттама» деген киелі қағида бар. Тұсауды жүрісі ширақ, елге сыйлы адамға кескізеді. Тұсауы кесілген баланың аяғына шашу шашылып, жақсылық тіленеді.',
        aspectRatio: '16:9'
      }
    ],
    keyframes: [
      {
        id: 'stage-1',
        stageIndex: 0,
        title: 'Ала жіпті байлау және дайындық',
        stageLabel: '1-кезең: Дайындық: ала жіп',
        description: 'Сәбидің аяғына ақ пен қарадан есілген жіп тұсау ретінде сегіздік формасында байланады.',
        image: '/assets/cultural/tusaukeser/tusaukeser_cover.jpg',
        imageWebp: '/assets/cultural/tusaukeser/tusaukeser_cover.webp',
        actionDetails: 'Сәби ақ жол төсенішінің басына қойылып, екі жағынан ата-анасы демеп тұрады.',
        promptNote: 'Nano Banana keyframe: Toddler prepared with ala zhip on white runner.'
      },
      {
        id: 'stage-2',
        stageIndex: 1,
        title: 'Тұсауды кесу және ақ тілек',
        stageLabel: '2-кезең: Тұсауды кесу',
        description: 'Құрметті әже қайшымен немесе пышақпен ала жіпті кесіп, «Қадамың құтты болсын!» деп бата береді.',
        image: '/assets/cultural/tusaukeser/tusaukeser_cover.jpg',
        imageWebp: '/assets/cultural/tusaukeser/tusaukeser_cover.webp',
        actionDetails: 'Жіп кесілген сәтте балаға жол ашылып, жиналған жұрт қошеметтейді.',
        promptNote: 'Nano Banana keyframe: Cutting the cord with scissors.'
      }
    ],
    veoMotion: {
      posterUrl: '/assets/cultural/tusaukeser/tusaukeser_cover.jpg',
      posterWebp: '/assets/cultural/tusaukeser/tusaukeser_cover.webp',
      durationSeconds: 6,
      title: 'Тұсаукесер: Алғашқы еркін қадам',
      actionDescription: 'Қарт әже өткір қайшымен кішкентай етіктерді қысып тұрған қара-ақ ала жіпті жеңіл кесіп тастайды. Жіп екіге бөлініп ақ матаға құлайды; сәби ата-анасының қолын ұстап, қуана алға нық қадам жасайды; шашу тәттілері баланың алдына жауып түседі.',
      cameraMotion: 'Еден деңгейіндегі төмен ракурс (Low angle floor dolly), сәби қадамына ілесіп алға жылжу.',
      prompt: 'Cinematic slow-motion shot of Kazakh Tusaukeser ceremony. Close-up on the small feet of a one-year-old Kazakh child wearing embroidered felt boots on a white fabric runner. Weathered caring hands of a Kazakh grandmother in traditional rings cut a twisted black-and-white wool cord (ala zhip) with antique scissors. The cord separates and falls away. The child takes their first liberated step forward, supported gently by parents hands, while colorful sweets and coins (shashu) scatter gracefully on the runner. Warm cinematic yurt lighting, shallow depth of field, 4K photorealistic.'
    },
    provenance: {
      generator: 'Nano Banana (Gemini Image Model)',
      synthIdNoted: true,
      researchSources: [
        'Туребаева А. Қазақ халқының ежелгі мерекелері мен салт-дәстүрлері, 2026.',
        'ҚР Мәдениет және ақпарат министрлігі. «Қазақтың отбасылық салт-дәстүрлері: Тұсаукесер».'
      ],
      disclaimer: 'Бұл визуализация — баланың тәй-тәй басу рәсімінің оқу моделіне қосымша визуалды реконструкция.'
    }
  },

  'besikke-salu': {
    id: 'besikke-salu',
    traditionId: 'besikke-salu',
    name: 'Бесікке салу',
    subtitle: 'Сәбиді алғаш бесікке бөлеу',
    coverImage: '/assets/scene_besikke_salu.png',
    coverImageWebp: '/assets/scene_besikke_salu.png',
    altText: 'Бесікке салу рәсімі – ағаш бесікті жабдықтау және сәбиді бөлеу',
    overviewNarrative: 'Бесікке салу — жаңа туған сәбиді таза ағаштан жасалған тербелмелі бесікке алғаш рет бөлеу салты. Рәсімде отбасы амандық тілеп, сәбиге арнап ақ тілектер мен бесік жыры орындалады.',
    closeups: [
      {
        id: 'besik-woodcraft',
        title: 'Қазақтың ағаш бесігі',
        description: 'Қайың не қарағайдан шабылып, ою-өрнекпен әшекейленген тербелмелі бесік құрылымы.',
        image: '/assets/scene_besikke_salu.png',
        imageWebp: '/assets/scene_besikke_salu.png',
        culturalDetails: 'Бесіктің негізгі бөліктері: екі басы, арқалығы, шабағы, табаны, жөргегі, шүмегі және түбегі. Бесік тазалық пен бала денсаулығына бейімделген халықтық гигиенаның озық өнертабысы.',
        aspectRatio: '4:3'
      }
    ],
    keyframes: [
      {
        id: 'stage-1',
        stageIndex: 0,
        title: 'Бесікті жабдықтау және аластау',
        stageLabel: '1-кезең: Бесікті жабдықтау',
        description: 'Бесікті аршаның түтінімен аластап, жұмсақ көрпешелері мен төсеніштерін реттейді.',
        image: '/assets/scene_besikke_salu.png',
        imageWebp: '/assets/scene_besikke_salu.png',
        actionDetails: 'Әулеттің үлкен әжесі бесікке «тыштыма» салып, жақсылық тілейді.',
        promptNote: 'Veo reference: Preparing and purifying the traditional wooden cradle.'
      }
    ],
    veoMotion: {
      posterUrl: '/assets/scene_besikke_salu.png',
      posterWebp: '/assets/scene_besikke_salu.png',
      durationSeconds: 8,
      title: 'Бесікке салу: Баланы бөлеу және тербету',
      actionDescription: 'Көп бала өсірген дана әже жаңа туған сәбиді құндақтап, ағаш бесікке жатқызады. Тартпа бауларын байыппен бекітіп, үстіне өрнекті жабуын жабады да, қолымен ақырын тербетіп бесік жырын бастайды.',
      cameraMotion: 'Жоғарыдан бесікке қарай жұмсақ еңкею (Slow high-angle tilt down), жылы интимді отбасылық жарық.',
      prompt: 'Cinematic cultural Kazakh ceremony Besikke salu inside a warm authentic yurt. A gentle elderly Kazakh grandmother with loving eyes wearing a white kimeshek swaddles a newborn infant in soft linen and carefully places them into a hand-carved wooden Kazakh rocking cradle (besik) decorated with red qoshqarmuyiz carvings. The mother and relatives watch with deep maternal warmth. The grandmother gently rocks the wooden cradle with a rhythmic hand while singing a silent lullaby. Soft sunbeams pouring through the yurt shanyraq, photorealistic cloth physics, 4K film.'
    },
    provenance: {
      generator: '3D GLB моделі & этнографиялық зерттеу',
      synthIdNoted: false,
      researchSources: [
        'ҚР Ұлттық музейі. «Қазақ бесігінің құрылымы мен жасалу технологиясы» (656).',
        'Ақын Сара мемориалдық музейінің этнографиялық қоры.'
      ],
      disclaimer: 'Бұл көрініс 3D сандық реконструкциясы мен этнографиялық зерттеулер негізінде әзірленген.'
    }
  },

  'syrga-salu': {
    id: 'syrga-salu',
    traditionId: 'syrga-salu',
    name: 'Сырға салу',
    subtitle: 'Отбасылар келісімінің белгісі',
    coverImage: '/assets/scene_syrga_salu.png',
    coverImageWebp: '/assets/scene_syrga_salu.png',
    altText: 'Сырға салу рәсімі – қалыңдыққа құдалық сырғасын тағу',
    overviewNarrative: 'Сырға салу — екі әулеттің құда түсіп, қызға алтын не күміс сырға тағуы арқылы құдалық келісімін ресми бекіту дәстүрі.',
    closeups: [
      {
        id: 'kazakh-earrings',
        title: 'Дәстүрлі құдалық сырғасы',
        description: 'Күмістен, алтыннан жасалған салпыншақты ай сырғалар мен ақық тастар.',
        image: '/assets/scene_syrga_salu.png',
        imageWebp: '/assets/scene_syrga_salu.png',
        culturalDetails: 'Қазақ зергерлік өнеріндегі сырға түрлері: ай сырға, қоңырау сырға, сүмбіл сырға, тасбақа сырға. Сырға тағылған қыз «атастырылған», «қалыңдық» мәртебесіне ие болады.',
        aspectRatio: '4:3'
      }
    ],
    keyframes: [
      {
        id: 'stage-1',
        stageIndex: 0,
        title: 'Құдалық кездесу және сырға тағу',
        stageLabel: '1-кезең: Сырғаны тағу',
        description: 'Жігіт жағынан келген енесі немесе сыйлы әйел қыздың құлағына салтанатты сырғаны тағады.',
        image: '/assets/scene_syrga_salu.png',
        imageWebp: '/assets/scene_syrga_salu.png',
        actionDetails: 'Қыз ибалықпен басын иіп, екі жақтың аналары бір-бірін құшақтап құттықтайды.',
        promptNote: 'Veo reference: Mother-in-law fastening earrings on the young bride.'
      }
    ],
    veoMotion: {
      posterUrl: '/assets/scene_syrga_salu.png',
      posterWebp: '/assets/scene_syrga_salu.png',
      durationSeconds: 7,
      title: 'Сырға салу: Құдалық сыйлығы',
      actionDescription: 'Күйеу жігіттің анасы ерекше мейіріммен жас қалыңдықтың құлағына күміс салпыншақты сырғаны тағады. Қыздың ұяң жүзіне күлкі үйіріліп, анасының қолын сүйеді; әйелдер қуаныш білдіріп, құшақтасады.',
      cameraMotion: 'Кейіпкерлердің қолдары мен жүздеріне бағытталған орташа-жақын план (Medium close-up dolly), жұмсақ фокус.',
      prompt: 'Cinematic intimate cultural moment of Kazakh Syrga Salu tradition. An elegant mother-in-law in an embroidered velvet vest with intricate silver buttons puts ornate traditional Kazakh filigree silver earrings with dangling pearl drops onto the earlobes of a beautiful young Kazakh bride. The bride blushes modestly with gentle downcast eyes and a warm smile. Family women gathered around inside a room adorned with rich Kazakh textiles look on with heartfelt joy. Smooth camera slider, soft lighting, 4K film.'
    },
    provenance: {
      generator: '3D GLB моделі & этнографиялық зерттеу',
      synthIdNoted: false,
      researchSources: [
        'ҚР Мәдениет және ақпарат министрлігі, «Сырға салу дәстүрі», 2025.',
        'ҚР Ұлттық музейінің дәстүрлі зергерлік өнер қоры.'
      ],
      disclaimer: 'Бұл сахна 3D GLB сандық моделі мен этнографиялық зерттеулерге негізделген білім беру реконструкциясы болып табылады.'
    }
  },

  'bata-beru': {
    id: 'bata-beru',
    traditionId: 'bata-beru',
    name: 'Бата беру',
    subtitle: 'Ізгі тілек пен үлкенді құрметтеу',
    coverImage: '/assets/scene_bata_beru.png',
    coverImageWebp: '/assets/scene_bata_beru.png',
    altText: 'Бата беру – ақсақалдың дастарқан басында ақ тілек арнауы',
    overviewNarrative: 'Бата беру — жасы үлкен қадірлі адамның жиналған қауымға, жас отбасына немесе жолаушыға ізгі ниет, ақ тілек пен рухани демеу білдіретін халықтық даналық үлгісі.',
    closeups: [
      {
        id: 'bata-hands',
        title: 'Бата берушінің алақаны',
        description: 'Үлкен кісінің ашық алақандары, мөр жүзігі және дастарқан төрі.',
        image: '/assets/scene_bata_beru.png',
        imageWebp: '/assets/scene_bata_beru.png',
        culturalDetails: 'Қазақта «Жаңбырменен жер көгерер, батаменен ел көгерер» деген нақыл бар. Бата соңында барлығы «Әумин!» деп бетін сипайды.',
        aspectRatio: '4:3'
      }
    ],
    keyframes: [
      {
        id: 'stage-1',
        stageIndex: 0,
        title: 'Ақсақалдың бата беруі',
        stageLabel: '1-кезең: Ізгі тілек',
        description: 'Төрде отырған ақсақал екі алақанын кеуде тұсына жайып, ақ тілегін жеткізеді.',
        image: '/assets/scene_bata_beru.png',
        imageWebp: '/assets/scene_bata_beru.png',
        actionDetails: 'Барлық отбасы мүшелері де қол жайып, тыныштықта тыңдайды.',
        promptNote: 'Veo reference: Venerable elder with open palms giving blessing.'
      }
    ],
    veoMotion: {
      posterUrl: '/assets/scene_bata_beru.png',
      posterWebp: '/assets/scene_bata_beru.png',
      durationSeconds: 7,
      title: 'Бата беру: Ақсақал батасы',
      actionDescription: 'Ақ сақалды дана қария алақандарын ашып бата сөздерін мәнерлеп айтады. Барлық отбасы мүшелері құрметпен қол жайып отыр; бата біткен сәтте барлығы бір мезетте алақандарымен бетін сипап «Әумин» жасайды.',
      cameraMotion: 'Қарияның тұлғасына баяу бағытталған статикалық салтанатты план (Slow zoom in on face and hands).',
      prompt: 'Cinematic quiet Kazakh cultural moment of Bata Beru blessing. A venerable Kazakh elder (aqsaqal) with a long natural silver beard and wise wrinkled eyes, dressed in an embroidered wool chapan and fur-trimmed hat, holds his open weathered hands cupped upwards in traditional prayer at the head of a festive dastarkhan. The surrounding multi-generational family holds their palms open in reverent silence. At the end, the elder gently brings his hands down his face in the final "Amin" gesture. Warm intimate yurt lighting, authentic steam from tea bowls, 4K film.'
    },
    provenance: {
      generator: '3D GLB моделі & этнографиялық зерттеу',
      synthIdNoted: false,
      researchSources: [
        'ҚР Мемлекеттік деректер қоры, «Бата беру дәстүрі мен түрлері», 2024.',
        'Ақтөбе облыстық тілдер басқармасы мәдени материалдары.'
      ],
      disclaimer: 'Бұл сахна 3D GLB сандық моделі мен этнографиялық зерттеулерге негізделген білім беру реконструкциясы болып табылады.'
    }
  },

  shashu: {
    id: 'shashu',
    traditionId: 'shashu',
    name: 'Шашу',
    subtitle: 'Қуанышты бөлісу',
    coverImage: '/assets/scene_shashu.png',
    coverImageWebp: '/assets/scene_shashu.png',
    altText: 'Шашу рәсімі – қуанышты күні тәттілер мен тиын шашу',
    overviewNarrative: 'Шашу — үлкен қуанышта (той, келін түсу, нәресте тууы) қонақтарға, балаларға тәттілер, құрт, тиындар шашу салты. Бұл қуанышты бөлісу мен молшылық тілеудің белгісі.',
    closeups: [
      {
        id: 'shashu-sweets',
        title: 'Шашу ыдысы мен тәттілер',
        description: 'Ағаш астауға толтырылған құрт, кәмпиттер, бауырсақтар және күміс тиындар.',
        image: '/assets/scene_shashu.png',
        imageWebp: '/assets/scene_shashu.png',
        culturalDetails: 'Шашылған тәттіні жинап алу — сол шаңырақтың құты мен берекесін үйіне апару, жақсылыққа ортақтасу деген сеніммен байланысты.',
        aspectRatio: '4:3'
      }
    ],
    keyframes: [
      {
        id: 'stage-1',
        stageIndex: 0,
        title: 'Тәттілерді шашу сәті',
        stageLabel: '1-кезең: Шашу шашу',
        description: 'Әжелер мен аналар ағаш ыдыстан тәттілерді уыстап алып, жоғары шашады.',
        image: '/assets/scene_shashu.png',
        imageWebp: '/assets/scene_shashu.png',
        actionDetails: 'Тәттілер ауада ұшып, кілемге шашылады, балалар таласа-тармаса жинайды.',
        promptNote: 'Veo reference: Dynamic slow-motion trajectory of sweets scattering in festive yurt.'
      }
    ],
    veoMotion: {
      posterUrl: '/assets/scene_shashu.png',
      posterWebp: '/assets/scene_shashu.png',
      durationSeconds: 6,
      title: 'Шашу: Тәттілер шашу кинематикасы',
      actionDescription: 'Күлімдеген қазақ анасы ағаш астаудан уыстаған түрлі-түсті кәмпиттер мен құртты жоғары қарай серпіп шашады. Тәттілер баяу қозғалыста ауада қалықтап кілемге түседі; күлген балалар жүгіріп келіп, тәттілерді қуана теріп алады.',
      cameraMotion: 'Баяу қозғалысты кинематикалық ракурс (Slow motion 120fps camera pan), тәттілер траекториясына ілесу.',
      prompt: 'High-speed cinematic 120fps slow-motion shot of Kazakh Shashu celebration ritual. A joyful Kazakh mother in a velvet green kamzol with golden embroidery casts a handful of colorful wrapped sweets, white dried kurt balls, and silver coins upward in a dramatic glittering arc. The sweets tumble weightlessly through the air inside a festive yurt, catching golden sunlight. Below on the richly patterned tekemet carpet, happy Kazakh children and smiling elders laugh and eagerly reach out to catch the festive blessing. Photorealistic, 4K film look.'
    },
    provenance: {
      generator: '3D GLB моделі & этнографиялық зерттеу',
      synthIdNoted: false,
      researchSources: [
        'ҚР Сыртқы істер министрлігі. «Қазақстанның бай мәдени мұрасы: Шашу».',
        'Абай институты. «Салт-дәстүрлер қоры».'
      ],
      disclaimer: 'Бұл сахна 3D GLB сандық моделі мен этнографиялық зерттеулерге негізделген білім беру реконструкциясы болып табылады.'
    }
  },

  qymyzmuryndyq: {
    id: 'qymyzmuryndyq',
    traditionId: 'qymyzmuryndyq',
    name: 'Қымызмұрындық',
    subtitle: 'Маусымның алғашқы қымызынан дәм тату',
    coverImage: '/assets/scene_qymyzmuryndyq.png',
    coverImageWebp: '/assets/scene_qymyzmuryndyq.png',
    altText: 'Қымызмұрындық дәстүрі – жайлауда алғашқы қымызды сабадан құю',
    overviewNarrative: 'Қымызмұрындық — маусымның алғашқы биесі сауылып, алғашқы қымыз ашытылғанда, ауыл-аймақты шақырып, дәм татқызатын көктемгі-жазғы малшы дәстүрі.',
    closeups: [
      {
        id: 'saba-pispek',
        title: 'Былғары саба мен піспек',
        description: 'Жылқы терісінен тігілген дәстүрлі саба және қымызды пісуге арналған ағаш піспек.',
        image: '/assets/scene_qymyzmuryndyq.png',
        imageWebp: '/assets/scene_qymyzmuryndyq.png',
        culturalDetails: 'Саба жылқы терісін ыстау, өңдеу арқылы жасалады. Онда ашыған қымыз мың мәрте пісіліп, ерекше шипалы әрі жұпар иіске ие болады.',
        aspectRatio: '4:3'
      }
    ],
    keyframes: [
      {
        id: 'stage-1',
        stageIndex: 0,
        title: 'Қымыз құю және ұсыну',
        stageLabel: '1-кезең: Қымыз құю',
        description: 'Сабадағы қымыз ағаш тегенеге құйылып, ожаумен көпіршітіліп, тостағандарға бөлінеді.',
        image: '/assets/scene_qymyzmuryndyq.png',
        imageWebp: '/assets/scene_qymyzmuryndyq.png',
        actionDetails: 'Қонақтар жайлау самалында саф қымыздан дәм татып, ақ тілек айтады.',
        promptNote: 'Veo reference: Pouring frothy qymyz from leather saba into wooden bowls.'
      }
    ],
    veoMotion: {
      posterUrl: '/assets/scene_qymyzmuryndyq.png',
      posterWebp: '/assets/scene_qymyzmuryndyq.png',
      durationSeconds: 8,
      title: 'Қымызмұрындық: Алғашқы сауын және қымыз ұсыну',
      actionDescription: 'Көкорай жайлаудағы киіз үй алдында жылқышы үлкен былғары сабадағы қымызды ұзын ағаш піспекпен ырғақты қозғалыспен піседі. Содан соң аппақ көбігі бұрқыраған салқын қымызды ағаш ожаумен оюлы тостағандарға құйып, жиналған қауымға екі қолымен ұсынады.',
      cameraMotion: 'Жайлау көрінісінен саба мен тостағанға қарай жақындау (Establishing scenic crane to close-up).',
      prompt: 'Cinematic 4K scene of Kazakh Qymyzmuryndyq seasonal celebration on an idyllic green mountain pasture (jailau). A skilled Kazakh herdsman rhythmically churns a large hand-stitched leather saba vessel filled with fermented mare milk using a wooden pispek churn. He smoothly ladles the rich frothy white qymyz using an ozhau ladle into finely polished wooden bowls (tostagan). He presents a full bowl with both hands to eager guests sitting outside a white yurt with green rolling hills and grazing mares in the background. Natural morning sunlight, cool mountain breeze, photorealistic liquid dynamics.'
    },
    provenance: {
      generator: '3D GLB моделі & этнографиялық зерттеу',
      synthIdNoted: false,
      researchSources: [
        'Шығыс Қазақстан облыстық музей-қорығы, «Қымызмұрындық дәстүрі», 2025.',
        'ҚР Ұлттық ғылым академиясы. «Қазақтың дәстүрлі қымыз мәдениеті».'
      ],
      disclaimer: 'Бұл сахна 3D GLB сандық моделі мен этнографиялық зерттеулерге негізделген білім беру реконструкциясы болып табылады.'
    }
  }
};

export function getCulturalMedia(traditionId: string): CulturalMediaItem | undefined {
  return CULTURAL_MEDIA_DATA[traditionId];
}
