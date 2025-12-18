
import React, { useState, useEffect } from 'react';
import { PROMPT_CATEGORIES, QUALITY_TAGS, COMMON_NEGATIVE_PROMPTS, PRESERVATION_OPTIONS } from './constants';
import { PortraitState, Gender, OutputLanguage, OutputFormat, ReferenceImage, TaskMode } from './types';
import { SelectionCard } from './components/SelectionCard';
import { ReferenceImageCard } from './components/ReferenceImageCard';
import { Accordion } from './components/Accordion';

const App: React.FC = () => {
  // --- State ---
  const [state, setState] = useState<PortraitState>({
    taskMode: 'generation', // Default mode
    gender: 'female',
    referenceImages: [],
    nationality: '',
    age: '',
    bodyType: [], // Multi
    role: '',
    faceShape: '',
    eyeGaze: '',
    hairColor: [], // Multi
    hairStyle: [], // Multi
    appearance: [], // Multi
    clothing: [], // Multi
    clothingDetail: [], // Multi
    accessories: [], // Multi
    action: '',
    hands: '',
    composition: '',
    era: '',
    environment: '',
    lighting: [], // Multi
    colorPalette: '',
    camera: '',
    artStyle: [], // Multi
    mood: [], // Multi
    aspectRatio: '',
    cameraMovement: '',
    motionStrength: '',
    quality: ['masterpiece', 'best quality', '8k', 'highly detailed', 'detailed face'],
    preservation: [],
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

  const getTerm = (catId: keyof PortraitState | 'quality' | 'preservation', value: string, lang: OutputLanguage): string => {
    if (!value) return '';
    if (lang === 'en') return value;
    if (value.startsWith('random ')) return '隨機 (Random)';

    if (catId === 'quality') {
      const tag = QUALITY_TAGS.find(t => t.value === value);
      return tag ? extractLabel(tag.label, lang)! : value;
    }

    if (catId === 'preservation') {
      const tag = PRESERVATION_OPTIONS.find(t => t.value === value);
      return tag ? extractLabel(tag.label, lang)! : value;
    }

    const category = PROMPT_CATEGORIES.find(c => c.id === catId);
    if (category) {
      const option = category.options.find(o => o.value === value);
      if (option) return extractLabel(option.label, lang)!;
    }

    return value;
  };

  const resolveField = (key: keyof PortraitState | 'quality' | 'preservation', val: string | string[], lang: OutputLanguage) => {
    if (Array.isArray(val)) {
      return val.map(v => getTerm(key, v, lang)).filter(Boolean).join(', ');
    }
    return getTerm(key, val, lang);
  };

  // --- Logic ---

  useEffect(() => {
    // 1. Resolve raw values to localized strings
    const genderTermEn = state.gender === 'female' ? 'woman' : 'man';
    const genderTermZh = state.gender === 'female' ? '女性' : '男性';

    // Raw fields for logic
    const raw = state;

    // Localized fields for output
    const fields = {
      quality: resolveField('quality', state.quality, outputLang),
      preservation: resolveField('preservation', state.preservation, outputLang),
      nationality: resolveField('nationality', state.nationality, outputLang),
      age: resolveField('age', state.age, outputLang),
      bodyType: resolveField('bodyType', state.bodyType, outputLang),
      gender: outputLang === 'en' ? genderTermEn : genderTermZh,
      role: resolveField('role', state.role, outputLang),
      faceShape: resolveField('faceShape', state.faceShape, outputLang),
      eyeGaze: resolveField('eyeGaze', state.eyeGaze, outputLang),
      hairColor: resolveField('hairColor', state.hairColor, outputLang),
      hairStyle: resolveField('hairStyle', state.hairStyle, outputLang),
      appearance: resolveField('appearance', state.appearance, outputLang),
      clothing: resolveField('clothing', state.clothing, outputLang),
      clothingDetail: resolveField('clothingDetail', state.clothingDetail, outputLang),
      accessories: resolveField('accessories', state.accessories, outputLang),
      action: resolveField('action', state.action, outputLang),
      hands: resolveField('hands', state.hands, outputLang),
      composition: resolveField('composition', state.composition, outputLang),
      era: resolveField('era', state.era, outputLang),
      environment: resolveField('environment', state.environment, outputLang),
      lighting: resolveField('lighting', state.lighting, outputLang),
      colorPalette: resolveField('colorPalette', state.colorPalette, outputLang),
      camera: resolveField('camera', state.camera, outputLang),
      artStyle: resolveField('artStyle', state.artStyle, outputLang),
      mood: resolveField('mood', state.mood, outputLang),
      aspectRatio: resolveField('aspectRatio', state.aspectRatio, outputLang),
      cameraMovement: resolveField('cameraMovement', state.cameraMovement, outputLang),
      motionStrength: resolveField('motionStrength', state.motionStrength, outputLang),
      negative: state.negativePrompt
    };

    let result = '';

    // --- JSON / YAML Output (Structured Data) ---
    if (outputFormat === 'json' || outputFormat === 'yaml') {
      const dataObj = {
        meta: {
          language: outputLang,
          task_mode: state.taskMode,
          engine: state.taskMode === 'video_generation' ? "veo/sora" : "gemini_nano_banana_pro"
        },
        input_images: state.referenceImages.map(img => ({
          url: img.url,
          intent: img.intent
        })),
        prompt_content: {
          subject: { ...fields, quality: undefined, preservation: undefined, negative: undefined }, // Spread all fields
          preservation: state.preservation.map(p => getTerm('preservation', p, outputLang)),
          quality_tags: state.quality.map(q => getTerm('quality', q, outputLang))
        },
        negative_prompt: fields.negative
      };

      if (outputFormat === 'json') {
        result = JSON.stringify(dataObj, null, 2);
      } else {
        // Detailed YAML construction
        const lines: string[] = [];
        lines.push(`meta:`);
        lines.push(`  mode: ${state.taskMode}`);
        lines.push(`  language: ${outputLang}`);
        lines.push(`  engine: ${state.taskMode === 'video_generation' ? "veo" : "gemini_nano_banana_pro"}`);

        if (state.referenceImages.length > 0) {
          lines.push(`images:`);
          state.referenceImages.forEach(img => {
            lines.push(`  - url: "${img.url}"`);
            lines.push(`    intent: ${img.intent}`);
          });
        }

        lines.push(`prompt:`);

        // Define all mapping fields for YAML
        const yamlFields: Record<string, string | string[]> = {
          subject_desc: [fields.nationality, fields.age, fields.gender, fields.role].filter(Boolean).join(' '),
          body_type: fields.bodyType,
          face_features: [fields.faceShape, fields.eyeGaze].filter(Boolean).join(', '),
          hair: [fields.hairColor, fields.hairStyle].filter(Boolean).join(' '),
          appearance_details: fields.appearance,
          outfit: [fields.clothing, fields.clothingDetail].filter(Boolean).join(' '),
          accessories: fields.accessories,
          action_pose: fields.action,
          hand_interaction: fields.hands,
          // Video Specifics
          camera_movement: fields.cameraMovement,
          motion_strength: fields.motionStrength,
          // End Video Specifics
          scene_environment: [fields.environment, fields.era].filter(Boolean).join(', '),
          composition_angle: fields.composition,
          camera_lens: fields.camera,
          lighting: fields.lighting,
          color_tone: fields.colorPalette,
          art_style: fields.artStyle,
          mood_emotion: fields.mood,
          preservation: fields.preservation, // This is now a comma string
          quality_tags: fields.quality, // This is now a comma string
          aspect_ratio: fields.aspectRatio
        };

        // Write fields that have values
        Object.entries(yamlFields).forEach(([key, val]) => {
          if (!val || (Array.isArray(val) && val.length === 0)) return;
          lines.push(`  ${key}: "${val}"`);
        });

        if (fields.negative) {
          lines.push(`negative_prompt: "${fields.negative.replace(/"/g, '\\"')}"`);
        }

        result = lines.join('\n');
      }
    }
    // --- Text / Markdown Output ---
    else {
      // A. VIDEO GENERATION MODE
      if (state.taskMode === 'video_generation') {
        const subjectEn = [state.nationality, state.age, state.gender === 'female' ? 'woman' : 'man', state.role].filter(Boolean).join(' ');
        const subjectZh = [fields.nationality, fields.age, fields.gender, fields.role].filter(Boolean).join('');
        const mainSubject = outputLang === 'en' ? `A ${subjectEn}` : `一個${subjectZh}`;

        // Video Structure: [Camera Move] + [Subject] + [Action/Motion] + [Environment] + [Style/Quality]
        const parts = [
          fields.cameraMovement,   // 1. Camera Movement (The Soul of Video)
          mainSubject,             // 2. Who
          fields.environment,      // 3. Where (Context usually comes early for video establishment)
          fields.action,           // 4. Action
          fields.motionStrength,   // 5. Motion Dynamics
          fields.clothing,
          fields.clothingDetail,
          fields.appearance,
          fields.hairColor,
          fields.hairStyle,
          fields.eyeGaze,
          fields.composition,
          fields.camera,
          fields.lighting,
          fields.era,
          fields.artStyle,
          fields.mood,
          fields.colorPalette,
          fields.quality,
        ].filter(Boolean);

        const separator = outputLang === 'en' ? ', ' : '，';
        const basePrompt = parts.join(separator);

        if (outputFormat === 'markdown') {
          let md = `**Video Prompt**\n> ${basePrompt}`;
          if (fields.negative) md += `\n\n**Negative Prompt**\n> ${fields.negative}`;
          result = md;
        } else {
          result = basePrompt;
          if (fields.negative) result += `\n\n--no ${fields.negative}`;
        }
      }
      // B. IMAGE GENERATION MODE (Descriptive)
      else if (state.taskMode === 'generation') {
        const subjectEn = [state.nationality, state.age, state.gender === 'female' ? 'woman' : 'man', state.role].filter(Boolean).join(' ');
        const subjectZh = [fields.nationality, fields.age, fields.gender, fields.role].filter(Boolean).join('');
        const mainSubject = outputLang === 'en' ? `A ${subjectEn}` : `一個${subjectZh}`;

        // ORDER OPTIMIZATION FOR GEMINI / NANO BANANA PRO
        const parts = [
          mainSubject,             // 1. Who (Subject is King)
          fields.action,           // 2. Doing what?
          fields.environment,      // 3. Where?
          fields.clothing,         // 4. Wearing what?
          fields.clothingDetail,
          fields.appearance,       // 5. Details
          fields.accessories,
          fields.bodyType,
          fields.faceShape,
          fields.hairColor,
          fields.hairStyle,
          fields.eyeGaze,
          fields.hands,
          fields.composition,      // 6. Camera/Angle
          fields.camera,
          fields.lighting,
          fields.era,
          fields.artStyle,         // 7. Artistic Style
          fields.mood,
          fields.colorPalette,
          fields.quality,       // 8. Quality Boosters
          fields.aspectRatio       // 9. Tech specs (Resolution last for images)
        ].filter(Boolean);

        const separator = outputLang === 'en' ? ', ' : '，';
        const basePrompt = parts.join(separator);

        if (outputFormat === 'markdown') {
          // MARKDOWN OUTPUT
          let md = `**Prompt**\n> ${basePrompt}`;

          if (fields.negative) {
            md += `\n\n**Negative Prompt**\n> ${fields.negative}`;
          }

          if (state.referenceImages.length > 0) {
            md += `\n\n**References**\n${state.referenceImages.map(img => `- ${img.url} (${img.intent})`).join('\n')}`;
          }
          result = md;
        } else {
          // PLAIN TEXT OUTPUT
          result = basePrompt;
          if (state.referenceImages.length > 0) {
            result += `\n\n[References: ${state.referenceImages.map(i => i.url).join(', ')}]`;
          }
          if (fields.negative) {
            result += `\n\n--no ${fields.negative}`;
          }
        }
      }
      // C. EDITING MODE (Instructional)
      else {
        const instructions: string[] = [];

        // --- CONFLICT RESOLUTION LOGIC ---
        // If a preservation tag is present, we SUPPRESS related modification instructions.
        // Values here match 'value' in PRESERVATION_OPTIONS constants.ts
        const isPreserved = (targetValue: string) => {
          return state.preservation.includes(targetValue);
        };

        // 1. Process Intents
        state.referenceImages.forEach(img => {
          if (img.intent === 'high_denoising') instructions.push(outputLang === 'en' ? "Completely reimagine the image." : "完全重新構想這張圖片。");
          if (img.intent === 'keep_subject') instructions.push(outputLang === 'en' ? "Keep the facial features unchanged." : "保持臉部特徵不變。");
          if (img.intent === 'keep_composition') instructions.push(outputLang === 'en' ? "Retain the original composition and pose." : "保留原始構圖與姿勢。");
        });

        // 2. Process Preservation (Positive Constraint)
        if (fields.preservation.length > 0) {
          // fields.preservation is already joined string
          instructions.push(outputLang === 'en'
            ? `Ensure the ${fields.preservation} remain unchanged.`
            : `確保${fields.preservation}保持不變。`);
        }

        // 3. Build Instructions from fields (With Conflict Checks)

        // Change Subject/Demographics
        // If "facial features" is preserved, we avoid instructions that fundamentally change the person's identity.
        if (!isPreserved('facial features')) {
          const demographicParts = [];
          if (raw.nationality) demographicParts.push(fields.nationality);
          if (raw.age) demographicParts.push(fields.age);
          if (raw.gender) demographicParts.push(fields.gender);
          if (raw.faceShape) demographicParts.push(fields.faceShape);
          // Body type change implies character change
          if (fields.bodyType) demographicParts.push(fields.bodyType);

          if (demographicParts.length > 0) {
            const desc = demographicParts.join(' ');
            instructions.push(outputLang === 'en'
              ? `Change the character's appearance to be ${desc}.`
              : `將角色外觀改為${desc}。`);
          }
        }

        // Roles are often props/costumes, so we allow them unless strictly conflicting
        if (raw.role) {
          instructions.push(outputLang === 'en'
            ? `Change the role to a ${fields.role}.`
            : `將角色改為${fields.role}。`);
        }

        // Hair
        if ((raw.hairColor.length > 0 || raw.hairStyle.length > 0) && !isPreserved('hair style')) {
          const hair = [fields.hairColor, fields.hairStyle].filter(Boolean).join(' ');
          instructions.push(outputLang === 'en' ? `Change hair to ${hair}.` : `將髮型改為${hair}。`);
        }

        // Change Clothing
        if ((raw.clothing.length > 0 || raw.clothingDetail.length > 0) && !isPreserved('clothing')) {
          const cloth = [fields.clothing, fields.clothingDetail].filter(Boolean).join(' ');
          instructions.push(outputLang === 'en'
            ? `Change the outfit to ${cloth}.`
            : `將服裝更換為${cloth}。`);
        }

        // Add Accessories (Usually safe to add even if clothing is preserved, unless specific conflict)
        if (raw.accessories.length > 0) {
          instructions.push(outputLang === 'en'
            ? `Add ${fields.accessories} to the character.`
            : `為角色添加${fields.accessories}。`);
        }

        // Change Action/Pose (ADDED)
        if (raw.action && !isPreserved('image composition')) {
          instructions.push(outputLang === 'en'
            ? `Change pose to ${fields.action}.`
            : `將姿勢改為${fields.action}。`);
        }

        // Change Hands (ADDED)
        if (raw.hands) {
          instructions.push(outputLang === 'en'
            ? `Character is ${fields.hands}.`
            : `角色${fields.hands}。`);
        }

        // Change Background / Era
        if ((raw.environment || raw.era) && !isPreserved('background environment')) {
          const bg = [fields.environment, fields.era].filter(Boolean).join(' ');
          instructions.push(outputLang === 'en'
            ? `Change the background to ${bg}.`
            : `將背景改為${bg}。`);
        }

        // Change Composition / Camera
        if ((raw.composition || raw.camera || raw.aspectRatio) && !isPreserved('image composition')) {
          const comp = [fields.composition, fields.camera, fields.aspectRatio].filter(Boolean).join(' ');
          instructions.push(outputLang === 'en'
            ? `Adjust composition to ${comp}.`
            : `將構圖調整為${comp}。`);
        }

        // Change Style
        if (raw.artStyle.length > 0) {
          instructions.push(outputLang === 'en'
            ? `Transform the style to ${fields.artStyle}.`
            : `將風格轉換為${fields.artStyle}。`);
        }

        // Change Mood/Expression
        // If face is preserved, changing expression is tricky but possible. We allow it.
        if (raw.mood.length > 0) {
          instructions.push(outputLang === 'en'
            ? `Make the character look ${fields.mood}.`
            : `讓角色看起來${fields.mood}。`);
        }

        // Change Lighting
        if (raw.lighting.length > 0 && !isPreserved('lighting conditions')) {
          instructions.push(outputLang === 'en'
            ? `Apply ${fields.lighting}.`
            : `應用${fields.lighting}。`);
        }

        // Change Colors
        if (raw.colorPalette && !isPreserved('color palette')) {
          instructions.push(outputLang === 'en'
            ? `Use a ${fields.colorPalette}.`
            : `使用${fields.colorPalette}。`);
        }

        const baseInstructions = instructions.join(' ');

        if (outputFormat === 'markdown') {
          // MARKDOWN OUTPUT (Editing)
          let md = `**Instructions**\n> ${baseInstructions}`;

          if (fields.negative) {
            md += `\n\n**Negative Constraint**\n> ${fields.negative}`;
          }

          if (state.referenceImages.length > 0) {
            md += `\n\n**Input Images**\n${state.referenceImages.map(img => `- ${img.url} (${img.intent})`).join('\n')}`;
          }
          result = md;
        } else {
          // PLAIN TEXT OUTPUT (Editing)
          result = baseInstructions;
          // For editing chat, we just list images at the end usually
          if (state.referenceImages.length > 0) {
            result += `\n\n[Inputs: ${state.referenceImages.map(i => i.url).join(', ')}]`;
          }
          if (fields.negative) {
            result += `\n\n(Avoid: ${fields.negative})`;
          }
        }
      }
    }

    setGeneratedPrompt(result);
  }, [state, outputLang, outputFormat]);

  // --- Handlers ---

  const handleSelect = (category: string, value: string, isToggle = true) => {
    setState(prev => {
      const currentVal = (prev as any)[category];
      // Check if the category definition allows multiSelect
      const catConfig = PROMPT_CATEGORIES.find(c => c.id === category);
      const isMulti = catConfig?.multiSelect;

      if (isMulti && Array.isArray(currentVal)) {
        // Multi-select logic
        // If isToggle is false (e.g. Random button), we might want to just set it or add it.
        // But usually Random replaces or adds. Let's make Random REPLACE for simplicity in this specific app UX to avoid clutter,
        // OR make it ADD. Given "Random" usually implies "Pick this one thing", let's make random replace unless it's a chip click.

        if (!isToggle) {
          // Force set (replace all) - mainly for Custom Input or Random replacement
          // If it's custom input, we probably want to append? No, usually replace is safer to avoid duplicates unless user intends.
          // Actually, for multi-select, "Random" usually adds 1 random item, but clearing previous is cleaner for "I'm feeling lucky".
          // Let's stick to: Custom Input = Add? No, Custom Input replaces specific value usually.
          // Let's make it: Custom/Random replaces for now.
          return { ...prev, [category]: [value] };
        }

        const exists = currentVal.includes(value);
        const newValue = exists
          ? currentVal.filter(v => v !== value)
          : [...currentVal, value];
        return { ...prev, [category]: newValue };
      } else {
        // Single select logic (existing)
        if (!isToggle) return { ...prev, [category]: value };
        return { ...prev, [category]: currentVal === value ? '' : value };
      }
    });
  };

  const handleGenderSelect = (gender: Gender) => {
    setState(prev => ({ ...prev, gender }));
  };

  const handleTaskModeSelect = (mode: TaskMode) => {
    setState(prev => ({ ...prev, taskMode: mode }));
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

  const togglePreservationTag = (tagValue: string) => {
    setState(prev => {
      const current = prev.preservation || [];
      if (current.includes(tagValue)) {
        return { ...prev, preservation: current.filter(t => t !== tagValue) };
      } else {
        return { ...prev, preservation: [...current, tagValue] };
      }
    });
  };

  const handleNegativeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState(prev => ({ ...prev, negativePrompt: e.target.value }));
  };

  const toggleNegativeTag = (tag: string) => {
    setState(prev => {
      const currentRaw = prev.negativePrompt || '';
      // Split by comma, trim whitespace, remove empty
      const tags = currentRaw.split(',').map(t => t.trim()).filter(Boolean);

      if (tags.includes(tag)) {
        // Remove
        const newTags = tags.filter(t => t !== tag);
        return { ...prev, negativePrompt: newTags.join(', ') };
      } else {
        // Add
        return { ...prev, negativePrompt: [...tags, tag].join(', ') };
      }
    });
  };

  const handleRandomizeAll = () => {
    const newValues: Partial<PortraitState> = {};
    PROMPT_CATEGORIES.forEach(cat => {
      // Logic for hiding fields should also apply to randomization to avoid setting hidden values
      if (state.taskMode === 'video_generation' && cat.id === 'aspectRatio') return;
      if (state.taskMode !== 'video_generation' && (cat.id === 'cameraMovement' || cat.id === 'motionStrength')) return;

      const validOptions = cat.options.filter(opt => !opt.gender || opt.gender === state.gender);
      if (validOptions.length > 0) {
        const randomVal = validOptions[Math.floor(Math.random() * validOptions.length)].value;
        if (cat.multiSelect) {
          (newValues as any)[cat.id] = [randomVal];
        } else {
          (newValues as any)[cat.id] = randomVal;
        }
      }
    });
    setState(prev => ({ ...prev, ...newValues }));
  };

  const handleCopy = () => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setState(prev => ({
      ...prev,
      nationality: '', age: '', bodyType: [], role: '', faceShape: '', eyeGaze: '',
      hairColor: [], hairStyle: [], appearance: [], clothing: [], clothingDetail: [],
      accessories: [], action: '', hands: '', composition: '', era: '', environment: '',
      lighting: [], colorPalette: '', camera: '', artStyle: [], mood: [], aspectRatio: '',
      cameraMovement: '', motionStrength: '',
      quality: ['masterpiece', 'best quality', '8k', 'highly detailed', 'detailed face'],
      preservation: [],
      negativePrompt: '',
      referenceImages: []
    }));
    setGeneratedPrompt('');
  };

  const addReferenceImage = () => {
    const newImg: ReferenceImage = {
      id: Date.now().toString(),
      url: '',
      intent: 'general'
    };
    setState(prev => ({ ...prev, referenceImages: [newImg, ...prev.referenceImages] }));
  };

  const updateReferenceImage = (id: string, updates: Partial<ReferenceImage>) => {
    setState(prev => ({
      ...prev,
      referenceImages: prev.referenceImages.map(img => img.id === id ? { ...img, ...updates } : img)
    }));
  };

  const removeReferenceImage = (id: string) => {
    setState(prev => ({
      ...prev,
      referenceImages: prev.referenceImages.filter(img => img.id !== id)
    }));
  };

  // --- Icons ---
  const CopyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2" /><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" /></svg>
  );

  const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
  );

  const FemaleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="9" r="5" /><path d="M12 14v7" /><path d="M9 18h6" /></svg>
  );

  const MaleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="14" r="5" /><path d="m19 5-5.4 5.4" /><path d="M19 5h-5" /><path d="M19 5v5" /></svg>
  );

  const CodeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
  );

  const DiceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><path d="M16 8h.01" /><path d="M8 8h.01" /><path d="M8 16h.01" /><path d="M16 16h.01" /><path d="M12 12h.01" /></svg>
  );

  const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
  );

  const XIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 18 18" /></svg>
  );

  const ImageIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
  );

  const ShieldIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
  );

  const VideoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 8-6 4 6 4V8Z" /><rect width="14" height="12" x="2" y="6" rx="2" ry="2" /></svg>
  );

  // Group Icons
  const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
  const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z" /><path d="M5 3v4" /><path d="M9 3v4" /><path d="M3 5h4" /><path d="M3 9h4" /></svg>;
  const MapIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" x2="9" y1="3" y2="18" /><line x1="15" x2="15" y1="6" y2="21" /></svg>;
  const CameraIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>;

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
      categoryIds: ['bodyType', 'faceShape', 'eyeGaze', 'hairColor', 'hairStyle', 'appearance', 'clothing', 'clothingDetail', 'accessories']
    },
    {
      id: 'scene',
      title: '動作與場景 (Scene & Action)',
      icon: <MapIcon />,
      // Add motionStrength to scene group
      categoryIds: ['action', 'motionStrength', 'hands', 'composition', 'era', 'environment']
    },
    {
      id: 'style',
      title: '風格與攝影 (Style & Camera)',
      icon: <CameraIcon />,
      // Add cameraMovement to style group
      categoryIds: ['lighting', 'colorPalette', 'artStyle', 'camera', 'cameraMovement', 'mood', 'aspectRatio']
    }
  ];

  // --- Components ---

  const OutputToolbar = () => (
    <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <span className="text-xs font-mono text-slate-400 uppercase flex items-center gap-2">
          <CodeIcon />
          {state.taskMode === 'editing' ? '編輯指令 (Instructions)' :
            state.taskMode === 'video_generation' ? '影片提示詞 (Video Prompt)' :
              '繪圖提示詞 (Image Prompt)'}
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
            Text
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
              為 Nano Banana Pro (Gemini) 打造專業產圖與修圖指令。
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

          {/* TASK MODE SWITCH */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-2 flex gap-1 overflow-x-auto">
            <button
              onClick={() => handleTaskModeSelect('generation')}
              className={`flex-1 min-w-[120px] py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 text-sm
                    ${state.taskMode === 'generation' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}
                `}
            >
              <SparklesIcon /> 文生圖
            </button>
            <button
              onClick={() => handleTaskModeSelect('video_generation')}
              className={`flex-1 min-w-[120px] py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 text-sm
                    ${state.taskMode === 'video_generation' ? 'bg-rose-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}
                `}
            >
              <VideoIcon /> 文生影片
            </button>
            <button
              onClick={() => handleTaskModeSelect('editing')}
              className={`flex-1 min-w-[120px] py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 text-sm
                    ${state.taskMode === 'editing' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}
                `}
            >
              <ImageIcon /> 修圖
            </button>
          </div>

          {/* Reference Images Section */}
          <div className={`transition-all duration-300 ${state.taskMode === 'editing' ? 'ring-2 ring-emerald-500/30 rounded-xl' : ''}`}>
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-2">
                  <ImageIcon /> {state.taskMode === 'editing' ? '輸入圖片 (Input Images)' : '參考圖片 (References)'}
                </h3>
                <button
                  onClick={addReferenceImage}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-indigo-400 px-3 py-1.5 rounded-full transition-colors font-medium border border-indigo-500/30"
                >
                  + 新增圖片
                </button>
              </div>

              {state.referenceImages.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-slate-800 rounded-lg text-slate-600 text-sm">
                  {state.taskMode === 'editing'
                    ? '請新增要修改的原始圖片'
                    : '可選：新增參考圖片以控制風格或構圖'
                  }
                </div>
              ) : (
                <div className="space-y-3">
                  {state.referenceImages.map(img => (
                    <ReferenceImageCard
                      key={img.id}
                      image={img}
                      onUpdate={updateReferenceImage}
                      onRemove={removeReferenceImage}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Preservation Tags (Only relevant for Editing) */}
          {state.taskMode === 'editing' && (
            <div className="bg-slate-900/80 border border-emerald-500/30 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                <ShieldIcon />
              </div>
              <h3 className="text-sm uppercase tracking-wider text-emerald-500 font-semibold mb-3 flex items-center gap-2">
                <ShieldIcon /> 保留特徵 (Preserve Attributes)
              </h3>
              <p className="text-xs text-slate-500 mb-3">告訴 AI 哪些部分<b>絕對不要</b>修改。</p>
              <div className="flex flex-wrap gap-2">
                {PRESERVATION_OPTIONS.map(tag => (
                  <button
                    key={tag.value}
                    onClick={() => togglePreservationTag(tag.value)}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-all font-medium
                        ${state.preservation.includes(tag.value)
                        ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/50'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-300'}
                    `}
                  >
                    {tag.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Gender Selector */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider ml-2">性別 (Gender)</span>
            </div>

            <div className="flex bg-slate-800 rounded-lg p-1 w-full sm:w-auto">
              <button
                onClick={() => handleGenderSelect('female')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-md transition-all font-medium ${state.gender === 'female'
                  ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/50'
                  : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                <FemaleIcon /> 女性
              </button>
              <button
                onClick={() => handleGenderSelect('male')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2 rounded-md transition-all font-medium ${state.gender === 'male'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                  : 'text-slate-400 hover:text-slate-200'
                  }`}
              >
                <MaleIcon /> 男性
              </button>
            </div>
          </div>

          {/* Quality Tags (Hidden for Editing mode, kept for Video/Image) */}
          {state.taskMode !== 'editing' && (
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
          )}

          {/* Negative Prompt */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 border-l-4 border-l-red-500/50">
            <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-3 flex items-center justify-between">
              負面提示詞 (Negative Prompts)
            </h3>
            <textarea
              value={state.negativePrompt}
              onChange={handleNegativeChange}
              placeholder="例如: nsfw, low quality, bad hands..."
              className="w-full p-3 rounded-lg bg-slate-950 border border-slate-700 text-slate-300 text-sm focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 transition-all resize-y min-h-[80px]"
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {COMMON_NEGATIVE_PROMPTS.map(tag => <button
                key={tag}
                onClick={() => toggleNegativeTag(tag)}
                className={`px-2 py-0.5 text-[10px] rounded border transition-colors ${(state.negativePrompt || '').split(',').map(t => t.trim()).includes(tag)
                    ? 'bg-red-500/20 border-red-500 text-red-300'
                    : 'border-slate-700 bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
                  }`}
              >
                {tag}
              </button>
              )}
            </div>
          </div>

          {/* Accordion Grouped Categories */}
          <div>
            {CATEGORY_GROUPS.map((group, index) => (
              <Accordion
                key={group.id}
                title={group.title}
                icon={group.icon}
                defaultOpen={index === 0}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.categoryIds.map(catId => {
                    const cat = PROMPT_CATEGORIES.find(c => c.id === catId);
                    if (!cat) return null;

                    // CONDITIONAL RENDERING LOGIC FOR MODES
                    if (state.taskMode === 'video_generation') {
                      // In Video Mode: Hide Aspect Ratio (usually fixed), Show Video specific fields
                      if (cat.id === 'aspectRatio') return null;
                    } else {
                      // In Image/Edit Mode: Hide Video specific fields
                      if (cat.id === 'cameraMovement' || cat.id === 'motionStrength') return null;
                    }

                    const filteredOptions = cat.options.filter(
                      opt => !opt.gender || opt.gender === state.gender
                    );

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
          <div className={`bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border ${state.taskMode === 'editing' ? 'border-emerald-500/30' :
            state.taskMode === 'video_generation' ? 'border-rose-500/30' :
              'border-slate-700'
            } shadow-2xl overflow-hidden flex flex-col`}>
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
                    : state.taskMode === 'video_generation'
                      ? 'bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-50'
                      : 'bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50'
                  } shadow-lg`}
              >
                <CopyIcon /> {copied ? '已複製！' : '一鍵複製'}
              </button>
            </div>
          </div>


          <div className="text-xs text-slate-500 text-center px-4">
            {state.taskMode === 'editing'
              ? '* 修圖提示詞：適用於 Gemini, Stable Diffusion Inpainting。'
              : state.taskMode === 'video_generation'
                ? '* 影片提示詞：適用於 Veo, Sora, Kling, Runway Gen-3。'
                : '* 產圖提示詞：適用於 Nano Banana Pro, Midjourney, SD。'
            }
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
          className={`flex-[2] rounded-lg py-3 font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform ${copied ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white'
            }`}
        >
          <CopyIcon /> {copied ? '已複製' : '一鍵複製'}
        </button>
      </div>

      {/* Mobile Preview Modal (Full Screen Overlay) */}
      {isMobilePreviewOpen && (
        <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col animate-fade-in lg:hidden">
          <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-900">
            <h3 className="text-lg font-semibold text-white">
              {state.taskMode === 'editing' ? '編輯指令' : '生成的提示詞'}
            </h3>
            <button
              onClick={() => setIsMobilePreviewOpen(false)}
              className="p-2 bg-slate-800 rounded-full text-slate-400 hover:text-white"
            >
              <XIcon />
            </button>
          </div>

          <div className="flex-1 overflow-auto bg-slate-900">
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
              className={`flex-1 py-3 rounded-lg font-bold flex items-center justify-center gap-2 ${copied ? 'bg-emerald-600' : 'bg-indigo-600'
                }`}
            >
              <CopyIcon /> {copied ? '已複製' : '複製'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;
