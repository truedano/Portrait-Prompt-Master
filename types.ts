export type OutputLanguage = 'en' | 'zh';
export type OutputFormat = 'text' | 'json' | 'yaml' | 'markdown';
export type TaskMode = 'generation' | 'video_generation' | 'editing';

export interface OptionItem {
  value: string;
  label: string;
  gender?: 'male' | 'female'; // Optional gender constraint
  image?: string; // Optional preview image
}

export type PromptOption = OptionItem;

export interface OptionCategory {
  id: string;
  label: string; // Display name
  description?: string; // Helper text
  options: OptionItem[];
  scope?: 'global' | 'subject';
  multiSelect?: boolean;
}

export type SubjectType = 'human' | 'animal' | 'vehicle' | 'scenery' | 'infographic';

export type Gender = 'male' | 'female'; // | 'other' in future?

export interface SubjectConfig {
  id: string; // Unique identifier for React keys
  subjectType: SubjectType;
  gender?: Gender; // Only for humans

  // Human Attributes
  nationality: string | string[];
  age: string | string[];
  role: string | string[];
  bodyType: string | string[];
  faceShape: string | string[];
  eyeGaze: string | string[];
  hairColor: string | string[];
  hairStyle: string | string[];
  appearance: string | string[];
  clothing: string | string[];
  clothingDetail: string | string[];
  accessories: string | string[];
  action: string | string[];
  hands: string | string[];
  mood: string | string[];

  // Animal Attributes
  animalSpecies: string;
  animalFur: string | string[];

  // Vehicle Attributes
  vehicleType: string;
  vehicleColor: string | string[];

  // Infographic Attributes
  chartType: string;
  infographicStyle: string;
  infographicContent: string;
}

export interface ReferenceImage {
  id: string;
  url: string;
  intent: 'general' | 'structure' | 'style'; // For future extensions (ControlNet)
}

export interface GlobalConfig {
  taskMode: TaskMode;

  // Scene & Environment
  composition: string | string[];
  era: string; // Time period
  environment: string | string[]; // Background/Location

  // Lighting & Style (Global overrides or base)
  lighting: string | string[];
  colorPalette: string;
  camera: string | string[];
  artStyle: string | string[];

  // Technical
  aspectRatio: string;
  cameraMovement: string | string[]; // For Video
  motionStrength: string; // For Video

  quality: string[]; // "Masterpiece", "8k" etc.
  preservation: string[]; // "Preserve Face" etc. (Inpainting)
  negativePrompt: string;
  useNegativePrompt: boolean;
  referenceImages: ReferenceImage[];

  interaction: string | string[]; // New field for multi-subject interaction
}

export interface PortraitState {
  global: GlobalConfig;
  subjects: SubjectConfig[];

  activeSubjectId: string; // The ID of the currently selected subject in UI
}
