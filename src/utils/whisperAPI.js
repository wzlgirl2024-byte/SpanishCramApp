// OpenAI Whisper API - 语音转文字
const WHISPER_API_URL = 'https://api.openai.com/v1/audio/transcriptions';

function getOpenAIKey() {
    const key = localStorage.getItem('openai_api_key');
    if (!key) throw new Error('请先在设置中配置 OpenAI API Key');
    return key;
}

/**
 * 将音频 Blob 发送到 OpenAI Whisper API 进行语音转文字
 * @param {Blob} audioBlob - 录音音频 (webm/mp3/wav)
 * @param {string} language - 语言代码，默认 'es' (西班牙语)
 * @returns {Promise<string>} 转写文本
 */
export async function transcribeAudio(audioBlob, language = 'es') {
    const apiKey = getOpenAIKey();

    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.webm');
    formData.append('model', 'whisper-1');
    formData.append('language', language);
    formData.append('response_format', 'text');

    const response = await fetch(WHISPER_API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
        },
        body: formData,
    });

    if (!response.ok) {
        const errText = await response.text();
        if (response.status === 401) {
            throw new Error('OpenAI API Key 无效，请在设置中重新配置');
        }
        throw new Error(`语音转写失败: ${response.status} ${errText}`);
    }

    const text = await response.text();
    return text.trim();
}
