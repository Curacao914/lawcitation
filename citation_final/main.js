/**
 * 第一部分：数据接收与预处理
 * 逻辑：接收 index.html 传来的原始文本，进行标准化清洗，然后调用正则匹配
 */
function convertAndDisplayWithCleanedText(textToConvert) {
    console.log("【调试】main.js 已接收到数据");
    
    if (!textToConvert || textToConvert.trim() === "") {
        console.log("【调试】接收数据为空");
        return;
    }
    
    const lines = textToConvert.split('\n');
    let outputCitations = [];

    lines.forEach((line, index) => {
        if (!line.trim()) return;

        // 1. 基础清洗：去掉序号、空格，统一半角符号
        let processedLine = line.trim()
            .replace(/^\s*(\[\d+\]|\d+\.|\(\d+\)|\d+\))\s*/, "") // 去掉 [1] 或 1. 这种序号
            .replace(/[\s　]+/g, "") // 去掉所有半角和全角空格
            .replace(/：/g, ':').replace(/，/g, ',').replace(/；/g, ';')
            .replace(/（/g, '(').replace(/）/g, ')').replace(/［/g, '[').replace(/］/g, ']')
            .replace(/．/g, '.');
        
        // 2. 补全末尾点号：正则库强依赖结尾的英文点号
        if (!processedLine.endsWith('.')) {
            processedLine = processedLine.replace(/。$/, '') + '.';
        }

        console.log(`【调试】第 ${index + 1} 行清洗后内容: ${processedLine}`);

        // 3. 执行正则转换
        const result = convertCitation(processedLine);
        outputCitations.push(result);
    });

    // 4. 将最终结果写入页面
    const outputField = document.getElementById('outputTextarea');
    if (outputField) {
        outputField.value = outputCitations.join('\n');
        console.log("【调试】结果已写入文本框");
    } else {
        console.error("【错误】找不到 outputTextarea 元素");
    }
}

/**
 * 第二部分：基础功能函数
 */
function openReferenceTool() {
    window.open('https://pegaseius.github.io/lawschoolreferencetest/', '_blank'); 
}

function copyToClipboard() {
    const outputTextarea = document.getElementById('outputTextarea');
    const text = outputTextarea ? outputTextarea.value.trim() : "";

    if (!text) {
        alert('转换结果为空，无法复制！');
        return;
    }

    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = text;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);

    const copyBtn = document.querySelector('.copy-button');
    if (copyBtn) {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fa fa-check"></i> 复制完成';
        setTimeout(() => { copyBtn.innerHTML = originalText; }, 1500);
    }
}

/**
 * 第三部分：核心正则规则库 (convertCitation)
 * 逻辑：如果匹配成功则返回法学格式，全部匹配失败则返回“无法识别”
 */
function convertCitation(inputCitation) {
    // 所有的正则表达式定义
    const regexWithPages = /^(.+?)\.(.+?)\[(.+?)\]\.(.+?),(\d{4})\((\d{1,2})\):(\d+)-(\d+)\.$/;
    const regexWith1Page = /^(.+?)\.(.+?)\[(.+?)\]\.(.+?),(\d{4})\((\d{1,2})\):(\d+)\.$/;
    const regexWithoutPages = /^(.+?)\.(.+?)\[(.+?)\]\.(.+?),(\d{4})\((\d{1,2})\)\.$/;
    const regexWithPagesandv = /^(.+?)\.(.+?)\[(.+?)\]\.(.+?),(\d{4}),(\d{1,2})\((\d{1,2})\):(\d+)-(\d+)\.$/;
    const regexWith1Pageandv = /^(.+?)\.(.+?)\[(.+?)\]\.(.+?),(\d{4}),(\d{1,2})\((\d{1,2})\):(\d+)\.$/;
    const regexWithoutPagesandv = /^(.+?)\.(.+?)\[(.+?)\]\.(.+?),(\d{4}),(\d{1,2})\((\d{1,2})\)\.$/;
    const regexzhiwangqikan = /^(.*?)\[(.*?)\]\.(.*?)\.(.*?)\,(.*?)\((.*?)\)/;
    const regexPublisher = /^(.+?)\.(.+?)\[M\]\.([^:,]+):([^,]+),(\d{4})\.$/;
    const regexPublisherwithpages = /^(.+?)\.(.+?)\[M\]\.(.+?):(.+?),(\d+):(\d+)-(\d+)\.$/;
    const regexPublisherwith1page = /^(.+?)\.(.+?)\[(M)\]\.(.+?):(.+?),(\d+):(\d+)\.$/;
    const regexzhiwangbookz = /^(.*?)\[(.*?)\]\.(.*?)(著)\.(.*?)\.(.*)/;
    const regexzhiwangbookzb = /^(.*?)\[(.*?)\]\.(.*?)(主编)\.(.*?)\.(.*)/;
    const regexzhiwangbook = /^(.*?)\[(.*?)\]\.(.*?)\.(.*?)\.(.*)/;
    const regexDegree = /^(.+?)\.(.+?)\[(D)\]\.(.+?):(.+?),(\d+)\.$/;
    const regexDegreewithpages = /^(.+?)\.(.+?)\[(D)\]\.(.+?):(.+?),(\d+):(\d+)-(\d+)\.$/;
    const regexDegreewith1page = /^(.+?)\.(.+?)\[(D)\]\.(.+?):(.+?),(\d+):(\d+)\.$/;
    const regexzhiwangdegree = /^(.+?)\[(\w)\]\.\s*(.+?)\.(.+?),(\d+)$/;

    let match;
    // 期刊类匹配
    match = inputCitation.match(regexWithPages);
    if (match) return `${match[1]}：《${match[2]}》，载《${match[4]}》${match[5]}年第${parseInt(match[6], 10)}期，第${match[7]}~${match[8]}页。`;
    
    match = inputCitation.match(regexWith1Page);
    if (match) return `${match[1]}：《${match[2]}》，载《${match[4]}》${match[5]}年第${parseInt(match[6], 10)}期，第${match[7]}页。`;
    
    match = inputCitation.match(regexWithoutPages);
    if (match) return `${match[1]}：《${match[2]}》，载《${match[4]}》${match[5]}年第${parseInt(match[6], 10)}期。`;
    
    match = inputCitation.match(regexWithPagesandv);
    if (match) return `${match[1]}：《${match[2]}》，载《${match[4]}》${match[5]}年第${parseInt(match[6], 10)}卷第${parseInt(match[7], 10)}期，第${match[8]}~${match[9]}页。`;

    match = inputCitation.match(regexzhiwangqikan);
    if (match) return `${match[3]}：《${match[1]}》，载《${match[4]}》${match[5]}年第${parseInt(match[6], 10)}期。`;

    // 著作类匹配
    match = inputCitation.match(regexPublisher);
    if (match) return `${match[1]}：《${match[2]}》，${match[4]}${match[5]}年版。`;

    match = inputCitation.match(regexzhiwangbookz);
    if (match) return `${match[3]}：《${match[1]}》，${match[5]}${match[6]}年版。`;

    // 学位论文匹配
    match = inputCitation.match(regexzhiwangdegree);
    if (match) return `${match[3]}：《${match[1]}》，${match[4]}${match[5]}年博士论文。`;

    // 如果所有正则都匹配失败，返回警告提示
    return "【无法识别的引用格式】";
}
