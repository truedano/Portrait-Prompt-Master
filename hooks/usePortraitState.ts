import { useState } from 'react';
import { PortraitState, Gender, ReferenceImage, TaskMode } from '../types';
import { PROMPT_CATEGORIES } from '../constants';

export const usePortraitState = () => {
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
