import { useState, useEffect, useMemo } from 'react';
import { CheckCircle, Volume2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmationModal from './ConfirmationModal';

export default function VocabDrill({ vocab, lessonId }) {
    // Helper to load session
    const loadSession = () => {
        try {
            const saved = localStorage.getItem(`vocab_drill_session_${lessonId}`);
            if (saved) {
                const data = JSON.parse(saved);
                // Convert arrays back to Sets
                return {
                    ...data,
                    wrongWords: new Set(data.wrongWords || []),
                    remainingWords: data.remainingWords || [],
                    currentIndex: data.currentIndex || 0,
                    stats: data.stats || { correct: 0, total: 0 },
                    mode: data.mode || 'normal' // 'normal' or 'review'
                };
            }
        } catch (error) {
            console.error('Failed to load session:', error);
        }
        return null;
    };

    const session = loadSession();
    const [remainingWords, setRemainingWords] = useState(session?.remainingWords || []);
    const [wrongWords, setWrongWords] = useState(session?.wrongWords || new Set());
    const [currentIndex, setCurrentIndex] = useState(session?.currentIndex || 0);
    const [stats, setStats] = useState(session?.stats || { correct: 0, total: 0 });
    const [mode, setMode] = useState(session?.mode || 'normal');
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [options, setOptions] = useState([]);
    const [showConfirmRestart, setShowConfirmRestart] = useState(false);

    // Clear previous session data to avoid interference
    useEffect(() => {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith('vocab_drill_session_')) {
                keysToRemove.push(key);
            }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        console.log(`Cleared ${keysToRemove.length} session data entries`);
    }, []);

    // Initialize remainingWords if empty and vocab exists
    useEffect(() => {
        if (vocab && vocab.length > 0 && remainingWords.length === 0) {
            // Shuffle vocab
            const shuffled = [...vocab].sort(() => Math.random() - 0.5);
            setRemainingWords(shuffled);
            setCurrentIndex(0);
        }
    }, [vocab]);

    // Save progress to localStorage
    useEffect(() => {
        const data = {
            remainingWords,
            wrongWords: Array.from(wrongWords),
            currentIndex,
            stats,
            mode
        };
        localStorage.setItem(`vocab_drill_session_${lessonId}`, JSON.stringify(data));
    }, [lessonId, remainingWords, wrongWords, currentIndex, stats, mode]);

    const currentWord = remainingWords[currentIndex];

    // Generate options when word changes
    useEffect(() => {
        if (!currentWord) return;

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
        setIsCorrect(null);

        // Auto-play pronunciation after animation completes
        const timer = setTimeout(() => {
            speak(currentWord.spanish);
        }, 400);

        return () => clearTimeout(timer);
    }, [currentIndex, remainingWords]);

    const speak = (text) => {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'es-ES';
        window.speechSynthesis.speak(u);
    };

    const handleSelect = (option) => {
        if (selectedOption) return;

        setSelectedOption(option);
        const correct = option.spanish === currentWord.spanish;
        setIsCorrect(correct);

        // Update stats based on mode
        if (mode === 'normal') {
            // Normal mode: increment total and correct if correct
            setStats(s => ({ correct: s.correct + (correct ? 1 : 0), total: s.total + 1 }));
        } else {
            // Review mode: only increment correct if correct, total stays unchanged
            if (correct) {
                setStats(s => ({ ...s, correct: s.correct + 1 }));
            }
        }

        // Update wrong words set
        let newWrongWords = new Set(wrongWords);
        if (correct) {
            // If correct in review mode, remove from wrong words
            newWrongWords.delete(currentWord.spanish);
        } else {
            // If wrong, add to wrong words
            newWrongWords.add(currentWord.spanish);
        }
        setWrongWords(newWrongWords);

        // Auto advance after delay
        setTimeout(() => {
            // Move to next word
            if (currentIndex < remainingWords.length - 1) {
                setCurrentIndex(c => c + 1);
            } else {
                // Reached end of current list
                if (newWrongWords.size > 0 && mode === 'normal') {
                    // Switch to review mode with wrong words
                    setMode('review');
                    const wrongWordList = vocab.filter(w => newWrongWords.has(w.spanish));
                    setRemainingWords(wrongWordList);
                    setCurrentIndex(0);
                } else if (newWrongWords.size > 0 && mode === 'review') {
                    // Still have wrong words after review, restart review
                    const wrongWordList = vocab.filter(w => newWrongWords.has(w.spanish));
                    setRemainingWords(wrongWordList);
                    setCurrentIndex(0);
                } else {
                    // All words correct, stay at the end (completion screen will show)
                }
            }
        }, 1500);
    };

    const handleRestart = () => {
        // Reset all state
        setRemainingWords([]); // will be reinitialized by useEffect
        setWrongWords(new Set());
        setCurrentIndex(0);
        setStats({ correct: 0, total: 0 });
        setMode('normal');
        setSelectedOption(null);
        setIsCorrect(null);
        localStorage.removeItem(`vocab_drill_session_${lessonId}`);
    };

    // Determine if lesson is completed
    const isCompleted = remainingWords.length === 0 || (currentIndex >= remainingWords.length - 1 && wrongWords.size === 0);

    if (!vocab || vocab.length === 0) {
        return (
            <div className="flex items-center justify-center h-64 text-slate-400">
                本课暂无词汇数据
            </div>
        );
    }

    // Show completion screen when lesson is completed
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

    return (
        <div className="max-w-md mx-auto mt-8">
            {/* Mode indicator */}
            {mode === 'review' && (
                <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg text-center">
                    <p className="text-sm text-orange-700 font-medium">
                        🔄 错词复习模式 - 剩余 {remainingWords.length} 个单词
                    </p>
                </div>
            )}

            {/* Progress and stats */}
            <div className="flex justify-between text-sm text-slate-400 mb-8">
                <span>进度: {currentIndex + 1} / {remainingWords.length}</span>
                <span>正确: {stats.correct} / {stats.total}</span>
            </div>

            {/* Word display with animation */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentWord.spanish}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="text-center mb-10"
                >
                    <h2 className="text-5xl font-bold text-slate-800 mb-4">{currentWord.spanish}</h2>
                    <button
                        onClick={() => speak(currentWord.spanish)}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 text-sm"
                    >
                        <Volume2 size={14} /> 发音
                    </button>
                </motion.div>
            </AnimatePresence>

            {/* Options */}
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

            {/* Confirmation modal for restart */}
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
