import { useState, useEffect } from 'react';
import { PortraitState, OutputLanguage, OutputFormat, SubjectConfig, GlobalConfig, GeneratedPromptResult, PromptSection } from '../types';
import { PROMPT_CATEGORIES, QUALITY_TAGS, PRESERVATION_OPTIONS, SCENERY_FORBIDDEN_MOODS } from '../constants';

export const usePromptGenerator = (
    state: PortraitState,
    outputLang: OutputLanguage,
    outputFormat: OutputFormat
): GeneratedPromptResult => {
    const [result, setResult] = useState<GeneratedPromptResult>({ fullText: '', sections: [] });

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

    const jsonToYaml = (obj: any, indent = 0): string => {
        const spaces = '  '.repeat(indent);
        if (Array.isArray(obj)) {
            if (obj.length === 0) return ' []';
            return obj.map(item => `\n${spaces}- ${jsonToYaml(item, indent + 1).trim()}`).join('');
        } else if (typeof obj === 'object' && obj !== null) {
            let yaml = '';
            Object.entries(obj).forEach(([key, value]) => {
                if (value === null || value === undefined || value === '') return;
                const valStr = jsonToYaml(value, indent + 1);
                yaml += `\n${spaces}${key}:${valStr.includes('\n') ? valStr : ' ' + valStr.trim()}`;
            });
            return yaml;
        } else {
            const str = String(obj);
            // Basic escape for strings with special characters
            if (str.includes(':') || str.includes('#') || str.includes('[') || str.includes(']') || str.includes('{') || str.includes('}') || str.includes(',') || str.includes('*') || str.includes('!')) {
                return ` "${str.replace(/"/g, '\\"')}"`;
            }
            return ` ${str}`;
        }
    };

    // --- Logic ---
    useEffect(() => {
        const rawGlobal = state.global;
        const sections: PromptSection[] = [];

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

                chartType: resolveField('chartType', (subj as any).chartType, outputLang),
                infographicStyle: resolveField('infographicStyle', (subj as any).infographicStyle, outputLang),
                infographicContent: resolveField('infographicContent', (subj as any).infographicContent, outputLang),

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
                const moodArray = Array.isArray(subj.mood) ? subj.mood : (subj.mood ? [subj.mood] : []);
                const filteredMood = moodArray.filter(m => !SCENERY_FORBIDDEN_MOODS.includes(m));
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
            negative: rawGlobal.useNegativePrompt ? rawGlobal.negativePrompt : '',
            interaction: resolveField('interaction', rawGlobal.interaction, outputLang)
        };

        // Build Subject Strings & Add to Sections
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
            } else if (subj.subjectType === 'infographic') {
                const parts = [
                    sFields.infographicStyle,
                    sFields.chartType,
                    sFields.infographicContent ? (outputLang === 'en' ? `about ${sFields.infographicContent}` : `關於 ${sFields.infographicContent}`) : null
                ].filter(Boolean);
                const sub = parts.join(outputLang === 'en' ? ', ' : '，');
                subjectDesc = outputLang === 'en' ? `Infographic: ${sub}` : `資訊圖表：${sub}`;
            }

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
            const content = detailParts.join(sep);

            sections.push({
                id: subj.id,
                type: 'subject',
                label: `Subject ${index + 1}`,
                content: content
            });

            return content;
        });

        // 1. Interaction (Add specifically if needed)
        if (state.subjects.length > 1 && globalFields.interaction) {
            sections.unshift({
                id: 'interaction',
                type: 'global',
                label: outputLang === 'en' ? 'Interaction' : '交互',
                content: globalFields.interaction
            });
        }

        // 2. Camera & Env (Global)
        const globalContentParts = [
            rawGlobal.taskMode === 'video_generation' ? globalFields.cameraMovement : null,
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

        if (globalContentParts.length > 0) {
            sections.push({
                id: 'global-settings',
                type: 'global',
                label: outputLang === 'en' ? 'Global' : '全域',
                content: globalContentParts.join(outputLang === 'en' ? ', ' : '，')
            });
        }

        // 3. Negative
        if (globalFields.negative) {
            sections.push({
                id: 'negative-prompt',
                type: 'negative',
                label: outputLang === 'en' ? 'Negative' : '負面',
                content: globalFields.negative
            });
        }

        // 4. References
        if (rawGlobal.referenceImages.length > 0) {
            sections.push({
                id: 'references',
                type: 'reference',
                label: outputLang === 'en' ? 'References' : '參考',
                content: rawGlobal.referenceImages.map(img => `${img.url} (${img.intent})`).join(', ')
            });
        }

        let fullText = '';
        if (outputFormat === 'json') {
            const dataObj = {
                meta: { language: outputLang, task_mode: rawGlobal.taskMode },
                global: globalFields,
                subjects: state.subjects.map(s => resolveSubject(s)),
            };
            fullText = JSON.stringify(dataObj, null, 2);
        } else if (outputFormat === 'yaml') {
            const dataObj = {
                meta: { language: outputLang, task_mode: rawGlobal.taskMode },
                global: globalFields,
                subjects: state.subjects.map(s => resolveSubject(s))
            };
            fullText = jsonToYaml(dataObj).trim();
        } else if (outputFormat === 'markdown') {
            fullText = sections.map(s => `**${s.label}**\n> ${s.content}`).join('\n\n');
        } else {
            // Text format: Join subjects with AND, then add global
            const subjectsJoined = subjectStrings.join(outputLang === 'en' ? ' AND ' : ' 與 ');
            const baseParts = [
                state.subjects.length > 1 ? globalFields.interaction : null,
                rawGlobal.taskMode === 'video_generation' ? globalFields.cameraMovement : null,
                subjectsJoined,
                ...globalContentParts.filter(p => !subjectStrings.includes(p)) // Avoid double adding for now, though globalContentParts is cleaner anyway
            ].filter(Boolean);

            // Re-evaluating text construction to match sections perfectly
            // Let's just join subject + global parts for pure text
            fullText = [
                state.subjects.length > 1 ? globalFields.interaction : null,
                ...subjectStrings,
                ...globalContentParts
            ].filter(Boolean).join(outputLang === 'en' ? ', ' : '，');

            if (globalFields.negative) fullText += `\n\n--no ${globalFields.negative}`;
        }

        setResult({ fullText, sections });
    }, [state, outputLang, outputFormat]);

    return result;
};
