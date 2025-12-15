
export type Gender = 'female' | 'male';

export type TaskMode = 'generation' | 'editing';

// Replaces Midjourney ReferenceType with Gemini Editing Intents
export type EditingIntent = 'general' | 'high_denoising' | 'keep_subject' | 'keep_composition';

export interface ReferenceImage {
  id: string;
  url: string;
  intent: EditingIntent;
}

export interface PortraitState {
  taskMode: TaskMode; // New: Switch between Gen/Edit
  gender: Gender;
  referenceImages: ReferenceImage[]; 
  nationality: string;
  age: string;
  bodyType: string;
  role: string;
  faceShape: string;
  eyeGaze: string;
  hairColor: string;
  hairStyle: string;
  appearance: string;
  clothing: string;
  clothingDetail: string;
  accessories: string;
  action: string;
  hands: string;
  composition: string;
  era: string;
  environment: string;
  lighting: string;
  colorPalette: string;
  camera: string;
  artStyle: string;
  mood: string;
  aspectRatio: string;
  quality: string[];
  preservation: string[]; // New: For editing mode
  negativePrompt: string;
}

export type OutputLanguage = 'en' | 'zh';
export type OutputFormat = 'text' | 'json' | 'yaml' | 'markdown';

export interface PromptOption {
  label: string;
  value: string;
  gender?: Gender; 
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
