import { useState, useEffect } from 'react';
import { PortraitState, OutputLanguage, OutputFormat, SubjectConfig, GlobalConfig, GeneratedPromptResult, PromptSection } from '../types';
import { PROMPT_CATEGORIES, QUALITY_TAGS, PRESERVATION_OPTIONS, SCENERY_FORBIDDEN_MOODS } from '../constants';

const CATEGORY_LABELS_ZH: Record<string, string> = {
    subjectType: '主體類型',
    nationality: '國籍/人種',
    age: '年齡',
    gender: '性別',
    role: '角色/職業',
    bodyType: '體型',
    faceShape: '臉型',
    eyeGaze: '視線與眼神',
    hairColor: '髮色',
    hairStyle: '髮型',
    appearance: '外觀細節',
    clothing: '服裝',
    clothingDetail: '服裝材質',
    accessories: '飾品與配件',
    action: '動作',
    hands: '手部互動',
    mood: '情緒',
    animalSpecies: '物種',
    animalFur: '毛色/特徵',
    vehicleType: '車型',
    vehicleColor: '烤漆顏色',
    chartType: '圖表類型',
    infographicStyle: '圖表風格',
    infographicContent: '內容主題',
    composition: '構圖與視角',
    cameraMovement: '運鏡方式',
    motionStrength: '動態強度',
    environment: '背景環境',
    era: '時代背景',
    lighting: '光影',
    colorPalette: '色調與濾鏡',
    artStyle: '藝術風格',
    camera: '攝影器材',
    aspectRatio: '解析度/比例',
    quality: '品質要求',
    preservation: '保留細節',
    interaction: '主體互動'
};

const SUBJECT_GROUPS_ZH: Record<string, { label: string; fields: string[] }[]> = {
    human: [
        { label: '主體特徵', fields: ['nationality', 'age', 'gender', 'role'] },
        { label: '外形細節', fields: ['bodyType', 'faceShape', 'hairColor', 'hairStyle', 'appearance', 'eyeGaze'] },
        { label: '服裝飾品', fields: ['clothing', 'clothingDetail', 'accessories'] },
        { label: '動作狀態', fields: ['action', 'hands', 'mood'] }
    ],
    animal: [
        { label: '物種特徵', fields: ['animalSpecies', 'animalFur'] },
        { label: '外觀細節', fields: ['appearance', 'clothing', 'accessories'] },
        { label: '動作狀態', fields: ['action', 'mood'] }
    ],
    vehicle: [
        { label: '車輛特徵', fields: ['vehicleType', 'vehicleColor'] }
    ],
    scenery: [
        { label: '場景情緒', fields: ['mood'] }
    ],
    infographic: [
        { label: '圖表資訊', fields: ['chartType', 'infographicStyle', 'infographicContent'] }
    ]
};

const GLOBAL_GROUPS_ZH = [
    { label: '構圖鏡頭', fields: ['composition', 'camera', 'aspectRatio', 'cameraMovement', 'motionStrength'] },
    { label: '場景與風格', fields: ['environment', 'era', 'lighting', 'colorPalette', 'artStyle'] },
    { label: '全域與畫質', fields: ['quality', 'preservation', 'interaction'] }
];

const CATEGORY_LABELS_EN: Record<string, string> = {
    subjectType: 'Subject Type',
    nationality: 'Nationality',
    age: 'Age',
    gender: 'Gender',
    role: 'Role',
    bodyType: 'Body Type',
    faceShape: 'Face Shape',
    eyeGaze: 'Gaze',
    hairColor: 'Hair Color',
    hairStyle: 'Hair Style',
    appearance: 'Features',
    clothing: 'Clothing',
    clothingDetail: 'Clothing Detail',
    accessories: 'Accessories',
    action: 'Pose',
    hands: 'Hands',
    mood: 'Mood',
    animalSpecies: 'Species',
    animalFur: 'Fur',
    vehicleType: 'Vehicle Type',
    vehicleColor: 'Paint Color',
    chartType: 'Chart Type',
    infographicStyle: 'Infographic Style',
    infographicContent: 'Content Context',
    composition: 'Composition',
    cameraMovement: 'Camera Move',
    motionStrength: 'Motion Strength',
    environment: 'Environment',
    era: 'Era',
    lighting: 'Lighting',
    colorPalette: 'Color Palette',
    artStyle: 'Style',
    camera: 'Camera & Lens',
    aspectRatio: 'Resolution',
    quality: 'Quality',
    preservation: 'Preserve',
    interaction: 'Interaction'
};

const SUBJECT_GROUPS_EN: Record<string, { label: string; fields: string[] }[]> = {
    human: [
        { label: 'Core Attributes', fields: ['nationality', 'age', 'gender', 'role'] },
        { label: 'Visual Details', fields: ['bodyType', 'faceShape', 'hairColor', 'hairStyle', 'appearance', 'eyeGaze'] },
        { label: 'Attire', fields: ['clothing', 'clothingDetail', 'accessories'] },
        { label: 'State & Action', fields: ['action', 'hands', 'mood'] }
    ],
    animal: [
        { label: 'Species Info', fields: ['animalSpecies', 'animalFur'] },
        { label: 'Appearance', fields: ['appearance', 'clothing', 'accessories'] },
        { label: 'Action', fields: ['action', 'mood'] }
    ],
    vehicle: [
        { label: 'Vehicle Specs', fields: ['vehicleType', 'vehicleColor'] }
    ],
    scenery: [
        { label: 'Scene Mood', fields: ['mood'] }
    ],
    infographic: [
        { label: 'Infographic Data', fields: ['chartType', 'infographicStyle', 'infographicContent'] }
    ]
};

const GLOBAL_GROUPS_EN = [
    { label: 'Composition & Camera', fields: ['composition', 'camera', 'aspectRatio', 'cameraMovement', 'motionStrength'] },
    { label: 'Environment & Style', fields: ['environment', 'era', 'lighting', 'colorPalette', 'artStyle'] },
    { label: 'Advanced', fields: ['quality', 'preservation', 'interaction'] }
];

const SUBJECT_TYPE_LABELS_ZH: Record<string, string> = {
    human: '人類',
    animal: '動物',
    vehicle: '車輛',
    scenery: '風景',
    infographic: '資訊圖表'
};

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
                subjectType: outputLang === 'en' ? subj.subjectType : (SUBJECT_TYPE_LABELS_ZH[subj.subjectType] || subj.subjectType),
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
                label: outputLang === 'en' ? `Subject ${index + 1}` : `主體 ${index + 1}`,
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
        } else if (outputFormat === 'markdown' || (outputFormat === 'text' && outputLang === 'zh')) {
            const isMd = outputFormat === 'markdown';
            const isZh = outputLang === 'zh';
            const labels = isZh ? CATEGORY_LABELS_ZH : CATEGORY_LABELS_EN;
            const subGroups = isZh ? SUBJECT_GROUPS_ZH : SUBJECT_GROUPS_EN;
            const globGroups = isZh ? GLOBAL_GROUPS_ZH : GLOBAL_GROUPS_EN;
            const groupedSections: string[] = [];

            // Add Task Mode Header
            const taskHeader = isZh ?
                (rawGlobal.taskMode === 'editing' ? '圖片編輯模式 (Image Editing)' :
                    rawGlobal.taskMode === 'video_generation' ? '影片生成模式 (Video Generation)' :
                        '圖片生成模式 (Image Generation)') :
                (rawGlobal.taskMode === 'editing' ? 'Task: Image Editing' :
                    rawGlobal.taskMode === 'video_generation' ? 'Task: Video Generation' :
                        'Task: Image Generation');

            groupedSections.push(isMd ? `# ${taskHeader}` : `【${taskHeader}】`);

            state.subjects.forEach((subj, index) => {
                const sFields = resolveSubject(subj);
                const typeGroups = subGroups[subj.subjectType] || [];
                const typeLabel = isZh ? (SUBJECT_TYPE_LABELS_ZH[subj.subjectType] || subj.subjectType) : subj.subjectType;

                let subjectTitle = '';
                const titleText = isZh ? `主體 ${index + 1} (${typeLabel})` : `Subject ${index + 1} (${typeLabel})`;
                subjectTitle = isMd ? `## ● ${titleText}` : `● ${titleText}`;

                const subjectContent: string[] = [];
                typeGroups.forEach(group => {
                    const groupLines = group.fields.map(f => {
                        const val = sFields[f];
                        if (!val) return null;
                        const label = labels[f] || f;
                        return isMd ? `- **${label}** : ${val}` : `  ${label} : ${val}`;
                    }).filter(Boolean);

                    if (groupLines.length > 0) {
                        const groupHeader = isMd ? `### [${group.label}]` : `[${group.label}]`;
                        subjectContent.push(`${groupHeader}\n${groupLines.join('\n')}`);
                    }
                });

                if (subjectContent.length > 0) {
                    groupedSections.push(subjectTitle + '\n' + subjectContent.join('\n\n'));
                }
            });

            const globalContent: string[] = [];
            globGroups.forEach(group => {
                const groupLines = group.fields.map(f => {
                    if (f === 'interaction' && state.subjects.length <= 1) return null;
                    if (rawGlobal.taskMode !== 'video_generation' && (f === 'cameraMovement' || f === 'motionStrength')) return null;
                    if (rawGlobal.taskMode !== 'editing' && f === 'preservation') return null;

                    const val = (globalFields as any)[f];
                    if (!val) return null;
                    const label = labels[f] || f;
                    return isMd ? `- **${label}** : ${val}` : `  ${label} : ${val}`;
                }).filter(Boolean);

                if (groupLines.length > 0) {
                    const groupHeader = isMd ? `### [${group.label}]` : `[${group.label}]`;
                    globalContent.push(`${groupHeader}\n${groupLines.join('\n')}`);
                }
            });

            if (globalContent.length > 0) {
                const globalTitle = isZh ? `全域設定` : `Global Settings`;
                const title = isMd ? `## ● ${globalTitle}` : `● ${globalTitle}`;
                groupedSections.push(`${title}\n` + globalContent.join('\n\n'));
            }

            if (globalFields.negative) {
                const negLabel = isZh ? '負面提示詞' : 'Negative Prompt';
                const negHeader = isMd ? `### [${negLabel}]` : `[${negLabel}]`;
                groupedSections.push(`${negHeader}\n${isMd ? '' : '  '}${globalFields.negative}`);
            }

            fullText = groupedSections.join('\n\n');
        } else {
            // Text format (English): Task-specific narratives
            const subjectsJoined = subjectStrings.join(' AND ');

            if (rawGlobal.taskMode === 'video_generation') {
                const camera = globalFields.cameraMovement ? `Camera moves: ${globalFields.cameraMovement}. ` : '';
                const motion = globalFields.motionStrength ? `Motion: ${globalFields.motionStrength}. ` : '';
                fullText = `A cinematic video showcasing ${subjectsJoined}. ${camera}${motion}Set in ${globalFields.environment || 'the scene'}, ${globalContentParts.filter(p => !subjectStrings.includes(p) && p !== globalFields.cameraMovement && p !== globalFields.motionStrength).join(', ')}.`;
            } else if (rawGlobal.taskMode === 'editing') {
                const preserve = globalFields.preservation ? ` While preserving ${globalFields.preservation},` : '';
                const refs = rawGlobal.referenceImages.length > 0 ? ` based on the provided reference(s),` : '';
                fullText = `Modify the image to feature ${subjectsJoined}.${preserve}${refs} Overall style adjustment: ${globalContentParts.filter(p => !subjectStrings.includes(p)).join(', ')}.`;
            } else {
                // Standard generation
                fullText = [
                    state.subjects.length > 1 ? globalFields.interaction : null,
                    ...subjectStrings,
                    ...globalContentParts
                ].filter(Boolean).join(', ');
            }

            if (globalFields.negative) fullText += `\n\n--no ${globalFields.negative}`;
        }

        setResult({ fullText, sections });
    }, [state, outputLang, outputFormat]);

    return result;
};
