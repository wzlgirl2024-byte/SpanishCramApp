import { useState } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';

export default function WordEntry({ vocabList, onAdd, onDelete }) {
    const [spanish, setSpanish] = useState('');
    const [chinese, setChinese] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!spanish.trim() || !chinese.trim()) return;

        onAdd(spanish, chinese);
        setSpanish('');
        setChinese('');
    };

    return (
        <div className="flex flex-col h-full">
            {/* Input Form */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-4">
                <h3 className="text-lg font-bold text-spanish-red mb-3 flex items-center gap-2">
                    <Plus size={20} />
                    快速录入
                </h3>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <input
                            type="text"
                            placeholder="Spanish (e.g. Hola)"
                            value={spanish}
                            onChange={(e) => setSpanish(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-spanish-yellow focus:border-transparent outline-none"
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="中文 (例如: 你好)"
                            value={chinese}
                            onChange={(e) => setChinese(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-spanish-yellow focus:border-transparent outline-none"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-spanish-red text-white py-2 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <Save size={18} />
                        保存单词
                    </button>
                </form>
            </div>

            {/* Recent List */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="p-3 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-semibold text-slate-700">已录入 ({vocabList.length})</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {vocabList.length === 0 ? (
                        <div className="text-center text-slate-400 py-8 text-sm">
                            还没有单词<br />看书的时候顺手记下来吧
                        </div>
                    ) : (
                        vocabList.map((word) => (
                            <div key={word.id} className="group flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-100">
                                <div>
                                    <div className="font-bold text-slate-800">{word.spanish}</div>
                                    <div className="text-sm text-slate-500">{word.chinese}</div>
                                </div>
                                <button
                                    onClick={() => onDelete(word.id)}
                                    className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
