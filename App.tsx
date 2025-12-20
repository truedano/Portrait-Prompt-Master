import React, { useState, useEffect } from 'react';
import { PROMPT_CATEGORIES, QUALITY_TAGS, COMMON_NEGATIVE_PROMPTS, PRESERVATION_OPTIONS, SUBJECT_CATEGORY_CONFIG, SCENERY_FORBIDDEN_MOODS } from './constants';
import { PortraitState, OutputLanguage, OutputFormat, ReferenceImage, TaskMode } from './types';
import { SelectionCard } from './components/SelectionCard';
import { SubjectSelector } from './components/SubjectSelector';
import { ReferenceImageCard } from './components/ReferenceImageCard';
import { Accordion } from './components/Accordion';
import { HistoryPanel } from './components/HistoryPanel';
import { usePortraitState } from './hooks/usePortraitState';
import { usePromptGenerator } from './hooks/usePromptGenerator';
import { useHistory } from './hooks/useHistory';

const App: React.FC = () => {
  // --- Custom Hooks ---
  const {
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
  } = usePortraitState();

  const {
    history,
    favorites,
    addToHistory,
    toggleFavorite,
    removeFavorite, // exposed but used via toggleFavorite mainly
    clearHistory
  } = useHistory();

  // --- UI State (Layout/View only) ---
  const [outputLang, setOutputLang] = useState<OutputLanguage>('en');
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('text');
  const [copied, setCopied] = useState(false);
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);

  // New UI states for sliding panels
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // --- Prompt Generation ---
  const generatedPrompt = usePromptGenerator(state, outputLang, outputFormat);

  // --- Effects ---
  const handleCopy = async () => {
    if (!generatedPrompt) return;

    const onSuccess = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      addToHistory(state);
    };

    try {
      // Try modern Clipboard API first
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(generatedPrompt);
        onSuccess();
      } else {
        throw new Error("Clipboard API unavailable");
      }
    } catch (err) {
      console.warn('Clipboard API failed, attempting fallback...', err);
      // Fallback for older browsers or non-secure contexts
      try {
        const textArea = document.createElement("textarea");
        textArea.value = generatedPrompt;

        // Ensure it's not visible but part of DOM
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);

        textArea.focus();
        textArea.select();

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (successful) {
          onSuccess();
        } else {
          console.error("Fallback copy failed.");
          alert("複製失敗，請手動選取文字複製。");
        }
      } catch (fallbackErr) {
        console.error("Fallback copy error:", fallbackErr);
        alert("複製失敗，請手動選取文字複製。");
      }
    }
  };

  const handleLoadState = (loadedState: PortraitState) => {
    setState(loadedState);
    // Optional: close panel on mobile, keep open on desktop?
    // setIsHistoryOpen(false); 
  };

  const handleSmartRandomize = (theme?: string) => {
    handleRandomizeAll(theme);
    // We don't auto-add to history here, let user explore first.
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

  const HistoryIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v5h5" /><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" /><path d="M12 7v5l4 2" /></svg>
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
      title: '主體特徵 (Subject Details)',
      icon: <UserIcon />,
      categoryIds: [
        'nationality', 'age', 'role', // Human
        'animalSpecies', 'animalFur', // Animal
        'vehicleType', 'vehicleColor' // Vehicle
      ]
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

  const OutputToolbar = () => (
    <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <span className="text-xs font-mono text-slate-400 uppercase flex items-center gap-2">
          <CodeIcon />
          {state.taskMode === 'editing' ? '編輯指令 (Instructions)' :
            state.taskMode === 'video_generation' ? '影片提示詞 (Video Prompt)' :
              '繪圖提示詞 (Image Prompt)'}
        </span>
        <div className="flex gap-2">
          {state.subjectType === 'animal' && <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Animal</span>}
          {state.subjectType === 'vehicle' && <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">Vehicle</span>}
          <button
            onClick={handleClear}
            className="p-1.5 hover:bg-red-500/10 hover:text-red-400 text-slate-500 rounded-md transition-colors"
            title="清空所有選項"
          >
            <TrashIcon />
          </button>
        </div>
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
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 relative">

        {/* Header */}
        <div className="lg:col-span-12 mb-4 lg:mb-0 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              圖像提示詞大師
            </h1>
            <p className="text-slate-400 text-sm mt-1">Image Prompt Master v2.1</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsHistoryOpen(!isHistoryOpen)}
              className={`flex items-center gap-2 px-4 py-2 text-slate-200 rounded-lg transition-colors text-sm font-medium border ${isHistoryOpen ? 'bg-slate-700 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 hover:bg-slate-700'}`}
            >
              <HistoryIcon />
              {isHistoryOpen ? '隱藏紀錄' : '歷史紀錄'}
            </button>
            <div className="flex gap-1">
              <button
                onClick={() => handleSmartRandomize()}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-l-lg hover:shadow-lg hover:shadow-indigo-500/20 transition-all text-sm font-medium border-r border-white/20"
              >
                <DiceIcon />
                隨機生成
              </button>
              <div className="relative group/random">
                <button className="h-full px-2 bg-purple-600 rounded-r-lg hover:bg-purple-500 text-white flex items-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>
                {/* Random Dropdown */}
                <div className="absolute right-0 top-full mt-1 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden hidden group-hover/random:block z-50">
                  <div className="p-2 text-xs text-slate-500 font-semibold uppercase">智慧隨機主題</div>
                  <button onClick={() => handleSmartRandomize('cyberpunk')} className="w-full text-left px-4 py-2 hover:bg-slate-700 text-sm text-cyan-300">賽博龐克 (Cyberpunk)</button>
                  <button onClick={() => handleSmartRandomize('fantasy')} className="w-full text-left px-4 py-2 hover:bg-slate-700 text-sm text-emerald-300">奇幻冒險 (Fantasy)</button>
                  <button onClick={() => handleSmartRandomize('vintage')} className="w-full text-left px-4 py-2 hover:bg-slate-700 text-sm text-amber-300">復古底片 (Vintage)</button>
                  <button onClick={() => handleSmartRandomize('portrait')} className="w-full text-left px-4 py-2 hover:bg-slate-700 text-sm text-pink-300">專業人像 (Portrait)</button>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* History Panel (Collapsible) */}
        {isHistoryOpen && (
          <div className="lg:col-span-12 animate-fade-in">
            <HistoryPanel
              history={history}
              favorites={favorites}
              onLoad={handleLoadState}
              onToggleFavorite={toggleFavorite}
              onClearHistory={clearHistory}
            />
          </div>
        )}

        {/* Left Column: Task Mode & References */}
        <div className="lg:col-span-3 space-y-6">
          {/* Task Mode Selector */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">工作模式 (Task Mode)</h2>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => handleTaskModeSelect('generation')}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg border transition-all ${state.taskMode === 'generation' ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300' : 'bg-slate-800 border-transparent text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'}`}
              >
                <ImageIcon />
                <div className="text-left">
                  <div className="text-sm font-medium">圖片生成</div>
                  <div className="text-[10px] opacity-70">Text-to-Image</div>
                </div>
              </button>
              <button
                onClick={() => handleTaskModeSelect('video_generation')}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg border transition-all ${state.taskMode === 'video_generation' ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300' : 'bg-slate-800 border-transparent text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'}`}
              >
                <VideoIcon />
                <div className="text-left">
                  <div className="text-sm font-medium">影片生成</div>
                  <div className="text-[10px] opacity-70">Text-to-Video (Veo/Sora)</div>
                </div>
              </button>
              <button
                onClick={() => handleTaskModeSelect('editing')}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg border transition-all ${state.taskMode === 'editing' ? 'bg-purple-600/20 border-purple-500 text-purple-300' : 'bg-slate-800 border-transparent text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'}`}
              >
                <CodeIcon />
                <div className="text-left">
                  <div className="text-sm font-medium">圖片編輯</div>
                  <div className="text-[10px] opacity-70">Image-to-Image / Inpainting</div>
                </div>
              </button>
            </div>
          </div>

          <SubjectSelector selected={state.subjectType} onSelect={handleSubjectTypeSelect} />

          {/* Reference Images (Visible in all modes, crucial for Editing) */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">參考圖片 (References)</h2>
              <button
                onClick={() => addReferenceImage({ id: Date.now().toString(), url: '', intent: 'general' })}
                className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 transition-colors"
              >
                <div className="w-4 h-4 flex items-center justify-center">+</div>
              </button>
            </div>

            <div className="space-y-3">
              {state.referenceImages.length === 0 ? (
                <div className="text-center py-4 text-xs text-slate-500 dashed-border rounded-lg border border-dashed border-slate-700">
                  無參考圖片 (選填)
                </div>
              ) : (
                state.referenceImages.map(img => (
                  <ReferenceImageCard
                    key={img.id}
                    image={img}
                    showIntent={state.taskMode === 'editing'}
                    onRemove={removeReferenceImage}
                    onUpdate={updateReferenceImage}
                  />
                ))
              )}
            </div>
            {state.taskMode === 'generation' && state.referenceImages.length > 0 && (
              <p className="text-[10px] text-slate-500 mt-2">
                * 圖片生成模式下，參考圖主要作為風格或構圖參考 (ControlNet/IP-Adapter)
              </p>
            )}
          </div>

          {/* Gender Selector - Only for Human */}
          {state.subjectType === 'human' && (
            <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">基礎性別 (Base Gender)</h2>
              <div className="flex bg-slate-800 rounded-lg p-1">
                <button
                  onClick={() => handleGenderSelect('female')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all text-sm font-medium ${state.gender === 'female' ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/20' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <FemaleIcon /> 女性
                </button>
                <button
                  onClick={() => handleGenderSelect('male')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md transition-all text-sm font-medium ${state.gender === 'male' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  <MaleIcon /> 男性
                </button>
              </div>
            </div>
          )}

          {/* Negative Prompt - Collapsible or Mini */}
          <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <ShieldIcon /> 負面提示詞
              </h2>
              <div className="relative inline-block w-8 h-4 align-middle select-none transition duration-200 ease-in">
                <input type="checkbox" name="toggle" id="toggle" checked={state.useNegativePrompt} onChange={toggleUseNegativePrompt} className="toggle-checkbox absolute block w-4 h-4 rounded-full bg-white border-4 appearance-none cursor-pointer" />
                <label htmlFor="toggle" className={`toggle-label block overflow-hidden h-4 rounded-full cursor-pointer ${state.useNegativePrompt ? 'bg-indigo-600' : 'bg-slate-700'}`}></label>
              </div>
            </div>

            {state.useNegativePrompt && (
              <div className="space-y-2">
                <textarea
                  className="w-full h-24 bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-slate-300 resize-none focus:border-indigo-500 focus:outline-none"
                  value={state.negativePrompt}
                  onChange={(e) => handleNegativeChange(e.target.value)}
                  placeholder="不想出現的內容..."
                />
                <div className="flex flex-wrap gap-1">
                  {COMMON_NEGATIVE_PROMPTS.slice(0, 8).map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleNegativeTag(tag)}
                      className={`text-[10px] px-2 py-1 rounded border ${state.negativePrompt.includes(tag) ? 'bg-red-500/20 border-red-500 text-red-300' : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-500'}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Center Column: Main Selectors */}
        <div className="lg:col-span-6 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            {/* Render Accordion Groups */}
            {CATEGORY_GROUPS.map((group) => {
              const allowedForSubject = SUBJECT_CATEGORY_CONFIG[state.subjectType] || [];
              const visibleCategories = group.categoryIds.filter(catId => {
                if (state.taskMode !== 'video_generation' && (catId === 'cameraMovement' || catId === 'motionStrength')) return false;
                return allowedForSubject.includes(catId);
              });

              if (visibleCategories.length === 0) return null;

              return (
                <Accordion key={group.id} title={group.title} icon={group.icon} defaultOpen={group.id === 'appearance'}>
                  <div className="grid grid-cols-1 gap-4">
                    {visibleCategories.map(catId => {
                      const cat = PROMPT_CATEGORIES.find(c => c.id === catId);
                      if (!cat) return null;

                      // Filter options by gender
                      let filteredOptions = cat.options.filter(opt => !opt.gender || !state.gender || opt.gender === state.gender);

                      // Filter character-specific options for Scenery mode
                      if (state.subjectType === 'scenery') {
                        if (cat.id === 'mood') {
                          filteredOptions = filteredOptions.filter(opt => !SCENERY_FORBIDDEN_MOODS.includes(opt.value));
                        } else {
                          const forbiddenSceneryOptions = ['close-up portrait', 'medium shot, upper body', 'full body shot', 'selfie angle', '85mm lens'];
                          filteredOptions = filteredOptions.filter(opt => !forbiddenSceneryOptions.includes(opt.value));
                        }
                      }

                      return (
                        <SelectionCard
                          key={cat.id}
                          category={{ ...cat, options: filteredOptions }}
                          selectedValue={(state as any)[catId]}
                          onSelect={handleSelect}
                        />
                      );
                    })}
                  </div>
                </Accordion>
              );
            })}
          </div>
        </div>

        {/* Right Column: Output & Quality & Preservation */}
        <div className="lg:col-span-3 space-y-4">

          {/* Output Preview Card (Sticky on Desktop) */}
          <div className="sticky top-4 space-y-4">
            <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl shadow-indigo-500/10">
              <OutputToolbar />

              <div className="p-4 bg-slate-950 min-h-[200px] relative group">
                <pre className="whitespace-pre-wrap text-sm text-slate-300 font-mono leading-relaxed break-words">
                  {generatedPrompt || <span className="text-slate-600 italic">請選擇左側選項以生成提示詞...</span>}
                </pre>

                {generatedPrompt && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={handleCopy}
                      className={`p-2 rounded-lg flex items-center gap-2 text-xs font-bold transition-all ${copied ? 'bg-green-500 text-white' : 'bg-white text-slate-900 hover:bg-slate-200'}`}
                    >
                      {copied ? '已複製!' : <><CopyIcon /> 複製</>}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Quality Tags (Quick Access) */}
            {state.taskMode !== 'editing' && (
              <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">畫質增強 (Quality Boosters)</h2>
                <div className="flex flex-wrap gap-2">
                  {QUALITY_TAGS.map(tag => (
                    <button
                      key={tag.value}
                      onClick={() => toggleQualityTag(tag.value)}
                      className={`px-2 py-1 text-xs rounded-full border transition-all ${state.quality.includes(tag.value)
                        ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300'
                        : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-500'
                        }`}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Preservation Tags (Editing Mode Only) */}
            {state.taskMode === 'editing' && (
              <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <ShieldIcon />保留特徵 (Preserve)
                </h2>
                <p className="text-[10px] text-slate-500 mb-3">選擇希望 AI 保持原本樣貌的部分</p>
                <div className="flex flex-wrap gap-2">
                  {PRESERVATION_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => togglePreservationTag(opt.value)}
                      className={`px-2 py-1 text-xs rounded-full border transition-all ${state.preservation.includes(opt.value)
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-500 hover:border-slate-500'
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Mobile Preview Fab */}
      <div className="lg:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMobilePreviewOpen(true)}
          className="w-14 h-14 bg-indigo-600 rounded-full shadow-lg shadow-indigo-600/40 flex items-center justify-center text-white"
        >
          <EyeIcon />
        </button>
      </div>

      {/* Mobile Preview Modal */}
      {isMobilePreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-900">
              <h3 className="font-bold text-slate-200">提示詞預覽</h3>
              <button onClick={() => setIsMobilePreviewOpen(false)} className="p-2 text-slate-400 hover:text-white">
                <XIcon />
              </button>
            </div>

            <div className="overflow-y-auto p-0">
              <OutputToolbar />
              <div className="p-4 bg-slate-950 min-h-[150px]">
                <pre className="whitespace-pre-wrap text-sm text-slate-300 font-mono">
                  {generatedPrompt || <span className="text-slate-600 italic">尚未生成...</span>}
                </pre>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-end">
              <button
                onClick={handleCopy}
                className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all ${copied ? 'bg-green-500 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-500'}`}
              >
                {copied ? '已複製!' : <><CopyIcon /> 複製提示詞</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
