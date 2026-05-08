import { useState, useEffect } from 'react';
import { Brain, Check, X, Loader2, ArrowRight, RefreshCw, MessageSquare } from 'lucide-react';
import { generateTranslationQuestions, gradeTranslationWithAI } from '../utils/deepseekAPI';

export default function TranslationTrainer({ data, vocab, lessonId }) {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswer, setUserAnswer] = useState('');
    const [showResult, setShowResult] = useState(false);
    const [grading, setGrading] = useState(false);
    const [aiFeedback, setAiFeedback] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
        } catch (err) {
            console.error(err);
            // Fallback if AI fails
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

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(c => c + 1);
        } else {
            // Finished
        }
    };

    const generateNewQuestions = async () => {
        setLoading(true);
        setError(null);
        try {
            const newQuestions = await generateTranslationQuestions(vocab, 5, 'both');
            setQuestions(newQuestions);
            setCurrentIndex(0);
            setUserAnswer('');
            setShowResult(false);
            setAiFeedback(null);
        } catch (err) {
            setError('生成题目失败，请检查API Key设置或网络连接');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (questions.length === 0) {
        return <div className="p-8 text-center text-slate-500">暂无题目</div>;
    }

    // Completion screen
    if (currentIndex >= questions.length - 1 && showResult && !grading) {
        return (
            <div className="max-w-2xl mx-auto mt-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center">
                <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageSquare size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">翻译训练完成！</h2>
                <p className="text-slate-500 mb-6">
                    继续加油，多加练习！
                </p>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => {
                            setCurrentIndex(0);
                            setUserAnswer('');
                            setShowResult(false);
                            setAiFeedback(null);
                        }}
                        className="px-6 py-2 border border-slate-300 rounded-lg font-bold text-slate-600 hover:bg-slate-50"
                    >
                        重做旧题
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
                {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
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
                <span className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                    {currentIndex + 1} / {questions.length}
                </span>
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
                        下一题 <ArrowRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
}
