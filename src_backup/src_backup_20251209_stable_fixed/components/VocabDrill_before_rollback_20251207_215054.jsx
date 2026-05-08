import { useState, useEffect, useMemo } from 'react';
import { CheckCircle, XCircle, RefreshCw, Volume2, RotateCcw, Sparkles, Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ConfirmationModal from './ConfirmationModal';
import { generateVocabQuestions } from '../utils/deepseekAPI';
import { courseData } from '../data/course_data';

export default function VocabDrill({ vocab, lessonId }) {
    // Get previous lessons' vocab for context (to avoid out-of-scope words)
    const previousVocab = useMemo(() => {
        if (!lessonId || lessonId <= 1) return [];
        return courseData
            .filter(lesson => lesson.id < lessonId && lesson.vocab)
            .flatMap(lesson => lesson.vocab);
    }, [lessonId]);
    // Helper to load session
    const loadSession = () => {
        try {
            const saved = localStorage.getItem(`vocab_drill_session_${lessonId}`);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error('Failed to load session:', error);
        }
        return null;
    };

    const speak = (text) => {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'es-ES';
        window.speechSynthesis.speak(u);
    };

    const [currentIndex, setCurrentIndex] = useState(() => loadSession()?.currentIndex ?? 0);
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    // Stats should reset each time a new practice session starts
    const [stats, setStats] = useState({ correct: 0, total: 0 });
    const [wrongWords, setWrongWords] = useState(() => new Set(loadSession()?.wrongWords ?? []));
    const [reviewMode, setReviewMode] = useState(() => loadSession()?.reviewMode ?? false);
    const [showConfirmRestart, setShowConfirmRestart] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false); // This state is NOT persisted
    
    // AI-generated questions state
    const [aiQuestions, setAiQuestions] = useState([]);
    const [aiQuestionIndex, setAiQuestionIndex] = useState(0);
    const [isUsingAI, setIsUsingAI] = useState(false);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [aiError, setAiError] = useState(null);

    // Save progress to localStorage (but NOT stats - stats reset each session)
    useEffect(() => {
        // We don't save `selectedOption`, `isCompleted`, or `stats` to avoid getting stuck
        // Stats should reset each time user starts a new practice session
        const data = {
            currentIndex,
            wrongWords: Array.from(wrongWords),
            reviewMode
        };
        localStorage.setItem(`vocab_drill_session_${lessonId}`, JSON.stringify(data));
    }, [lessonId, currentIndex, wrongWords, reviewMode]);

    // Dynamically determine active vocabulary list
    const activeVocab = useMemo(() => {
        if (!vocab || vocab.length === 0) return [];
        if (reviewMode) {
            return vocab.filter(word => wrongWords.has(word.spanish));
        }
        return vocab;
    }, [vocab, reviewMode, wrongWords]);

    // Get current word - either from default vocab or AI questions
    const getCurrentWord = () => {
        if (isUsingAI && aiQuestions.length > 0) {
            const aiQ = aiQuestions[aiQuestionIndex];
            if (aiQ) {
                return {
                    spanish: aiQ.spanish,
                    chinese: aiQ.chinese,
                    isAI: true
                };
            }
        }
        return activeVocab[currentIndex];
    };

    // Fix invalid currentIndex when activeVocab changes or is empty
    useEffect(() => {
        // If activeVocab is empty in review mode, exit review mode
        if (reviewMode && activeVocab.length === 0) {
            setReviewMode(false);
            setCurrentIndex(0);
            return;
        }
        
        // If currentIndex is out of bounds, reset it
        if (activeVocab.length > 0 && currentIndex >= activeVocab.length) {
            setCurrentIndex(0);
        }
        
        // If currentWord is undefined but activeVocab has items, reset index
        if (activeVocab.length > 0 && !activeVocab[currentIndex]) {
            setCurrentIndex(0);
        }
    }, [activeVocab, reviewMode, currentIndex]);

    const handleGenerateAIQuestions = async () => {
        const apiKey = localStorage.getItem('deepseek_api_key');
        if (!apiKey) {
            setAiError('请先设置API Key才能使用AI生成题目');
            return;
        }

        setIsGeneratingAI(true);
        setAiError(null);

        try {
            const newQuestions = await generateVocabQuestions(vocab, 10, previousVocab);
            if (newQuestions && newQuestions.length > 0) {
                const wasEmpty = aiQuestions.length === 0;
                setAiQuestions(prev => [...prev, ...newQuestions]);
                if (wasEmpty) {
                    // First time generating, switch to AI mode
                    setIsUsingAI(true);
                    setAiQuestionIndex(0);
                } else {
                    // Continue to next question after generating
                    setAiQuestionIndex(prev => prev + 1);
                }
            } else {
                setAiError('AI未能生成有效题目，请重试');
            }
        } catch (error) {
            console.error('生成AI题目失败:', error);
            setAiError(error.message || '生成题目失败，请检查API Key设置');
        } finally {
            setIsGeneratingAI(false);
        }
    };

    const currentWord = getCurrentWord();

    useEffect(() => {
        // When navigating back to a completed lesson, this prevents the completion screen
        // from showing immediately. The user will see the last question again.
        setIsCompleted(false);

        // Generate options when word changes
        if (!currentWord) {
            // If using AI and no more questions, try to generate more
            if (isUsingAI && aiQuestions.length === 0 && !isGeneratingAI) {
                handleGenerateAIQuestions();
            }
            return;
        }

        // If using AI questions, use the distractors from AI
        if (isUsingAI && currentWord.isAI) {
            const aiQ = aiQuestions[aiQuestionIndex];
            if (aiQ && aiQ.distractors) {
                const allOptions = [
                    { spanish: aiQ.spanish, chinese: aiQ.chinese },
                    ...aiQ.distractors.map(d => ({ spanish: '', chinese: d, isDistractor: true }))
                ].sort(() => Math.random() - 0.5);
                setOptions(allOptions);
                setSelectedOption(null);
            }
        } else {
            // Default: use vocab list to generate options
            if (activeVocab.length === 0) return;

            // Filter out words with same Spanish OR same Chinese translation to avoid duplicate options
            const distractors = vocab
                .filter(w =>
                    w.spanish !== currentWord.spanish &&
                    w.chinese !== currentWord.chinese
                )
                .sort(() => Math.random() - 0.5)
                .slice(0, 3);

            const allOptions = [currentWord, ...distractors].sort(() => Math.random() - 0.5);
            setOptions(allOptions);
            setSelectedOption(null);
        }

        // Auto-play pronunciation after animation completes
        const timer = setTimeout(() => {
            if (currentWord && currentWord.spanish) {
                speak(currentWord.spanish);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [currentIndex, activeVocab, currentWord, vocab, isUsingAI, aiQuestions, aiQuestionIndex, isGeneratingAI]);

    const handleSelect = (option) => {
        if (selectedOption) return;

        setSelectedOption(option);
        const correct = isUsingAI && currentWord.isAI
            ? option.chinese === currentWord.chinese
            : option.spanish === currentWord.spanish;
        setStats(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));

        // Calculate new wrongWords set (only for default vocab, not AI questions)
        if (!isUsingAI || !currentWord.isAI) {
            let newWrongWords = new Set(wrongWords);
            if (!correct) {
                newWrongWords.add(currentWord.spanish);
                setWrongWords(newWrongWords);
            } else if (reviewMode) {
                newWrongWords.delete(currentWord.spanish);
                setWrongWords(newWrongWords);
            }
        }

        // Auto advance
        setTimeout(() => {
            if (isUsingAI && currentWord.isAI) {
                // AI question mode
                const isLastAIQuestion = aiQuestionIndex >= aiQuestions.length - 1;
                if (isLastAIQuestion) {
                    // Generate more AI questions automatically
                    handleGenerateAIQuestions();
                    // Don't increment index yet, wait for new questions to be generated
                } else {
                    setAiQuestionIndex(i => i + 1);
                }
            } else {
                // Default vocab mode
                const isLastWord = currentIndex >= activeVocab.length - 1;
                
                // Check for completion
                if (isLastWord && wrongWords.size === 0) {
                    if (reviewMode && correct) { // Last wrong word answered correctly in review
                        if (activeVocab.length === 1) {
                            setIsCompleted(true);
                            return;
                        }
                    } else if (!reviewMode) {
                        setIsCompleted(true);
                        return;
                    }
                }
                
                // In review mode, if answered correctly, the word is removed from the list
                // so we should NOT increment the index (the next word will be at the same index)
                const shouldIncrementIndex = !(reviewMode && correct);

                if (shouldIncrementIndex && !isLastWord) {
                    setCurrentIndex(c => c + 1);
                } else if (isLastWord) {
                    // Reached end of current list
                    if (!reviewMode && wrongWords.size > 0) {
                        // First round complete with errors, enter review mode
                        setReviewMode(true);
                        setCurrentIndex(0);
                    } else if (reviewMode && wrongWords.size > 0) {
                        // Still have wrong words after this answer, restart review
                        setCurrentIndex(0);
                    }
                    // Otherwise, stay at the end, completion screen is shown by isCompleted state
                }
            }
        }, 1500);
    };

    const handleSwitchToAI = () => {
        if (aiQuestions.length === 0) {
            handleGenerateAIQuestions();
        } else {
            setIsUsingAI(true);
            setAiQuestionIndex(0);
        }
    };

    const handleSwitchToDefault = () => {
        setIsUsingAI(false);
        setCurrentIndex(0);
    };

    const handleRestart = () => {
        setIsCompleted(false);
        setCurrentIndex(0);
        setStats({ correct: 0, total: 0 });
        setWrongWords(new Set());
        setReviewMode(false);
        setIsUsingAI(false);
        setAiQuestions([]);
        setAiQuestionIndex(0);
        setAiError(null);
        // Clear saved session to restart fresh
        localStorage.removeItem(`vocab_drill_session_${lessonId}`);
        setShowConfirmRestart(false);
    };

    if (!vocab || vocab.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-slate-400">
                本课暂无词汇数据
            </div>
        );
    }

    // If currentWord is undefined (shouldn't happen after fix, but safety check)
    if (!currentWord) {
        if (isUsingAI && isGeneratingAI) {
            return (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                    <Loader2 size={32} className="animate-spin mb-4 text-purple-600" />
                    <p className="text-lg font-medium">AI正在生成新题目...</p>
                    <p className="text-sm text-slate-400 mt-2">请稍候</p>
                </div>
            );
        }
        if (isUsingAI && aiQuestions.length === 0 && !isGeneratingAI) {
            return (
                <div className="flex flex-col items-center justify-center h-64">
                    <button
                        onClick={handleGenerateAIQuestions}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-colors flex items-center gap-2"
                    >
                        <Sparkles size={20} />
                        开始AI无限练习
                    </button>
                    {aiError && (
                        <p className="mt-4 text-sm text-red-600">{aiError}</p>
                    )}
                </div>
            );
        }
        if (activeVocab.length > 0) {
            return (
                <div className="flex items-center justify-center h-64 text-slate-400">
                    正在加载...
                </div>
            );
        }
    }

    if (isCompleted) {
        const isPerfect = stats.total === vocab.length && stats.correct === vocab.length;

        return (
            <div className="h-full flex flex-col items-center justify-center text-center">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${isPerfect ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                    {isPerfect ? <CheckCircle size={40} /> : <RotateCcw size={40} />}
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    {isPerfect ? '🎉 完美通过！' : '✅ 本课词汇完成！'}
                </h2>
                <p className="text-slate-500 mb-2">正确率: {Math.round((stats.correct / stats.total) * 100)}%</p>
                <p className="text-sm text-slate-400 mb-6">
                    共答题 {stats.total} 次，正确 {stats.correct} 次
                </p>
                <button
                    onClick={() => setShowConfirmRestart(true)}
                    className="px-6 py-2 bg-spanish-red text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
                >
                    再来一遍
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-8">
            {/* Mode switcher and AI controls */}
            <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex gap-2">
                    <button
                        onClick={handleSwitchToDefault}
                        disabled={!isUsingAI}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all ${
                            !isUsingAI
                                ? 'bg-slate-200 text-slate-700'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                    >
                        默认题目
                    </button>
                    <button
                        onClick={handleSwitchToAI}
                        disabled={isUsingAI || isGeneratingAI}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
                            isUsingAI
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                    >
                        {isGeneratingAI ? (
                            <>
                                <Loader2 size={14} className="animate-spin" />
                                生成中...
                            </>
                        ) : (
                            <>
                                <Sparkles size={14} />
                                AI无限题
                            </>
                        )}
                    </button>
                </div>
                {isUsingAI && (
                    <span className="text-xs text-purple-600 font-medium">
                        AI模式
                    </span>
                )}
            </div>

            {/* Error message */}
            {aiError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{aiError}</p>
                </div>
            )}

            {/* Review mode indicator */}
            {reviewMode && !isUsingAI && (
                <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-center">
                    <p className="text-sm text-orange-700 font-medium">
                        🔄 错词复习模式 - 剩余 {activeVocab.length} 个单词
                    </p>
                </div>
            )}

            <div className="flex justify-between text-sm text-slate-400 mb-8">
                <span>
                    进度: {isUsingAI 
                        ? `${aiQuestionIndex + 1} / ${aiQuestions.length}${aiQuestions.length > 0 ? ' (AI)' : ''}`
                        : `${currentIndex + 1} / ${activeVocab.length}`
                    }
                </span>
                <span>正确: {stats.correct} / {stats.total}</span>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentWord?.spanish}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-center mb-10"
                >
                    <h2 className="text-5xl font-bold text-slate-800 mb-4">{currentWord?.spanish}</h2>
                    <button
                        onClick={() => speak(currentWord?.spanish)}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 text-sm"
                    >
                        <Volume2 size={14} /> 发音
                    </button>
                </motion.div>
            </AnimatePresence>

            <div className="space-y-3">
                {options.map((opt, idx) => {
                    let stateClass = "bg-white border-slate-200 hover:border-spanish-yellow hover:bg-yellow-50";
                    if (selectedOption) {
                        const isCorrect = isUsingAI && currentWord.isAI
                            ? opt.chinese === currentWord.chinese
                            : opt.spanish === currentWord.spanish;
                        if (isCorrect) {
                            stateClass = "bg-green-50 border-green-500 text-green-700";
                        } else if (opt === selectedOption) {
                            stateClass = "bg-red-50 border-red-500 text-red-700";
                        } else {
                            stateClass = "opacity-50 border-slate-100";
                        }
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleSelect(opt)}
                            disabled={!!selectedOption}
                            className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 font-medium text-lg ${stateClass}`}
                        >
                            {opt.chinese}
                        </button>
                    );
                })}
            </div>

            <ConfirmationModal
                isOpen={showConfirmRestart}
                onClose={() => setShowConfirmRestart(false)}
                onConfirm={handleRestart}
                title="重置练习"
                message="确定要清空当前的所有进度吗？"
                confirmText="重置"
            />
        </div>
    );
}
