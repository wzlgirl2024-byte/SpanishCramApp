import { useState, useEffect } from 'react';
import { BookOpen, Check, X, Loader2, ArrowRight, RefreshCw, HelpCircle, CheckCircle2, AlertCircle } from 'lucide-react';
import { generateReadingComprehension } from '../utils/deepseekAPI';

export default function ReadingComp({ data, vocab, grammarTitle, lessonId }) {
    const [content, setContent] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);
    const [score, setScore] = useState(0);
    const [error, setError] = useState(null);

    // Initial load
    useEffect(() => {
        if (data) {
            setContent(data);
        }
    }, [data]);

    const handleOptionSelect = (index) => {
        if (showResult) return;

        setSelectedOption(index);
        const currentQuestion = content.questions[currentIndex];
        const correct = index === currentQuestion.answer;
        setIsCorrect(correct);
        setShowResult(true);

        // Auto show explanation if wrong
        if (!correct) {
            setShowExplanation(true);
        } else {
            setShowExplanation(false);
        }

        if (correct) {
            setScore(s => s + 1);
        }
    };

    const handleNext = () => {
        setSelectedOption(null);
        setShowResult(false);
        setShowExplanation(false);
        setIsCorrect(false);

        if (currentIndex < content.questions.length - 1) {
            setCurrentIndex(c => c + 1);
        } else {
            // Finished
        }
    };

    const generateNewContent = async () => {
        setLoading(true);
        setError(null);
        try {
            const newContent = await generateReadingComprehension(vocab, grammarTitle);
            setContent(newContent);
            setCurrentIndex(0);
            setScore(0);
            setSelectedOption(null);
            setShowResult(false);
            setShowExplanation(false);
        } catch (err) {
            setError('生成阅读失败，请检查API Key设置或网络连接');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!content) {
        return <div className="p-8 text-center text-slate-500">暂无阅读内容</div>;
    }

    // Completion screen
    if (currentIndex >= content.questions.length - 1 && showResult) {
        return (
            <div className="max-w-4xl mx-auto mt-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">阅读练习完成！</h2>
                <p className="text-slate-500 mb-6">
                    得分: {score} / {content.questions.length}
                </p>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => {
                            setCurrentIndex(0);
                            setScore(0);
                            setSelectedOption(null);
                            setShowResult(false);
                            setShowExplanation(false);
                        }}
                        className="px-6 py-2 border border-slate-300 rounded-lg font-bold text-slate-600 hover:bg-slate-50"
                    >
                        重做本文
                    </button>
                    <button
                        onClick={generateNewContent}
                        disabled={loading}
                        className="px-6 py-2 bg-spanish-red text-white rounded-lg font-bold hover:bg-red-700 flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <RefreshCw size={18} />}
                        AI生成新文
                    </button>
                </div>
                {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
            </div>
        );
    }

    const currentQuestion = content.questions[currentIndex];

    return (
        <div className="max-w-4xl mx-auto mt-8 h-[calc(100vh-200px)] flex gap-6">
            {/* Article Section */}
            <div className="flex-1 bg-white p-8 rounded-2xl shadow-lg border border-slate-100 overflow-y-auto">
                <h3 className="text-lg font-bold text-slate-400 mb-4 uppercase tracking-wider">Lectura</h3>
                <div className="prose prose-lg text-slate-800 leading-loose">
                    {content.text.split('\n').map((para, i) => (
                        <p key={i} className="mb-4">{para}</p>
                    ))}
                </div>
            </div>

            {/* Question Section */}
            <div className="flex-1 flex flex-col">
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 flex-1 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800">问题 {currentIndex + 1}</h3>
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                            {currentIndex + 1} / {content.questions.length}
                        </span>
                    </div>

                    <h4 className="text-lg font-bold text-slate-800 mb-6">
                        {currentQuestion.question}
                    </h4>

                    <div className="space-y-3">
                        {currentQuestion.options.map((opt, idx) => {
                            let stateClass = "border-slate-200 hover:border-spanish-yellow hover:bg-yellow-50";
                            if (showResult) {
                                if (idx === currentQuestion.answer) {
                                    stateClass = "bg-green-50 border-green-500 text-green-700";
                                } else if (idx === selectedOption) {
                                    stateClass = "bg-red-50 border-red-500 text-red-700";
                                } else {
                                    stateClass = "opacity-50 border-slate-100";
                                }
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionSelect(idx)}
                                    disabled={showResult}
                                    className={`w-full p-4 text-left rounded-xl border-2 transition-all font-medium flex justify-between items-center ${stateClass}`}
                                >
                                    <span>{opt}</span>
                                    {showResult && idx === currentQuestion.answer && <Check size={20} className="text-green-600" />}
                                    {showResult && idx === selectedOption && idx !== currentQuestion.answer && <X size={20} className="text-red-600" />}
                                </button>
                            );
                        })}
                    </div>

                    {/* Explanation Section */}
                    {showResult && (
                        <div className="mt-6 animate-in fade-in slide-in-from-top-4 duration-300">
                            {isCorrect && !showExplanation ? (
                                <button
                                    onClick={() => setShowExplanation(true)}
                                    className="text-sm text-spanish-red font-bold hover:underline flex items-center gap-1"
                                >
                                    <HelpCircle size={16} /> 查看解析
                                </button>
                            ) : (
                                <div className={`p-4 rounded-lg border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                    <div className="flex items-start gap-3">
                                        <div className={`mt-0.5 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                            {isCorrect ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                                        </div>
                                        <div>
                                            <h4 className={`font-bold mb-1 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                                                {isCorrect ? '回答正确！' : '回答错误'}
                                            </h4>
                                            <p className="text-slate-700 text-sm leading-relaxed">
                                                {currentQuestion.explanation || "暂无解析"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {showResult && (
                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleNext}
                            className="px-8 py-3 bg-spanish-red text-white rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 hover:scale-105 transition-all flex items-center gap-2"
                        >
                            下一题 <ArrowRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
