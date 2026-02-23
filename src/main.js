// 1. 語系字典定義 (已整合高槓桿 SEO 戰略版 Meta 標籤)
const translations = {
    'zh-TW': {
        title: 'AI Prompt Splitter',
        desc: 'The Premier Zero-Leak Context Chunker (隱私優先的純前端分割工具)',
        trustMsg: '🔒 您的資料絕不離開瀏覽器 (100% 本地運算)',
        placeholder: '請貼上長文本...',
        splitBtn: '立即分割 (Split)',
        clearBtn: '清空 (Clear)',
        part: '部分',
        copy: '複製 (Copy)',
        copied: '已複製! (Copied)',
        words: '字',
        meta: {
            title: 'AI 提示詞分割器：100% 瀏覽器本地處理，拒絕隱私外洩 (Zero-Leak)',
            desc: '專為解決長文本「Lost in the Middle」設計。本機運算不經伺服器，保護企業與個人機密。優化 ChatGPT 與 Claude 的 Token 效率。'
        }
    },
    'zh-CN': {
        title: 'AI Prompt Splitter',
        desc: 'The Premier Zero-Leak Context Chunker (隐私优先的纯前端分割工具)',
        trustMsg: '🔒 您的数据绝不离开浏览器 (100% 本地运算)',
        placeholder: '请粘贴长文本...',
        splitBtn: '立即分割 (Split)',
        clearBtn: '清空 (Clear)',
        part: '部分',
        copy: '复制 (Copy)',
        copied: '已复制! (Copied)',
        words: '字',
        meta: {
            title: 'AI 提示词分割器：100% 浏览器本地处理，拒绝隐私泄露 (Zero-Leak)',
            desc: '专为解决长文本 “Lost in the Middle” 设计。本机运算不经服务器，保护企业与个人机密。优化 ChatGPT 与 Claude 的 Token 效率。'
        }
    },
    'en': {
        title: 'AI Prompt Splitter',
        desc: 'The Premier Zero-Leak Context Chunker for AI Tasks.',
        trustMsg: '🔒 Your data never leaves your browser (100% Local Processing)',
        placeholder: 'Paste your long text here...',
        splitBtn: 'Split Now',
        clearBtn: 'Clear',
        part: 'Part',
        copy: 'Copy',
        copied: 'Copied!',
        words: 'chars',
        meta: {
            title: 'AI Prompt Splitter: Zero-Leak Context Chunker for LLMs',
            desc: "Securely split long prompts locally. Prevent data leaks & solve 'Lost in the Middle' in ChatGPT/Claude. 100% Client-side."
        }
    },
    'ja': {
        title: 'AI Prompt Splitter',
        desc: 'The Premier Zero-Leak Context Chunker (プライバシー優先の分割ツール)',
        trustMsg: '🔒 データはブラウザから送信されません (100% ローカル処理)',
        placeholder: '長いテキストを貼り付けてください...',
        splitBtn: '今すぐ分割',
        clearBtn: 'クリア',
        part: 'セクション',
        copy: 'コピー',
        copied: 'コピー完了',
        words: '文字',
        meta: {
            title: 'AIプロンプト分割器：完全ローカル実行のプライバシー保護ツール',
            desc: '長いプロンプトを安全に分割。データ流出を完全に防ぎ、ChatGPTの文脈理解を最適化します。サーバー保存なし。'
        }
    },
    'de': {
        title: 'AI Prompt Splitter',
        desc: 'The Premier Zero-Leak Context Chunker (Datenschutz-Splitter)',
        trustMsg: '🔒 Ihre Daten verlassen niemals Ihren Browser (100% lokale Verarbeitung)',
        placeholder: 'Langen Text hier einfügen...',
        splitBtn: 'Jetzt teilen',
        clearBtn: 'Löschen',
        part: 'Teil',
        copy: 'Kopieren',
        copied: 'Kopiert!',
        words: 'Zeichen',
        meta: {
            title: 'KI Prompt Splitter: DSGVO-konformer Context Chunker',
            desc: 'Lange Prompts sicher lokal teilen. Schützen Sie Ihre Daten vor KI-Leaks. 100% Client-seitige Verarbeitung ohne Server.'
        }
    },
    'es': {
        title: 'AI Prompt Splitter',
        desc: 'The Premier Zero-Leak Context Chunker (Divisor de privacidad)',
        trustMsg: '🔒 Sus datos nunca salen de su navegador (Procesamiento 100% local)',
        placeholder: 'Pegue su texto largo aquí...',
        splitBtn: 'Dividir ahora',
        clearBtn: 'Limpiar',
        part: 'Parte',
        copy: 'Copiar',
        copied: '¡Copiado!',
        words: 'caracteres',
        meta: {
            title: 'AI Prompt Splitter: Chunker de Contexto Seguro y Zero-Leak',
            desc: 'Divide prompts largos localmente con total seguridad. Evita fugas de datos y optimiza la ventana de contexto en ChatGPT/Claude.'
        }
    }
};

// 2. 全域狀態 (Global State)
let currentLang = 'en'; // 預設改為 en，匹配國際化策略
let currentChunks = []; 

// 3. DOM 元素鎖定 (改用動態獲取，避免找不到元素時報錯)
const ui = {
    get title() { return document.querySelector('h1'); },
    get desc() { return document.getElementById('mainDesc'); },
    get trustMsg() { return document.getElementById('trustMsg'); },
    get input() { return document.getElementById('inputText'); },
    get splitBtn() { return document.getElementById('splitBtn'); },
    get clearBtn() { return document.getElementById('clearBtn'); },
    get langBtns() { return document.querySelectorAll('nav button'); },
    get resultArea() { return document.getElementById('resultArea'); }
};

// 4. 語系切換函數 (整合動態 SEO Meta 標籤更新與 HTML lang 同步)
function setLanguage(lang) {
    currentLang = lang; 
    const t = translations[lang] || translations['en'];
    
    // --- 修補一：動態同步 HTML 最外層語系宣告 (SEO 基礎) ---
    document.documentElement.lang = lang;

    // --- 動態更新 SEO Meta 標籤 ---
    if (t.meta) {
        document.title = t.meta.title;
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
            metaDesc = document.createElement('meta');
            metaDesc.name = "description";
            document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', t.meta.desc);
    }
    
    // 替換靜態文字 (僅在元素存在時執行，確保跨頁面不報錯)
    if (ui.title) ui.title.textContent = t.title;
    if (ui.desc) ui.desc.textContent = t.desc;
    if (ui.trustMsg) ui.trustMsg.textContent = t.trustMsg;
    if (ui.input) ui.input.placeholder = t.placeholder;
    if (ui.splitBtn) ui.splitBtn.textContent = t.splitBtn;
    if (ui.clearBtn) ui.clearBtn.textContent = t.clearBtn;

    // 更新按鈕樣式
    ui.langBtns.forEach(btn => {
        // 注意：HTML 上的 data-lang 如果是 jp，請記得也要改為 ja
        const btnLang = btn.dataset.lang === 'jp' ? 'ja' : btn.dataset.lang; 
        
        if (btnLang === lang) {
            btn.className = 'px-2 py-1 bg-blue-600 text-white rounded transition-colors text-xs font-medium';
        } else {
            btn.className = 'px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors text-gray-700 text-xs font-medium';
        }
    });

    // 觸發已生成卡片的響應式更新
    if (currentChunks.length > 0 && ui.resultArea) {
        renderChunks(currentChunks);
    }
}

// 5. 綁定語系按鈕事件 (並支援動態修改網址，但不跳轉)
ui.langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        let lang = btn.dataset.lang;
        if (lang === 'jp') lang = 'ja'; // 防呆：處理舊版 HTML 可能殘留的 jp
        
        setLanguage(lang);
        
        // 替換當前網址但不重整頁面，強化 SEO 與分享體驗
        window.history.pushState({}, '', `/${lang}/`);
    });
});

// 6. 核心分割演算法 (維持原版邏輯無損)
function splitText(text, chunkSize = 2000) {
    if (!text.trim()) return [];

    const chunks = [];
    let currentChunk = '';
    const paragraphs = text.split('\n');

    for (const paragraph of paragraphs) {
        if (currentChunk.length + paragraph.length > chunkSize) {
            if (currentChunk.trim()) {
                chunks.push(currentChunk.trim());
                currentChunk = '';
            }
            let remaining = paragraph;
            while (remaining.length > chunkSize) {
                chunks.push(remaining.substring(0, chunkSize));
                remaining = remaining.substring(chunkSize);
            }
            currentChunk = remaining + '\n';
        } else {
            currentChunk += paragraph + '\n';
        }
    }
    if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
    }
    return chunks;
}

// 7. 結果渲染與一鍵複製功能
function renderChunks(chunks) {
    if (!ui.resultArea) return; // 防呆
    
    ui.resultArea.innerHTML = ''; 
    const t = translations[currentLang]; 

    if (chunks.length === 0) return;

    chunks.forEach((chunk, index) => {
        const card = document.createElement('div');
        card.className = 'bg-white p-4 rounded-xl shadow-sm border border-gray-200 mt-4 transition-all hover:shadow-md';
        
        card.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <span class="font-bold text-gray-700 text-sm bg-gray-100 px-2 py-1 rounded">
                    ${t.part} ${index + 1} / ${chunks.length} (${chunk.length} ${t.words})
                </span>
                <button class="copy-btn bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                    ${t.copy}
                </button>
            </div>
            <textarea class="w-full h-32 p-3 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-600 outline-none resize-none" readonly>${chunk}</textarea>
        `;

        const copyBtn = card.querySelector('.copy-btn');
        const textArea = card.querySelector('textarea');

        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(chunk);
                
                copyBtn.textContent = t.copied; 
                copyBtn.className = 'copy-btn bg-gray-800 text-white px-3 py-1 rounded text-sm font-medium transition-colors';
                textArea.select();

                setTimeout(() => {
                    copyBtn.textContent = t.copy; 
                    copyBtn.className = 'copy-btn bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors';
                    window.getSelection().removeAllRanges();
                }, 2000);
            } catch (err) {
                alert('瀏覽器阻擋剪貼簿權限，請手動複製。');
            }
        });

        ui.resultArea.appendChild(card);
    });
}

// 8. 綁定控制按鈕 (加入防呆)
if (ui.splitBtn && ui.input) {
    ui.splitBtn.addEventListener('click', () => {
        const rawText = ui.input.value;
        if (!rawText.trim()) {
            alert('請先輸入或貼上需要分割的文本。');
            return;
        }
        currentChunks = splitText(rawText, 2000); 
        renderChunks(currentChunks); 
    });
}

if (ui.clearBtn && ui.input && ui.resultArea) {
    ui.clearBtn.addEventListener('click', () => {
        ui.input.value = '';
        ui.resultArea.innerHTML = ''; 
        currentChunks = []; 
    });
}

// 9. 核心邏輯：URL 路由偵測與初始化
function initI18nFromUrl() {
    const path = window.location.pathname; 
    const segments = path.split('/').filter(p => p); 
    
    // 必須與 translations 字典的 Key 完全對應
    const supportedLangs = ['en', 'de', 'ja', 'zh-TW', 'zh-CN', 'es'];
    
    // 判斷網址第一個路徑是否為支援語系，否則預設為 en
    const detectedLang = segments.length > 0 && supportedLangs.includes(segments[0]) 
        ? segments[0] 
        : 'en';
        
    setLanguage(detectedLang);
}

// 系統啟動入口
initI18nFromUrl();