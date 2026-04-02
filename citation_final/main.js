// 【第一部分：基础配置】确保 index.html 调用的变量和函数是全局可见的
var cleanedTextData = ""; 

// 【第二部分：核心转换逻辑】
function convertAndDisplayWithCleanedText() {
    if (!cleanedTextData) {
        console.log("没有接收到清洗后的数据");
        return;
    }
    const inputCitationArray = cleanedTextData.split('\n');
    let outputCitations = '';

    // 遍历转换
    inputCitationArray.forEach(inputCitation => {
        const outputCitation = convertCitation(inputCitation.trim().replace(/;/g, '、'));
        outputCitations += outputCitation.replace(/([^\x00-\xff]),([^\x00-\xff])/g, '$1、$2') + '\n';
    });

    const outputTextarea = document.getElementById('outputTextarea');
    if (outputTextarea) {
        outputTextarea.value = outputCitations.trim();
    }
}

// 【第三部分：工具函数】跳转及复制功能
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

    // 找到按钮并反馈
    const copyBtn = document.querySelector('.copy-button');
    if (copyBtn) {
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = '<i class="fa fa-check"></i> 复制完成';
        setTimeout(() => { copyBtn.innerHTML = originalText; }, 1500);
    }
}

// 【第四部分：正则规则库】这是你最核心的财产，不要动它
function convertCitation(inputCitation) {
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
    match = inputCitation.match(regexWithPages);
    if (match) {
        const period = parseInt(match[6], 10);
        return `${match[1]}：《${match[2]}》，载《${match[4]}》${match[5]}年第${period}期，第${match[7]}~${match[8]}页。`;
    }
    match = inputCitation.match(regexWith1Page);
    if (match) {
        const period = parseInt(match[6], 10);
        return `${match[1]}：《${match[2]}》，载《${match[4]}》${match[5]}年第${period}期，第${match[7]}页。`;
    }
    match = inputCitation.match(regexWithoutPages);
    if (match) {
        const period = parseInt(match[6], 10);
        return `${match[1]}：《${match[2]}》，载《${match[4]}》${match[5]}年第${period}期。`;
    }
    match = inputCitation.match(regexWithPagesandv);
    if (match) {
        const volume = parseInt(match[6], 10);
        const period = parseInt(match[7], 10);
        return `${match[1]}：《${match[2]}》，载《${match[4]}》${match[5]}年第${volume}卷第${period}期，第${match[8]}~${match[9]}页。`;
    }
    match = inputCitation.match(regexWith1Pageandv);
    if (match) {
        const volume = parseInt(match[6], 10);
        const period = parseInt(match[7], 10);
        return `${match[1]}：《${match[2]}》，载《${match[4]}》${match[5]}年第${volume}卷第${period}期，第${match[8]}页。`;
    }
    match = inputCitation.match(regexWithoutPagesandv);
    if (match) {
        const volume = parseInt(match[6], 10);
        const period = parseInt(match[7], 10);
        return `${match[1]}：《${match[2]}》，载《${match[4]}》${match[5]}年第${volume}卷第${period}期。`;
    }
    match = inputCitation.match(regexzhiwangqikan);
    if (match) {
        const period = parseInt(match[6], 10);
        return `${match[3]}：《${match[1]}》，载《${match[4]}》${match[5]}年第${period}期。`;
    }
    match = inputCitation.match(regexPublisher);
    if (match) return `${match[1]}：《${match[2]}》，${match[4]}${match[5]}年版。`;
    match = inputCitation.match(regexPublisherwithpages);
    if (match) return `${match[1]}：《${match[2]}》，${match[4]}${match[5]}年版，第${match[6]}~${match[7]}页。`;
    match = inputCitation.match(regexPublisherwith1page);
    if (match) return `${match[1]}：《${match[2]}》，${match[5]}${match[6]}年版，第${match[7]}页。`;
    match = inputCitation.match(regexzhiwangbookz);
    if (match) return `${match[3]}：《${match[1]}》，${match[5]}${match[6]}年版。`;
    match = inputCitation.match(regexzhiwangbookzb);
    if (match) return `${match[3]}：《${match[1]}》，${match[5]}${match[6]}年版。`;
    match = inputCitation.match(regexzhiwangbook);
    if (match) return `${match[3]}：《${match[1]}》，${match[4]}${match[5]}年版。`;
    match = inputCitation.match(regexDegree);
    if (match) return `${match[1]}：《${match[2]}》，${match[5]}${match[6]}年博士论文。`;
    match = inputCitation.match(regexDegreewithpages);
    if (match) return `${match[1]}：《${match[2]}》，${match[5]}${match[6]}年博士论文,第${match[7]}~${match[8]}页。`;
    match = inputCitation.match(regexDegreewith1page);
    if (match) return `${match[1]}：《${match[2]}》，${match[5]}${match[6]}年博士论文,第${match[7]}页。`;
    match = inputCitation.match(regexzhiwangdegree);
    if (match) return `${match[3]}：《${match[1]}》，${match[4]}${match[5]}年博士论文。`;

    return "无法识别的引用格式";
}
