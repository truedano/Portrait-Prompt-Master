
export type Gender = 'female' | 'male' | undefined;
export type SubjectType = 'human' | 'animal' | 'vehicle' | 'scenery';

export type TaskMode = 'generation' | 'editing' | 'video_generation';

// Replaces Midjourney ReferenceType with Gemini Editing Intents
export type EditingIntent = 'general' | 'high_denoising' | 'keep_subject' | 'keep_composition';

export interface ReferenceImage {
  id: string;
  url: string;
  intent: EditingIntent;
}

export interface SubjectConfig {
  id: string;
  subjectType: SubjectType;
  gender: Gender;
  nationality: string[]; // multi-select
  age: string[]; // multi-select
  role: string[]; // multi-select
  bodyType: string[];
  faceShape: string[];
  eyeGaze: string[];
  hairColor: string[];
  hairStyle: string[];
  appearance: string[];
  clothing: string[];
  clothingDetail: string[];
  accessories: string[];
  action: string[]; // multi-select
  hands: string[]; // multi-select
  mood: string[];

  // Animal / Vehicle Specifics
  animalSpecies: string;
  animalFur: string[];
  vehicleType: string;
  vehicleColor: string;
}

export interface GlobalConfig {
  taskMode: TaskMode;
  composition: string[]; // multi-select
  era: string; // single select
  environment: string[]; // multi-select

  // Multi-selectable fields
  lighting: string[];
  colorPalette: string;
  camera: string[]; // multi-select
  artStyle: string[];

  aspectRatio: string;
  cameraMovement: string[];
  motionStrength: string;

  quality: string[];
  preservation: string[];
  negativePrompt: string;
  useNegativePrompt: boolean;

  referenceImages: ReferenceImage[];
}

export interface PortraitState {
  global: GlobalConfig;
  subjects: SubjectConfig[];
  activeSubjectId: string;
}

export type OutputLanguage = 'en' | 'zh';
export type OutputFormat = 'text' | 'json' | 'yaml' | 'markdown';

export interface PromptOption {
  label: string;
  value: string;
  gender?: Gender;
  image?: string; // URL for visual selector
}

export interface OptionCategory {
  id: string; // Simplified from keyof PortraitState for multi-subject refactor
  label: string;
  options: PromptOption[];
  multiSelect?: boolean;
  description?: string;
}

export type GeneratedImage = {
  url: string;
  loading: boolean;
  error: string | null;
};
