import React, { useState, useEffect } from 'react';
import { PROMPT_CATEGORIES, QUALITY_TAGS, COMMON_NEGATIVE_PROMPTS } from './constants';
import { PortraitState, Gender, OutputLanguage, OutputFormat, PromptOption } from './types';
import { SelectionCard } from './components/SelectionCard';
import { Accordion } from './components/Accordion';

const App: React.FC = () => {
  // --- State ---
  const [state, setState] = useState<PortraitState>({
    gender: 'female',
    nationality: '',
    age: '',
    bodyType: '', // New
    role: '',
    faceShape: '',
    eyeGaze: '', // New
    hairColor: '',
    hairStyle: '',
    appearance: '',
    clothing: '',
    clothingDetail: '', // New
    accessories: '', 
    action: '',
    hands: '', // New
    composition: '', 
    era: '', 
    environment: '',
    lighting: '',
    colorPalette: '', 
    camera: '',
    artStyle: '',
    mood: '',
    aspectRatio: '',
    quality: ['masterpiece', 'best quality', '8k', 'highly detailed', 'detailed face'],
    negativePrompt: 'nsfw, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blur'
  });

  const [outputLang, setOutputLang] = useState<OutputLanguage>('en');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('text');
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);

  // --- Helpers ---

  const extractLabel = (fullLabel: string, lang: OutputLanguage) => {
    if (lang === 'en') return null;
    return fullLabel.split('(')[0].trim();
  };

  const getTerm = (catId: keyof PortraitState | 'quality', value: string, lang: OutputLanguage): string => {
    if (!value) return '';
    if (lang === 'en') return value;
    if (value.startsWith('random ')) return '隨機 (Random)';

    if (catId === 'quality') {
      const tag = QUALITY_TAGS.find(t => t.value === value);
      return tag ? extractLabel(tag.label, lang)! : value;
    }

    const category = PROMPT_CATEGORIES.find(c => c.id === catId);
    if (category) {
      const option = category.options.find(o => o.value === value);
      if (option) return extractLabel(option.label, lang)!;
    }

    return value;
  };

  // --- Logic ---

  useEffect(() => {
    // 1. Prepare Data Object
    const genderTermEn = state.gender === 'female' ? 'woman' : 'man';
    const genderTermZh = state.gender === 'female' ? '女性' : '男性';
    
    // Construct Subject: e.g., "A Taiwanese teenager woman university student"
    const subjectEn = [
        state.nationality, 
        state.age,
        state.gender === 'female' ? 'woman' : 'man', 
        state.role
    ].filter(Boolean).join(' ');

    const subjectZh = [
        getTerm('nationality', state.nationality, 'zh'),
        getTerm('age', state.age, 'zh'),
        genderTermZh,
        getTerm('role', state.role, 'zh')
    ].filter(Boolean).join('');


    // Collect all fields with their resolved text
    const fields = {
      quality: state.quality.map(q => getTerm('quality', q, outputLang)),
      subject: outputLang === 'en' ? `A ${subjectEn}` : `一個${subjectZh}`,
      nationality: getTerm('nationality', state.nationality, outputLang),
      age: getTerm('age', state.age, outputLang),
      bodyType: getTerm('bodyType', state.bodyType, outputLang), // New
      gender: outputLang === 'en' ? genderTermEn : genderTermZh,
      role: getTerm('role', state.role, outputLang),
      faceShape: getTerm('faceShape', state.faceShape, outputLang),
      eyeGaze: getTerm('eyeGaze', state.eyeGaze, outputLang), // New
      hairColor: getTerm('hairColor', state.hairColor, outputLang),
      hairStyle: getTerm('hairStyle', state.hairStyle, outputLang),
      appearance: getTerm('appearance', state.appearance, outputLang),
      clothing: getTerm('clothing', state.clothing, outputLang),
      clothingDetail: getTerm('clothingDetail', state.clothingDetail, outputLang), // New
      accessories: getTerm('accessories', state.accessories, outputLang),
      action: getTerm('action', state.action, outputLang),
      hands: getTerm('hands', state.hands, outputLang), // New
      composition: getTerm('composition', state.composition, outputLang),
      era: getTerm('era', state.era, outputLang),
      environment: getTerm('environment', state.environment, outputLang),
      lighting: getTerm('lighting', state.lighting, outputLang),
      colorPalette: getTerm('colorPalette', state.colorPalette, outputLang),
      camera: getTerm('camera', state.camera, outputLang),
      artStyle: getTerm('artStyle', state.artStyle, outputLang),
      mood: getTerm('mood', state.mood, outputLang),
      aspectRatio: getTerm('aspectRatio', state.aspectRatio, outputLang),
      negative: state.negativePrompt
    };

    let result = '';

    if (outputFormat === 'json') {
      // JSON Format
      const jsonObj = {
        meta: {
          language: outputLang,
          type: "portrait"
        },
        prompt_elements: {
          quality: fields.quality,
          subject: {
             full_text: fields.subject,
             nationality: fields.nationality,
             age: fields.age,
             body_type: fields.bodyType,
             gender: fields.gender,
             role: fields.role
          },
          features: {
             face: fields.faceShape,
             eyes: fields.eyeGaze,
             hair_color: fields.hairColor,
             hair_style: fields.hairStyle,
             appearance: fields.appearance,
             clothing: fields.clothing,
             texture: fields.clothingDetail,
             accessories: fields.accessories
          },
          scene: {
             action: fields.action,
             hands: fields.hands,
             composition: fields.composition,
             era: fields.era,
             environment: fields.environment,
             lighting: fields.lighting,
             camera: fields.camera
          },
          style: {
             art: fields.artStyle,
             color: fields.colorPalette,
             mood: fields.mood,
             ratio: fields.aspectRatio
          }
        },
        negative_prompt: fields.negative
      };
      result = JSON.stringify(jsonObj, null, 2);

    } else if (outputFormat === 'yaml') {
      // YAML Format
      const qList = fields.quality.length > 0 ? `[${fields.quality.map(q => `"${q}"`).join(', ')}]` : '[]';
      result = `meta:
  language: ${outputLang}
  type: portrait
prompt_elements:
  quality: ${qList}
  subject:
    full_text: "${fields.subject}"
    nationality: "${fields.nationality}"
    age: "${fields.age}"
    body_type: "${fields.bodyType}"
    gender: "${fields.gender}"
    role: "${fields.role}"
  features:
    face: "${fields.faceShape}"
    eyes: "${fields.eyeGaze}"
    hair_color: "${fields.hairColor}"
    hair_style: "${fields.hairStyle}"
    appearance: "${fields.appearance}"
    clothing: "${fields.clothing}"
    texture: "${fields.clothingDetail}"
    accessories: "${fields.accessories}"
  scene:
    action: "${fields.action}"
    hands: "${fields.hands}"
    composition: "${fields.composition}"
    era: "${fields.era}"
    environment: "${fields.environment}"
    lighting: "${fields.lighting}"
    camera: "${fields.camera}"
  style:
    art: "${fields.artStyle}"
    color: "${fields.colorPalette}"
    mood: "${fields.mood}"
    ratio: "${fields.aspectRatio}"
negative_prompt: "${fields.negative}"`;

    } else if (outputFormat === 'markdown') {
      // Markdown Format
      result = `# Portrait Prompt Generation
**Language:** ${outputLang === 'en' ? 'English' : 'Chinese'}

## Core Subject
> ${fields.subject}
> ${fields.bodyType ? `*Body Type: ${fields.bodyType}*` : ''}

## Quality Tags
${fields.quality.map(q => `- ${q}`).join('\n')}

## Negative Prompt
> ${fields.negative || '(None)'}

## Character Details
| Category | Value |
| :--- | :--- |
| **Nationality** | ${fields.nationality || '-'} |
| **Age** | ${fields.age || '-'} |
| **Body Type** | ${fields.bodyType || '-'} |
| **Gender** | ${fields.gender} |
| **Role** | ${fields.role || '-'} |
| **Face** | ${fields.faceShape || '-'} |
| **Eye Gaze** | ${fields.eyeGaze || '-'} |
| **Hair Color** | ${fields.hairColor || '-'} |
| **Hair Style** | ${fields.hairStyle || '-'} |
| **Appearance** | ${fields.appearance || '-'} |
| **Clothing** | ${fields.clothing || '-'} |
| **Texture** | ${fields.clothingDetail || '-'} |
| **Accessories** | ${fields.accessories || '-'} |

## Scene & Style
| Category | Value |
| :--- | :--- |
| **Action** | ${fields.action || '-'} |
| **Hands** | ${fields.hands || '-'} |
| **Composition** | ${fields.composition || '-'} |
| **Era** | ${fields.era || '-'} |
| **Environment** | ${fields.environment || '-'} |
| **Lighting** | ${fields.lighting || '-'} |
| **Color** | ${fields.colorPalette || '-'} |
| **Camera** | ${fields.camera || '-'} |
| **Art Style** | ${fields.artStyle || '-'} |
| **Mood** | ${fields.mood || '-'} |
| **Ratio** | ${fields.aspectRatio || '-'} |
`;

    } else {
      // Raw Text Format (Standard Prompt)
      const parts = [
        ...fields.quality,
        fields.subject,
        fields.bodyType, // Added after subject
        fields.accessories,
        fields.faceShape,
        fields.eyeGaze, // Added after face
        fields.hairColor, 
        fields.hairStyle,
        fields.appearance,
        fields.clothing,
        fields.clothingDetail, // Added after clothing
        fields.action,
        fields.hands, // Added after action
        fields.composition,
        fields.era,
        fields.environment,
        fields.lighting,
        fields.colorPalette,
        fields.camera,
        fields.artStyle,
        fields.mood,
        fields.aspectRatio
      ].filter(Boolean);

      const separator = outputLang === 'en' ? ', ' : '，';
      const positivePrompt = parts.join(separator);
      
      if (fields.negative) {
         result = `${positivePrompt}\n\n--no ${fields.negative}`;
      } else {
         result = positivePrompt;
      }
    }

    setGeneratedPrompt(result);
  }, [state, outputLang, outputFormat]);

  const handleSelect = (category: string, value: string, isToggle = true) => {
    setState(prev => {
        // Cast prev to any to allow dynamic property access/assignment without strict key checks
        const next = { ...prev } as any;
        if (!isToggle) {
           next[category] = value;
        } else {
           next[category] = next[category] === value ? '' : value;
        }
        return next;
    });
  };

  const handleGenderSelect = (gender: Gender) => {
    setState(prev => ({ ...prev, gender }));
  };

  const toggleQualityTag = (tagValue: string) => {
    setState(prev => {
      const currentTags = prev.quality;
      if (currentTags.includes(tagValue)) {
        return { ...prev, quality: currentTags.filter(t => t !== tagValue) };
      } else {
        return { ...prev, quality: [...currentTags, tagValue] };
      }
    });
  };

  const handleNegativeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState(prev => ({ ...prev, negativePrompt: e.target.value }));
  };

  const addNegativeTag = (tag: string) => {
    setState(prev => {
      const current = prev.negativePrompt;
      if (current.includes(tag)) return prev;
      const newValue = current ? `${current}, ${tag}` : tag;
      return { ...prev, negativePrompt: newValue };
    });
  };

  const handleRandomizeAll = () => {
    const newValues: Partial<PortraitState> = {};
    PROMPT_CATEGORIES.forEach(cat => {
      // Filter options by gender before randomizing
      const validOptions = cat.options.filter(opt => !opt.gender || opt.gender === state.gender);
      if (validOptions.length > 0) {
        // Fix for TS error: Type 'string' is not assignable to type 'Gender & string & string[]'
        (newValues as any)[cat.id] = validOptions[Math.floor(Math.random() * validOptions.length)].value;
      }
    });
    setState(prev => ({
      ...prev,
      ...newValues
    }));
  };

  const handleCopy = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setState({
        gender: state.gender,
        nationality: '',
        age: '',
        bodyType: '',
        role: '',
        faceShape: '',
        eyeGaze: '',
        hairColor: '',
        hairStyle: '',
        appearance: '',
        clothing: '',
        clothingDetail: '',
        accessories: '',
        action: '',
        hands: '',
        composition: '',
        era: '',
        environment: '',
        lighting: '',
        colorPalette: '',
        camera: '',
        artStyle: '',
        mood: '',
        aspectRatio: '',
        quality: ['masterpiece', 'best quality', '8k', 'highly detailed', 'detailed face'],
        negativePrompt: ''
    });
    setGeneratedPrompt('');
  };

  // --- Icons ---
  const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
  );

  const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
  );

  const FemaleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="9" r="5"/><path d="M12 14v7"/><path d="M9 18h6"/></svg>
  );

  const MaleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="14" r="5"/><path d="m19 5-5.4 5.4"/><path d="M19 5h-5"/><path d="M19 5v5"/></svg>
  );

  const CodeIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
  );

  const DiceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M16 8h.01"/><path d="M8 8h.01"/><path d="M8 16h.01"/><path d="M16 16h.01"/><path d="M12 12h.01"/></svg>
  );

  const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
  );

  const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 18 18"/></svg>
  );

  // Group Icons
  const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
  const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M9 3v4"/><path d="M3 5h4"/><path d="M3 9h4"/></svg>;
  const MapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/></svg>;
  const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>;

  // --- Configuration for Accordion Groups ---
  const CATEGORY_GROUPS = [
    {
      id: 'character',
      title: '人物設定 (Character Profile)',
      icon: <UserIcon />,
      categoryIds: ['nationality', 'age', 'role']
    },
    {
      id: 'appearance',
      title: '外觀造型 (Appearance)',
      icon: <SparklesIcon />,
      // Added: bodyType, eyeGaze, clothingDetail
      categoryIds: ['bodyType', 'faceShape', 'eyeGaze', 'hairColor', 'hairStyle', 'appearance', 'clothing', 'clothingDetail', 'accessories']
    },
    {
      id: 'scene',
      title: '動作與場景 (Scene & Action)',
      icon: <MapIcon />,
      // Added: hands
      categoryIds: ['action', 'hands', 'composition', 'era', 'environment']
    },
    {
      id: 'style',
      title: '風格與攝影 (Style & Camera)',
      icon: <CameraIcon />,
      categoryIds: ['lighting', 'colorPalette', 'artStyle', 'camera', 'mood', 'aspectRatio']
    }
  ];

  // --- Components ---
  
  const OutputToolbar = () => (
    <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex flex-col gap-3">
        <div className="flex justify-between items-center">
            <span className="text-xs font-mono text-slate-400 uppercase flex items-center gap-2">
                <CodeIcon /> 輸出設定
            </span>
            <button 
                onClick={handleClear}
                className="p-1.5 hover:bg-red-500/10 hover:text-red-400 text-slate-500 rounded-md transition-colors"
                title="清空所有選項"
            >
                <TrashIcon />
            </button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
            {/* Language Toggle */}
            <div className="flex bg-slate-800 rounded-md p-0.5 flex-1">
                <button 
                    onClick={() => setOutputLang('en')}
                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 text-xs font-medium rounded transition-all ${outputLang === 'en' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    ENG
                </button>
                <button 
                    onClick={() => setOutputLang('zh')}
                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 text-xs font-medium rounded transition-all ${outputLang === 'zh' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    中文
                </button>
            </div>

            {/* Format Toggle */}
            <div className="flex bg-slate-800 rounded-md p-0.5 flex-[2]">
                <button 
                    onClick={() => setOutputFormat('text')}
                    className={`flex-1 py-1.5 px-2 text-xs font-medium rounded transition-all ${outputFormat === 'text' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    Prompt
                </button>
                <button 
                    onClick={() => setOutputFormat('json')}
                    className={`flex-1 py-1.5 px-2 text-xs font-medium rounded transition-all ${outputFormat === 'json' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    JSON
                </button>
                <button 
                    onClick={() => setOutputFormat('yaml')}
                    className={`flex-1 py-1.5 px-2 text-xs font-medium rounded transition-all ${outputFormat === 'yaml' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    YAML
                </button>
                <button 
                    onClick={() => setOutputFormat('markdown')}
                    className={`flex-1 py-1.5 px-2 text-xs font-medium rounded transition-all ${outputFormat === 'markdown' ? 'bg-slate-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
                >
                    MD
                </button>
            </div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-24 lg:pb-8 p-4 md:p-8 relative">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Header */}
        <div className="lg:col-span-12 mb-4 lg:mb-0 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              人像提示詞大師
            </h1>
            <p className="text-slate-400 mt-2">
              為 Midjourney、Stable Diffusion 或 LLM 打造專業提示詞。
            </p>
          </div>
          <button
              onClick={handleRandomizeAll}
              className="group flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-900/40 transition-all transform hover:scale-[1.02] active:scale-95 font-semibold w-full md:w-auto"
            >
              <DiceIcon /> 全域隨機生成
              <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs ml-1 bg-white/20 px-1.5 py-0.5 rounded hidden sm:inline">I'm Feeling Lucky</span>
          </button>
        </div>

        {/* Left Column: Controls */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Gender Selector */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
               <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider ml-2">性別 (Gender)</span>
            </div>
            
            <div className="flex bg-slate-800 rounded-lg p-1 w-full sm:w-auto">
              <button
                onClick={() => handleGenderSelect('female')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-md transition-all font-medium ${
                  state.gender === 'female' 
                    ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/50' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FemaleIcon /> 女性 Female
              </button>
              <button
                onClick={() => handleGenderSelect('male')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-md transition-all font-medium ${
                  state.gender === 'male' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MaleIcon /> 男性 Male
              </button>
            </div>
          </div>

          {/* Quality Tags (Quick Select) */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-3">
              畫質增強 (Quality)
            </h3>
            <div className="flex flex-wrap gap-2">
              {QUALITY_TAGS.map(tag => (
                <button
                  key={tag.value}
                  onClick={() => toggleQualityTag(tag.value)}
                  className={`px-2 py-1 text-xs rounded-full border transition-all
                    ${state.quality.includes(tag.value) 
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' 
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}
                  `}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Negative Prompt */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 border-l-4 border-l-red-500/50">
             <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-3 flex items-center justify-between">
              負面提示詞 (Negative Prompts)
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400">排除不想要的元素</span>
             </h3>
             <textarea
                value={state.negativePrompt}
                onChange={handleNegativeChange}
                placeholder="例如: nsfw, low quality, bad hands..."
                className="w-full p-3 rounded-lg bg-slate-950 border border-slate-700 text-slate-300 text-sm focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all resize-y min-h-[80px]"
             />
             <div className="flex flex-wrap gap-2 mt-3">
                {COMMON_NEGATIVE_PROMPTS.map(tag => (
                    <button
                       key={tag}
                       onClick={() => addNegativeTag(tag)}
                       className="px-2 py-0.5 text-[10px] rounded border border-slate-700 bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-slate-200 transition-colors"
                    >
                        + {tag}
                    </button>
                ))}
             </div>
          </div>

          {/* Accordion Grouped Categories */}
          <div>
            {CATEGORY_GROUPS.map((group, index) => (
              <Accordion 
                key={group.id} 
                title={group.title} 
                icon={group.icon}
                defaultOpen={index === 0} // Only open the first group by default for cleaner UI
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.categoryIds.map(catId => {
                    const cat = PROMPT_CATEGORIES.find(c => c.id === catId);
                    if (!cat) return null;

                    // Filter options: Keep only those with no gender specified or matching current gender
                    const filteredOptions = cat.options.filter(
                      opt => !opt.gender || opt.gender === state.gender
                    );
                    
                    // Only render category if there are options available
                    if (filteredOptions.length === 0) return null;

                    const filteredCategory = { ...cat, options: filteredOptions };

                    return (
                      <SelectionCard
                        key={cat.id}
                        category={filteredCategory}
                        selectedValue={(state as any)[cat.id]}
                        onSelect={handleSelect}
                      />
                    );
                  })}
                </div>
              </Accordion>
            ))}
          </div>
        </div>

        {/* Right Column: Preview & Output (Desktop) */}
        <div className="hidden lg:block lg:col-span-5 space-y-6 lg:sticky lg:top-8 h-fit">
          
          {/* Prompt Output Box */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col">
            <OutputToolbar />
            
            <div className="p-4 min-h-[300px] relative group bg-slate-900/50">
              {generatedPrompt ? (
                <textarea
                  value={generatedPrompt}
                  readOnly
                  className="w-full h-full bg-transparent border-none resize-none focus:ring-0 text-slate-100 font-mono text-sm leading-relaxed"
                  rows={15}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-slate-600 italic select-none">
                  請選擇左側選項以建立提示詞...
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="p-4 bg-slate-900/50 border-t border-slate-800">
               <button
                onClick={handleCopy}
                disabled={!generatedPrompt}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all
                  ${copied 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-900/30'}
                `}
              >
                <CopyIcon /> {copied ? '已複製！' : '一鍵複製'}
              </button>
            </div>
          </div>

          
          <div className="text-xs text-slate-500 text-center px-4">
            * 提示詞 (Prompt)：適用於 Midjourney, Stable Diffusion。<br/>
            * 格式化輸出：適用於 API 串接、筆記或對話式 AI。
          </div>
        </div>
      </div>

      {/* --- Mobile Only: Floating Bottom Bar & Preview Modal --- */}
      
      {/* Floating Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 p-4 lg:hidden z-40 flex gap-3 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
         <button 
           onClick={() => setIsMobilePreviewOpen(true)}
           className="flex-1 bg-slate-800 text-slate-200 rounded-lg py-3 font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform"
         >
            <EyeIcon /> 預覽結果
         </button>
         <button 
           onClick={handleCopy}
           disabled={!generatedPrompt}
           className={`flex-[2] rounded-lg py-3 font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform ${
               copied ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white'
           }`}
         >
            <CopyIcon /> {copied ? '已複製' : '一鍵複製'}
         </button>
      </div>

      {/* Mobile Preview Modal (Full Screen Overlay) */}
      {isMobilePreviewOpen && (
          <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col animate-fade-in lg:hidden">
              <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900">
                  <h3 className="text-lg font-semibold text-white">生成的提示詞</h3>
                  <button 
                    onClick={() => setIsMobilePreviewOpen(false)}
                    className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white"
                  >
                      <XIcon />
                  </button>
              </div>
              
              <div className="flex-1 overflow-auto bg-slate-900">
                   {/* Reuse Logic for Toolbar inside modal or simplified */}
                   <OutputToolbar />
                   <div className="p-4 h-full">
                        <textarea
                            value={generatedPrompt}
                            readOnly
                            className="w-full h-full min-h-[50vh] bg-transparent border-none resize-none focus:ring-0 text-slate-100 font-mono text-sm leading-relaxed"
                        />
                   </div>
              </div>

              <div className="p-4 border-t border-slate-800 bg-slate-900 flex gap-3">
                 <button 
                    onClick={handleCopy}
                    className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 ${
                        copied ? 'bg-emerald-600' : 'bg-indigo-600'
                    }`}
                 >
                    <CopyIcon /> {copied ? '已複製' : '複製提示詞'}
                 </button>
              </div>
          </div>
      )}

    </div>
  );
};

export default App;