// 1. 語系字典定義 (i18n Dictionary) - 擴充卡片專用文字
const translations = {
    'zh-TW': {
        title: 'AI Context Chunker',
        desc: '解決「Lost in the Middle」痛點，隱私優先的純前端分割工具。',
        placeholder: '請貼上長文本...',
        splitBtn: '立即分割 (Split)',
        clearBtn: '清空 (Clear)',
        part: '部分',
        copy: '複製 (Copy)',
        copied: '已複製! (Copied)',
        words: '字'
    },
    'en': {
        title: 'AI Context Chunker',
        desc: 'Solve "Lost in the Middle" issues with this privacy-first frontend tool.',
        placeholder: 'Paste your long text here...',
        splitBtn: 'Split Now',
        clearBtn: 'Clear',
        part: 'Part',
        copy: 'Copy',
        copied: 'Copied!',
        words: 'chars'
    },
    'jp': {
        title: 'AI コンテキスト分割',
        desc: 'プライバシー優先のフロントエンド分割ツール。',
        placeholder: '長いテキストを貼り付けてください...',
        splitBtn: '今すぐ分割',
        clearBtn: 'クリア',
        part: 'セクション',
        copy: 'コピー',
        copied: 'コピー完了',
        words: '文字'
    },
    'de': {
        title: 'AI Kontext-Splitter',
        desc: 'Datenschutzorientiertes Frontend-Tool zur Textteilung.',
        placeholder: 'Langen Text hier einfügen...',
        splitBtn: 'Jetzt teilen',
        clearBtn: 'Löschen',
        part: 'Teil',
        copy: 'Kopieren',
        copied: 'Kopiert!',
        words: 'Zeichen'
    },
    'es': {
        title: 'Divisor de Contexto AI',
        desc: 'Herramienta de front-end centrada en la privacidad para dividir texto.',
        placeholder: 'Pegue su texto largo aquí...',
        splitBtn: 'Dividir ahora',
        clearBtn: 'Limpiar',
        part: 'Parte',
        copy: 'Copiar',
        copied: '¡Copiado!',
        words: 'caracteres'
    }
};

// 2. 全域狀態 (Global State) - 數位資產的「單一事實來源」
let currentLang = 'zh-TW';
let currentChunks = []; // 記憶目前的分割區塊，用於語系無縫切換

// 3. DOM 元素鎖定
const ui = {
    title: document.querySelector('h1'),
    desc: document.querySelector('section p'),
    input: document.getElementById('inputText'),
    splitBtn: document.getElementById('splitBtn'),
    clearBtn: document.getElementById('clearBtn'),
    langBtns: document.querySelectorAll('nav button'),
    resultArea: document.getElementById('resultArea')
};

// 4. 語系切換函數
function setLanguage(lang) {
    currentLang = lang; // 核心：同步更新大腦狀態
    const t = translations[lang] || translations['en'];
    
    // 更新頂部介面文字
    ui.title.textContent = t.title;
    ui.desc.textContent = t.desc;
    ui.input.placeholder = t.placeholder;
    ui.splitBtn.textContent = t.splitBtn;
    ui.clearBtn.textContent = t.clearBtn;

    // 更新按鈕樣式 (高亮當前語系)
    ui.langBtns.forEach(btn => {
        if (btn.textContent.toLowerCase().includes(lang.split('-')[0]) || 
            (lang === 'zh-TW' && btn.textContent === '繁中')) {
            btn.className = 'px-2 py-1 bg-blue-600 text-white rounded';
        } else {
            btn.className = 'px-2 py-1 bg-gray-200 rounded';
        }
    });

    // 高槓桿優化：若下方已有分割卡片，立即以新語系重新渲染
    if (currentChunks.length > 0) {
        renderChunks(currentChunks);
    }
}

// 5. 綁定語系按鈕事件
ui.langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const langMap = { 'EN': 'en', '繁中': 'zh-TW', 'JP': 'jp', 'DE': 'de', 'ES': 'es' };
        setLanguage(langMap[btn.textContent]);
    });
});

// 6. 核心分割演算法 (Paragraph-Aware Chunking)
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
    const t = translations[currentLang]; // 從全域狀態精準抓取字典

    if (chunks.length === 0) return;

    chunks.forEach((chunk, index) => {
        const card = document.createElement('div');
        card.className = 'bg-white p-4 rounded-xl shadow-sm border border-gray-200 mt-4 transition-all hover:shadow-md';
        
        // 動態注入語系文字 (t.part, t.words, t.copy)
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
                
                // 動態切換為「已複製」語系文字
                copyBtn.textContent = t.copied; 
                copyBtn.className = 'copy-btn bg-gray-800 text-white px-3 py-1 rounded text-sm font-medium transition-colors';
                textArea.select();

                setTimeout(() => {
                    // 恢復「複製」語系文字
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

// 8. 綁定控制按鈕 (觸發器)
ui.splitBtn.addEventListener('click', () => {
    const rawText = ui.input.value;
    if (!rawText.trim()) {
        alert('請先輸入或貼上需要分割的文本。');
        return;
    }
    currentChunks = splitText(rawText, 2000); // 將結果存入全域陣列
    renderChunks(currentChunks); 
});

ui.clearBtn.addEventListener('click', () => {
    ui.input.value = '';
    ui.resultArea.innerHTML = ''; 
    currentChunks = []; // 清空狀態記憶
});

// 初始化：預設啟動繁體中文
setLanguage('zh-TW');