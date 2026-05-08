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
                    mode: data.mode || 'normal', // 'normal' or 'review'
                    highlightedWords: data.highlightedWords || {}
                };
            }
        } catch (error) {
            console.error('Failed to load session:', error);
        }
        return null;
    };

    // Helper to load sticker data (review counts and cover states)
    const loadStickerData = () => {
        try {
            const countsKey = `vocab_drill_review_counts_${lessonId}`;
            const coverKey = `vocab_drill_cover_states_${lessonId}`;
            const counts = localStorage.getItem(countsKey);
            const covers = localStorage.getItem(coverKey);
            return {
                reviewCounts: counts ? JSON.parse(counts) : {},
                coverStates: covers ? JSON.parse(covers) : {}
            };
        } catch (error) {
            console.error('Failed to load sticker data:', error);
            return { reviewCounts: {}, coverStates: {} };
        }
    };

    const session = loadSession();
    const stickerData = loadStickerData();
    const [remainingWords, setRemainingWords] = useState(session?.remainingWords || []);
    const [wrongWords, setWrongWords] = useState(session?.wrongWords || new Set());
    const [currentIndex, setCurrentIndex] = useState(session?.currentIndex || 0);
    const [stats, setStats] = useState(session?.stats || { correct: 0, total: 0 });
    const [mode, setMode] = useState(session?.mode || 'normal');
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [options, setOptions] = useState([]);
    const [showConfirmRestart, setShowConfirmRestart] = useState(false);
    // Cover states for sticker effect: { spanish: { spanishCovered: boolean, chineseCovered: boolean } }
    const [coverStates, setCoverStates] = useState(stickerData.coverStates);
    // Review counts for each word: { spanish: number }
    const [reviewCounts, setReviewCounts] = useState(stickerData.reviewCounts);
    // Highlighted words: { spanish: boolean }
    const [highlightedWords, setHighlightedWords] = useState(session?.highlightedWords || {});

    // Compute sorted vocabulary based on review counts (higher score first)
    const sortedVocab = useMemo(() => {
        if (!vocab) return [];
        return [...vocab].sort((a, b) => {
            const scoreA = reviewCounts[a.spanish] || 0;
            const scoreB = reviewCounts[b.spanish] || 0;
            // Descending: higher score first
            if (scoreB !== scoreA) return scoreB - scoreA;
            // If scores equal, maintain original order
            return vocab.indexOf(a) - vocab.indexOf(b);
        });
    }, [vocab, reviewCounts]);

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

    // Initialize cover states for all vocab words, preserving existing saved states
    useEffect(() => {
        if (vocab && vocab.length > 0) {
            setCoverStates(prev => {
                const updated = { ...prev };
                let changed = false;
                vocab.forEach(word => {
                    if (!(word.spanish in updated)) {
                        updated[word.spanish] = {
                            spanishCovered: false,
                            chineseCovered: false
                        };
                        changed = true;
                    }
                });
                // Only update if new words were added
                return changed ? updated : prev;
            });
        }
    }, [vocab]);

    // Save progress to localStorage
    useEffect(() => {
        const data = {
            remainingWords,
            wrongWords: Array.from(wrongWords),
            currentIndex,
            stats,
            mode,
            highlightedWords
        };
        localStorage.setItem(`vocab_drill_session_${lessonId}`, JSON.stringify(data));
    }, [lessonId, remainingWords, wrongWords, currentIndex, stats, mode, highlightedWords]);

    // Save sticker data (review counts and cover states) to localStorage
    useEffect(() => {
        const countsKey = `vocab_drill_review_counts_${lessonId}`;
        const coverKey = `vocab_drill_cover_states_${lessonId}`;
        localStorage.setItem(countsKey, JSON.stringify(reviewCounts));
        localStorage.setItem(coverKey, JSON.stringify(coverStates));
    }, [lessonId, reviewCounts, coverStates]);

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

    const toggleCover = (word, field) => {
        setCoverStates(prev => ({
            ...prev,
            [word.spanish]: {
                ...prev[word.spanish],
                [field]: !prev[word.spanish]?.[field]
            }
        }));
    };

    const handleCountChange = (word, value) => {
        const num = parseInt(value, 10);
        if (isNaN(num) || num < 0) return;
        setReviewCounts(prev => ({
            ...prev,
            [word.spanish]: num
        }));
    };

    const toggleHighlight = (word) => {
        setHighlightedWords(prev => ({
            ...prev,
            [word.spanish]: !prev[word.spanish]
        }));
    };

    // Helper to generate icon string based on count
    const getIconsForCount = (count) => {
        if (count < 3) return '';
        // 每3次背诵获得一个对勾
        const checks = Math.floor(count / 3);
        // 3个对勾合成一个爱心
        const hearts = Math.floor(checks / 3);
        // 3个爱心合成一个皇冠
        const crowns = Math.floor(hearts / 3);
        // 3个皇冠合成一个太阳
        const suns = Math.floor(crowns / 3);
        const remainingChecks = checks % 3;
        const remainingHearts = hearts % 3;
        const remainingCrowns = crowns % 3;
        
        let icons = '';
        // Add suns (highest tier)
        icons += '☀️'.repeat(suns);
        // Add remaining crowns
        icons += '👑'.repeat(remainingCrowns);
        // Add remaining hearts
        icons += '❤️'.repeat(remainingHearts);
        // Add remaining checks (✅)
        icons += '✅'.repeat(remainingChecks);
        return icons;
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
                // Reached end of current list (last word answered)
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
                    // No wrong words, advance index beyond the list to trigger completion
                    setCurrentIndex(c => c + 1);
                }
            }
        }, 1500);
    };

    const handleRestart = () => {
        // Reset all state
        const shuffled = [...vocab].sort(() => Math.random() - 0.5);
        setRemainingWords(shuffled);
        setWrongWords(new Set());
        setCurrentIndex(0);
        setStats({ correct: 0, total: 0 });
        setMode('normal');
        setSelectedOption(null);
        setIsCorrect(null);
        localStorage.removeItem(`vocab_drill_session_${lessonId}`);
        setShowConfirmRestart(false);
    };

    // Determine if lesson is completed
    const isCompleted = remainingWords.length === 0 || currentIndex >= remainingWords.length;

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

            {/* Sticker vocabulary table - improved UI with review count */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <span className="inline-block w-2 h-5 bg-spanish-red rounded"></span>
                    贴纸背单词（点击遮盖/显示，记录背诵次数）
                </h3>
                <div className="max-h-56 overflow-y-auto border border-slate-300 rounded-xl p-4 bg-white shadow-sm">
                    <div className="space-y-3">
                        {sortedVocab.map((word) => {
                            const cover = coverStates[word.spanish] || { spanishCovered: false, chineseCovered: false };
                            const count = reviewCounts[word.spanish] || 0;
                            const highlighted = highlightedWords[word.spanish] || false;
                            return (
                                <motion.div
                                    layout
                                    key={word.spanish}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{
                                        layout: { type: "spring", stiffness: 300, damping: 30 },
                                        opacity: { duration: 0.3, ease: "easeInOut" },
                                        scale: { duration: 0.3, ease: "easeInOut" }
                                    }}
                                    className={`flex items-stretch rounded-lg overflow-hidden border border-slate-200 hover:border-spanish-yellow transition-colors ${highlighted ? 'bg-yellow-50' : 'bg-white'}`}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        toggleHighlight(word);
                                    }}
                                    title="右键点击标记/取消标记"
                                >
                                    {/* Spanish cell */}
                                    <div
                                        className="flex-1 relative p-3 cursor-pointer group hover:bg-yellow-100 transition-colors min-w-0"
                                        onClick={() => toggleCover(word, 'spanishCovered')}
                                    >
                                        {cover.spanishCovered ? (
                                            <div className="absolute inset-0 bg-yellow-100 flex items-center justify-center">
                                                <span className="text-sm font-medium text-slate-700">点击显示西语</span>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="text-xs text-slate-500 mb-1">西语</div>
                                                <span className="font-bold text-base text-slate-900 break-words whitespace-normal">{word.spanish}</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="w-px bg-slate-200"></div>
                                    {/* Chinese cell */}
                                    <div
                                        className="flex-1 relative p-3 cursor-pointer group hover:bg-red-100 transition-colors min-w-0"
                                        onClick={() => toggleCover(word, 'chineseCovered')}
                                    >
                                        {cover.chineseCovered ? (
                                            <div className="absolute inset-0 bg-red-100 flex items-center justify-center">
                                                <span className="text-sm font-medium text-slate-700">点击显示中文</span>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="text-xs text-slate-500 mb-1">中文</div>
                                                <span className="font-medium text-base text-slate-800 break-words whitespace-normal">{word.chinese}</span>
                                            </>
                                        )}
                                    </div>
                                    <div className="w-px bg-slate-200"></div>
                                    {/* Review count input */}
                                    <div className="flex-1 p-3 flex flex-col items-center justify-center border-l border-slate-200">
                                        <div className="text-xs text-slate-500 mb-1">背诵次数</div>
                                        <input
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={count}
                                            onChange={(e) => handleCountChange(word, e.target.value)}
                                            onWheel={(e) => {
                                                e.preventDefault();
                                                e.target.blur();
                                            }}
                                            className="w-16 text-center p-1 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-spanish-yellow focus:border-transparent"
                                            placeholder="0"
                                        />
                                        <div className="text-xs text-slate-400 mt-1">
                                            {getIconsForCount(count)}
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
                <p className="text-xs text-slate-400 mt-2">点击每个单元格可以遮盖/显示对应内容，方便对照记忆。输入背诵次数，每3次获得一个✅，3个✅合成一个❤️，3个❤️合成一个👑，3个👑合成一个☀️。合成后低级图标会被消耗。</p>
            </div>

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
