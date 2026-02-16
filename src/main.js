// 1. 語系字典定義 (加入 zh-CN 與 trustMsg)
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
        words: '字'
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
        words: '字'
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
        words: 'chars'
    },
    'jp': {
        title: 'AI Prompt Splitter',
        desc: 'The Premier Zero-Leak Context Chunker (プライバシー優先の分割ツール)',
        trustMsg: '🔒 データはブラウザから送信されません (100% ローカル処理)',
        placeholder: '長いテキストを貼り付けてください...',
        splitBtn: '今すぐ分割',
        clearBtn: 'クリア',
        part: 'セクション',
        copy: 'コピー',
        copied: 'コピー完了',
        words: '文字'
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
        words: 'Zeichen'
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
        words: 'caracteres'
    }
};

// 2. 全域狀態 (Global State)
let currentLang = 'zh-TW';
let currentChunks = []; 

// 3. DOM 元素鎖定
const ui = {
    title: document.querySelector('h1'),
    desc: document.getElementById('mainDesc'),
    trustMsg: document.getElementById('trustMsg'),
    input: document.getElementById('inputText'),
    splitBtn: document.getElementById('splitBtn'),
    clearBtn: document.getElementById('clearBtn'),
    langBtns: document.querySelectorAll('nav button'),
    resultArea: document.getElementById('resultArea')
};

// 4. 語系切換函數 (極致效能重構)
function setLanguage(lang) {
    currentLang = lang; 
    const t = translations[lang] || translations['en'];
    
    // 替換靜態文字
    ui.title.textContent = t.title;
    ui.desc.textContent = t.desc;
    ui.trustMsg.textContent = t.trustMsg;
    ui.input.placeholder = t.placeholder;
    ui.splitBtn.textContent = t.splitBtn;
    ui.clearBtn.textContent = t.clearBtn;

    // 更新按鈕樣式 (使用 data-lang 屬性精準綁定)
    ui.langBtns.forEach(btn => {
        if (btn.dataset.lang === lang) {
            btn.className = 'px-2 py-1 bg-blue-600 text-white rounded transition-colors text-xs font-medium';
        } else {
            btn.className = 'px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded transition-colors text-gray-700 text-xs font-medium';
        }
    });

    // 觸發已生成卡片的響應式更新
    if (currentChunks.length > 0) {
        renderChunks(currentChunks);
    }
}

// 5. 綁定語系按鈕事件
ui.langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        setLanguage(btn.dataset.lang);
    });
});

// 6. 核心分割演算法 (Paragraph-Aware)
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

// 8. 綁定控制按鈕
ui.splitBtn.addEventListener('click', () => {
    const rawText = ui.input.value;
    if (!rawText.trim()) {
        alert('請先輸入或貼上需要分割的文本。');
        return;
    }
    currentChunks = splitText(rawText, 2000); 
    renderChunks(currentChunks); 
});

ui.clearBtn.addEventListener('click', () => {
    ui.input.value = '';
    ui.resultArea.innerHTML = ''; 
    currentChunks = []; 
});

// 初始化：預設啟動繁體中文
setLanguage('zh-TW');