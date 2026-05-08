import { useState, useEffect } from 'react';
import { Brain, Check, X, Loader2, ArrowRight, RefreshCw, MessageSquare, Trophy, RotateCcw } from 'lucide-react';
import { generateTranslationQuestions, gradeTranslationWithAI } from '../utils/deepseekAPI';

export default function TranslationTrainer({ data, vocab, lessonId, previousKnowledge }) {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [grading, setGrading] = useState(false);
    const [aiFeedback, setAiFeedback] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // History for summary
    const [history, setHistory] = useState([]); // [{ question, answer, userAnswer, score, feedback }]

    // Initial load
    useEffect(() => {
        if (data) {
            setQuestions(data);
        }
    }, [data]);

    const handleCheck = async () => {
        if (!userAnswer.trim()) return;

        setShowResult(true);
        setGrading(true);

        try {
            const currentQ = questions[currentIndex];
            const result = await gradeTranslationWithAI(
                userAnswer,
                currentQ.a,
                currentQ.q,
                currentQ.type
            );
            setAiFeedback(result);

            // Add to history
            setHistory(prev => [...prev, {
                question: currentQ.q,
                correctAnswer: currentQ.a,
                userAnswer: userAnswer,
                score: result.score,
                feedback: result.feedback
            }]);

        } catch (err) {
            console.error(err);
            setAiFeedback({
                score: 0,
                feedback: "无法连接AI进行评分，请参考标准答案。"
            });
        } finally {
            setGrading(false);
        }
    };

    const handleNext = () => {
        setUserAnswer('');
        setShowResult(false);
        setAiFeedback(null);

        if (currentIndex < questions.length) {
            setCurrentIndex(c => c + 1);
        }
    };

    const generateNewQuestions = async () => {
        setLoading(true);
        setError(null);
        try {
            const newQuestions = await generateTranslationQuestions(vocab, 10, 'both', previousKnowledge);
            setQuestions(newQuestions);
            setCurrentIndex(0);
            setUserAnswer('');
            setShowResult(false);
            setAiFeedback(null);
            setHistory([]);
        } catch (err) {
            setError('生成题目失败，请检查API Key设置或网络连接');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = () => {
        setCurrentIndex(0);
        setUserAnswer('');
        setShowResult(false);
        setAiFeedback(null);
        setHistory([]);
    };

    if (questions.length === 0) {
        return <div className="p-8 text-center text-slate-500">暂无题目</div>;
    }

    // Completion screen
    if (currentIndex >= questions.length) {
        const avgScore = Math.round(history.reduce((acc, curr) => acc + curr.score, 0) / history.length) || 0;
        const correctCount = history.filter(h => h.score >= 80).length;

        return (
            <div className="max-w-4xl mx-auto mt-8">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 mb-8 text-center">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${avgScore >= 80 ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                        <Trophy size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 mb-2">平均分: {avgScore}</h2>
                    <p className="text-slate-500 mb-6">
                        优秀 (80+): {correctCount} / {history.length} 题
                    </p>

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={handleRetry}
                            className="px-6 py-2 border border-slate-300 rounded-lg font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                        >
                            <RotateCcw size={18} /> 重做本组
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
                    {history.map((item, idx) => (
                        <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                            <div className="flex justify-between items-start mb-4">
                                <span className="font-bold text-slate-400">#{idx + 1}</span>
                                <span className={`font-black text-lg ${item.score >= 80 ? 'text-green-600' : 'text-orange-600'}`}>
                                    {item.score}分
                                </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-400 mb-1">题目</h4>
                                    <p className="text-slate-800 font-medium mb-4">{item.question}</p>

                                    <h4 className="text-sm font-bold text-slate-400 mb-1">你的回答</h4>
                                    <p className="text-slate-800 mb-4">{item.userAnswer}</p>

                                    <h4 className="text-sm font-bold text-slate-400 mb-1">参考答案</h4>
                                    <p className="text-green-700 font-medium">{item.correctAnswer}</p>
                                </div>
                                <div className="bg-slate-50 p-4 rounded-xl">
                                    <h4 className="text-sm font-bold text-slate-500 mb-2 flex items-center gap-2">
                                        <Brain size={16} /> AI 点评
                                    </h4>
                                    <p className="text-slate-700 text-sm leading-relaxed">{item.feedback}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const currentQ = questions[currentIndex];

    return (
        <div className="max-w-2xl mx-auto mt-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <MessageSquare className="text-spanish-red" />
                    翻译特训
                </h2>
                <div className="flex items-center gap-3">
                    <button
                        onClick={generateNewQuestions}
                        disabled={loading}
                        className="text-sm font-bold text-spanish-red bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                        换一批
                    </button>
                    <span className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                        {currentIndex + 1} / {questions.length}
                    </span>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 mb-6">
                <div className="mb-6">
                    <span className="inline-block px-2 py-1 bg-slate-100 text-slate-500 text-xs rounded mb-2">
                        {currentQ.type === 'zh-es' ? '中译西' : '西译中'}
                    </span>
                    <h3 className="text-2xl font-bold text-slate-800 leading-relaxed">
                        {currentQ.q}
                    </h3>
                </div>

                <div className="space-y-4">
                    <textarea
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        disabled={showResult}
                        placeholder="请输入翻译..."
                        className="w-full p-4 rounded-xl border-2 border-slate-200 focus:border-spanish-yellow focus:ring-2 focus:ring-yellow-100 outline-none transition-all resize-none h-32 text-lg"
                    />

                    {!showResult ? (
                        <button
                            onClick={handleCheck}
                            disabled={!userAnswer.trim()}
                            className="w-full py-3 bg-spanish-red text-white rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
                        >
                            提交答案
                        </button>
                    ) : (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                                <h4 className="text-sm font-bold text-green-800 mb-1">参考答案</h4>
                                <p className="text-green-900 font-medium text-lg">{currentQ.a}</p>
                            </div>

                            {grading ? (
                                <div className="flex items-center gap-2 text-slate-500 p-4">
                                    <Loader2 className="animate-spin" />
                                    AI正在分析您的翻译...
                                </div>
                            ) : aiFeedback && (
                                <div className={`p-4 rounded-xl border ${aiFeedback.score >= 80 ? 'bg-blue-50 border-blue-200' : 'bg-orange-50 border-orange-200'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-slate-700 flex items-center gap-2">
                                            <Brain size={18} /> AI 点评
                                        </h4>
                                        <span className={`text-xl font-black ${aiFeedback.score >= 80 ? 'text-blue-600' : 'text-orange-600'}`}>
                                            {aiFeedback.score}分
                                        </span>
                                    </div>
                                    <p className="text-slate-700">{aiFeedback.feedback}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {showResult && !grading && (
                <div className="flex justify-end">
                    <button
                        onClick={handleNext}
                        className="px-8 py-3 bg-spanish-red text-white rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 hover:scale-105 transition-all flex items-center gap-2"
                    >
                        {currentIndex < questions.length - 1 ? (
                            <>下一题 <ArrowRight size={20} /></>
                        ) : (
                            <>查看成绩单 <Trophy size={20} /></>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
