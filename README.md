<div align="center">
<img width="1200" height="475" alt="Portrait Prompt Master" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Portrait Prompt Master v2.3

**Portrait Prompt Master** 是一個專為 AI 創作者設計的高級提示詞生成工具。無論您是使用 Midjourney、Stable Diffusion 還是最新的 AI 影片生成模型 (如 Google Veo / OpenAI Sora)，此工具都能幫助您快速構建精確、豐富且高品質的提示詞。

## 🌟 主要功能 (Key Features)

### 1. 多主體與互動 (Multi-Subject & Interaction)
- **👥 多主體支援**: 單次生成中可設定多個獨立角色 (Subject 1, Subject 2...)，各自擁有不同的性別、外觀與動作。
- **🤝 互動模式 (Interaction Mode)**: 當設定多個主體時，自動啟用互動選項 (如：擁抱、打鬥、背對背)，精確控制角色間的關係。

### 2. 資訊圖表模式 (Infographic Mode) [New]
- **📊 專業圖表支援**: 新增 **圖表 (Infographic)** 主體類型，支援長條圖、圓餅圖、心智圖、UI 介面等多種圖表生成。
- **🎨 風格與內容客製**: 可指定 **扁平化設計 (Flat Design)**、**3D 立體**、**手繪風格** 等，並自定義圖表內容主題（如：旅遊行程、銷售數據）。
- **✨ 畫質自動優化**: 自動啟用 4K/8K 高解析度設定，並移除不適合圖表的人像標籤，確保文字與線條清晰銳利。

### 3. 多模式支援 (Multi-Mode Support)
- **🖼️ 圖片生成 (Text-to-Image)**: 專為高品質人像攝影設計，涵蓋光影、構圖、風格等細節。
- **🎥 影片生成 (Text-to-Video)**: 支援最新的影片生成需求，包含 **運鏡方式 (Camera Movement)** 與 **動態強度 (Motion Strength)** 設定。
- **🎨 圖片編輯 (Image Editing)**: 提供基於參考圖的編輯指令生成，支援 **Inpainting** 與 **重繪** 需求。

### 4. 精細的參數控制
- **智慧性別選擇**: 支援男性/女性/不指定 (無性別/通用)，自動過濾或顯示所有外觀選項。
- **豐富的類別**: 超過 20 種分類，包含國籍、髮型、服裝、材質、飾品、動作、環境、光影、相機參數等。
- **視覺化選擇**: 關鍵選項 (如髮型、光影) 提供視覺化預覽卡片。

### 5. 進階功能
- **參考圖管理 (Reference Images)**: 上傳並設定參考圖的意圖 (如：保持臉部特徵、保留構圖等)。
- **智慧隨機 (Smart Randomize)**: 一鍵生成特定主題 (Cyberpunk, Fantasy, Vintage, Portrait)。
- **歷史紀錄與收藏**: 自動保存生成歷史，並可將喜歡的組合加入收藏。
- **多語言輸出**: 支援 **英文 (English)** 與 **中文** 提示詞輸出。
- **多種格式**: 支援 Text, JSON, YAML, Markdown 等多種輸出格式，方便對接 API 或筆記。

## 🚀 快速開始 (Quick Start)

**前置需求:** Node.js (v16+)

1. 安裝依賴:
   ```bash
   npm install
   ```

2. 啟動開發伺服器:
   ```bash
   npm run dev
   ```

3. 開啟瀏覽器訪問 `http://localhost:5173`。

## 🛠️ 技術棧 (Tech Stack)
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS (Glassmorphism Design)
- **Icons**: Lucide React

## 📝 更新日誌 (Changelog)

### v2.3
- ✨ **新增**: 資訊圖表主體 (Infographic Subject)，專為生成數據圖表與 UI 介面設計。
- ✨ **新增**: 圖表專屬設定欄位 (Chart Type, Style, Content Context)。
- 🎨 **優化**: 自動化畫質標籤管理 (Auto-Highres for Charts, Auto-DetailedFace for Humans)。

### v2.2
- ✨ **新增**: 多主體支援 (Multi-Subject Support)，可同時生成多個角色。
- ✨ **新增**: 全域互動模式 (Interaction Mode)，控制角色間的互動行為。
- 🎨 **優化**: UI 更新支援主體分頁切換。

### v2.1
- ✨ **新增**: 支援「不指定性別」選項，顯示所有外觀特徵。
- ✨ **新增**: 圖片編輯模式 (Picture Editing) 與參考圖意圖設定。
- 🎨 **優化**: 改進的深色玻璃擬態 UI (Dark Glassmorphism)。

### v2.0
- 🚀 **新增**: 影片生成模式 (Video Generation Mode)。
- 📸 **新增**: 運鏡控制 (Camera Movement) 與動態強度參數。

---

*Designed for AI Creators.*
