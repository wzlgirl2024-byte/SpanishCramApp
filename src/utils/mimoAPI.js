// API配置 - 小米 MiMo API
const API_URL = 'https://api.xiaomimimo.com/v1/chat/completions';

// 获取用户保存的API Key
function getApiKey() {
    const key = localStorage.getItem('mimo_api_key');
    if (!key) {
        throw new Error('请先设置MiMo API Key');
    }
    return key;
}

// 随机主题列表 - 用于增加生成内容的多样性
const THEMES = [
    "La familia (家庭)", "La escuela (学校)", "El restaurante (餐厅)",
    "Las compras (购物)", "El viaje (旅行)", "Los amigos (朋友)",
    "El tiempo libre (业余时间)", "La casa (家)", "El trabajo (工作)",
    "La comida (食物)", "La ciudad (城市)", "El fin de semana (周末)",
    "El hospital (医院)", "El parque (公园)", "La fiesta (派对)",
    "El cine (电影院)", "La biblioteca (图书馆)", "El aeropuerto (机场)"
];

// 随机人名列表 - 用于替换通用人名，避免重复
const NAMES = [
    "Ana", "Carlos", "Elena", "David", "Sofía", "Miguel", "Lucía", "Pablo",
    "María", "Juan", "Carmen", "José", "Isabel", "Luis", "Paula", "Javier",
    "Laura", "Antonio", "Marta", "Manuel", "Sara", "Pedro", "Julia", "Jorge"
];

function getRandomTheme() {
    return THEMES[Math.floor(Math.random() * THEMES.length)];
}

function getRandomNames(count = 3) {
    const shuffled = [...NAMES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).join(', ');
}

/**
 * 格式化之前的知识点，用于Prompt
 */
function formatPreviousKnowledge(previousKnowledge) {
    if (!previousKnowledge) return '';

    let text = '';
    if (previousKnowledge.vocab && previousKnowledge.vocab.length > 0) {
        const shuffled = [...previousKnowledge.vocab].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 30).map(v => `${v.spanish}=${v.chinese}`).join(', ');
        text += `\n已学词汇（可适当使用）：${selected}`;
    }

    if (previousKnowledge.grammar && previousKnowledge.grammar.length > 0) {
        const grammarTitles = previousKnowledge.grammar.map(g => g.title).join(', ');
        text += `\n已学语法（可适当涉及）：${grammarTitles}`;
    }

    return text;
}

// ============================================================
//  公共 API 调用层 - 统一处理请求、响应解析、空内容重试
// ============================================================

/**
 * 从 API 响应 JSON 中提取文本内容
 * 兼容多种可能的响应结构
 */
function extractContent(data) {
    if (!data || !data.choices || !data.choices[0]) return '';

    const choice = data.choices[0];

    // 标准 OpenAI 格式: choices[0].message.content
    if (choice.message?.content && choice.message.content.trim()) {
        return choice.message.content;
    }

    // 某些模型用 reasoning_content 字段（思维链），content 可能为空
    // 尝试从 reasoning_content 中提取（如果有的话，通常不是我们想要的，但记录下来方便调试）
    if (choice.message?.reasoning_content) {
        console.log('[MiMo API] 检测到 reasoning_content 字段');
    }

    // 某些兼容格式: choices[0].text
    if (choice.text && choice.text.trim()) {
        return choice.text;
    }

    // 遍历 message 的所有属性，找第一个非空字符串
    if (choice.message) {
        for (const [key, val] of Object.entries(choice.message)) {
            if (typeof val === 'string' && val.trim() && key !== 'role') {
                console.log(`[MiMo API] 从 message.${key} 中提取到内容`);
                return val;
            }
        }
    }

    return '';
}

/**
 * 统一调用 MiMo API（带自动重试）
 * @param {Array} messages - chat messages
 * @param {Object} options - { temperature, maxTokens, timeout, retries, systemPrompt }
 * @returns {string} 提取到的文本内容
 */
async function callMiMoAPI(messages, options = {}) {
    const {
        temperature = 0.8,
        maxTokens = 3000,
        timeout = 60000,
        retries = 2,       // 默认重试2次（共3次尝试）
        label = 'API'      // 日志标签
    } = options;

    const apiKey = getApiKey();

    for (let attempt = 0; attempt <= retries; attempt++) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        try {
            if (attempt > 0) {
                console.log(`[MiMo API] ${label} 第${attempt + 1}次尝试...`);
            }

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'mimo-v2.5',
                    messages,
                    temperature,
                    max_tokens: maxTokens
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`);
            }

            const data = await response.json();
            const content = extractContent(data);

            if (content.trim()) {
                if (attempt > 0) {
                    console.log(`[MiMo API] ${label} 第${attempt + 1}次尝试成功`);
                }
                console.log(`[MiMo API] ${label} 返回内容长度: ${content.length}, 前200字符:`, content.substring(0, 200));
                return content;
            }

            // 内容为空，记录日志
            console.warn(`[MiMo API] ${label} 返回空内容 (attempt ${attempt + 1}/${retries + 1})，完整响应:`, JSON.stringify(data).substring(0, 500));

            // 如果还有重试机会，等待一小段时间后重试
            if (attempt < retries) {
                await new Promise(r => setTimeout(r, 1000));
                continue;
            }

            // 所有重试都失败
            throw new Error('API多次返回空内容，请稍后重试或检查API Key');

        } catch (error) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                console.warn(`[MiMo API] ${label} 请求超时 (attempt ${attempt + 1}/${retries + 1})`);
                if (attempt < retries) {
                    await new Promise(r => setTimeout(r, 1000));
                    continue;
                }
                throw new Error(`${label}请求超时，请稍后重试`);
            }

            // 非空内容错误（如网络错误、JSON解析错误），不重试
            if (error.message.includes('API请求失败') || error.message.includes('空内容')) {
                if (attempt < retries) {
                    await new Promise(r => setTimeout(r, 1000));
                    continue;
                }
            }

            throw error;
        }
    }
}

/**
 * 清理 markdown 代码块标记，提取纯 JSON 文本
 */
function cleanMarkdown(text) {
    return text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
}

/**
 * 在文本中寻找第一个完整的 JSON 块（{...} 或 [...]）
 * 跳过字符串内部的括号，正确处理 \" 转义
 * @param {string} text - 待搜索文本
 * @param {string} openChar - '{' 或 '['
 * @param {string} closeChar - '}' 或 ']'
 * @returns {string|null} 提取到的 JSON 字符串，找不到返回 null
 */
function findJSONBlock(text, openChar, closeChar) {
    let depth = 0;
    let start = -1;
    let inString = false;

    for (let i = 0; i < text.length; i++) {
        const ch = text[i];

        // 处理字符串内的转义字符 \" \n \\ 等
        if (inString) {
            if (ch === '\\') {
                i++; // 跳过转义后的下一个字符
                continue;
            }
            if (ch === '"') {
                inString = false;
            }
            continue;
        }

        // 不在字符串内
        if (ch === '"') {
            inString = true;
            continue;
        }

        if (ch === openChar) {
            if (depth === 0) start = i;
            depth++;
        } else if (ch === closeChar) {
            depth--;
            if (depth === 0 && start !== -1) {
                return text.substring(start, i + 1);
            }
        }
    }
    return null;
}

/**
 * 从文本中提取并解析 JSON 数组
 */
function parseJSONArray(text) {
    const cleaned = cleanMarkdown(text);

    // 方式1: 直接解析
    try { const r = JSON.parse(cleaned); if (Array.isArray(r)) return r; } catch {}

    // 方式2: 找第一个完整 JSON 数组
    const arrStr = findJSONBlock(cleaned, '[', ']');
    if (arrStr) { try { const r = JSON.parse(arrStr); if (Array.isArray(r)) return r; } catch {} }

    // 方式3: 找第一个完整 JSON 对象（可能 AI 返回了包装对象）
    const objStr = findJSONBlock(cleaned, '{', '}');
    if (objStr) {
        try {
            const r = JSON.parse(objStr);
            if (r.questions && Array.isArray(r.questions)) return r.questions;
            if (Array.isArray(r)) return r;
        } catch {}
    }

    return null;
}

/**
 * 从文本中提取并解析 JSON 对象
 */
function parseJSONObject(text) {
    const cleaned = cleanMarkdown(text);

    // 方式1: 直接解析（整个文本就是纯 JSON）
    try { return JSON.parse(cleaned); } catch {}

    // 方式2: 找第一个完整 JSON 对象（跳过字符串内的括号）
    const objStr = findJSONBlock(cleaned, '{', '}');
    if (objStr) { try { return JSON.parse(objStr); } catch {} }

    return null;
}

// ============================================================
//  业务函数
// ============================================================

/**
 * 调用MiMo API生成翻译题目
 * @param {Array} vocab - 当前课词汇列表
 * @param {number} count - 生成题目数量
 * @param {string} direction - 'zh-es' | 'es-zh' | 'both'
 * @param {Object} previousKnowledge - { vocab: [], grammar: [] }
 */
export async function generateTranslationQuestions(vocab, count = 10, direction = 'both', previousKnowledge = null) {
    const vocabList = vocab.map(v => `${v.spanish} = ${v.chinese}`).join(', ');
    const theme = getRandomTheme();
    const randomNames = getRandomNames(4);
    const prevKnowledgeText = formatPreviousKnowledge(previousKnowledge);

    const directionText = direction === 'zh-es' ? '中文翻译成西班牙语' :
        direction === 'es-zh' ? '西班牙语翻译成中文' :
            '中译西和西译中各一半';

    const prompt = `你是一位西班牙语教师。基于以下词汇表，生成${count}道翻译练习题（${directionText}）：

当前课词汇表（重点考察）：${vocabList}
${prevKnowledgeText}
场景主题：${theme}

**学生当前水平**：已学词汇和语法如上所列。请根据此水平生成难度匹配的题目，确保题目符合学生当前的知识储备。

要求：
1. **词汇限制**：主要使用"当前课词汇表"中的单词。可以少量使用"已学词汇"，但绝对不要使用任何超纲词（即未列出的词汇）。
2. **句子长度与复杂度**：句子长度适中，结构符合学生当前水平（例如，已学语法点包括现在时、简单句、肯定/否定句等）。避免使用未学过的时态、虚拟式、复合句等。
3. **主题相关**：句子内容与场景主题相关，贴近日常生活。
4. **多样性**：每次生成都要有所不同，不要重复旧题。
5. **人名使用**：可以使用这些人名：${randomNames} (请随机使用)。

请以JSON数组格式输出，每个题目包含：
- q: 问题（中文或西班牙语）
- a: 答案（西班牙语或中文）
- type: "zh-es" 或 "es-zh"

只返回JSON数组，不要其他文字。`;

    const content = await callMiMoAPI([
        {
            role: 'system',
            content: '你是MiMo，是小米公司研发的AI智能助手。你的知识截止日期是2024年12月。你是一位专业的西班牙语教师。你的任务是为初学者设计翻译题。最重要的规则是：**绝对不要使用超纲词汇**。'
        },
        { role: 'user', content: prompt }
    ], { label: '翻译题生成' });

    const questions = parseJSONArray(content);
    if (!questions) {
        throw new Error('无法解析AI返回的JSON格式，收到: ' + content.substring(0, 200));
    }
    return questions.filter(q => q.q && q.a && q.type);
}

/**
 * 测试API连接
 */
export async function testMiMoAPI() {
    try {
        const apiKey = getApiKey();
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'mimo-v2.5',
                messages: [{ role: 'user', content: 'Hello' }],
                max_tokens: 10
            })
        });
        return response.ok;
    } catch {
        return false;
    }
}

/**
 * 使用AI判断翻译的准确性和评分
 */
export async function gradeTranslationWithAI(userAnswer, correctAnswer, originalQuestion, type) {
    const direction = type === 'zh-es' ? '中文翻译成西班牙语' : '西班牙语翻译成中文';

    const prompt = `你是一位鼓励型西班牙语教师，注重沟通效果而非语法完美。请评判学生的翻译。

题目：${originalQuestion}
方向：${direction}
正确答案：${correctAnswer}
学生答案：${userAnswer}

请根据以下宽松标准给出0-100的分数：
- 100分：意思完全一致，语法正确。
- 80-95分：意思正确，能清晰传达信息，即使有语法错误（如词序、冠词、拼写）或表达不够地道，但沟通无障碍。
- 60-79分：意思基本正确，但有明显语法错误或词汇使用不当，仍能理解。
- 40-59分：意思部分正确，但存在误解或严重语法错误。
- 0-39分：意思错误或无关。

请以JSON格式返回：
{
"score": 分数(0-100),
"feedback": "简短评价（中文）"
}

只返回JSON，不要其他文字。`;

    const content = await callMiMoAPI([
        {
            role: 'system',
            content: '你是MiMo，是小米公司研发的AI智能助手。你是一位鼓励型西班牙语教师。'
        },
        { role: 'user', content: prompt }
    ], { temperature: 0.3, maxTokens: 200, timeout: 30000, retries: 1, label: 'AI评分' });

    const result = parseJSONObject(content);
    if (!result) {
        throw new Error('无法解析AI返回的评分');
    }
    return Array.isArray(result) ? result[0] : result;
}

/**
 * 生成语法选择题
 */
export async function generateGrammarQuiz(grammarTopic, vocab, count = 10, previousKnowledge = null) {
    const vocabList = vocab.map(v => `${v.spanish} = ${v.chinese}`).join(', ');
    const theme = getRandomTheme();
    const randomNames = getRandomNames(4);
    const prevKnowledgeText = formatPreviousKnowledge(previousKnowledge);

    const prompt = `你是西班牙语教师。基于以下语法知识点，生成${count}道选择题：

当前语法主题：${grammarTopic.title}
当前语法内容：${grammarTopic.content}
当前课词汇表：${vocabList}
${prevKnowledgeText}
场景主题：${theme}

要求：
1. 题目要考查该语法点的理解和应用。
2. **词汇限制**：主要使用当前课词汇，可适当结合已学词汇。不要超纲！
3. 每题4个选项，只有1个正确答案。
4. **必须提供解析**：解释为什么选这个答案，以及为什么其他选项是错的。
5. 每次生成都要有所不同。
6. **可以使用这些人名**：${randomNames} (请随机使用)

请以JSON数组格式输出：
[
  {
    "question": "题目（中文问题，或者填空题的西班牙语句子）",
    "options": ["选项1", "选项2", "选项3", "选项4"],
    "answer": 正确选项索引(0-3),
    "explanation": "解析（中文，解释正确答案和错误原因）"
  }
]

只返回JSON数组，不要其他文字。`;

    const content = await callMiMoAPI([
        { role: 'system', content: '你是MiMo，是小米公司研发的AI智能助手。你的知识截止日期是2024年12月。你是专业的西班牙语教师。设计题目时，请务必严格遵守词汇限制，不要使用学生没学过的词。' },
        { role: 'user', content: prompt }
    ], { label: '语法题生成' });

    console.log('[语法题] 原始内容:', content);

    const result = parseJSONArray(content);
    if (!result) {
        throw new Error('无法解析AI返回的JSON，收到: ' + content.substring(0, 200));
    }
    return result;
}

/**
 * 生成阅读理解
 */
export async function generateReadingComprehension(vocab, grammarTopic, previousKnowledge = null) {
    const vocabList = vocab.map(v => `${v.spanish} = ${v.chinese}`).join(', ');
    const theme = getRandomTheme();
    const randomNames = getRandomNames(4);
    const prevKnowledgeText = formatPreviousKnowledge(previousKnowledge);

    const prompt = `你是西班牙语教师。创作一篇短文和3-4道理解题：

当前课词汇表：${vocabList}
当前语法点：${grammarTopic}
${prevKnowledgeText}
场景主题：${theme}

**学生当前水平**：已学词汇和语法如上所列。请根据此水平创作难度匹配的阅读材料，确保短文和题目符合学生当前的知识储备。

要求：
1. **短文长度**：80-120词（根据学生水平调整，避免过长）。
2. **词汇限制**：主要使用当前课词汇，可适当结合已学词汇。绝对不要使用任何超纲词（即未列出的词汇）。
3. **语法复杂度**：句子结构简单，使用已学语法点（如现在时、简单句）。避免使用未学过的时态、虚拟式、复合句等。
4. **内容趣味性**：内容有趣，贴近日常生活，结合指定的场景主题。
5. **包含语法点**：短文中自然地包含本课语法点。
6. **题目设计**：4-5道选择题，题目和选项都用西班牙语。题目应直接基于短文内容，避免需要推理或背景知识。
7. **解析**：为每道题提供解析，引用文中句子解释答案。
8. **人名使用**：可以使用这些人名：${randomNames} (请随机使用)。

请以JSON格式输出：
{
  "text": "阅读短文（西班牙语）",
  "questions": [
    {
      "question": "问题（西班牙语）",
      "options": ["选项1", "选项2", "选项3", "选项4"],
      "answer": 正确索引(0-3),
      "explanation": "解析（中文，引用文中句子解释）"
    }
  ]
}

只返回JSON，不要其他文字。`;

    const content = await callMiMoAPI([
        { role: 'system', content: '你是MiMo，是小米公司研发的AI智能助手。你的知识截止日期是2024年12月。你是专业的西班牙语教师。创作阅读材料时，请务必严格遵守词汇限制，确保初学者能读懂。' },
        { role: 'user', content: prompt }
    ], { label: '阅读理解生成' });

    const result = parseJSONObject(content);
    if (!result) {
        throw new Error('无法解析AI返回的JSON，收到: ' + content.substring(0, 200));
    }
    return result;
}

/**
 * 生成语法讲解
 * @param {Object} grammarTopic - {title, content}
 * @param {Object} previousKnowledge - { vocab: [], grammar: [] }
 * @param {Array} vocab - 当前课词汇列表
 */
export async function generateGrammarExplanation(grammarTopic, previousKnowledge = null, vocab = []) {
    const prevKnowledgeText = formatPreviousKnowledge(previousKnowledge);
    const vocabList = vocab.length > 0 ? vocab.map(v => `${v.spanish} = ${v.chinese}`).join(', ') : '';

    const prompt = `你是西班牙语教师。请为学生深入讲解以下语法点：

语法标题：${grammarTopic.title}
简要内容：${grammarTopic.content}
${prevKnowledgeText}
${vocabList ? `\n当前课词汇表：${vocabList}` : ''}

要求：
1. **深入浅出**：用中文讲解，通俗易懂，适合初学者。
2. **举例说明**：多举例子，例句尽量使用学生已学过的词汇（参考已学词汇表）。特别鼓励使用当前课词汇表中的单词来构造例句，以帮助学生巩固新词。
3. **对比分析**：如果有容易混淆的知识点（如ser和estar），请进行简单对比。
4. **结构清晰**：使用Markdown格式，分点讲解。
5. **互动性**：语气亲切，鼓励学生。
6. **紧扣课程**：讲解内容应围绕本课语法点展开，避免偏离主题。

请直接返回Markdown格式的讲解内容，不需要JSON。`;

    return await callMiMoAPI([
        { role: 'system', content: '你是MiMo，是小米公司研发的AI智能助手。你的知识截止日期是2024年12月。你是专业的西班牙语教师，擅长把复杂的语法讲得简单易懂。' },
        { role: 'user', content: prompt }
    ], { temperature: 0.7, maxTokens: 2000, label: '语法讲解' });
}

export async function generateSmartContent(lesson) {
    const prompt = `
    作为一位专业的西班牙语老师，请根据以下课程内容进行备课。

    课程标题: ${lesson.title}
    课程副标题: ${lesson.subtitle}
    词汇表: ${JSON.stringify(lesson.vocab.map(v => v.spanish + ' (' + v.chinese + ')').join(', '))}

    请生成一个JSON对象，包含以下三个部分：
    1. "lexicalAnalysis": 数组，包含3-5个本课重点词汇或短语的深度讲解。每个对象包含：
       - "title": 词汇/短语
       - "content": 详细讲解（用法、搭配、例句、注意事项）。支持Markdown格式。
       - "relatedVocab": 数组，相关的扩展词汇（例如如果是讲星期，列出所有星期单词）。

    2. "smartQuiz": 数组，包含5道基于上述词汇讲解的选择题。每个对象包含：
       - "question": 问题
       - "options": 选项数组
       - "answer": 正确答案索引(0-3)
       - "explanation": 解析

    3. "irregularVerbs": 数组，找出本课词汇表中出现的所有不规则动词（如果有）。每个对象包含：
       - "infinitive": 原形
       - "meaning": 中文意思
       - "conjugation": 对象，包含yo, tú, él, nosotros, vosotros, ellos的变位。

    请确保输出是合法的JSON格式，不要包含Markdown代码块标记。
    `;

    const content = await callMiMoAPI([
        { role: "system", content: "你是MiMo，是小米公司研发的AI智能助手。你的知识截止日期是2024年12月。你是一位经验丰富的西班牙语老师，擅长深入浅出地讲解词汇和语法。请只返回JSON数据。" },
        { role: "user", content: prompt }
    ], { timeout: 90000, label: '智能备课' });

    return parseJSONObject(content);
}

/**
 * 生成听力练习内容
 * 生成一段对话，包含说话者信息（男/女），以及一道四选一选择题
 * @param {Array} vocab - 当前课词汇列表
 * @param {Object} grammarTopic - {title, content}
 * @param {Object} previousKnowledge - { vocab: [], grammar: [] }
 * @param {string} lessonTitle - 课文标题（如 "¿QUIÉN ERES?"）
 */
export async function generateListeningExercise(vocab, grammarTopic, previousKnowledge = null, lessonTitle = '') {
    const vocabList = vocab.map(v => `${v.spanish} = ${v.chinese}`).join(', ');
    const theme = getRandomTheme();
    const randomNames = getRandomNames(4);
    const prevKnowledgeText = formatPreviousKnowledge(previousKnowledge);

    const grammarInfo = grammarTopic ? `当前语法点：${grammarTopic.title}` : '';
    const lessonInfo = lessonTitle ? `课文标题：${lessonTitle}` : '';

    const prompt = `你是一位西班牙语教师，正在为使用《速成西班牙语》(Español Sin Fronteras)教材的学生设计听力练习。

请根据以下课文内容，生成一段贴近课文风格的西班牙语对话，并配套一道听力理解选择题。

${lessonInfo}
当前课词汇表：${vocabList}
${grammarInfo}
${prevKnowledgeText}
场景主题：${theme}
可用人名：${randomNames}

**词汇使用规则（关键）**：
1. **核心信息必须使用已学词汇**：对话中传达的关键信息（人物身份、动作、地点、时间、数量、情感等）必须使用当前课词汇表和已学词汇。
2. **允许少量超纲词**：为了使对话自然流畅，可以使用2-3个简单的超纲词（如日常连接词 hola, bueno, pues, vale 等），但这些超纲词不能承载关键信息。
3. **题目和选项严格限词**：听力理解题的问题和四个选项必须100%使用已学词汇，不得出现任何超纲词。
4. **课文风格**：对话应模仿课文的情景对话风格——简短、实用、围绕一个明确场景展开。

**说话者设定**：
- 两个说话者，一男一女。
- 男性使用阳性形式（soy estudiante, estoy contento, soy médico）。
- 女性使用阴性形式（soy estudiante, estoy contenta, soy médica）。
- 确保形容词、名词的阴阳性与说话者性别一致。

**其他要求**：
1. 对话4-6个轮次，总词数50-80词。
2. 语法使用已学语法点（现在时、简单句等），避免未学过的时态。
3. 对话自然真实，贴近日常生活。
4. 适合用稍慢语速朗读（DELE A1/A2考试语速）。

请以JSON格式输出：
{
  "title": "对话标题（西班牙语）",
  "speakers": [
    { "name": "说话者名字", "gender": "male 或 female" },
    { "name": "说话者名字", "gender": "male 或 female" }
  ],
  "dialogue": [
    { "speaker": 0, "text": "说话内容（西班牙语）" },
    { "speaker": 1, "text": "说话内容（西班牙语）" }
  ],
  "question": {
    "question": "听力理解问题（西班牙语，必须使用已学词汇）",
    "options": ["选项A", "选项B", "选项C", "选项D"],
    "answer": 正确选项索引(0-3),
    "explanation": "解析（中文）"
  }
}

只返回JSON，不要其他文字。`;

    const messages = [
        {
            role: 'system',
            content: '你是MiMo，是小米公司研发的AI智能助手。你的知识截止日期是2024年12月。你是专业的西班牙语教师，擅长设计DELE考试备考材料。对话核心信息和题目选项必须使用学生已学过的词汇，可以少量使用简单超纲词使对话自然。只返回JSON数据，不要包含任何解释文字、代码块标记或前缀说明。'
        },
        { role: 'user', content: prompt }
    ];

    // 最多尝试3次：API空内容重试 + JSON解析失败重试
    let lastError = null;
    for (let i = 0; i < 3; i++) {
        if (i > 0) {
            console.log(`[听力练习] JSON解析失败，第${i + 1}次重试...`);
        }

        const content = await callMiMoAPI(messages, { label: '听力练习生成', retries: 1 });

        // 详细日志：方便调试
        console.log(`[听力练习] API返回内容 (attempt ${i + 1}):`, content);

        const result = parseJSONObject(content);
        if (result) {
            console.log(`[听力练习] JSON解析成功 (attempt ${i + 1})`);
            return result;
        }

        // JSON 解析失败，记录完整内容方便排查
        console.error(`[听力练习] JSON解析失败 (attempt ${i + 1}/3)`);
        console.error(`[听力练习] 原始内容:`, content);
        console.error(`[听力练习] 内容长度:`, content.length);
        console.error(`[听力练习] 前100字符charCode:`, [...content.substring(0, 100)].map(c => c.charCodeAt(0)));
        lastError = '无法解析AI返回的JSON格式，收到: ' + content.substring(0, 150);
    }

    throw new Error(lastError || '生成听力练习失败，请重试');
}
