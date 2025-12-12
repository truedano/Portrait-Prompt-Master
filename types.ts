export type Gender = 'female' | 'male';

export interface PortraitState {
  gender: Gender;
  nationality: string;
  age: string;
  bodyType: string; // New: Body Type
  role: string;
  faceShape: string;
  eyeGaze: string; // New: Eye Gaze
  hairColor: string;
  hairStyle: string;
  appearance: string;
  clothing: string;
  clothingDetail: string; // New: Fabric/Texture
  accessories: string;
  action: string;
  hands: string; // New: Hand Interaction
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
  negativePrompt: string;
}

export type OutputLanguage = 'en' | 'zh';
export type OutputFormat = 'text' | 'json' | 'yaml' | 'markdown';

export interface PromptOption {
  label: string;
  value: string;
  gender?: Gender; // Optional: to filter options by gender if needed
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