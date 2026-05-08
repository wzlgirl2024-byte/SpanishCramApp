import { useState, useEffect, useRef } from 'react';
import { Book, X, Save, Trash2, ChevronLeft, ChevronRight, PenLine } from 'lucide-react';

export default function StudyNotes({ apiKey }) {
    const [isOpen, setIsOpen] = useState(false);
    const [notes, setNotes] = useState('');
    const [lastSaved, setLastSaved] = useState(null);
    const textareaRef = useRef(null);

    // Load notes from local storage on mount
    useEffect(() => {
        const savedNotes = localStorage.getItem('study_notes');
        if (savedNotes) {
            setNotes(savedNotes);
        }
    }, []);

    // Clear notes if API key changes (user switch)
    useEffect(() => {
        const lastKey = localStorage.getItem('study_notes_owner');
        if (lastKey && lastKey !== apiKey) {
            setNotes('');
            localStorage.removeItem('study_notes');
        }
        if (apiKey) {
            localStorage.setItem('study_notes_owner', apiKey);
        }
    }, [apiKey]);

    // Auto-save logic
    useEffect(() => {
        const timer = setTimeout(() => {
            localStorage.setItem('study_notes', notes);
            setLastSaved(new Date());
        }, 1000);

        return () => clearTimeout(timer);
    }, [notes]);

    const handleClear = () => {
        if (window.confirm('确定要清空所有笔记吗？此操作无法撤销。')) {
            setNotes('');
            localStorage.removeItem('study_notes');
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed right-0 top-1/2 -translate-y-1/2 z-50 bg-white border border-slate-200 shadow-lg p-2 rounded-l-xl transition-all hover:bg-slate-50 text-slate-600 flex flex-col items-center gap-1 ${isOpen ? 'translate-x-[320px]' : 'translate-x-0'}`}
                style={{ transition: 'transform 0.3s ease-in-out' }}
                title="学习笔记"
            >
                {isOpen ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                <span className="text-xs font-bold writing-vertical-rl py-2 tracking-widest">
                    学习笔记
                </span>
                <PenLine size={16} />
            </button>

            {/* Sidebar Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-40 transform transition-transform duration-300 ease-in-out border-l border-slate-200 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-2 text-slate-800 font-bold">
                        <Book size={20} className="text-spanish-red" />
                        错题本 / 笔记
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 flex flex-col bg-[#fffdf0]">
                    <textarea
                        ref={textareaRef}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="在这里记录你的错题、生词或语法心得..."
                        className="flex-1 w-full bg-transparent resize-none outline-none text-slate-700 leading-relaxed font-medium placeholder:text-slate-300"
                        style={{
                            backgroundImage: 'linear-gradient(transparent 95%, #e2e8f0 95%)',
                            backgroundSize: '100% 2rem',
                            lineHeight: '2rem'
                        }}
                    />
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-slate-100 bg-white flex justify-between items-center text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                        {lastSaved && (
                            <>
                                <Save size={12} />
                                已保存 {lastSaved.toLocaleTimeString()}
                            </>
                        )}
                    </div>
                    <button
                        onClick={handleClear}
                        className="flex items-center gap-1 text-red-400 hover:text-red-600 transition-colors px-2 py-1 rounded hover:bg-red-50"
                    >
                        <Trash2 size={14} />
                        清空
                    </button>
                </div>
            </div>
        </>
    );
}
