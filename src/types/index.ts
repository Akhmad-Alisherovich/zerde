export interface Tradition {
  id: string;
  code: string; // N01, K01, T01, B01, A01, E01
  name: string;
  subtitle: string;
  coreValue: string; // Құндылық
  description: string;
  deepMeaning: string;
  reflectionQuestion: string;
  source: string;
  sourceRef: number; // 1, 2, 3, 4
  image: string;
  hasArScenario: boolean;
  arScenarioId?: string;
  tags: string[];
}

export interface ARScenario {
  id: string;
  traditionId: string;
  name: string;
  subtitle: string;
  sceneDescription: string;
  keyAction: string;
  studentTask: string;
  acceptanceCriteria: string;
  markerType: string;
  imagePreview: string;
  hologramColor: string;
  interactiveObjects: {
    name: string;
    description: string;
    coordinates?: string;
  }[];
}

export interface ResearchMethod {
  id: string;
  title: string;
  kzTitle: string;
  description: string;
  roleInProject: string;
  iconName: string;
  details: string[];
}

export interface ExperimentGroupData {
  groupName: string;
  description: string;
  participantCount: number | null;
  completedBothTests: number | null;
  preTestAverage: number | null; // out of 10
  postTestAverage: number | null; // out of 10
  gain: number | null; // post - pre
  retentionOneWeek: number | null; // out of 10
  interestScore: number | null; // 1 to 5
  technicalIssuesCount: number | null;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  sourceCode?: string;
  sourceRef?: number;
  reflectionPrompt?: string;
  confidenceScore?: number;
  isOutOfScope?: boolean;
}
