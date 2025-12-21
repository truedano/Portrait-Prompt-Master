import { useState } from 'react';
import { PortraitState, Gender, ReferenceImage, TaskMode, SubjectType, SubjectConfig, GlobalConfig } from '../types';
import { PROMPT_CATEGORIES, SUBJECT_CATEGORY_CONFIG, SCENERY_FORBIDDEN_MOODS } from '../constants';

const createDefaultSubject = (id: string, type: SubjectType = 'human'): SubjectConfig => ({
    id,
    subjectType: type,
    gender: 'female',
    nationality: [],
    age: [],
    role: [],
    bodyType: [],
    faceShape: [],
    eyeGaze: [],
    hairColor: [],
    hairStyle: [],
    appearance: [],
    clothing: [],
    clothingDetail: [],
    accessories: [],
    action: [],
    hands: [],
    mood: [],
    animalSpecies: '',
    animalFur: [],
    vehicleType: '',
    vehicleColor: '',
    chartType: '',
    infographicStyle: '',
    infographicContent: ''
});

const defaultGlobal: GlobalConfig = {
    taskMode: 'generation',
    composition: [],
    era: '',
    environment: [],
    lighting: [],
    colorPalette: '',
    camera: [],
    artStyle: [],
    aspectRatio: '',
    cameraMovement: [],
    motionStrength: '',
    quality: ['masterpiece', 'best quality', '8k', 'highly detailed', 'detailed face'],
    preservation: [],
    negativePrompt: 'nsfw, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blur',
    useNegativePrompt: true,
    referenceImages: [],
    interaction: []
};

export const usePortraitState = () => {
    const defaultSubject = createDefaultSubject('subject-1');

    const [state, setState] = useState<PortraitState>({
        global: defaultGlobal,
        subjects: [defaultSubject],
        activeSubjectId: defaultSubject.id
    });

    // --- Subject Management ---
    const addSubject = () => {
        const newId = `subject-${Date.now()}`;
        const newSubject = createDefaultSubject(newId);
        setState(prev => {
            const newSubjects = [...prev.subjects, newSubject];
            const newGlobal = { ...prev.global };
            // Since new default subject is 'human', always ensure 'detailed face' is ON
            if (!newGlobal.quality.includes('detailed face')) {
                newGlobal.quality = [...newGlobal.quality, 'detailed face'];
            }
            return {
                ...prev,
                subjects: newSubjects,
                activeSubjectId: newId,
                global: newGlobal
            };
        });
    };

    const removeSubject = (id: string) => {
        setState(prev => {
            if (prev.subjects.length <= 1) return prev; // Don't remove the last one
            const newSubjects = prev.subjects.filter(s => s.id !== id);
            const newActiveId = prev.activeSubjectId === id ? newSubjects[0].id : prev.activeSubjectId;

            // Automation: check if any human remains
            const hasHuman = newSubjects.some(s => s.subjectType === 'human');
            const newGlobal = { ...prev.global };
            if (!hasHuman) {
                newGlobal.quality = newGlobal.quality.filter(q => q !== 'detailed face');
            } else if (!newGlobal.quality.includes('detailed face')) {
                newGlobal.quality = [...newGlobal.quality, 'detailed face'];
            }

            return {
                ...prev,
                subjects: newSubjects,
                activeSubjectId: newActiveId,
                global: newGlobal
            };
        });
    };

    const setActiveSubject = (id: string) => {
        setState(prev => ({ ...prev, activeSubjectId: id }));
    };

    const duplicateSubject = (id: string) => {
        setState(prev => {
            if (prev.subjects.length >= 5) return prev;
            const subjectToCopy = prev.subjects.find(s => s.id === id);
            if (!subjectToCopy) return prev;

            const newId = `subject-${Date.now()}`;
            const newSubject = { ...subjectToCopy, id: newId };
            const newSubjects = [...prev.subjects, newSubject];

            return {
                ...prev,
                subjects: newSubjects,
                activeSubjectId: newId
            };
        });
    };

    // --- Selection Logic ---
    const handleSelect = (category: string, value: string, isToggle = true) => {
        setState(prev => {
            const catConfig = PROMPT_CATEGORIES.find(c => c.id === category);

            // Scope check
            const scope = (catConfig as any)?.scope || 'global';

            if (scope === 'subject') {
                // Update Active Subject
                const activeIndex = prev.subjects.findIndex(s => s.id === prev.activeSubjectId);
                if (activeIndex === -1) return prev;

                const newSubjects = [...prev.subjects];
                const activeSubject = { ...newSubjects[activeIndex] } as any;
                const currentVal = activeSubject[category];

                // Force multi-select behavior for fields typed as array in SubjectConfig
                const isArrayType = Array.isArray(activeSubject[category]);

                if (isArrayType) {
                    let newValue: string[];
                    if (!isToggle) {
                        newValue = [value];
                    } else {
                        const exists = currentVal.includes(value);
                        newValue = exists ? currentVal.filter((v: string) => v !== value) : [...currentVal, value];
                    }
                    activeSubject[category] = newValue;
                } else {
                    // Single value
                    if (!isToggle) activeSubject[category] = value;
                    else activeSubject[category] = currentVal === value ? '' : value;
                }
                newSubjects[activeIndex] = activeSubject;
                return { ...prev, subjects: newSubjects };

            } else {
                // Update Global
                const newGlobal = { ...prev.global } as any;
                const currentVal = newGlobal[category];
                // Check if config says multi, OR if our new type says array
                const isArrayType = Array.isArray(newGlobal[category]);

                if (isArrayType) {
                    let newValue: string[];
                    if (!isToggle) {
                        newValue = [value];
                    } else {
                        const exists = currentVal.includes(value);
                        newValue = exists ? currentVal.filter((v: string) => v !== value) : [...currentVal, value];
                    }
                    newGlobal[category] = newValue;
                } else {
                    // Single value
                    if (!isToggle) newGlobal[category] = value;
                    else newGlobal[category] = currentVal === value ? '' : value;
                }
                return { ...prev, global: newGlobal };
            }
        });
    };

    const handleSubjectTypeSelect = (type: SubjectType) => {
        setState(prev => {
            const activeIndex = prev.subjects.findIndex(s => s.id === prev.activeSubjectId);
            if (activeIndex === -1) return prev;

            const newSubjects = [...prev.subjects];
            const oldSubject = newSubjects[activeIndex];

            if (oldSubject.subjectType === type) return prev;

            const allowedCategories = SUBJECT_CATEGORY_CONFIG[type] || [];

            const newSubject: any = { ...oldSubject, subjectType: type };

            // Reset invalid fields
            [
                'nationality', 'age', 'role', 'bodyType', 'faceShape', 'eyeGaze',
                'hairColor', 'hairStyle', 'appearance', 'clothing', 'clothingDetail',
                'accessories', 'action', 'hands', 'mood',
                'animalSpecies', 'animalFur', 'vehicleType', 'vehicleColor',
                'chartType', 'infographicStyle', 'infographicContent'
            ].forEach(key => {
                if (!allowedCategories.includes(key)) {
                    if (Array.isArray(newSubject[key])) newSubject[key] = [];
                    else newSubject[key] = '';
                }
            });

            // Gender handling
            if (type !== 'human') {
                newSubject.gender = undefined;
                if (type === 'scenery') {
                    newSubject.mood = newSubject.mood.filter((m: string) => !SCENERY_FORBIDDEN_MOODS.includes(m));
                }
            }

            newSubjects[activeIndex] = newSubject as SubjectConfig;

            // Automation: sync "Detailed Face" based on presence of any Human subject
            let newGlobal = { ...prev.global };
            const hasHuman = newSubjects.some(s => s.subjectType === 'human');

            // 1. Handle "Detailed Face"
            if (hasHuman) {
                if (!newGlobal.quality.includes('detailed face')) {
                    newGlobal.quality = [...newGlobal.quality, 'detailed face'];
                }
            } else {
                newGlobal.quality = newGlobal.quality.filter(q => q !== 'detailed face');
            }

            // 2. Infographic Automation: Force High Quality to avoid text errors (as requested)
            if (type === 'infographic') {
                // Ensure high quality tags are present
                const recommendedTags = ['masterpiece', 'best quality', '4k', '8k', 'highres'];
                recommendedTags.forEach(tag => {
                    if (!newGlobal.quality.includes(tag)) {
                        newGlobal.quality = [...newGlobal.quality, tag];
                    }
                });
                // Note: We deliberately KEEP these tags now, reverting the previous logic that removed them.
                // We still want to remove 'detailed face' if no human, which is handled by step 1.
            }

            return { ...prev, subjects: newSubjects, global: newGlobal };
        });
    };

    const handleGenderSelect = (gender: Gender) => {
        setState(prev => {
            const activeIndex = prev.subjects.findIndex(s => s.id === prev.activeSubjectId);
            if (activeIndex === -1) return prev;
            const newSubjects = [...prev.subjects];
            newSubjects[activeIndex] = {
                ...newSubjects[activeIndex],
                gender: newSubjects[activeIndex].gender === gender ? undefined : gender
            };
            return { ...prev, subjects: newSubjects };
        });
    };

    const handleTaskModeSelect = (mode: TaskMode) => {
        setState(prev => ({
            ...prev,
            global: {
                ...prev.global,
                taskMode: mode
            }
        }));
    };


    // Global Toggles
    const toggleQualityTag = (tagValue: string) => {
        setState(prev => {
            const current = prev.global.quality;
            const newTags = current.includes(tagValue)
                ? current.filter(t => t !== tagValue)
                : [...current, tagValue];
            return { ...prev, global: { ...prev.global, quality: newTags } };
        });
    };

    const togglePreservationTag = (tagValue: string) => {
        setState(prev => {
            const current = prev.global.preservation;
            const newTags = current.includes(tagValue)
                ? current.filter(t => t !== tagValue)
                : [...current, tagValue];
            return { ...prev, global: { ...prev.global, preservation: newTags } };
        });
    };

    const handleNegativeChange = (value: string) => {
        setState(prev => ({ ...prev, global: { ...prev.global, negativePrompt: value } }));
    };

    const toggleUseNegativePrompt = () => {
        setState(prev => ({ ...prev, global: { ...prev.global, useNegativePrompt: !prev.global.useNegativePrompt } }));
    };

    const toggleNegativeTag = (tag: string) => {
        setState(prev => {
            const currentRaw = prev.global.negativePrompt || '';
            const tags = currentRaw.split(',').map(t => t.trim()).filter(Boolean);
            let newTags;
            if (tags.includes(tag)) newTags = tags.filter(t => t !== tag);
            else newTags = [...tags, tag];
            return { ...prev, global: { ...prev.global, negativePrompt: newTags.join(', ') } };
        });
    };

    const handleRandomizeAll = (theme?: string) => {
        const themeKeywords: Record<string, string[]> = {
            'cyberpunk': ['cyberpunk', 'neon', 'mechanical', 'tech', 'futuristic', 'blue', 'purple', 'night', 'city', 'leather'],
            'fantasy': ['wizard', 'elf', 'magic', 'wood', 'forest', 'robe', 'medieval', 'castle', 'armor', 'sword'],
            'vintage': ['1920s', '1980s', 'retro', 'film', 'grain', 'sepia', 'faded', 'old'],
            'portrait': ['portrait', 'studio', 'lighting', 'bokeh', '85mm', 'sharp', 'clean']
        };
        const keywords = theme ? themeKeywords[theme] : [];

        setState(prev => {
            const activeIndex = prev.subjects.findIndex(s => s.id === prev.activeSubjectId);
            if (activeIndex === -1) return prev;

            const newSubjects = [...prev.subjects];
            // Shallow clone active subject to modify
            const newSubject = { ...newSubjects[activeIndex] } as any;
            const newGlobal = { ...prev.global } as any;

            PROMPT_CATEGORIES.forEach(cat => {
                // Video/task checks
                if (newGlobal.taskMode === 'video_generation' && cat.id === 'aspectRatio') return;
                if (newGlobal.taskMode !== 'video_generation' && (cat.id === 'cameraMovement' || cat.id === 'motionStrength')) return;

                const scope = (cat as any).scope || 'global';

                if (scope === 'subject') {
                    // Subject Randomization
                    const allowedForSubject = SUBJECT_CATEGORY_CONFIG[newSubject.subjectType] || [];
                    if (!allowedForSubject.includes(cat.id)) return;

                    let validOptions = cat.options.filter(opt => !opt.gender || !newSubject.gender || opt.gender === newSubject.gender);

                    if (newSubject.subjectType === 'scenery') {
                        if (cat.id === 'mood') {
                            validOptions = validOptions.filter(opt => !SCENERY_FORBIDDEN_MOODS.includes(opt.value));
                        } else {
                            const forbiddenSceneryOptions = ['close-up portrait', 'medium shot, upper body', 'full body shot', 'selfie angle', '85mm lens'];
                            validOptions = validOptions.filter(opt => !forbiddenSceneryOptions.includes(opt.value));
                        }
                    }

                    if (theme && keywords.length > 0) {
                        const themed = validOptions.filter(opt => keywords.some(k => opt.value.toLowerCase().includes(k)));
                        if (themed.length > 0) validOptions = themed;
                    }

                    if (validOptions.length > 0) {
                        const randomVal = validOptions[Math.floor(Math.random() * validOptions.length)].value;
                        if (Array.isArray(newSubject[cat.id])) newSubject[cat.id] = [randomVal];
                        else newSubject[cat.id] = randomVal;
                    }
                } else {
                    // Global Randomization
                    let validOptions = cat.options;
                    if (theme && keywords.length > 0) {
                        const themed = validOptions.filter(opt => keywords.some(k => opt.value.toLowerCase().includes(k)));
                        if (themed.length > 0) validOptions = themed;
                    }
                    if (validOptions.length > 0) {
                        const randomVal = validOptions[Math.floor(Math.random() * validOptions.length)].value;
                        if (Array.isArray(newGlobal[cat.id])) newGlobal[cat.id] = [randomVal];
                        else newGlobal[cat.id] = randomVal;
                    }
                }
            });

            newSubjects[activeIndex] = newSubject;
            return { ...prev, subjects: newSubjects, global: newGlobal };
        });
    };

    const handleClear = () => {
        setState(prev => {
            const activeIndex = prev.subjects.findIndex(s => s.id === prev.activeSubjectId);
            if (activeIndex === -1) return prev;

            const clearedSubject = createDefaultSubject(prev.activeSubjectId, prev.subjects[activeIndex].subjectType);
            // Preserve type and gender preferences if desired, or reset?
            // "Clear" typically means reset to default.
            // Let's keep the TYPE but reset fields.
            clearedSubject.subjectType = prev.subjects[activeIndex].subjectType;
            clearedSubject.gender = prev.subjects[activeIndex].gender;

            const newSubjects = [...prev.subjects];
            newSubjects[activeIndex] = clearedSubject;

            // Clear Global but keep defaults
            const clearedGlobal: GlobalConfig = {
                ...defaultGlobal,
                referenceImages: []
            };

            return { ...prev, subjects: newSubjects, global: clearedGlobal };
        });
    };

    // --- Persistence / Migration ---
    const importState = (inputState: any) => {
        if (!inputState) return;

        // Check if it's already new format
        if (inputState.global && inputState.subjects && Array.isArray(inputState.subjects)) {
            setState(inputState as PortraitState);
            return;
        }

        // Migration Logic for Legacy State
        const newId = `subject-${Date.now()}`;
        const prevSubjectType = inputState.subjectType || 'human';
        const newSubject = createDefaultSubject(newId, prevSubjectType);

        // Map Subject Fields
        const subjectKeys: (keyof SubjectConfig)[] = [
            'gender', 'nationality', 'age', 'role', 'bodyType', 'faceShape', 'eyeGaze',
            'hairColor', 'hairStyle', 'appearance', 'clothing', 'clothingDetail', 'accessories',
            'action', 'hands', 'mood', 'animalSpecies', 'animalFur', 'vehicleType', 'vehicleColor'
        ];

        subjectKeys.forEach(key => {
            if (inputState[key] !== undefined) {
                (newSubject as any)[key] = inputState[key];
            }
        });

        // Map Global Fields
        const newGlobal: GlobalConfig = { ...defaultGlobal };
        const globalKeys: (keyof GlobalConfig)[] = [
            'taskMode', 'composition', 'era', 'environment', 'lighting', 'colorPalette',
            'camera', 'artStyle', 'aspectRatio', 'cameraMovement', 'motionStrength',
            'quality', 'preservation', 'negativePrompt', 'useNegativePrompt', 'referenceImages',
            'interaction'
        ];

        globalKeys.forEach(key => {
            if (inputState[key] !== undefined) {
                (newGlobal as any)[key] = inputState[key];
            }
        });

        setState({
            global: newGlobal,
            subjects: [newSubject],
            activeSubjectId: newId
        });
    };

    const addReferenceImage = (img: ReferenceImage) => {
        setState(prev => ({ ...prev, global: { ...prev.global, referenceImages: [img, ...prev.global.referenceImages] } }));
    };

    const updateReferenceImage = (id: string, updates: Partial<ReferenceImage>) => {
        setState(prev => ({
            ...prev,
            global: {
                ...prev.global,
                referenceImages: prev.global.referenceImages.map(img => img.id === id ? { ...img, ...updates } : img)
            }
        }));
    };

    const removeReferenceImage = (id: string) => {
        setState(prev => ({
            ...prev,
            global: {
                ...prev.global,
                referenceImages: prev.global.referenceImages.filter(img => img.id !== id)
            }
        }));
    };

    return {
        state,
        setState,
        importState, // Exported new function
        addSubject,
        duplicateSubject,
        removeSubject,
        setActiveSubject,
        handleSelect,
        handleSubjectTypeSelect,
        handleGenderSelect,
        handleTaskModeSelect,
        toggleQualityTag,
        togglePreservationTag,
        handleNegativeChange,
        toggleUseNegativePrompt,
        toggleNegativeTag,
        handleRandomizeAll,
        handleClear,
        addReferenceImage,
        updateReferenceImage,
        removeReferenceImage
    };
};
