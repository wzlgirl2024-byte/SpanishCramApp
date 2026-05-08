import { useState, useEffect } from 'react';
import { CheckCircle2, RotateCcw, HelpCircle, Eraser } from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';

export default function VerbConjugation({ verbs, lessonId }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [showConfirmRestart, setShowConfirmRestart] = useState(false);

    // Reset state when lesson changes
    useEffect(() => {
        setCurrentIndex(0);
        setAnswers({});
        setShowResults(false);
    }, [lessonId]);

    if (!verbs || verbs.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-slate-400">
                本课暂无动词变位练习
            </div>
        );
    }

    const currentVerb = verbs[currentIndex];
    const pronouns = ['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos'];

    // Map for display labels if needed, though standard Spanish pronouns are fine
    const pronounLabels = {
        yo: 'Yo (我)',
        tú: 'Tú (你)',
        él: 'Él/Ella/Usted (他/她/您)',
        nosotros: 'Nosotros (我们)',
        vosotros: 'Vosotros (你们)',
        ellos: 'Ellos/Ellas/Ustedes'
    };

    const handleInput = (pronoun, value) => {
        if (showResults) return;
        setAnswers(prev => ({
            ...prev,
            [pronoun]: value
        }));
    };

    const checkAnswers = () => {
        setShowResults(true);
    };

    const nextVerb = () => {
        if (currentIndex < verbs.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setAnswers({});
            setShowResults(false);
        } else {
            // Finished all verbs
            // Could show a summary screen, but for now just loop or stay
        }
    };

    const prevVerb = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setAnswers({});
            setShowResults(false);
        }
    };

    const handleRestart = () => {
        setAnswers({});
        setShowResults(false);
    };

    const isCorrect = (pronoun) => {
        const userVal = (answers[pronoun] || '').trim().toLowerCase();
        const correctVal = currentVerb.conjugation[pronoun].toLowerCase();
        return userVal === correctVal;
    };

    const allCorrect = pronouns.every(p => isCorrect(p));

    return (
        <div className="max-w-2xl mx-auto mt-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-3xl font-black text-spanish-red mb-2">{currentVerb.infinitive}</h2>
                        <p className="text-slate-500 text-lg">{currentVerb.meaning}</p>
                    </div>
                    <div className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                        {currentIndex + 1} / {verbs.length}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {pronouns.map(pronoun => (
                        <div key={pronoun} className="space-y-2">
                            <label className="block text-sm font-bold text-slate-600">
                                {pronounLabels[pronoun]}
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={answers[pronoun] || ''}
                                    onChange={(e) => handleInput(pronoun, e.target.value)}
                                    disabled={showResults}
                                    className={`w-full p-3 rounded-lg border-2 outline-none transition-all font-medium ${showResults
                                            ? isCorrect(pronoun)
                                                ? 'bg-green-50 border-green-500 text-green-700'
                                                : 'bg-red-50 border-red-500 text-red-700'
                                            : 'border-slate-200 focus:border-spanish-yellow focus:ring-2 focus:ring-yellow-100'
                                        }`}
                                    placeholder="..."
                                />
                                {showResults && (
                                    <div className="absolute right-3 top-3">
                                        {isCorrect(pronoun) ? (
                                            <CheckCircle2 size={20} className="text-green-500" />
                                        ) : (
                                            <span className="text-sm font-bold text-red-500">
                                                {currentVerb.conjugation[pronoun]}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowConfirmRestart(true)}
                            className="p-2 text-slate-400 hover:text-spanish-red hover:bg-red-50 rounded-lg transition-colors"
                            title="重置本题"
                        >
                            <RotateCcw size={20} />
                        </button>
                    </div>

                    <div className="flex gap-3">
                        {currentIndex > 0 && (
                            <button
                                onClick={prevVerb}
                                className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-50 rounded-lg transition-colors"
                            >
                                上一个
                            </button>
                        )}

                        {!showResults ? (
                            <button
                                onClick={checkAnswers}
                                className="px-8 py-2 bg-spanish-red text-white font-bold rounded-lg shadow-lg shadow-red-200 hover:bg-red-700 hover:scale-105 transition-all"
                            >
                                检查答案
                            </button>
                        ) : (
                            <button
                                onClick={currentIndex < verbs.length - 1 ? nextVerb : () => { }}
                                disabled={currentIndex >= verbs.length - 1 && !allCorrect}
                                className={`px-8 py-2 font-bold rounded-lg shadow-lg transition-all ${currentIndex < verbs.length - 1
                                        ? 'bg-spanish-yellow text-yellow-900 shadow-yellow-200 hover:bg-yellow-400 hover:scale-105'
                                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                    }`}
                            >
                                {currentIndex < verbs.length - 1 ? '下一个动词' : '完成'}
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={showConfirmRestart}
                onClose={() => setShowConfirmRestart(false)}
                onConfirm={handleRestart}
                title="重置练习"
                message="确定要清空当前的所有输入吗？"
                confirmText="重置"
            />
        </div>
    );
}
