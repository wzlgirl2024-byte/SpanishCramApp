import { useState, useEffect, useMemo } from 'react';
import { CheckCircle, XCircle, RefreshCw, Volume2, RotateCcw } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import ConfirmationModal from './ConfirmationModal';

export default function VocabDrill({ vocab, lessonId }) {
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

    const currentWord = activeVocab[currentIndex];

    useEffect(() => {
        // When navigating back to a completed lesson, this prevents the completion screen
        // from showing immediately. The user will see the last question again.
        setIsCompleted(false);

        // Generate options when word changes
        if (!currentWord || activeVocab.length === 0) return;

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

        // Auto-play pronunciation after animation completes
        const timer = setTimeout(() => {
            if (currentWord) {
                speak(currentWord.spanish);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [currentIndex, activeVocab, currentWord, vocab]);

    const handleSelect = (option) => {
        if (selectedOption) return;

        setSelectedOption(option);
        const correct = option.spanish === currentWord.spanish;
        setStats(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));

        // Calculate new wrongWords set
        let newWrongWords = new Set(wrongWords);
        if (!correct) {
            newWrongWords.add(currentWord.spanish);
            setWrongWords(newWrongWords);
        } else if (reviewMode) {
            newWrongWords.delete(currentWord.spanish);
            setWrongWords(newWrongWords);
        }

        // Auto advance
        setTimeout(() => {
            const isLastWord = currentIndex >= activeVocab.length - 1;
            
            // Check for completion
            if (isLastWord && newWrongWords.size === 0) {
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
                if (!reviewMode && newWrongWords.size > 0) {
                    // First round complete with errors, enter review mode
                    setReviewMode(true);
                    setCurrentIndex(0);
                } else if (reviewMode && newWrongWords.size > 0) {
                    // Still have wrong words after this answer, restart review
                    setCurrentIndex(0);
                }
                // Otherwise, stay at the end, completion screen is shown by isCompleted state
            }
        }, 1500);
    };

    const handleRestart = () => {
        setIsCompleted(false);
        setCurrentIndex(0);
        setStats({ correct: 0, total: 0 });
        setWrongWords(new Set());
        setReviewMode(false);
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
    if (!currentWord && activeVocab.length > 0) {
        return (
            <div className="flex items-center justify-center h-64 text-slate-400">
                正在加载...
            </div>
        );
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
            {/* Review mode indicator */}
            {reviewMode && (
                <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-center">
                    <p className="text-sm text-orange-700 font-medium">
                        🔄 错词复习模式 - 剩余 {activeVocab.length} 个单词
                    </p>
                </div>
            )}

            <div className="flex justify-between text-sm text-slate-400 mb-8">
                <span>进度: {currentIndex + 1} / {activeVocab.length}</span>
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
                        if (opt.spanish === currentWord.spanish) {
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
