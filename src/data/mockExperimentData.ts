export interface ComparisonMetric {
  metric: string;
  unit: string;
  textGroup: number | null;
  digitalGroup: number | null;
  note?: string;
}

export const REAL_EMPTY_STATE = {
  isConfigured: false,
  statusNotice: 'Нақты зерттеу нәтижелері енгізілген жоқ.',
  statusDetails: '«Зерде» ғылыми ережелері мен авторлық шешімге сай: прототип пен әдістеме толық дайын, ал нақты қатысушылармен (7-сынып оқушылары) салыстырмалы сынақ өткізіліп, күнделікке тіркелгенге дейін қорытынды ұпайлар «—» белгісімен сақталады.',
  metrics: [
    { metric: 'Қатысушы саны', unit: 'оқушы', textGroup: null, digitalGroup: null, note: 'Дерек күтілуде' },
    { metric: 'Екі тесті де аяқтағандар', unit: 'оқушы', textGroup: null, digitalGroup: null, note: 'Дерек күтілуде' },
    { metric: 'Бастапқы орташа ұпай', unit: '/ 10', textGroup: null, digitalGroup: null, note: 'Дерек күтілуде' },
    { metric: 'Қорытынды орташа ұпай', unit: '/ 10', textGroup: null, digitalGroup: null, note: 'Дерек күтілуде' },
    { metric: 'Орташа өсім (Post - Pre)', unit: 'ұпай', textGroup: null, digitalGroup: null, note: 'Дерек күтілуде' },
    { metric: '1 аптадан кейінгі сақталу ұпайы', unit: '/ 10', textGroup: null, digitalGroup: null, note: 'Дерек күтілуде' },
    { metric: 'Қызығушылық деңгейінің өзгерісі', unit: '/ 5', textGroup: null, digitalGroup: null, note: 'Дерек күтілуде' },
    { metric: 'Техникалық ақау саны', unit: 'жағдай', textGroup: null, digitalGroup: null, note: 'Дерек күтілуде' }
  ]
};

export const ILLUSTRATIVE_SIMULATION_DATA = {
  isConfigured: true,
  simulationNotice: 'ЕСКЕРТУ: Бұл тек модельдік, көрнекі үлгі ретінде берілген көрсеткіштер. Ол ғылыми эксперименттің нақты нәтижесі болып табылмайды.',
  metrics: [
    { metric: 'Қатысушы саны', unit: 'оқушы', textGroup: 15, digitalGroup: 15, note: 'Тең бөлінген топтар' },
    { metric: 'Екі тесті де аяқтағандар', unit: 'оқушы', textGroup: 15, digitalGroup: 14, note: '1 оқушы техникалық ақауға байланысты толықтырмады' },
    { metric: 'Бастапқы орташа ұпай', unit: '/ 10', textGroup: 4.2, digitalGroup: 4.3, note: 'Топтардың бастапқы білім деңгейі шамалас' },
    { metric: 'Қорытынды орташа ұпай', unit: '/ 10', textGroup: 6.8, digitalGroup: 8.5, note: '15 минуттық оқудан кейін' },
    { metric: 'Орташа өсім (Post - Pre)', unit: 'ұпай', textGroup: 2.6, digitalGroup: 4.2, note: 'Цифрлық топта өсім жоғарырақ көрінуі мүмкін' },
    { metric: '1 аптадан кейінгі сақталу ұпайы', unit: '/ 10', textGroup: 5.4, digitalGroup: 7.6, note: 'Ұзақ мерзімді есте сақтау көрсеткіші' },
    { metric: 'Қызығушылық орташа бағасы', unit: '/ 5', textGroup: 3.4, digitalGroup: 4.7, note: 'AR мен ЖИ-ге оқушылар қызығушылығы жоғары' },
    { metric: 'Техникалық ақау саны', unit: 'жағдай', textGroup: 0, digitalGroup: 3, note: 'Камераны рұқсат ету, маркерді жоғалту мәселелері' }
  ],
  chartData: [
    { stage: 'Бастапқы тест (Pre)', textGroup: 4.2, digitalGroup: 4.3 },
    { stage: 'Қорытынды тест (Post)', textGroup: 6.8, digitalGroup: 8.5 },
    { stage: '1 аптадан кейін (Retention)', textGroup: 5.4, digitalGroup: 7.6 }
  ],
  growthData: [
    { name: 'Мәтіндік топ', gain: 2.6, retentionLoss: -1.4, color: '#F3BE5E' },
    { name: 'ЖИ + AR тобы', gain: 4.2, retentionLoss: -0.9, color: '#00BFFF' }
  ],
  interestDistribution: [
    { score: '1 балл (Өте төмен)', textCount: 1, digitalCount: 0 },
    { score: '2 балл (Төмен)', textCount: 3, digitalCount: 0 },
    { score: '3 балл (Орташа)', textCount: 6, digitalCount: 2 },
    { score: '4 балл (Жақсы)', textCount: 4, digitalCount: 5 },
    { score: '5 балл (Өте жоғары)', textCount: 1, digitalCount: 7 }
  ]
};
