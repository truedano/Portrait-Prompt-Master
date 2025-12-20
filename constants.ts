
import { OptionCategory, PromptOption } from './types';

// Gender-specific helper could be used here, but for simplicity we list options and can filter in UI if needed.
// For this iteration, we list comprehensive options.

export const NATIONALITIES: PromptOption[] = [
  { label: '台灣 (Taiwan)', value: 'Taiwanese' },
  { label: '日本 (Japan)', value: 'Japanese' },
  { label: '韓國 (Korea)', value: 'Korean' },
  { label: '中國 (China)', value: 'Chinese' },
  { label: '美國 (USA)', value: 'American' },
  { label: '英國 (UK)', value: 'British' },
  { label: '法國 (France)', value: 'French' },
  { label: '俄羅斯 (Russia)', value: 'Russian' },
  { label: '德國 (Germany)', value: 'German' },
  { label: '巴西 (Brazil)', value: 'Brazilian' }
];

export const SUBJECT_TYPES: PromptOption[] = [
  { label: '人類 (Human)', value: 'human' },
  { label: '動物 (Animal)', value: 'animal' },
  { label: '車輛 (Vehicle)', value: 'vehicle' }
];

export const ANIMAL_SPECIES: PromptOption[] = [
  { label: '貓 (Cat)', value: 'cat' },
  { label: '狗 (Dog)', value: 'dog' },
  { label: '獅子 (Lion)', value: 'lion' },
  { label: '老虎 (Tiger)', value: 'tiger' },
  { label: '鷹 (Eagle)', value: 'eagle' },
  { label: '龍 (Dragon)', value: 'dragon' },
  { label: '狼 (Wolf)', value: 'wolf' },
  { label: '狐狸 (Fox)', value: 'fox' },
  { label: '熊 (Bear)', value: 'bear' },
  { label: '兔子 (Rabbit)', value: 'rabbit' },
];

export const ANIMAL_FUR: PromptOption[] = [
  { label: '白色 (White)', value: 'white fur' },
  { label: '黑色 (Black)', value: 'black fur' },
  { label: '橘色 (Orange)', value: 'orange fur' },
  { label: '三花 (Calico)', value: 'calico fur' },
  { label: '虎斑 (Tabby)', value: 'tabby fur' },
  { label: '金色 (Golden)', value: 'golden fur' },
  { label: '蓬鬆 (Fluffy)', value: 'fluffy fur' },
  { label: '鱗片 (Scales)', value: 'scales' },
  { label: '羽毛 (Feathers)', value: 'feathers' },
];

export const VEHICLE_TYPES: PromptOption[] = [
  { label: '跑車 (Sports Car)', value: 'sports car' },
  { label: '轎車 (Sedan)', value: 'sedan' },
  { label: '休旅車 (SUV)', value: 'SUV' },
  { label: '卡車 (Truck)', value: 'truck' },
  { label: '重機 (Motorcycle)', value: 'motorcycle' },
  { label: '賽車 (Race Car)', value: 'race car' },
  { label: '太空船 (Spaceship)', value: 'spaceship' },
  { label: '飛機 (Airplane)', value: 'airplane' },
  { label: '直升機 (Helicopter)', value: 'helicopter' },
  { label: '機甲 (Mecha)', value: 'mecha robot' },
];

export const VEHICLE_COLOR: PromptOption[] = [
  { label: '金屬紅 (Metallic Red)', value: 'metallic red paint' },
  { label: '消光黑 (Matte Black)', value: 'matte black finish' },
  { label: '珍珠白 (Pearl White)', value: 'pearl white paint' },
  { label: '賽車銀 (Silver)', value: 'silver metallic' },
  { label: '賽博龐克藍 (Cyber Blue)', value: 'cyberpunk blue neon' },
  { label: '黃色 (Yellow)', value: 'bright yellow' },
  { label: '軍綠 (Army Green)', value: 'military green' },
  { label: '生鏽 (Rusted)', value: 'rusted metal texture' },
];

export const PROMPT_CATEGORIES: OptionCategory[] = [
  // --- ANIMAL SPECIFIC ---
  {
    id: 'animalSpecies',
    label: '物種 (Species)',
    description: '動物種類',
    options: ANIMAL_SPECIES
  },
  {
    id: 'animalFur',
    label: '毛色/特徵 (Fur)',
    description: '動物的毛色與質感',
    multiSelect: true,
    options: ANIMAL_FUR
  },
  // --- VEHICLE SPECIFIC ---
  {
    id: 'vehicleType',
    label: '車型 (Vehicle Type)',
    description: '交通工具種類',
    options: VEHICLE_TYPES
  },
  {
    id: 'vehicleColor',
    label: '烤漆顏色 (Paint)',
    description: '車輛外觀顏色',
    options: VEHICLE_COLOR
  },
  // --- HUMAN DEFAULT ---
  {
    id: 'nationality',
    label: '國籍/人種 (Nationality)',
    description: '人物的國籍或種族特徵',
    multiSelect: true,
    options: NATIONALITIES
  },
  {
    id: 'age',
    label: '年齡 (Age)',
    description: '人物的年齡層',
    multiSelect: true,
    options: [
      { label: '嬰兒 (Baby)', value: 'baby' },
      { label: '兒童 (Child)', value: 'child' },
      { label: '青少年 (Teenager)', value: 'teenager' },
      { label: '20歲 (20s)', value: '20 years old' },
      { label: '30歲 (30s)', value: '30 years old' },
      { label: '中年 (Middle-aged)', value: 'middle-aged' },
      { label: '老年 (Elderly)', value: 'elderly' }
    ]
  },
  {
    id: 'bodyType',
    label: '體型 (Body Type)',
    description: '人物的身材輪廓 (可多選)',
    multiSelect: true,
    options: [
      { label: '健美/肌肉 (Athletic)', value: 'athletic body, muscular' },
      { label: '豐滿/曲線 (Curvy)', value: 'curvy body, voluptuous', gender: 'female' },
      { label: '大胸部 (Large Breasts)', value: 'large breasts', gender: 'female' },
      { label: '波霸 (Busty)', value: 'busty', gender: 'female' },
      { label: '胸部豐滿 (Heavy Chested)', value: 'heavy chested', gender: 'female' },
      { label: '豐滿胸懷 (Ample Bosom)', value: 'ample bosom', gender: 'female' },
      { label: '纖細/瘦長 (Slender)', value: 'slender body, skinny' },
      { label: '微胖 (Chubby)', value: 'chubby body, plus size' },
      { label: '寬肩 (Broad shoulders)', value: 'broad shoulders', gender: 'male' },
      { label: '嬌小 (Petite)', value: 'petite frame', gender: 'female' },
      { label: '高大 (Tall)', value: 'tall stature' }
    ]
  },
  {
    id: 'role',
    label: '角色/職業 (Role)',
    description: '人物的身份或職業',
    multiSelect: true,
    options: [
      { label: '大學生', value: 'university student' },
      { label: '上班族', value: 'office worker' },
      { label: '時尚模特兒', value: 'fashion model' },
      { label: '偶像歌手', value: 'pop idol' },
      { label: '醫生', value: 'doctor' },
      { label: '運動員', value: 'athlete' },
      { label: '戰士', value: 'warrior' },
      { label: '賽博格 (生化人)', value: 'cyborg' },
      { label: '巫師/法師', value: 'wizard' },
      { label: '精靈', value: 'elf' },
      { label: '探險家', value: 'explorer' },
      { label: '街頭龐克', value: 'street punk' }
    ]
  },
  {
    id: 'faceShape',
    label: '臉型 (Face Shape)',
    description: '臉部輪廓特徵',
    multiSelect: true,
    options: [
      { label: '鵝蛋臉', value: 'oval face' },
      { label: '圓臉', value: 'round face' },
      { label: '瓜子臉 (心形)', value: 'heart-shaped face' },
      { label: '方臉', value: 'square face' },
      { label: '稜角分明', value: 'chiseled jawline' },
      { label: '瘦削臉頰', value: 'gaunt cheeks' },
      { label: '嬰兒肥', value: 'chubby cheeks' }
    ]
  },
  {
    id: 'eyeGaze',
    label: '視線與眼神 (Gaze)',
    description: '眼睛的方向與互動',
    multiSelect: true,
    options: [
      { label: '直視鏡頭', value: 'looking at viewer' },
      { label: '看向遠方', value: 'looking away, looking at horizon' },
      { label: '閉眼', value: 'closed eyes' },
      { label: '眨眼', value: 'winking' },
      { label: '翻白眼', value: 'rolling eyes' },
      { label: '向下看', value: 'looking down' },
      { label: '向上看', value: 'looking up' },
      { label: '斜視', value: 'sideways glance' }
    ]
  },
  {
    id: 'hairColor',
    label: '髮色 (Hair Color)',
    description: '頭髮的顏色 (可多選混搭)',
    multiSelect: true,
    options: [
      { label: '黑色', value: 'black hair' },
      { label: '金色 (Blonde)', value: 'blonde hair' },
      { label: '棕色 (Brown)', value: 'brown hair' },
      { label: '紅色 (Red)', value: 'red hair' },
      { label: '粉紅色 (Pink)', value: 'pink hair' },
      { label: '銀白色 (Silver)', value: 'silver white hair' },
      { label: '藍色 (Blue)', value: 'blue hair' },
      { label: '紫色 (Purple)', value: 'purple hair' },
      { label: '彩虹色', value: 'rainbow hair' },
      { label: '漸層染 (Ombre)', value: 'ombre hair' },
      { label: '挑染 (Streaks)', value: 'highlighted hair' }
    ]
  },
  {
    id: 'hairStyle',
    label: '髮型 (Hair Style)',
    description: '頭髮的造型 (可多選)',
    multiSelect: true,
    options: [
      { label: '長直髮', value: 'long straight hair' },
      { label: '波浪捲髮', value: 'wavy curly hair' },
      { label: '鮑伯頭 (Bob)', value: 'short bob cut' },
      { label: '平頭 (Buzz)', value: 'buzz cut' },
      { label: '馬尾', value: 'high ponytail' },
      { label: '雙馬尾', value: 'twin tails' },
      { label: '姬髮式', value: 'hime cut' },
      { label: '俐落短髮', value: 'short pixie cut' },
      { label: '凌亂短髮', value: 'messy short hair' },
      { label: '油頭', value: 'slicked back hair' },
      { label: '光頭', value: 'bald head' },
      { label: '爆炸頭 (Afro)', value: 'afro hair' },
      { label: '辮子 (Braids)', value: 'braided hair' },
      { label: '丸子頭 (Bun)', value: 'hair bun' }
    ]
  },
  {
    id: 'appearance',
    label: '外觀細節 (Features)',
    description: '皮膚、眼睛與其他特徵 (可多選)',
    multiSelect: true,
    options: [
      { label: '白皙皮膚', value: 'pale skin' },
      { label: '小麥色皮膚', value: 'tanned skin' },
      { label: '深色皮膚', value: 'dark skin' },
      { label: '藍眼睛', value: 'blue eyes' },
      { label: '琥珀色眼睛', value: 'amber eyes' },
      { label: '異色瞳', value: 'heterochromia eyes' },
      { label: '雀斑', value: 'freckles' },
      { label: '淚痣', value: 'mole under eye' },
      { label: '紋身', value: 'tattoos' },
      { label: '疤痕', value: 'scars' },
      // Female specific
      { label: '精緻妝容', value: 'exquisite makeup', gender: 'female' },
      { label: '素顏/自然', value: 'natural skin, no makeup', gender: 'female' },
      { label: '紅唇', value: 'red lips', gender: 'female' },
      { label: '長睫毛', value: 'long eyelashes', gender: 'female' },
      { label: '煙燻妝', value: 'smokey eyes', gender: 'female' },
      // Male specific
      { label: '刮鬍乾淨', value: 'clean shaven', gender: 'male' },
      { label: '絡腮鬍', value: 'full beard', gender: 'male' },
      { label: '山羊鬍', value: 'goatee', gender: 'male' },
      { label: '鬍渣', value: 'stubble', gender: 'male' },
      { label: '銳利眼神', value: 'sharp eyes', gender: 'male' }
    ]
  },
  {
    id: 'clothing',
    label: '服裝 (Clothing)',
    description: '穿著風格 (可多選混搭)',
    multiSelect: true,
    options: [
      { label: '白襯衫', value: 'white button-up shirt' },
      { label: '寬鬆帽T', value: 'oversized hoodie' },
      { label: '休閒 T-shirt', value: 'casual t-shirt' },
      { label: '緊身 T-shirt', value: 'tight t-shirt' },
      { label: '訂製西裝', value: 'tailored suit' },
      { label: '晚禮服', value: 'elegant evening gown', gender: 'female' },
      { label: '夏季洋裝', value: 'summer floral dress', gender: 'female' },
      { label: '低胸洋裝', value: 'low cut dress', gender: 'female' },
      { label: '比基尼', value: 'bikini', gender: 'female' },
      { label: '露肩上衣', value: 'off-shoulder top', gender: 'female' },
      { label: '旗袍', value: 'cheongsam', gender: 'female' },
      { label: '燕尾服', value: 'tuxedo', gender: 'male' },
      { label: '水手服', value: 'sailor school uniform' },
      { label: '和服', value: 'traditional kimono' },
      { label: '皮夾克', value: 'leather jacket' },
      { label: '戰術背心', value: 'tactical vest' },
      { label: '科幻機甲', value: 'sci-fi mechanical armor' },
      { label: '運動服', value: 'sportswear' }
    ]
  },
  {
    id: 'clothingDetail',
    label: '服裝材質 (Texture)',
    description: '衣物的布料與質感 (可多選)',
    multiSelect: true,
    options: [
      { label: '緊身衣物', value: 'tight fitting clothes' },
      { label: '深 V 領口', value: 'plunging neckline', gender: 'female' },
      { label: '胸口敞開', value: 'open chest' },
      { label: '絲綢/緞面', value: 'silk satin fabric' },
      { label: '丹寧/牛仔', value: 'denim texture' },
      { label: '皮革', value: 'leather material' },
      { label: '亮面乳膠', value: 'shiny latex' },
      { label: '針織/羊毛', value: 'knitted wool texture' },
      { label: '蕾絲細節', value: 'intricate lace details' },
      { label: '濕透', value: 'wet clothes, soaked' },
      { label: '薄紗/透視', value: 'sheer fabric' },
      { label: '金屬光澤', value: 'metallic fabric' },
      { label: '破舊', value: 'worn and torn clothes' }
    ]
  },
  {
    id: 'accessories',
    label: '飾品與配件 (Accessories)',
    description: '增加人物豐富度 (可多選)',
    multiSelect: true,
    options: [
      { label: '金屬框眼鏡', value: 'wearing metal rim glasses' },
      { label: '墨鏡', value: 'wearing sunglasses' },
      { label: '棒球帽', value: 'wearing baseball cap' },
      { label: '貝雷帽', value: 'wearing beret' },
      { label: '全罩耳機', value: 'wearing headphones' },
      { label: '耳環', value: 'wearing earrings' },
      { label: '珍珠項鍊', value: 'wearing pearl necklace' },
      { label: '圍巾', value: 'wearing scarf' },
      { label: '戰術面罩', value: 'wearing tactical mask' },
      { label: '皇冠', value: 'wearing crown' },
      { label: '眼罩', value: 'wearing eyepatch' }
    ]
  },
  {
    id: 'action',
    label: '動作 (Pose)',
    description: '人物的肢體動態',
    multiSelect: true,
    options: [
      { label: '站姿', value: 'standing pose' },
      { label: '坐姿', value: 'sitting' },
      { label: '躺姿', value: 'lying down' },
      { label: '騎腳踏車', value: 'riding a bicycle' },
      { label: '騎機車', value: 'riding a motorcycle' },
      { label: '開車', value: 'driving a car' },
      { label: '騎馬', value: 'riding a horse' },
      { label: '回眸', value: 'looking back' },
      { label: '雙臂交叉', value: 'crossing arms' },
      { label: '手托腮', value: 'resting chin on hand' },
      { label: '撥弄頭髮', value: 'touching hair' },
      { label: '動態跳躍', value: 'dynamic jumping pose' },
      { label: '戰鬥姿態', value: 'fighting stance' },
      { label: '祈禱', value: 'praying pose' },
      { label: '手插口袋', value: 'hands in pockets' }
    ]
  },
  {
    id: 'hands',
    label: '手部互動 (Hands)',
    description: '手部持有物品或互動',
    multiSelect: true,
    options: [
      { label: '拿著咖啡', value: 'holding a coffee cup' },
      { label: '拿著書', value: 'holding a book' },
      { label: '看手機', value: 'holding a smartphone' },
      { label: '拿著槍/武器', value: 'holding a weapon' },
      { label: '拿著劍', value: 'holding a sword' },
      { label: '拿著花束', value: 'holding flowers' },
      { label: '抽菸', value: 'smoking cigarette' },
      { label: '比讚', value: 'thumbs up' },
      { label: '比愛心', value: 'making heart shape with hands' },
      { label: '拿著相機', value: 'holding a camera' }
    ]
  },
  {
    id: 'composition',
    label: '構圖與視角 (Composition)',
    description: '鏡頭語言與取景方式',
    multiSelect: true,
    options: [
      { label: '特寫 (頭像)', value: 'close-up portrait' },
      { label: '半身像', value: 'medium shot, upper body' },
      { label: '全身照', value: 'full body shot' },
      { label: '低角度仰視 (氣勢)', value: 'low angle view, from below' },
      { label: '高角度俯視 (渺小)', value: 'high angle view, from above' },
      { label: '荷蘭式傾斜 (動態)', value: 'Dutch angle' },
      { label: '自拍視角', value: 'selfie angle' },
      { label: '三分法構圖', value: 'rule of thirds' },
      { label: '置中構圖', value: 'symmetrical composition' },
      { label: '景深 (背景模糊)', value: 'depth of field, blurred background' },
      { label: '魚眼', value: 'fisheye lens effect' },
      { label: 'GoPro', value: 'GoPro wide view' }
    ]
  },
  // New: Camera Movement for Video
  {
    id: 'cameraMovement',
    label: '運鏡方式 (Camera Move)',
    description: '影片專用：鏡頭移動方式',
    multiSelect: true,
    options: [
      { label: '推進 (Dolly In)', value: 'camera dolly in' },
      { label: '拉遠 (Dolly Out)', value: 'camera dolly out' },
      { label: '左搖 (Pan Left)', value: 'camera pan left' },
      { label: '右搖 (Pan Right)', value: 'camera pan right' },
      { label: '上搖 (Tilt Up)', value: 'camera tilt up' },
      { label: '下搖 (Tilt Down)', value: 'camera tilt down' },
      { label: '跟拍 (Tracking)', value: 'camera tracking shot' },
      { label: '環繞 (Orbit)', value: 'camera circling around subject' },
      { label: '希區考克變焦 (Dolly Zoom)', value: 'dolly zoom effect' },
      { label: '空拍 (Drone)', value: 'drone shot' },
      { label: 'FPV 穿越', value: 'FPV drone view' },
      { label: '手持晃動', value: 'handheld camera movement' },
      { label: '固定鏡頭', value: 'static camera' }
    ]
  },
  // New: Motion Strength for Video
  {
    id: 'motionStrength',
    label: '動態強度 (Motion Strength)',
    description: '影片專用：動作幅度',
    multiSelect: true,
    options: [
      { label: '微動 (Subtle)', value: 'subtle motion' },
      { label: '正常 (Normal)', value: 'normal motion' },
      { label: '動態 (Dynamic)', value: 'dynamic motion' },
      { label: '高強度 (High)', value: 'high motion' },
      { label: '慢動作 (Slow Mo)', value: 'slow motion' },
      { label: '縮時 (Timelapse)', value: 'timelapse' },
      { label: '極速 (Hyperlapse)', value: 'hyperlapse' }
    ]
  },
  {
    id: 'environment',
    label: '背景環境 (Environment)',
    description: '人像所處的場景',
    multiSelect: true,
    options: [
      { label: '純色背景 (棚拍)', value: 'simple solid background' },
      { label: '都市街道 (夜)', value: 'city street at night' },
      { label: '繁華十字路口', value: 'busy crosswalk' },
      { label: '教室', value: 'classroom' },
      { label: '辦公室', value: 'office interior' },
      { label: '海灘', value: 'beach' },
      { label: '森林', value: 'forest' },
      { label: '咖啡廳', value: 'coffee shop' },
      { label: '廢墟', value: 'abandoned ruins' },
      { label: '賽博龐克城市', value: 'cyberpunk city' },
      { label: '太空站', value: 'space station' },
      { label: '臥室', value: 'bedroom' },
      { label: '圖書館', value: 'library' },
      { label: '屋頂', value: 'rooftop' }
    ]
  },
  {
    id: 'era',
    label: '時代背景 (Era)',
    description: '設定特定的年代氛圍',
    options: [
      { label: '現代 (Modern)', value: 'modern day' },
      { label: '1920年代 (大亨小傳)', value: '1920s era, vintage style' },
      { label: '1980年代 (復古)', value: '1980s style, retro aesthetic' },
      { label: '1990年代', value: '1990s vibe' },
      { label: '維多利亞時代', value: 'Victorian era' },
      { label: '中世紀 (奇幻)', value: 'Medieval era' },
      { label: '賽博龐克 (2077)', value: 'Cyberpunk 2077 era, futuristic' },
      { label: '江戶時代 (日本)', value: 'Edo period Japan' },
      { label: '民國風', value: 'Republican China era' }
    ]
  },
  {
    id: 'lighting',
    label: '光影 (Lighting)',
    description: '決定氛圍的關鍵 (可多選混搭)',
    multiSelect: true,
    options: [
      { label: '自然光', value: 'natural lighting', image: 'https://placehold.co/600x400/22c55e/ffffff?text=Natural+Light' },
      { label: '窗光', value: 'window light', image: 'https://placehold.co/600x400/3b82f6/ffffff?text=Window+Light' },
      { label: '黃金時刻 (夕陽)', value: 'golden hour', image: 'https://placehold.co/600x400/f59e0b/ffffff?text=Golden+Hour' },
      { label: '電影感光效', value: 'cinematic lighting', image: 'https://placehold.co/600x400/6366f1/ffffff?text=Cinematic' },
      { label: '雷姆布蘭特光', value: 'Rembrandt lighting', image: 'https://placehold.co/600x400/7c3aed/ffffff?text=Rembrandt' },
      { label: '霓虹燈光', value: 'neon lighting', image: 'https://placehold.co/600x400/ec4899/ffffff?text=Neon' },
      { label: '柔光箱', value: 'softbox lighting', image: 'https://placehold.co/600x400/94a3b8/ffffff?text=Softbox' },
      { label: '輪廓光 (背光)', value: 'rim lighting', image: 'https://placehold.co/600x400/0f172a/ffffff?text=Rim+Light' },
      { label: '強烈對比', value: 'high contrast', image: 'https://placehold.co/600x400/000000/ffffff?text=High+Contrast' },
      { label: '體積光 (丁達爾)', value: 'volumetric lighting', image: 'https://placehold.co/600x400/e2e8f0/000000?text=Volumetric' }
    ]
  },
  {
    id: 'colorPalette',
    label: '色調與濾鏡 (Color Palette)',
    description: '照片的色彩傾向與質感',
    options: [
      { label: '鮮豔色彩', value: 'vivid colors' },
      { label: '粉彩色調', value: 'pastel color palette' },
      { label: '黑白攝影', value: 'monochrome photography' },
      { label: '賽博龐克 (藍紫)', value: 'cyberpunk neon colors' },
      { label: '大地色系', value: 'earth tones' },
      { label: '冷色調', value: 'cool color temperature' },
      { label: '暖色調', value: 'warm color temperature' },
      { label: 'Kodak Portra 400', value: 'Kodak Portra 400 film style' },
      { label: 'Fujifilm', value: 'Fujifilm simulation' },
      { label: '拍立得質感', value: 'Polaroid style' },
      { label: '懷舊泛黃 (Sepia)', value: 'sepia tone' },
      { label: '低飽和度', value: 'desaturated colors' }
    ]
  },
  {
    id: 'artStyle',
    label: '藝術風格 (Style)',
    description: '圖片的整體質感 (可多選混搭)',
    multiSelect: true,
    options: [
      { label: '極致寫實 (Photo)', value: 'Photorealistic, 8k, raw photo' },
      { label: '電影截圖', value: 'Cinematic film still' },
      { label: '3D 渲染 (Unreal)', value: 'Unreal Engine 5 render, 3D character' },
      { label: '2.5D 插畫', value: 'semi-realistic illustration' },
      { label: '日本動畫 (Anime)', value: 'Anime style, cel shaded' },
      { label: '油畫', value: 'Oil painting' },
      { label: '水彩', value: 'Watercolor' },
      { label: '素描', value: 'Sketch' },
      { label: '底片感 (Film)', value: 'Analog film, grain, vintage' },
      { label: '概念藝術', value: 'concept art' },
      { label: '浮世繪', value: 'Ukiyo-e style' }
    ]
  },
  {
    id: 'camera',
    label: '攝影器材 (Camera)',
    description: '鏡頭語言',
    multiSelect: true,
    options: [
      { label: '大光圈 (背景虛化)', value: 'f/1.8, bokeh' },
      { label: '人像鏡 (85mm)', value: '85mm lens' },
      { label: '廣角鏡', value: 'wide angle lens' },
      { label: '長焦鏡', value: 'telephoto lens' },
      { label: '微距', value: 'macro lens' },
      { label: '無人機視角', value: 'drone shot' }
    ]
  },
  {
    id: 'mood',
    label: '情緒 (Mood)',
    description: '圖片傳達的感覺 (可多選)',
    multiSelect: true,
    options: [
      { label: '快樂', value: 'happy, smiling' },
      { label: '悲傷', value: 'sad, crying' },
      { label: '生氣', value: 'angry' },
      { label: '冷酷', value: 'cool, serious' },
      { label: '神秘', value: 'mysterious' },
      { label: '誘人', value: 'seductive' },
      { label: '自信', value: 'confident' },
      { label: '害羞', value: 'shy, blushing' },
      { label: '厭世', value: 'bored, gloomy' },
      { label: '驚訝', value: 'surprised' }
    ]
  },
  {
    id: 'aspectRatio',
    label: '解析度/比例 (Resolution)',
    description: '圖片長寬比',
    multiSelect: true,
    options: [
      { label: '1:1 (正方形)', value: 'aspect ratio 1:1' },
      { label: '16:9 (電影感)', value: 'aspect ratio 16:9' },
      { label: '9:16 (手機直式)', value: 'aspect ratio 9:16' },
      { label: '4:3 (傳統照片)', value: 'aspect ratio 4:3' },
      { label: '3:4 (人像照片)', value: 'aspect ratio 3:4' },
      { label: '21:9 (超寬螢幕)', value: 'aspect ratio 21:9' }
    ]
  }
];

export const QUALITY_TAGS: PromptOption[] = [
  { label: '傑作', value: 'masterpiece' },
  { label: '最佳畫質', value: 'best quality' },
  { label: '超高解析度', value: '8k' },
  { label: '高度細節', value: 'highly detailed' },
  { label: 'HDR', value: 'HDR' },
  { label: 'ArtStation 趨勢', value: 'trending on artstation' },
  { label: '精緻五官', value: 'detailed face' }
];

export const PRESERVATION_OPTIONS: PromptOption[] = [
  { label: '臉部特徵 (Face)', value: 'facial features' },
  { label: '髮型 (Hair)', value: 'hair style' },
  { label: '服裝 (Clothing)', value: 'clothing' },
  { label: '背景 (Background)', value: 'background environment' },
  { label: '構圖 (Composition)', value: 'image composition' },
  { label: '色調 (Colors)', value: 'color palette' },
  { label: '光影 (Lighting)', value: 'lighting conditions' }
];

export const COMMON_NEGATIVE_PROMPTS = [
  'nsfw',
  'low quality',
  'worst quality',
  'monochrome',
  'lowres',
  'bad anatomy',
  'bad hands',
  'text',
  'error',
  'missing fingers',
  'extra digit',
  'fewer digits',
  'cropped',
  'jpeg artifacts',
  'signature',
  'watermark',
  'username',
  'artist name'
];

export const SUBJECT_CATEGORY_CONFIG: Record<string, string[]> = {
  human: [
    'nationality', 'age', 'bodyType', 'role', 'faceShape', 'eyeGaze', 'hairColor', 'hairStyle',
    'appearance', 'clothing', 'clothingDetail', 'accessories', 'action', 'hands',
    'composition', 'environment', 'lighting', 'era', 'colorPalette', 'artStyle', 'mood', 'camera', 'aspectRatio',
    'cameraMovement', 'motionStrength'
  ],
  animal: [
    'animalSpecies', 'animalFur',
    'appearance', 'clothing', 'accessories',
    'action', 'environment', 'lighting', 'composition', 'era', 'colorPalette', 'artStyle', 'mood', 'camera', 'aspectRatio',
    'cameraMovement', 'motionStrength'
  ],
  vehicle: [
    'vehicleType', 'vehicleColor',
    'environment', 'lighting', 'composition', 'era', 'colorPalette', 'artStyle', 'camera', 'aspectRatio',
    'cameraMovement', 'motionStrength'
  ]
};
