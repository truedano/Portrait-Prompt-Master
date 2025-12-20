import { useState, useEffect } from 'react';
import { PortraitState, OutputLanguage, OutputFormat, SubjectConfig, GlobalConfig } from '../types';
import { PROMPT_CATEGORIES, QUALITY_TAGS, PRESERVATION_OPTIONS, SCENERY_FORBIDDEN_MOODS } from '../constants';

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

    const getTerm = (catId: string, value: string, lang: OutputLanguage): string => {
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

    const resolveField = (key: string, val: string | string[], lang: OutputLanguage) => {
        if (Array.isArray(val)) {
            return val.map(v => getTerm(key, v, lang)).filter(Boolean).join(', ');
        }
        return getTerm(key, val, lang);
    };

    // --- Logic ---
    useEffect(() => {
        const rawGlobal = state.global;

        // Helper to resolve a subject's fields
        const resolveSubject = (subj: SubjectConfig) => {
            const genderTermEn = subj.gender === 'female' ? 'woman' : (subj.gender === 'male' ? 'man' : '');
            const genderTermZh = subj.gender === 'female' ? '女性' : (subj.gender === 'male' ? '男性' : '');

            // Localized fields
            const fields: Record<string, string> = {
                subjectType: subj.subjectType,
                nationality: resolveField('nationality', subj.nationality, outputLang),
                age: resolveField('age', subj.age, outputLang),
                gender: outputLang === 'en' ? genderTermEn : genderTermZh,
                role: resolveField('role', subj.role, outputLang),
                bodyType: resolveField('bodyType', subj.bodyType, outputLang),
                faceShape: resolveField('faceShape', subj.faceShape, outputLang),

                animalSpecies: resolveField('animalSpecies', subj.animalSpecies, outputLang),
                animalFur: resolveField('animalFur', subj.animalFur, outputLang),

                vehicleType: resolveField('vehicleType', subj.vehicleType, outputLang),
                vehicleColor: resolveField('vehicleColor', subj.vehicleColor, outputLang),

                eyeGaze: resolveField('eyeGaze', subj.eyeGaze, outputLang),
                hairColor: resolveField('hairColor', subj.hairColor, outputLang),
                hairStyle: resolveField('hairStyle', subj.hairStyle, outputLang),
                appearance: resolveField('appearance', subj.appearance, outputLang),
                clothing: resolveField('clothing', subj.clothing, outputLang),
                clothingDetail: resolveField('clothingDetail', subj.clothingDetail, outputLang),
                accessories: resolveField('accessories', subj.accessories, outputLang),
                action: resolveField('action', subj.action, outputLang),
                hands: resolveField('hands', subj.hands, outputLang),
                mood: resolveField('mood', subj.mood, outputLang),
            };

            // Filter mood for scenery
            if (subj.subjectType === 'scenery') {
                const filteredMood = subj.mood.filter(m => !SCENERY_FORBIDDEN_MOODS.includes(m));
                fields.mood = resolveField('mood', filteredMood, outputLang);
            }

            return fields;
        };

        // Prepare Global Fields
        const globalFields = {
            composition: resolveField('composition', rawGlobal.composition, outputLang),
            era: resolveField('era', rawGlobal.era, outputLang),
            environment: resolveField('environment', rawGlobal.environment, outputLang),
            lighting: resolveField('lighting', rawGlobal.lighting, outputLang),
            colorPalette: resolveField('colorPalette', rawGlobal.colorPalette, outputLang),
            camera: resolveField('camera', rawGlobal.camera, outputLang),
            artStyle: resolveField('artStyle', rawGlobal.artStyle, outputLang),
            aspectRatio: resolveField('aspectRatio', rawGlobal.aspectRatio, outputLang),
            cameraMovement: resolveField('cameraMovement', rawGlobal.cameraMovement, outputLang),
            motionStrength: resolveField('motionStrength', rawGlobal.motionStrength, outputLang),
            quality: resolveField('quality', rawGlobal.quality, outputLang),
            preservation: resolveField('preservation', rawGlobal.preservation, outputLang),
            negative: rawGlobal.useNegativePrompt ? rawGlobal.negativePrompt : ''
        };


        let result = '';

        // --- JSON / YAML Output (Structured Data) ---
        if (outputFormat === 'json' || outputFormat === 'yaml') {
            const dataObj = {
                meta: {
                    language: outputLang,
                    task_mode: rawGlobal.taskMode,
                    engine: rawGlobal.taskMode === 'video_generation' ? "veo/sora" : "gemini_nano_banana_pro"
                },
                subjects: state.subjects.map(s => resolveSubject(s)),
                global: globalFields,
                negative_prompt: globalFields.negative
            };

            if (outputFormat === 'json') {
                result = JSON.stringify(dataObj, null, 2);
            } else {
                result = "YAML output not fully implemented for multi-subject yet. Please use JSON or Text.";
            }

        }
        // --- Text / Markdown Output ---
        else {

            // Build Subject Strings
            const subjectStrings = state.subjects.map((subj, index) => {
                const sFields = resolveSubject(subj);
                let subjectDesc = '';

                if (subj.subjectType === 'human') {
                    const subjectEn = [sFields.nationality, sFields.age, sFields.gender, sFields.role].filter(Boolean).join(' ');
                    const subjectZh = [sFields.nationality, sFields.age, sFields.gender, sFields.role].filter(Boolean).join('');
                    subjectDesc = outputLang === 'en' ? `A ${subjectEn}` : `一個${subjectZh}`;
                } else if (subj.subjectType === 'animal') {
                    const sub = [sFields.animalFur, sFields.animalSpecies].filter(Boolean).join(outputLang === 'en' ? ' ' : '');
                    subjectDesc = outputLang === 'en' ? `A ${sub}` : `一隻${sub}`;
                } else if (subj.subjectType === 'vehicle') {
                    const sub = [sFields.vehicleColor, sFields.vehicleType].filter(Boolean).join(outputLang === 'en' ? ' ' : '');
                    subjectDesc = outputLang === 'en' ? `A ${sub}` : `一輛${sub}`;
                } else if (subj.subjectType === 'scenery') {
                    subjectDesc = outputLang === 'en' ? 'Landscape' : '風景';
                }

                // Combine subject details
                const detailParts = [
                    subjectDesc,
                    sFields.action,
                    sFields.clothing,
                    sFields.clothingDetail,
                    sFields.appearance,
                    sFields.accessories,
                    sFields.bodyType,
                    sFields.faceShape,
                    sFields.hairColor,
                    sFields.hairStyle,
                    sFields.eyeGaze,
                    sFields.hands,
                    sFields.mood
                ].filter(Boolean);

                const sep = outputLang === 'en' ? ', ' : '，';
                // Remove debug labels, just return content
                return detailParts.join(sep);
            });

            // Combine all subjects
            const subjectsJoined = subjectStrings.join(outputLang === 'en' ? ' AND ' : ' 與 ');

            // Construct Full Prompt
            const baseParts = [
                // 1. Camera Movement (Video)
                rawGlobal.taskMode === 'video_generation' ? globalFields.cameraMovement : null,

                // 2. Subjects
                subjectsJoined,

                // 3. Global Context
                globalFields.environment,
                rawGlobal.taskMode === 'video_generation' ? globalFields.motionStrength : null,
                globalFields.composition,
                globalFields.camera,
                globalFields.lighting,
                globalFields.era,
                globalFields.artStyle,
                globalFields.colorPalette,
                globalFields.quality,
                rawGlobal.taskMode === 'generation' ? globalFields.aspectRatio : null,
            ].filter(Boolean);

            const separator = outputLang === 'en' ? ', ' : '，';
            const basePrompt = baseParts.join(separator);

            if (outputFormat === 'markdown') {
                let md = `**Prompt**\n> ${basePrompt}`;
                if (globalFields.negative) md += `\n\n**Negative Prompt**\n> ${globalFields.negative}`;
                if (rawGlobal.referenceImages.length > 0) {
                    md += `\n\n**References**\n${rawGlobal.referenceImages.map(img => `- ${img.url} (${img.intent})`).join('\n')}`;
                }
                result = md;
            } else {
                result = basePrompt;
                if (globalFields.negative) result += `\n\n--no ${globalFields.negative}`;
            }
        }

        setGeneratedPrompt(result);
    }, [state, outputLang, outputFormat]);

    return generatedPrompt;
};
