import { useState } from 'react';
import { PortraitState, Gender, ReferenceImage, TaskMode, SubjectType } from '../types';
import { PROMPT_CATEGORIES, SUBJECT_CATEGORY_CONFIG, SCENERY_FORBIDDEN_MOODS } from '../constants';

export const usePortraitState = () => {
    const [state, setState] = useState<PortraitState>({
        taskMode: 'generation', // Default mode
        subjectType: 'human',
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

        animalSpecies: '',
        animalFur: [],
        vehicleType: '',
        vehicleColor: '',

        quality: ['masterpiece', 'best quality', '8k', 'highly detailed', 'detailed face'],
        preservation: [],
        negativePrompt: 'nsfw, lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blur',
        useNegativePrompt: true
    });

    const handleSelect = (category: string, value: string, isToggle = true) => {
        setState(prev => {
            const currentVal = (prev as any)[category];
            // Check if the category definition allows multiSelect
            const catConfig = PROMPT_CATEGORIES.find(c => c.id === category);
            const isMulti = catConfig?.multiSelect;

            if (isMulti && Array.isArray(currentVal)) {
                if (!isToggle) {
                    // Force set (replace all)
                    return { ...prev, [category]: [value] };
                }

                const exists = currentVal.includes(value);
                const newValue = exists
                    ? currentVal.filter(v => v !== value)
                    : [...currentVal, value];
                return { ...prev, [category]: newValue };
            } else {
                // Single select logic
                if (!isToggle) return { ...prev, [category]: value };
                return { ...prev, [category]: currentVal === value ? '' : value };
            }
        });
    };

    const handleSubjectTypeSelect = (type: SubjectType) => {
        setState(prev => {
            if (prev.subjectType === type) return prev; // No change

            // Smart Clear: Keep only fields valid for the new SubjectType
            const allowedCategories = SUBJECT_CATEGORY_CONFIG[type] || [];

            // Core fields to always keep
            const preservedKeys = [
                'taskMode', 'subjectType', 'gender', 'referenceImages',
                'quality', 'preservation', 'negativePrompt', 'useNegativePrompt'
            ];

            // 1. Start with copying preserved keys
            const newState: any = {};
            preservedKeys.forEach(key => {
                newState[key] = (prev as any)[key];
            });

            // 2. Set new subject type
            newState.subjectType = type;

            // 3. For every category in PROMPT_CATEGORIES, check if allowed
            PROMPT_CATEGORIES.forEach(cat => {
                // If this category is allowed in the NEW subject type, copy old value
                if (allowedCategories.includes(cat.id)) {
                    newState[cat.id] = (prev as any)[cat.id];
                } else {
                    // Otherwise reset to default
                    if (cat.multiSelect) {
                        newState[cat.id] = [];
                    } else {
                        newState[cat.id] = '';
                    }
                }
            });

            // Specially handle Gender: if switching to non-human, maybe we should clear gender?
            // Current design: Human keeps gender. Animal/Vehicle ignores it visually but maybe we clear it for cleaner state.
            // Let's clear gender if not human to avoid "Female Car" unless user wants that.
            if (type !== 'human') {
                newState.gender = undefined;
                newState.quality = (prev.quality || []).filter(q => q !== 'detailed face');
                // Also clean up forbidden moods if switching to scenery
                if (type === 'scenery') {
                    newState.mood = (prev.mood || []).filter(m => !SCENERY_FORBIDDEN_MOODS.includes(m));
                }
            } else {
                // If switching back to human, auto-add 'detailed face' for best results
                if (!newState.quality.includes('detailed face')) {
                    newState.quality = [...newState.quality, 'detailed face'];
                }
            }

            return newState as PortraitState;
        });
    };

    const handleGenderSelect = (gender: Gender) => {
        setState(prev => ({
            ...prev,
            gender: prev.gender === gender ? undefined : gender
        }));
    };

    const handleTaskModeSelect = (mode: TaskMode) => {
        setState(prev => ({
            ...prev,
            taskMode: mode,
            // If switching to editing mode, default gender to undefined (unselected)
            gender: mode === 'editing' ? undefined : prev.gender
        }));
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

    const handleNegativeChange = (value: string) => {
        setState(prev => ({ ...prev, negativePrompt: value }));
    };

    const toggleUseNegativePrompt = () => {
        setState(prev => ({ ...prev, useNegativePrompt: !prev.useNegativePrompt }));
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

    const handleRandomizeAll = (theme?: string) => {
        const newValues: Partial<PortraitState> = {};

        // Define theme filters (keywords to look for in option values)
        const themeKeywords: Record<string, string[]> = {
            'cyberpunk': ['cyberpunk', 'neon', 'mechanical', 'tech', 'futuristic', 'blue', 'purple', 'night', 'city', 'leather'],
            'fantasy': ['wizard', 'elf', 'magic', 'wood', 'forest', 'robe', 'medieval', 'castle', 'armor', 'sword'],
            'vintage': ['1920s', '1980s', 'retro', 'film', 'grain', 'sepia', 'faded', 'old'],
            'portrait': ['portrait', 'studio', 'lighting', 'bokeh', '85mm', 'sharp', 'clean']
        };

        const keywords = theme ? themeKeywords[theme] : [];

        PROMPT_CATEGORIES.forEach(cat => {
            // Logic for hiding fields should also apply to randomization to avoid setting hidden values
            if (state.taskMode === 'video_generation' && cat.id === 'aspectRatio') return;
            if (state.taskMode !== 'video_generation' && (cat.id === 'cameraMovement' || cat.id === 'motionStrength')) return;

            // Check if category is allowed for current subject type
            const allowedForSubject = SUBJECT_CATEGORY_CONFIG[state.subjectType] || [];
            if (!allowedForSubject.includes(cat.id)) return;

            // Filter options by gender (if no gender selected, allow all)
            let validOptions = cat.options.filter(opt => !opt.gender || !state.gender || opt.gender === state.gender);

            // Filter character-specific options for Scenery mode
            if (state.subjectType === 'scenery') {
                if (cat.id === 'mood') {
                    validOptions = validOptions.filter(opt => !SCENERY_FORBIDDEN_MOODS.includes(opt.value));
                } else {
                    const forbiddenSceneryOptions = ['close-up portrait', 'medium shot, upper body', 'full body shot', 'selfie angle', '85mm lens'];
                    validOptions = validOptions.filter(opt => !forbiddenSceneryOptions.includes(opt.value));
                }
            }

            // If a theme is selected, filter options further by keywords
            if (theme && keywords.length > 0) {
                const themedOptions = validOptions.filter(opt =>
                    keywords.some(k => opt.value.toLowerCase().includes(k))
                );
                // If theme matches found, prefer them. Otherwise fallback to all valid options.
                if (themedOptions.length > 0) {
                    validOptions = themedOptions;
                }
            }

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

    const handleClear = () => {
        setState(prev => ({
            ...prev,
            nationality: '', age: '', bodyType: [], role: '', faceShape: '', eyeGaze: '',
            hairColor: [], hairStyle: [], appearance: [], clothing: [], clothingDetail: [],
            accessories: [], action: '', hands: '', composition: '', era: '', environment: '',
            lighting: [], colorPalette: '', camera: '', artStyle: [], mood: [], aspectRatio: '',
            cameraMovement: '', motionStrength: '',
            animalSpecies: '', animalFur: [], vehicleType: '', vehicleColor: '',
            quality: prev.subjectType === 'human'
                ? ['masterpiece', 'best quality', '8k', 'highly detailed', 'detailed face']
                : ['masterpiece', 'best quality', '8k', 'highly detailed'],
            preservation: [],
            negativePrompt: '',
            useNegativePrompt: true,
            referenceImages: []
        }));
    };

    const addReferenceImage = (img: ReferenceImage) => {
        setState(prev => ({ ...prev, referenceImages: [img, ...prev.referenceImages] }));
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

    return {
        state,
        setState,
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
