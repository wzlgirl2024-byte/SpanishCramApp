import { useState, useEffect } from 'react';
import { Key, Save, Eye, EyeOff } from 'lucide-react';

export default function ApiKeyManager({ onKeySet }) {
    const [deepseekKey, setDeepseekKey] = useState('');
    const [openaiKey, setOpenaiKey] = useState('');
    const [showDeepseek, setShowDeepseek] = useState(false);
    const [showOpenai, setShowOpenai] = useState(false);
    const [deepseekSaved, setDeepseekSaved] = useState(false);
    const [openaiSaved, setOpenaiSaved] = useState(false);

    useEffect(() => {
        const dsKey = localStorage.getItem('deepseek_api_key');
        const oaiKey = localStorage.getItem('openai_api_key');
        if (dsKey) {
            setDeepseekKey(dsKey);
            setDeepseekSaved(true);
        }
        if (oaiKey) {
            setOpenaiKey(oaiKey);
            setOpenaiSaved(true);
        }
        if (dsKey && onKeySet) onKeySet(dsKey);
    }, []);

    const handleSaveDeepseek = () => {
        if (!deepseekKey.trim()) { alert('请输入 DeepSeek API Key'); return; }
        if (!deepseekKey.startsWith('sk-')) { alert('DeepSeek API Key 格式不正确，应以 "sk-" 开头'); return; }
        localStorage.setItem('deepseek_api_key', deepseekKey);
        if (onKeySet) onKeySet(deepseekKey);
        setDeepseekSaved(true);
        alert('DeepSeek API Key 已保存！');
    };

    const handleSaveOpenai = () => {
        if (!openaiKey.trim()) { alert('请输入 OpenAI API Key'); return; }
        if (!openaiKey.startsWith('sk-')) { alert('OpenAI API Key 格式不正确，应以 "sk-" 开头'); return; }
        localStorage.setItem('openai_api_key', openaiKey);
        setOpenaiSaved(true);
        alert('OpenAI API Key 已保存！现在可以使用语音识别功能');
    };

    const handleClear = (type) => {
        if (type === 'deepseek') {
            if (!confirm('确定要清除 DeepSeek API Key 吗？')) return;
            localStorage.removeItem('deepseek_api_key');
            setDeepseekKey('');
            setDeepseekSaved(false);
            if (onKeySet) onKeySet(null);
        } else {
            if (!confirm('确定要清除 OpenAI API Key 吗？清除后将无法使用语音识别。')) return;
            localStorage.removeItem('openai_api_key');
            setOpenaiKey('');
            setOpenaiSaved(false);
        }
    };

    const InputField = ({ label, value, onChange, show, setShow, saved, placeholder }) => (
        <div className="relative">
            <input
                type={show ? 'text' : 'password'}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-3 pr-12 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none font-mono text-sm"
            />
            <button
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    );

    return (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 space-y-6">
            {/* DeepSeek API Key */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Key size={20} className="text-purple-600" />
                    <h3 className="font-bold text-purple-900">DeepSeek API Key</h3>
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">AI 生成内容</span>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                    用于 AI 生成练习题、翻译、阅读理解等功能。获取地址：
                    <a href="https://platform.deepseek.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline ml-1">platform.deepseek.com</a>
                </p>
                <div className="space-y-3">
                    <InputField
                        value={deepseekKey}
                        onChange={setDeepseekKey}
                        show={showDeepseek}
                        setShow={setShowDeepseek}
                        saved={deepseekSaved}
                        placeholder="sk-xxxxxxxxxxxxxxxx"
                    />
                    <div className="flex gap-2">
                        <button onClick={handleSaveDeepseek} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium">
                            <Save size={18} /> 保存
                        </button>
                        {deepseekSaved && (
                            <button onClick={() => handleClear('deepseek')} className="px-4 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all">
                                清除
                            </button>
                        )}
                    </div>
                    {deepseekSaved && (
                        <p className="text-sm text-green-700 bg-green-50 p-2 rounded flex items-center gap-2">
                            <span className="text-green-600">&#10003;</span> DeepSeek API Key 已保存
                        </p>
                    )}
                </div>
            </div>

            <hr className="border-purple-200" />

            {/* OpenAI API Key */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <Key size={20} className="text-green-600" />
                    <h3 className="font-bold text-green-900">OpenAI API Key</h3>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">语音识别</span>
                </div>
                <p className="text-sm text-slate-600 mb-3">
                    用于口语练习的语音识别功能（Whisper 模型）。获取地址：
                    <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline ml-1">platform.openai.com</a>
                </p>
                <div className="space-y-3">
                    <InputField
                        value={openaiKey}
                        onChange={setOpenaiKey}
                        show={showOpenai}
                        setShow={setShowOpenai}
                        saved={openaiSaved}
                        placeholder="sk-xxxxxxxxxxxxxxxx"
                    />
                    <div className="flex gap-2">
                        <button onClick={handleSaveOpenai} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium">
                            <Save size={18} /> 保存
                        </button>
                        {openaiSaved && (
                            <button onClick={() => handleClear('openai')} className="px-4 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all">
                                清除
                            </button>
                        )}
                    </div>
                    {openaiSaved && (
                        <p className="text-sm text-green-700 bg-green-50 p-2 rounded flex items-center gap-2">
                            <span className="text-green-600">&#10003;</span> OpenAI API Key 已保存，语音识别可用
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
