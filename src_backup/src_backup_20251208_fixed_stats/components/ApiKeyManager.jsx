import { useState, useEffect } from 'react';
import { Key, Save, Eye, EyeOff } from 'lucide-react';

export default function ApiKeyManager({ onKeySet }) {
    const [apiKey, setApiKey] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        // 从localStorage加载API key
        const savedKey = localStorage.getItem('deepseek_api_key');
        if (savedKey) {
            setApiKey(savedKey);
            onKeySet(savedKey);
            setSaved(true);
        }
    }, []);

    const handleSave = () => {
        if (!apiKey.trim()) {
            alert('请输入API Key');
            return;
        }

        if (!apiKey.startsWith('sk-')) {
            alert('API Key格式不正确，应以"sk-"开头');
            return;
        }

        localStorage.setItem('deepseek_api_key', apiKey);
        onKeySet(apiKey);
        setSaved(true);
        alert('API Key已保存！');
    };

    const handleClear = () => {
        if (confirm('确定要清除API Key吗？清除后将无法使用AI功能。')) {
            localStorage.removeItem('deepseek_api_key');
            setApiKey('');
            onKeySet(null);
            setSaved(false);
        }
    };

    return (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
            <div className="flex items-center gap-2 mb-4">
                <Key size={20} className="text-purple-600" />
                <h3 className="font-bold text-purple-900">DeepSeek API Key设置</h3>
            </div>

            <div className="bg-white rounded-lg p-4 mb-4">
                <p className="text-sm text-slate-600 mb-3">
                    请输入您的DeepSeek API Key以使用AI功能。您的密钥仅保存在本地浏览器中。
                </p>
                <div className="text-xs text-slate-500 space-y-1">
                    <p>• 获取API Key: <a href="https://platform.deepseek.com" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">platform.deepseek.com</a></p>
                    <p>• 格式: sk-xxxxxxxxxxxxxxxx</p>
                </div>
            </div>

            <div className="space-y-3">
                <div className="relative">
                    <input
                        type={showKey ? 'text' : 'password'}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-xxxxxxxxxxxxxxxx"
                        className="w-full px-4 py-3 pr-12 border-2 border-slate-200 rounded-lg focus:border-purple-500 focus:outline-none font-mono text-sm"
                    />
                    <button
                        onClick={() => setShowKey(!showKey)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                        {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleSave}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all font-medium"
                    >
                        <Save size={18} />
                        保存API Key
                    </button>
                    {saved && (
                        <button
                            onClick={handleClear}
                            className="px-4 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all"
                        >
                            清除
                        </button>
                    )}
                </div>
            </div>

            {saved && (
                <div className="mt-3 text-sm text-green-700 bg-green-50 p-2 rounded flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    API Key已保存，您现在可以使用AI功能
                </div>
            )}
        </div>
    );
}
