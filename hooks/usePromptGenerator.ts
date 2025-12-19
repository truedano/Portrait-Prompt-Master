import { useState, useEffect } from 'react';
import { PortraitState, OutputLanguage, OutputFormat } from '../types';
import { PROMPT_CATEGORIES, QUALITY_TAGS, PRESERVATION_OPTIONS } from '../constants';

export const usePromptGenerator = (
    state: PortraitState,
    outputLang: OutputLanguage,
    outputFormat: OutputFormat
) => {
    const [generatedPrompt, setGeneratedPrompt] = useState<string>('');

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
            negative: state.useNegativePrompt ? state.negativePrompt : ''
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

    return generatedPrompt;
};
