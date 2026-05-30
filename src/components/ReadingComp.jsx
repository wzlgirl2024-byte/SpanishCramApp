import { useState, useEffect } from 'react';
import { BookOpen, Check, X, Loader2, ArrowRight, RefreshCw, HelpCircle, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight, Trophy, RotateCcw } from 'lucide-react';
import { generateReadingComprehension } from '../utils/mimoAPI';

export default function ReadingComp({ data, vocab, grammarTitle, lessonId, previousKnowledge }) {
    const [content, setContent] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({}); // { index: optionIndex }
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Initial load
    useEffect(() => {
        if (data) {
            setContent(data);
        }
    }, [data]);

    const handleOptionSelect = (optionIndex) => {
        if (isSubmitted) return;
        setUserAnswers(prev => ({
            ...prev,
            [currentIndex]: optionIndex
        }));
    };

    const handleNext = () => {
        if (currentIndex < content.questions.length - 1) {
            setCurrentIndex(c => c + 1);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(c => c - 1);
        }
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
        setCurrentIndex(0);
    };

    const generateNewContent = async () => {
        setLoading(true);
        setError(null);
        try {
            const newContent = await generateReadingComprehension(vocab, grammarTitle, previousKnowledge);
            setContent(newContent);
            setCurrentIndex(0);
            setUserAnswers({});
            setIsSubmitted(false);
        } catch (err) {
            setError('生成阅读失败，请检查API Key设置或网络连接');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = () => {
        setUserAnswers({});
        setIsSubmitted(false);
        setCurrentIndex(0);
    };

    if (!content) {
        return <div className="p-8 text-center text-slate-500">暂无阅读内容</div>;
    }

    // Scoreboard / Review View
    if (isSubmitted) {
        const correctCount = content.questions.filter((q, i) => userAnswers[i] === q.answer).length;
        const score = Math.round((correctCount / content.questions.length) * 100);

        return (
            <div className="max-w-6xl mx-auto mt-8 h-[calc(100vh-150px)] flex gap-6">
                {/* Left: Article (Sticky) */}
                <div className="w-1/3 bg-white p-8 rounded-2xl shadow-lg border border-slate-100 overflow-y-auto">
                    <h3 className="text-lg font-bold text-slate-400 mb-4 uppercase tracking-wider">Lectura</h3>
                    <div className="prose prose-lg text-slate-800 leading-loose">
                        {content.text.split('\n').map((para, i) => (
                            <p key={i} className="mb-4">{para}</p>
                        ))}
                    </div>
                </div>

                {/* Right: Scoreboard & Questions */}
                <div className="flex-1 overflow-y-auto pr-2">
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 mb-8 text-center">
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${score >= 80 ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                            <Trophy size={40} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-800 mb-2">{score}分</h2>
                        <p className="text-slate-500 mb-6">
                            答对 {correctCount} / {content.questions.length} 题
                        </p>
                        <div className="flex justify-center gap-4">
                            <button
                                onClick={handleRetry}
                                className="px-6 py-2 border border-slate-300 rounded-lg font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                            >
                                <RotateCcw size={18} /> 重做本文
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
                    </div>

                    <div className="space-y-6">
                        {content.questions.map((q, idx) => {
                            const userAnswer = userAnswers[idx];
                            const isCorrect = userAnswer === q.answer;

                            return (
                                <div key={idx} className={`bg-white p-6 rounded-2xl shadow-sm border-2 ${isCorrect ? 'border-green-100' : 'border-red-100'}`}>
                                    <div className="flex gap-4">
                                        <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold ${isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-slate-800 mb-3">{q.question}</h3>
                                            <div className="space-y-2 mb-4">
                                                {q.options.map((opt, optIdx) => {
                                                    let style = "p-3 rounded-lg border border-slate-100 text-slate-600";
                                                    if (optIdx === q.answer) {
                                                        style = "p-3 rounded-lg border-2 border-green-500 bg-green-50 text-green-700 font-bold";
                                                    } else if (optIdx === userAnswer && !isCorrect) {
                                                        style = "p-3 rounded-lg border-2 border-red-500 bg-red-50 text-red-700 font-bold";
                                                    }
                                                    return (
                                                        <div key={optIdx} className={style}>
                                                            {opt}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className={`p-4 rounded-lg text-sm leading-relaxed ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                                                <div className="font-bold mb-1 flex items-center gap-2">
                                                    <BookOpen size={14} /> 解析
                                                </div>
                                                {q.explanation || "暂无解析"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // Quiz View
    const currentQuestion = content.questions[currentIndex];

    return (
        <div className="max-w-6xl mx-auto mt-8 h-[calc(100vh-150px)] flex gap-6">
            {/* Left: Article */}
            <div className="w-1/2 bg-white p-8 rounded-2xl shadow-lg border border-slate-100 overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-400 uppercase tracking-wider">Lectura</h3>
                    <button
                        onClick={generateNewContent}
                        disabled={loading}
                        className="text-sm font-bold text-spanish-red bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                        生成新文章
                    </button>
                </div>
                <div className="prose prose-lg text-slate-800 leading-loose">
                    {content.text.split('\n').map((para, i) => (
                        <p key={i} className="mb-4">{para}</p>
                    ))}
                </div>
            </div>

            {/* Right: Question */}
            <div className="w-1/2 flex flex-col">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex-1 overflow-y-auto mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-slate-800">问题 {currentIndex + 1}</h3>
                        <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                            {currentIndex + 1} / {content.questions.length}
                        </span>
                    </div>

                    <h4 className="text-xl font-bold text-slate-800 mb-6">
                        {currentQuestion.question}
                    </h4>

                    <div className="space-y-3">
                        {currentQuestion.options.map((opt, idx) => {
                            const isSelected = userAnswers[currentIndex] === idx;
                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleOptionSelect(idx)}
                                    className={`w-full p-4 text-left rounded-xl border-2 transition-all font-medium flex justify-between items-center ${isSelected
                                            ? 'border-spanish-red bg-red-50 text-spanish-red'
                                            : 'border-slate-200 hover:border-spanish-yellow hover:bg-yellow-50'
                                        }`}
                                >
                                    <span>{opt}</span>
                                    {isSelected && <CheckCircle2 size={20} />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center">
                    <button
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl disabled:opacity-30 flex items-center gap-2"
                    >
                        <ChevronLeft size={20} /> 上一题
                    </button>

                    {currentIndex === content.questions.length - 1 ? (
                        <button
                            onClick={handleSubmit}
                            disabled={Object.keys(userAnswers).length < content.questions.length}
                            className="px-8 py-3 bg-spanish-red text-white rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                        >
                            提交试卷
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="px-8 py-3 bg-slate-800 text-white rounded-xl font-bold shadow-lg hover:bg-slate-700 hover:scale-105 transition-all flex items-center gap-2"
                        >
                            下一题 <ChevronRight size={20} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
