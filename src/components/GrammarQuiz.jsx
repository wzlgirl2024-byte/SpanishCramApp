import { useState, useEffect } from 'react';
import { BookOpen, Check, X, Loader2, ArrowRight, RefreshCw, HelpCircle, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight, Trophy, RotateCcw, Sparkles, Lightbulb } from 'lucide-react';
import { generateGrammarQuiz, generateGrammarExplanation } from '../utils/mimoAPI';
import ReactMarkdown from 'react-markdown';

export default function GrammarQuiz({ data, vocab, lessonId, previousKnowledge, smartContent, smartLoading }) {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState({}); // { index: optionIndex }
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // AI Explanation State
    const [showExplainModal, setShowExplainModal] = useState(false);
    const [explanationContent, setExplanationContent] = useState('');
    const [explaining, setExplaining] = useState(false);

    // Initial load
    useEffect(() => {
        if (data && data.questions) {
            let initialQuestions = [...data.questions];
            if (smartContent && smartContent.smartQuiz) {
                initialQuestions = [...initialQuestions, ...smartContent.smartQuiz];
            }
            setQuestions(initialQuestions);
        }
    }, [data, smartContent]);

    const handleOptionSelect = (optionIndex) => {
        if (isSubmitted) return;
        setUserAnswers(prev => ({
            ...prev,
            [currentIndex]: optionIndex
        }));
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
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

    const generateNewQuestions = async () => {
        setLoading(true);
        setError(null);
        try {
            const newQuestions = await generateGrammarQuiz(data, vocab, 10, previousKnowledge);
            setQuestions(newQuestions);
            setCurrentIndex(0);
            setUserAnswers({});
            setIsSubmitted(false);
        } catch (err) {
            setError('生成题目失败，请检查API Key设置或网络连接');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleExplainGrammar = async () => {
        setShowExplainModal(true);
        if (!explanationContent) {
            setExplaining(true);
            try {
                const explanation = await generateGrammarExplanation(data, previousKnowledge, vocab);
                setExplanationContent(explanation);
            } catch (err) {
                setExplanationContent("抱歉，生成讲解失败。");
            } finally {
                setExplaining(false);
            }
        }
    };

    const handleRetry = () => {
        setUserAnswers({});
        setIsSubmitted(false);
        setCurrentIndex(0);
    };

    // Scoreboard View
    if (isSubmitted) {
        const correctCount = questions.filter((q, i) => userAnswers[i] === q.answer).length;
        const score = Math.round((correctCount / questions.length) * 100);

        return (
            <div className="max-w-3xl mx-auto mt-8">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 mb-8 text-center">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${score >= 80 ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                        <Trophy size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 mb-2">{score}分</h2>
                    <p className="text-slate-500 mb-6">
                        答对 {correctCount} / {questions.length} 题
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={handleRetry}
                            className="px-6 py-2 border border-slate-300 rounded-lg font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                        >
                            <RotateCcw size={18} /> 重做本题
                        </button>
                        <button
                            onClick={generateNewQuestions}
                            disabled={loading}
                            className="px-6 py-2 bg-spanish-red text-white rounded-lg font-bold hover:bg-red-700 flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <RefreshCw size={18} />}
                            AI生成新题
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    {questions.map((q, idx) => {
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
                                            {q.explanation}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // Quiz View
    const currentQuestion = questions[currentIndex];

    return (
        <div className="max-w-4xl mx-auto mt-8 flex gap-6 h-[calc(100vh-150px)]">
            {/* Left Column: Learning Materials */}
            <div className="w-1/2 overflow-y-auto pr-2 space-y-6">
                {/* Static Grammar Content */}
                <div className="p-6 bg-yellow-50 rounded-2xl border border-yellow-100 shadow-sm">
                    <h3 className="font-bold text-yellow-900 mb-4 flex items-center gap-2 text-lg">
                        <BookOpen size={20} /> 语法要点
                    </h3>
                    <p className="text-yellow-800 whitespace-pre-line leading-relaxed">
                        {data.content}
                    </p>
                    <button
                        onClick={handleExplainGrammar}
                        className="mt-4 w-full py-2 bg-yellow-100 text-yellow-700 rounded-lg font-bold hover:bg-yellow-200 transition-colors flex items-center justify-center gap-2"
                    >
                        <Sparkles size={16} /> AI 深度讲解
                    </button>
                </div>

                {/* Smart Lexical Analysis */}
                {smartLoading ? (
                    <div className="p-8 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center justify-center text-slate-400 gap-3">
                        <Loader2 size={32} className="animate-spin text-spanish-red" />
                        <p className="text-sm font-medium">AI 正在备课中...</p>
                        <p className="text-xs">分析词汇用法 • 生成专项练习</p>
                    </div>
                ) : smartContent && smartContent.lexicalAnalysis ? (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-800 font-bold text-lg px-2">
                            <Lightbulb className="text-spanish-yellow" />
                            词汇精讲 (AI)
                        </div>
                        {smartContent.lexicalAnalysis.map((item, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <h4 className="font-bold text-spanish-red text-lg mb-3">{item.title}</h4>
                                <div className="prose prose-sm prose-slate max-w-none mb-4">
                                    <ReactMarkdown>{item.content}</ReactMarkdown>
                                </div>
                                {item.relatedVocab && item.relatedVocab.length > 0 && (
                                    <div className="bg-slate-50 p-3 rounded-lg text-xs">
                                        <span className="font-bold text-slate-500 block mb-1">相关词汇：</span>
                                        <div className="flex flex-wrap gap-2">
                                            {item.relatedVocab.map((v, i) => (
                                                <span key={i} className="bg-white px-2 py-1 rounded border border-slate-200 text-slate-600">
                                                    {v}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : null}
            </div>

            {/* Right Column: Quiz */}
            <div className="w-1/2 flex flex-col">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 flex-1 overflow-y-auto mb-6 relative">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <CheckCircle2 className="text-spanish-red" />
                            实战练习
                        </h2>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={generateNewQuestions}
                                disabled={loading}
                                className="p-2 text-spanish-red hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="生成新题"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                            </button>
                            <span className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                                {questions.length > 0 ? `${currentIndex + 1} / ${questions.length}` : '0 / 0'}
                            </span>
                        </div>
                    </div>

                    {questions.length > 0 ? (
                        <>
                            <h3 className="text-xl font-bold text-slate-800 mb-8 leading-relaxed">
                                {currentQuestion.question}
                            </h3>

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
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                            <p className="mb-4">暂无题目</p>
                            <button
                                onClick={generateNewQuestions}
                                disabled={loading}
                                className="px-6 py-2 bg-spanish-red text-white rounded-lg font-bold hover:bg-red-700 flex items-center gap-2 disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin" /> : <RefreshCw size={18} />}
                                AI生成新题
                            </button>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                {questions.length > 0 && (
                    <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                        <button
                            onClick={handlePrev}
                            disabled={currentIndex === 0}
                            className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-50 rounded-xl disabled:opacity-30 flex items-center gap-2"
                        >
                            <ChevronLeft size={20} /> 上一题
                        </button>

                        {currentIndex === questions.length - 1 ? (
                            <button
                                onClick={handleSubmit}
                                disabled={Object.keys(userAnswers).length < questions.length}
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
                )}
            </div>

            {/* AI Explanation Modal */}
            {showExplainModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                                <BookOpen className="text-spanish-red" />
                                AI 语法精讲
                            </h3>
                            <button
                                onClick={() => setShowExplainModal(false)}
                                className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto leading-relaxed text-slate-700">
                            {explaining ? (
                                <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-4">
                                    <Loader2 size={40} className="animate-spin text-spanish-red" />
                                    <p>AI 老师正在为您备课...</p>
                                </div>
                            ) : (
                                <div className="prose prose-slate max-w-none">
                                    <ReactMarkdown>{explanationContent}</ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
