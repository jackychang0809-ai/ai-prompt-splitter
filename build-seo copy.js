const fs = require('fs').promises;
const path = require('path');
const ROOT_DIR = process.cwd();
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const FOOTER_PATH = path.join(ROOT_DIR, 'src', 'components', 'footer.html');
async function walkDir(dir) {
let files = [];
const entries = await fs.readdir(dir, { withFileTypes: true });
for (const entry of entries) {
const fullPath = path.join(dir, entry.name);
if (entry.isDirectory()) files = files.concat(await walkDir(fullPath));
else if (entry.isFile() && fullPath.endsWith('.html')) files.push(fullPath);
}
return files;
}
async function injectFooter() {
try {
// 讀取並強制移除 UTF-8 BOM (Byte Order Mark)，防止隱藏字元干擾
let footerContent = await fs.readFile(FOOTER_PATH, 'utf-8');
footerContent = footerContent.replace(/^\uFEFF/, '');
code
Code
const htmlFiles = await walkDir(DIST_DIR);

    for (const filePath of htmlFiles) {
        let content = await fs.readFile(filePath, 'utf-8');
        content = content.replace(/^\uFEFF/, '');

        // 使用正則表達式 (Regex) 進行全域且忽略空白的精準替換
        const placeholderRegex = /<!--\s*INJECT_FOOTER\s*-->/gi;
        
        if (placeholderRegex.test(content)) {
            content = content.replace(placeholderRegex, footerContent);
            await fs.writeFile(filePath, content, 'utf-8');
            console.log(`✅ Footer injected: ${path.relative(ROOT_DIR, filePath)}`);
        } else {
            console.log(`⚠️ No placeholder found: ${path.relative(ROOT_DIR, filePath)}`);
        }
    }
} catch (error) {
    console.error('❌ Error:', error);
}
}
injectFooter();