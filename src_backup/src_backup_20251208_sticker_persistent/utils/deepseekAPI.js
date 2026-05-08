// API配置 - 用户需要自己提供API Key
const API_URL = 'https://api.deepseek.com/v1/chat/completions';

// 获取用户保存的API Key
function getApiKey() {
    const key = localStorage.getItem('deepseek_api_key');
    if (!key) {
        throw new Error('请先设置API Key');
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
        // 随机抽取一些旧词汇，避免Prompt过长
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

/**
 * 调用DeepSeek API生成翻译题目
 * @param {Array} vocab - 当前课词汇列表
 * @param {number} count - 生成题目数量
 * @param {string} direction - 'zh-es' | 'es-zh' | 'both'
 * @param {Object} previousKnowledge - { vocab: [], grammar: [] }
 */
export async function generateTranslationQuestions(vocab, count = 10, direction = 'both', previousKnowledge = null) {
    try {
        const apiKey = getApiKey();
        const vocabList = vocab.map(v => `${v.spanish} = ${v.chinese}`).join(', ');
        const theme = getRandomTheme();
        const randomNames = getRandomNames(4);
        const prevKnowledgeText = formatPreviousKnowledge(previousKnowledge);

        // 构建提示词
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

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60秒超时

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: '你是一位专业的西班牙语教师。你的任务是为初学者设计翻译题。最重要的规则是：**绝对不要使用超纲词汇**。'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.8,
                max_tokens: 3000
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            throw new Error('无法解析AI返回的JSON格式');
        }

        const questions = JSON.parse(jsonMatch[0]);
        return questions.filter(q => q.q && q.a && q.type);

    } catch (error) {
        console.error('DeepSeek API调用失败:', error);
        throw error;
    }
}

/**
 * 测试API连接
 */
export async function testDeepSeekAPI() {
    try {
        const apiKey = getApiKey();
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
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
    try {
        const apiKey = getApiKey();
        const direction = type === 'zh-es' ? '中文翻译成西班牙语' : '西班牙语翻译成中文';

        const prompt = `你是一位专业的西班牙语教师。请评判学生的翻译。

题目：${originalQuestion}
方向：${direction}
正确答案：${correctAnswer}
学生答案：${userAnswer}

请评判学生翻译的准确性，给出0-100的分数：
- 100分：完全正确或意思完全一致
- 80-95分：有小错误（如拼写、标点、冠词）但意思正确
- 50-75分：部分正确，主要意思对但有明显语法错误
- 1-45分：意思错误或严重语法错误
- 0分：完全错误或无关

请以JSON格式返回：
{
  "score": 分数(0-100),
  "feedback": "简短评价（中文，一句话，指出具体错误或表扬）"
}

只返回JSON，不要其他文字。`;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: '你是一位严格但公正的西班牙语教师，擅长评判翻译质量。'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 200
            })
        });

        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('无法解析AI返回的评分');
        }

        const result = JSON.parse(jsonMatch[0]);
        return {
            score: Math.min(100, Math.max(0, result.score)),
            feedback: result.feedback || '评分完成'
        };

    } catch (error) {
        console.error('AI评分失败:', error);
        throw error;
    }
}

/**
 * 生成语法选择题
 */
export async function generateGrammarQuiz(grammarTopic, vocab, count = 10, previousKnowledge = null) {
    try {
        const apiKey = getApiKey();
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

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: '你是专业的西班牙语教师。设计题目时，请务必严格遵守词汇限制，不要使用学生没学过的词。' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.8,
                max_tokens: 3000
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        const jsonMatch = content.match(/\[[\s\S]*\]/);

        if (!jsonMatch) {
            throw new Error('无法解析AI返回的JSON');
        }

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('生成语法题失败:', error);
        throw error;
    }
}

/**
 * 生成阅读理解
 */
export async function generateReadingComprehension(vocab, grammarTopic, previousKnowledge = null) {
    try {
        const apiKey = getApiKey();
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

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: '你是专业的西班牙语教师。创作阅读材料时，请务必严格遵守词汇限制，确保初学者能读懂。' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.8,
                max_tokens: 3000
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        const jsonMatch = content.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error('无法解析AI返回的JSON');
        }

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('生成阅读理解失败:', error);
        throw error;
    }
}

/**
 * 生成语法讲解
 * @param {Object} grammarTopic - {title, content}
 * @param {Object} previousKnowledge - { vocab: [], grammar: [] }
 */
export async function generateGrammarExplanation(grammarTopic, previousKnowledge = null) {
    try {
        const apiKey = getApiKey();
        const prevKnowledgeText = formatPreviousKnowledge(previousKnowledge);

        const prompt = `你是西班牙语教师。请为学生深入讲解以下语法点：

语法标题：${grammarTopic.title}
简要内容：${grammarTopic.content}
${prevKnowledgeText}

要求：
1. **深入浅出**：用中文讲解，通俗易懂，适合初学者。
2. **举例说明**：多举例子，例句尽量使用学生已学过的词汇（参考已学词汇表）。
3. **对比分析**：如果有容易混淆的知识点（如ser和estar），请进行简单对比。
4. **结构清晰**：使用Markdown格式，分点讲解。
5. **互动性**：语气亲切，鼓励学生。

请直接返回Markdown格式的讲解内容，不需要JSON。`;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    { role: 'system', content: '你是专业的西班牙语教师，擅长把复杂的语法讲得简单易懂。' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;

    } catch (error) {
        console.error('生成语法讲解失败:', error);
        throw error;
    }
}

export async function generateSmartContent(lesson) {
    const apiKey = getApiKey();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000); // 90 seconds for deep analysis

    try {
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

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: "你是一位经验丰富的西班牙语老师，擅长深入浅出地讲解词汇和语法。请只返回JSON数据。" },
                    { role: "user", content: prompt }
                ],
                stream: false
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }

        const data = await response.json();
        let content = data.choices[0].message.content;

        // Clean up markdown code blocks if present
        content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

        return JSON.parse(content);
    } catch (error) {
        if (error.name === 'AbortError') {
            console.error('Request timed out');
            throw new Error('智能备课超时，请重试');
        }
        console.error('Error generating smart content:', error);
        throw error;
    }
}
