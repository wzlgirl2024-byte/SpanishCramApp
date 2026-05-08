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
 * 调用DeepSeek API生成翻译题目
 * @param {Array} vocab - 词汇列表 [{spanish, chinese}]
 * @param {number} count - 生成题目数量
 * @param {string} direction - 'zh-es' | 'es-zh' | 'both'
 * @returns {Promise<Array>} 生成的题目列表
 */
export async function generateTranslationQuestions(vocab, count = 5, direction = 'both') {
    try {
        const apiKey = getApiKey(); // 获取用户API Key
        const vocabList = vocab.map(v => `${v.spanish} = ${v.chinese}`).join(', ');
        const theme = getRandomTheme();
        const randomNames = getRandomNames(4);

        // 构建提示词
        const directionText = direction === 'zh-es' ? '中文翻译成西班牙语' :
            direction === 'es-zh' ? '西班牙语翻译成中文' :
                '中译西和西译中各一半';

        const prompt = `你是一位西班牙语教师。基于以下词汇表，生成${count}道翻译练习题（${directionText}）：

词汇表：${vocabList}
场景主题：${theme} (请尽量结合此主题，但必须优先保证只使用给定词汇)

要求：
1. **严格限制**：只能使用给定词汇表中的单词和非常基础的语法。不要使用超纲词汇！
2. 句子要简短、自然，适合初学者。
3. 确保语法正确。
4. ${direction === 'both' ? '中译西和西译中题目数量大致相等' : ''}
5. 每次生成都要有所不同，不要重复旧题。
6. **可以使用这些人名**：${randomNames} (请随机使用，不要总是用Ana或Juan)

请以JSON数组格式输出，每个题目包含：
- q: 问题（中文或西班牙语）
- a: 答案（西班牙语或中文）
- type: "zh-es" 或 "es-zh"

只返回JSON数组，不要其他文字。`;

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
                temperature: 0.8, // 稍微提高温度以增加多样性
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        // 提取JSON内容（可能被markdown代码块包裹）
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            throw new Error('无法解析AI返回的JSON格式');
        }

        const questions = JSON.parse(jsonMatch[0]);

        // 验证题目格式
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
 * @param {string} userAnswer - 用户的翻译
 * @param {string} correctAnswer - 正确答案
 * @param {string} originalQuestion - 原始问题
 * @param {string} type - 'zh-es' 或 'es-zh'
 * @returns {Promise<{score: number, feedback: string}>}
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
 * @param {Object} grammarTopic - 语法主题 {title, content}
 * @param {Array} vocab - 词汇列表
 * @param {number} count - 题目数量
 * @returns {Promise<Array>} 生成的选择题
 */
export async function generateGrammarQuiz(grammarTopic, vocab, count = 5) {
    try {
        const apiKey = getApiKey();
        const vocabList = vocab.map(v => `${v.spanish} = ${v.chinese}`).join(', ');
        const theme = getRandomTheme();
        const randomNames = getRandomNames(4);

        const prompt = `你是西班牙语教师。基于以下语法知识点，生成${count}道选择题：

语法主题：${grammarTopic.title}
语法内容：${grammarTopic.content}
词汇表：${vocabList}
场景主题：${theme} (请尽量结合此主题)

要求：
1. 题目要考查该语法点的理解和应用。
2. **严格限制**：只能使用给定词汇表中的单词。不要超纲！
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
                max_tokens: 2000
            })
        });

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
 * @param {Array} vocab - 词汇列表
 * @param {string} grammarTopic - 语法主题
 * @returns {Promise<Object>} 阅读理解{text, questions}
 */
export async function generateReadingComprehension(vocab, grammarTopic) {
    try {
        const apiKey = getApiKey();
        const vocabList = vocab.map(v => `${v.spanish} = ${v.chinese}`).join(', ');
        const theme = getRandomTheme();
        const randomNames = getRandomNames(4);

        const prompt = `你是西班牙语教师。创作一篇短文和3-4道理解题：

词汇表：${vocabList}
语法点：${grammarTopic}
场景主题：${theme}

要求：
1. 短文100-150词。
2. **严格限制**：只能使用给定词汇表中的单词和基础语法。不要超纲！
3. 内容有趣，贴近日常生活，结合指定的场景主题。
4. 包含本课语法点。
5. 3-4道选择题，**题目和选项都用西班牙语**。
6. **必须提供解析**：解释答案在文中的依据。
7. **可以使用这些人名**：${randomNames} (请随机使用)

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
                max_tokens: 2000
            })
        });

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
 * 生成词汇选择题（用于单词突击的AI无限题）
 * @param {Array} currentVocab - 当前课词汇列表 [{spanish, chinese}]
 * @param {Array} previousVocab - 之前学过的词汇（用于不超纲）
 * @param {number} count - 生成题目数量
 * @returns {Promise<Array>} 生成的题目列表 [{spanish, chinese, distractors: [chinese1, chinese2, chinese3]}]
 */
export async function generateVocabQuestions(currentVocab, previousVocab = [], count = 10) {
    try {
        const apiKey = getApiKey();
        const currentVocabList = currentVocab.map(v => `${v.spanish} = ${v.chinese}`).join(', ');
        const previousVocabList = previousVocab.length > 0 
            ? previousVocab.map(v => `${v.spanish} = ${v.chinese}`).join(', ')
            : '';
        const theme = getRandomTheme();
        const randomNames = getRandomNames(4);

        const prompt = `你是一位专业的西班牙语教师。基于以下词汇表，生成${count}道词汇选择题：

当前课词汇表（重点考察）：${currentVocabList}
${previousVocabList ? `已学词汇（可少量使用，但不要喧宾夺主）：${previousVocabList}` : ''}
场景主题：${theme}

要求：
1. **核心要求**：主要使用"当前课词汇表"中的单词。
2. **严格限制**：只能使用当前课词汇表和已学词汇中的单词。绝对不要使用超纲词汇！
3. 每道题给出一个西班牙语单词，需要从4个中文选项中选择正确答案。
4. 干扰项（错误选项）应该：
   - 优先从当前课词汇表中选择（但不要选正确答案）
   - 如果当前课词汇不够，可以从已学词汇中选择
   - 确保干扰项与正确答案在难度和类型上相似
5. 每次生成都要有所不同，不要重复旧题。
6. **可以使用这些人名**：${randomNames} (请随机使用)

请以JSON数组格式输出：
[
  {
    "spanish": "西班牙语单词",
    "chinese": "正确的中文翻译",
    "distractors": ["干扰项1", "干扰项2", "干扰项3"]
  }
]

只返回JSON数组，不要其他文字。`;

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
                        content: '你是一位专业的西班牙语教师。设计词汇题时，请务必严格遵守词汇限制，绝对不要使用学生没学过的词。'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.8,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        // 提取JSON内容（可能被markdown代码块包裹）
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            throw new Error('无法解析AI返回的JSON格式');
        }

        const questions = JSON.parse(jsonMatch[0]);

        // 验证题目格式并转换为标准格式
        return questions
            .filter(q => q.spanish && q.chinese && q.distractors && Array.isArray(q.distractors) && q.distractors.length >= 3)
            .map(q => ({
                spanish: q.spanish.trim(),
                chinese: q.chinese.trim(),
                distractors: q.distractors.slice(0, 3).map(d => d.trim())
            }));

    } catch (error) {
        console.error('生成词汇题失败:', error);
        throw error;
    }
}

/**
 * 生成词汇选择题（用于单词突击）
 * @param {Array} vocab - 词汇列表 [{spanish, chinese}]
 * @param {number} count - 生成题目数量
 * @param {Array} previousVocab - 之前学过的词汇（用于不超纲）
 * @returns {Promise<Array>} 生成的题目列表 [{spanish, chinese, distractors: [chinese1, chinese2, chinese3]}]
 */
export async function generateVocabQuestions(vocab, count = 10, previousVocab = []) {
    try {
        const apiKey = getApiKey();
        const vocabList = vocab.map(v => `${v.spanish} = ${v.chinese}`).join(', ');
        const previousVocabList = previousVocab.length > 0 
            ? previousVocab.map(v => `${v.spanish} = ${v.chinese}`).join(', ')
            : '';
        const theme = getRandomTheme();
        const randomNames = getRandomNames(4);

        const prompt = `你是一位西班牙语教师。基于以下词汇表，生成${count}道词汇选择题：

当前课词汇表（重点考察）：${vocabList}
${previousVocabList ? `已学词汇（可少量使用，但不要喧宾夺主）：${previousVocabList}` : ''}
场景主题：${theme}

要求：
1. **核心要求**：主要使用"当前课词汇表"中的单词。
2. **严格限制**：只能使用当前课词汇表和已学词汇中的单词。绝对不要使用超纲词汇！
3. 每道题给出一个西班牙语单词，需要从4个中文选项中选择正确答案。
4. 干扰项（错误选项）应该：
   - 优先从当前课词汇表中选择（但不要选正确答案）
   - 如果当前课词汇不够，可以从已学词汇中选择
   - 确保干扰项与正确答案在难度和类型上相似
5. 每次生成都要有所不同，不要重复旧题。
6. **可以使用这些人名**：${randomNames} (请随机使用)

请以JSON数组格式输出：
[
  {
    "spanish": "西班牙语单词",
    "chinese": "正确的中文翻译",
    "distractors": ["干扰项1", "干扰项2", "干扰项3"]
  }
]

只返回JSON数组，不要其他文字。`;

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
                        content: '你是一位专业的西班牙语教师。设计词汇题时，请务必严格遵守词汇限制，绝对不要使用学生没学过的词。'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.8,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        // 提取JSON内容（可能被markdown代码块包裹）
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (!jsonMatch) {
            throw new Error('无法解析AI返回的JSON格式');
        }

        const questions = JSON.parse(jsonMatch[0]);

        // 验证题目格式并转换为标准格式
        return questions
            .filter(q => q.spanish && q.chinese && q.distractors && Array.isArray(q.distractors) && q.distractors.length >= 3)
            .map(q => ({
                spanish: q.spanish.trim(),
                chinese: q.chinese.trim(),
                distractors: q.distractors.slice(0, 3).map(d => d.trim())
            }));

    } catch (error) {
        console.error('生成词汇题失败:', error);
        throw error;
    }
}