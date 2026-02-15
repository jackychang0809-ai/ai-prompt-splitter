// 1. 語系字典定義 (i18n Dictionary)
const translations = {
    'zh-TW': {
        title: 'AI Context Chunker',
        desc: '解決「Lost in the Middle」痛點，隱私優先的純前端分割工具。',
        placeholder: '請貼上長文本...',
        splitBtn: '立即分割 (Split)',
        clearBtn: '清空 (Clear)'
    },
    'en': {
        title: 'AI Context Chunker',
        desc: 'Solve "Lost in the Middle" issues with this privacy-first frontend tool.',
        placeholder: 'Paste your long text here...',
        splitBtn: 'Split Now',
        clearBtn: 'Clear'
    },
    'jp': {
        title: 'AI コンテキスト分割',
        desc: 'プライバシー優先のフロントエンド分割ツール。',
        placeholder: '長いテキストを貼り付けてください...',
        splitBtn: '今すぐ分割',
        clearBtn: 'クリア'
    },
    'de': {
        title: 'AI Kontext-Splitter',
        desc: 'Datenschutzorientiertes Frontend-Tool zur Textteilung.',
        placeholder: 'Langen Text hier einfügen...',
        splitBtn: 'Jetzt teilen',
        clearBtn: 'Löschen'
    },
    'es': {
        title: 'Divisor de Contexto AI',
        desc: 'Herramienta de front-end centrada en la privacidad para dividir texto.',
        placeholder: 'Pegue su texto largo aquí...',
        splitBtn: 'Dividir ahora',
        clearBtn: 'Limpiar'
    }
};

// 2. DOM 元素鎖定
const ui = {
    title: document.querySelector('h1'),
    desc: document.querySelector('section p'),
    input: document.getElementById('inputText'),
    splitBtn: document.getElementById('splitBtn'),
    clearBtn: document.getElementById('clearBtn'),
    langBtns: document.querySelectorAll('nav button')
};

// 3. 語系切換函數
function setLanguage(lang) {
    const t = translations[lang] || translations['en'];
    
    // 更新介面文字
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
}

// 4. 綁定語系按鈕事件
ui.langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const langMap = { 'EN': 'en', '繁中': 'zh-TW', 'JP': 'jp', 'DE': 'de', 'ES': 'es' };
        setLanguage(langMap[btn.textContent]);
    });
});

// 初始化：預設繁中
setLanguage('zh-TW');

// 5. 核心分割演算法 (Paragraph-Aware Chunking)
function splitText(text, chunkSize = 2000) {
    if (!text.trim()) return [];

    const chunks = [];
    let currentChunk = '';
    
    // 優先以「換行符號」作為初步切割點，保護段落完整性
    const paragraphs = text.split('\n');

    for (const paragraph of paragraphs) {
        // 預判：如果加上這個段落會超載，就先將目前的 Chunk 推入陣列
        if (currentChunk.length + paragraph.length > chunkSize) {
            if (currentChunk.trim()) {
                chunks.push(currentChunk.trim());
                currentChunk = '';
            }
            
            // 防禦機制：如果單一段落本身就超過 2000 字 (例如無換行的超長代碼)
            let remaining = paragraph;
            while (remaining.length > chunkSize) {
                chunks.push(remaining.substring(0, chunkSize));
                remaining = remaining.substring(chunkSize);
            }
            currentChunk = remaining + '\n';
        } else {
            // 安全範圍內，持續累積段落
            currentChunk += paragraph + '\n';
        }
    }

    // 將最後剩餘的內容推入
    if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
    }

    return chunks;
}

// 6. 綁定控制按鈕 (觸發器)
// 7. 結果渲染與一鍵複製功能 (Phase 3 & 4)
const resultArea = document.getElementById('resultArea');

function renderChunks(chunks) {
    resultArea.innerHTML = ''; // 清空前次結果

    if (chunks.length === 0) return;

    chunks.forEach((chunk, index) => {
        const card = document.createElement('div');
        // Tailwind 卡片樣式
        card.className = 'bg-white p-4 rounded-xl shadow-sm border border-gray-200 mt-4 transition-all hover:shadow-md';
        
        card.innerHTML = `
            <div class="flex justify-between items-center mb-2">
                <span class="font-bold text-gray-700 text-sm bg-gray-100 px-2 py-1 rounded">Part ${index + 1} / ${chunks.length} (${chunk.length} 字)</span>
                <button class="copy-btn bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors">
                    複製 (Copy)
                </button>
            </div>
            <textarea class="w-full h-32 p-3 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-600 outline-none resize-none" readonly>${chunk}</textarea>
        `;

        // 綁定「一鍵複製」功能
        const copyBtn = card.querySelector('.copy-btn');
        const textArea = card.querySelector('textarea');

        copyBtn.addEventListener('click', async () => {
            try {
                // 寫入系統剪貼簿
                await navigator.clipboard.writeText(chunk);
                
                // 視覺回饋：變色與選取
                copyBtn.textContent = '已複製! (Copied)';
                copyBtn.className = 'copy-btn bg-gray-800 text-white px-3 py-1 rounded text-sm font-medium transition-colors';
                textArea.select();

                // 2秒後自動恢復按鈕狀態
                setTimeout(() => {
                    copyBtn.textContent = '複製 (Copy)';
                    copyBtn.className = 'copy-btn bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm font-medium transition-colors';
                    window.getSelection().removeAllRanges();
                }, 2000);
            } catch (err) {
                alert('瀏覽器阻擋剪貼簿權限，請手動複製。');
            }
        });

        resultArea.appendChild(card);
    });
}

// 替換原本的分割按鈕觸發器 (移除 Alert，改為渲染卡片)
ui.splitBtn.addEventListener('click', () => {
    const rawText = ui.input.value;
    if (!rawText.trim()) {
        alert('請先輸入或貼上需要分割的文本。');
        return;
    }
    const resultChunks = splitText(rawText, 2000);
    renderChunks(resultChunks); 
});

// 擴充清空按鈕功能：連同下方的結果區塊一起清空
ui.clearBtn.addEventListener('click', () => {
    ui.input.value = '';
    resultArea.innerHTML = ''; 
});