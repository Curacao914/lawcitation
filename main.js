// 用于接收从main.html传递过来的清洗后文本数据的变量
let cleanedTextData;

// 监听自定义事件，当main.html中完成文本清洗并触发事件时，获取清洗后的文本数据
document.addEventListener('cleanedTextAvailable', function (event) {
    cleanedTextData = event.detail.cleanedText;
    convertAndDisplayWithCleanedText();
});

function openReferenceTool() {
    window.open('https://pegaseius.github.io/lawschoolreferencetest/', '_blank'); // 跳转一键排序
}

function convertCitation(inputCitation) {
    // 正则表达式
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

    // 逐个尝试匹配
    let match;

    match = inputCitation.match(regexWithPages);
    if (match) {
        const period = parseInt(match[6], 10); // 转换期号为整数以去除前导零
        return `${match[1]}：《${match[2]}》，载《${match[4]}》${match[5]}年第${period}期，第${match[7]}~${match[8]}页。`;
    }

    match = inputCitation.match(regexWith1Page);
    if (match) {
        const period = parseInt(match[6], 10); // 转换期号为整数以去除前导零
        return `${match[1]}：《${match[2]}》，载《${match[4]}》${match[5]}年第${period}期，第${match[7]}页。`;
    }

    match = inputCitation.match(regexWithoutPages);
    if (match) {
        const period = parseInt(match[6], 10); // 转换期号为整数以去除前导零
        return `${match[1]}：《${match[2]}》，载《${match[4]}》${match[5]}年第${period}期。`;
    }

    match = inputCitation.match(regexWithPagesandv);
    if (match) {
        const volume = parseInt(match[6], 10); // 转换卷号为整数以去除前导零
        const period = parseInt(match[7], 10); // 转换期号为整数以去除前导零
        return `${match[1]}：《${match[2]}》，载《${match[4]}》${match[5]}年第${volume}卷第${period}期，第${match[8]}~${match[9]}页。`;
    }

    match = inputCitation.match(regexWith1Pageandv);
    if (match) {
        const volume = parseInt(match[6], 10); // 转换卷号为整数以去除前导零
        const period = parseInt(match[7], 10); // 转换期号为整数以去除前导零
        return `${match[1]}：《${match[2]}》，载《${match[4]}》${match[5]}年第${volume}卷第${period}期，第${match[8]}页。`;
    }

    match = inputCitation.match(regexWithoutPagesandv);
    if (match) {
        const volume = parseInt(match[6], 10); // 转换卷号为整数以去除前导零
        const period = parseInt(match[7], 10); // 转换期号为整数以去除前导零
        return `${match[1]}：《${match[2]}》，载《${match[4]}》${match[5]}年第${volume}卷第${period}期。`;
    }

    match = inputCitation.match(regexzhiwangqikan);
    if (match) {
        const period = parseInt(match[6], 10); // 转换期号为整数以去除前导零
        return `${match[3]}：《${match[1]}》，载《${match[4]}》${match[5]}年第${period}期。`;
    }

    match = inputCitation.match(regexPublisher);
    if (match) {
        return `${match[1]}：《${match[2]}》，${match[4]}${match[5]}年版。`;
    }

    match = inputCitation.match(regexPublisherwithpages);
    if (match) {
        return `${match[1]}：《${match[2]}》，${match[4]}${match[5]}年版，第${match[6]}~${match[7]}页。`;
    }

    match = inputCitation.match(regexPublisherwith1page);
    if (match) {
        return `${match[1]}：《${match[2]}》，${match[5]}${match[6]}年版，第${match[7]}页。`;
    }

    match = inputCitation.match(regexzhiwangbookz);
    if (match) {
        return `${match[3]}：《${match[1]}》，${match[5]}${match[6]}年版。`;
    }

    match = inputCitation.match(regexzhiwangbookzb);
    if (match) {
        return `${match[3]}：《${match[1]}》，${match[5]}${match[6]}年版。`;
    }

    match = inputCitation.match(regexzhiwangbook);
    if (match) {
        return `${match[3]}：《${match[1]}》，${match[4]}${match[5]}年版。`;
    }

    match = inputCitation.match(regexDegree);
    if (match) {
        return `${match[1]}：《${match[2]}》，${match[5]}${match[6]}年博士论文。`;
    }

    match = inputCitation.match(regexDegreewithpages);
    if (match) {
        return `${match[1]}：《${match[2]}》，${match[5]}${match[6]}年博士论文,第${match[7]}~${match[8]}页。`;
    }

    match = inputCitation.match(regexDegreewith1page);
    if (match) {
        return `${match[1]}：《${match[2]}》，${match[5]}${match[6]}年博士论文,第${match[7]}页。`;
    }

    match = inputCitation.match(regexzhiwangdegree);
    if (match) {
        return `${match[3]}：《${match[1]}》，${match[4]}${match[5]}年博士论文。`;
    }

    // 如果都匹配不到，返回错误信息
    return "无法识别的引用格式";
}

function convertAndDisplayWithCleanedText() {
    if (!cleanedTextData) {
        return; // 如果还没有接收到清洗后的数据，直接返回不进行后续操作
    }
    const inputCitationArray = cleanedTextData.split('\n'); // 将清洗后的文本按行分割成数组
    let outputCitations = ''; // 初始化输出的引用文本

    // 遍历每个清洗后的文献，转换并拼接到输出文本中
    inputCitationArray.forEach(inputCitation => {
        const outputCitation = convertCitation(inputCitation.trim().replace(/;/g, '、')); // 转换引用格式，并去除首尾空格，将分号替换为中文逗号
        outputCitations += outputCitation.replace(/([^\x00-\xff]),([^\x00-\xff])/g, '$1、$2') + '\n'; // 将转换后的引用文本拼接到输出文本中，替换逗号为顿号
    });

    const outputTextarea = document.getElementById('outputTextarea');
    outputTextarea.value = outputCitations.trim();
}

function copyToClipboard() {
    const copyButton = document.querySelector('.copy-button');
    const originalButtonText = copyButton.textContent;
    const outputTextarea = document.getElementById('outputTextarea');
    if (outputTextarea) {
        const outputCitations = outputTextarea.value;
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = outputCitations;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);

        // 检查按钮元素上是否已经存在自定义的data-is-restoring属性，不存在则设为false，表示不在恢复状态
        if (!copyButton.dataset.isRestoring) {
            copyButton.dataset.isRestoring = 'false';
        }

        // 只有当按钮不在恢复状态时，才执行修改文本和设置定时器恢复的操作
        if (copyButton.dataset.isRestoring === 'false') {
            copyButton.textContent = '复制完成';
            copyButton.dataset.isRestoring = 'true';
            setTimeout(() => {
                copyButton.textContent = originalButtonText;
                copyButton.dataset.isRestoring = 'false';
            }, 500);
        }
    } else {
        alert('找不到输出文本框，无法复制内容');
    }
}