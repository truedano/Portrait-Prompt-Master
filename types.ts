
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

export interface PortraitState {
  taskMode: TaskMode;
  subjectType: SubjectType;
  gender: Gender;
  referenceImages: ReferenceImage[];
  nationality: string;
  age: string;

  // Multi-selectable fields changed to string[]
  bodyType: string[];
  role: string;
  faceShape: string;
  eyeGaze: string;
  hairColor: string[];
  hairStyle: string[];
  appearance: string[];
  clothing: string[];
  clothingDetail: string[];
  accessories: string[];

  action: string;
  hands: string;
  composition: string;
  era: string;
  environment: string;

  // Multi-selectable fields
  lighting: string[];
  colorPalette: string;
  camera: string;
  artStyle: string[];
  mood: string[];

  aspectRatio: string;
  cameraMovement: string;
  motionStrength: string;


  // Animal / Vehicle Specifics
  animalSpecies: string;
  animalFur: string[];
  vehicleType: string;
  vehicleColor: string;

  quality: string[];
  preservation: string[];
  negativePrompt: string;
  useNegativePrompt: boolean;
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
  id: keyof PortraitState;
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
