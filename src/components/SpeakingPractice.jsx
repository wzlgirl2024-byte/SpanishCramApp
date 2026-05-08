import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, Volume2, RefreshCw, Loader2, Trophy, RotateCcw, ChevronLeft, ChevronRight, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { generateTranslationQuestions } from '../utils/deepseekAPI';

// Normalize text for comparison: lowercase, remove punctuation, trim
function normalizeText(text) {
    return text
        .toLowerCase()
        .replace(/[¿¡!?,.:;…\-—""''(){}[\]]/g, '')
        .replace(/\s+/g, ' ')
        .trim();
}

// Split text into words, filtering empty
function toWords(text) {
    return normalizeText(text).split(' ').filter(w => w.length > 0);
}

// Calculate word-level match results
function calculateMatch(targetText, spokenText) {
    const targetWords = toWords(targetText);
    const spokenWords = toWords(spokenText);

    if (targetWords.length === 0) return { score: 0, wordResults: [] };

    const spokenPool = [...spokenWords];
    const wordResults = targetWords.map(word => {
        const idx = spokenPool.findIndex(sw =>
            sw === word || sw.includes(word) || word.includes(sw)
        );
        if (idx !== -1) {
            spokenPool.splice(idx, 1);
            return { word, matched: true };
        }
        return { word, matched: false };
    });

    const matchedCount = wordResults.filter(r => r.matched).length;
    const score = Math.round((matchedCount / targetWords.length) * 100);

    return { score, wordResults };
}

// Extract sentences from lesson data
function extractSentences(reading, translation) {
    const sentences = [];

    // From reading text: split by newlines, clean dialogue markers
    if (reading?.text) {
        reading.text.split('\n').forEach(line => {
            const cleaned = line.replace(/^[\s—\-–]+/, '').trim();
            if (cleaned.length > 3 && /[a-záéíóúñü]/i.test(cleaned)) {
                sentences.push({ spanish: cleaned, source: 'reading' });
            }
        });
    }

    // From translation entries (zh-es type: question is Chinese, answer is Spanish)
    if (translation && Array.isArray(translation)) {
        translation.forEach(t => {
            if (t.type === 'zh-es' && t.a && t.q) {
                sentences.push({ spanish: t.a, chinese: t.q, source: 'translation' });
            }
        });
    }

    return sentences;
}

export default function SpeakingPractice({ vocab, lessonId, reading, translation, previousKnowledge }) {
    const [sentences, setSentences] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [score, setScore] = useState(null);
    const [wordResults, setWordResults] = useState([]);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [speechSupported, setSpeechSupported] = useState(true);
    const [showResult, setShowResult] = useState(false);

    const recognitionRef = useRef(null);
    const isListeningRef = useRef(false);
    const sentencesRef = useRef([]);
    const currentIndexRef = useRef(0);

    // Keep refs in sync with state
    useEffect(() => {
        sentencesRef.current = sentences;
    }, [sentences]);

    useEffect(() => {
        currentIndexRef.current = currentIndex;
    }, [currentIndex]);

    // Check SpeechRecognition support
    useEffect(() => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) {
            setSpeechSupported(false);
            return;
        }
        const recognition = new SR();
        recognition.lang = 'es-ES';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const result = event.results[0][0].transcript;
            setTranscript(result);
            setIsListening(false);
            isListeningRef.current = false;

            // Auto-score using refs for latest values
            const currentSentences = sentencesRef.current;
            const idx = currentIndexRef.current;
            const target = currentSentences[idx]?.spanish;
            if (target) {
                const { score: s, wordResults: wr } = calculateMatch(target, result);
                setScore(s);
                setWordResults(wr);
                setShowResult(true);
                setHistory(prev => [...prev, {
                    target,
                    chinese: currentSentences[idx]?.chinese || '',
                    transcript: result,
                    score: s,
                    wordResults: wr
                }]);
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
            isListeningRef.current = false;
            if (event.error === 'not-allowed') {
                setError('麦克风权限被拒绝，请在浏览器设置中允许麦克风访问');
            } else if (event.error === 'no-speech') {
                setError('未检测到语音，请重试');
            } else {
                setError(`语音识别出错: ${event.error}`);
            }
        };

        recognition.onend = () => {
            if (isListeningRef.current) {
                setIsListening(false);
                isListeningRef.current = false;
            }
        };

        recognitionRef.current = recognition;

        return () => {
            if (recognitionRef.current) {
                try { recognitionRef.current.abort(); } catch (e) { /* ignore */ }
            }
        };
    }, []);

    // Initialize sentences from lesson data
    useEffect(() => {
        const extracted = extractSentences(reading, translation);
        if (extracted.length > 0) {
            // Shuffle
            const shuffled = [...extracted].sort(() => Math.random() - 0.5);
            setSentences(shuffled);
            setCurrentIndex(0);
            resetCurrentState();
        }
    }, [lessonId, reading, translation]);

    const resetCurrentState = () => {
        setTranscript('');
        setScore(null);
        setWordResults([]);
        setShowResult(false);
        setError(null);
    };

    // TTS
    const speak = useCallback((text) => {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'es-ES';
        u.rate = 0.85;
        window.speechSynthesis.speak(u);
    }, []);

    // Start/Stop listening
    const toggleListening = () => {
        if (!recognitionRef.current) return;

        if (isListeningRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
            isListeningRef.current = false;
        } else {
            setError(null);
            setTranscript('');
            setScore(null);
            setWordResults([]);
            setShowResult(false);
            try {
                recognitionRef.current.start();
                setIsListening(true);
                isListeningRef.current = true;
            } catch (e) {
                setError('启动语音识别失败，请重试');
            }
        }
    };

    const handleNext = () => {
        if (currentIndex < sentences.length - 1) {
            setCurrentIndex(i => i + 1);
            resetCurrentState();
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(i => i - 1);
            resetCurrentState();
        }
    };

    const handleRetry = () => {
        setHistory([]);
        setCurrentIndex(0);
        resetCurrentState();
    };

    // AI generate new sentences
    const generateNewSentences = async () => {
        if (!vocab || vocab.length === 0) return;
        setLoading(true);
        setError(null);
        try {
            const questions = await generateTranslationQuestions(vocab, 8, 'zh-es', previousKnowledge);
            const newSentences = questions.map(q => ({
                spanish: q.a,
                chinese: q.q,
                source: 'ai'
            }));
            if (newSentences.length > 0) {
                setSentences(newSentences);
                setCurrentIndex(0);
                resetCurrentState();
                setHistory([]);
            }
        } catch (err) {
            setError('生成句子失败，请检查API Key设置或网络连接');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!speechSupported) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-4">
                <AlertCircle size={48} />
                <p className="text-lg font-bold text-slate-500">浏览器不支持语音识别</p>
                <p className="text-sm">请使用 Chrome 或 Edge 浏览器</p>
            </div>
        );
    }

    if (sentences.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-4">
                <p className="mb-4">暂无练习句子</p>
                <button
                    onClick={generateNewSentences}
                    disabled={loading}
                    className="px-6 py-2 bg-spanish-red text-white rounded-lg font-bold hover:bg-red-700 flex items-center gap-2 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" /> : <RefreshCw size={18} />}
                    AI生成句子
                </button>
            </div>
        );
    }

    const currentSentence = sentences[currentIndex];
    const isCompleted = history.length > 0 && currentIndex >= sentences.length - 1 && showResult;

    // Completion screen
    if (isCompleted && history.length === sentences.length) {
        const avgScore = Math.round(history.reduce((sum, h) => sum + h.score, 0) / history.length);
        const goodCount = history.filter(h => h.score >= 80).length;

        return (
            <div className="max-w-3xl mx-auto mt-8">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 mb-8 text-center">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${avgScore >= 80 ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                        <Trophy size={48} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-800 mb-2">平均分: {avgScore}</h2>
                    <p className="text-slate-500 mb-6">
                        优秀 (80+): {goodCount} / {history.length} 句
                    </p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={handleRetry}
                            className="px-6 py-2 border border-slate-300 rounded-lg font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                        >
                            <RotateCcw size={18} /> 再来一遍
                        </button>
                        <button
                            onClick={generateNewSentences}
                            disabled={loading}
                            className="px-6 py-2 bg-spanish-red text-white rounded-lg font-bold hover:bg-red-700 flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <RefreshCw size={18} />}
                            AI生成新句
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    {history.map((item, idx) => {
                        const matched = item.wordResults.filter(r => r.matched).length;
                        const total = item.wordResults.length;
                        return (
                            <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
                                <div className="flex justify-between items-start mb-3">
                                    <span className="font-bold text-slate-400">#{idx + 1}</span>
                                    <span className={`font-black text-lg ${item.score >= 80 ? 'text-green-600' : 'text-orange-600'}`}>
                                        {item.score}分
                                    </span>
                                </div>
                                {item.chinese && (
                                    <p className="text-sm text-slate-500 mb-2">{item.chinese}</p>
                                )}
                                <p className="text-slate-800 font-bold mb-2">{item.target}</p>
                                <p className="text-sm text-slate-500 mb-2">识别: {item.transcript}</p>
                                {/* Mini progress bar */}
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden mb-2">
                                    <div
                                        className={`h-full rounded-full ${item.score >= 80 ? 'bg-green-500' : item.score >= 50 ? 'bg-orange-500' : 'bg-red-500'}`}
                                        style={{ width: `${item.score}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-wrap gap-1">
                                        {item.wordResults.map((wr, i) => (
                                            <span key={i} className={`px-2 py-0.5 rounded text-xs font-medium ${wr.matched ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {wr.word}
                                            </span>
                                        ))}
                                    </div>
                                    <span className="text-xs text-slate-400 font-medium shrink-0 ml-3">
                                        {matched}/{total} 词命中
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto mt-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Mic className="text-spanish-red" />
                    口语练习
                </h2>
                <div className="flex items-center gap-3">
                    <button
                        onClick={generateNewSentences}
                        disabled={loading}
                        className="text-sm font-bold text-spanish-red bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1 disabled:opacity-50"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                        AI生成新句
                    </button>
                    <span className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                        {currentIndex + 1} / {sentences.length}
                    </span>
                </div>
            </div>

            {/* Target Sentence Card */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 mb-6">
                {currentSentence.chinese && (
                    <p className="text-sm text-slate-500 mb-2">{currentSentence.chinese}</p>
                )}
                <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-2xl font-bold text-slate-800 flex-1">
                        {currentSentence.spanish}
                    </h3>
                    <button
                        onClick={() => speak(currentSentence.spanish)}
                        className="p-3 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors text-slate-600"
                        title="播放语音"
                    >
                        <Volume2 size={22} />
                    </button>
                </div>
                <p className="text-xs text-slate-400">点击喇叭听发音，然后跟读</p>
            </div>

            {/* Microphone Button */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 mb-6 flex flex-col items-center">
                <button
                    onClick={toggleListening}
                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg ${isListening
                            ? 'bg-red-500 text-white shadow-red-200 scale-110 animate-pulse'
                            : 'bg-spanish-red text-white shadow-red-200 hover:bg-red-700 hover:scale-105'
                        }`}
                >
                    <Mic size={36} />
                </button>
                <p className="mt-4 text-sm font-medium text-slate-500">
                    {isListening ? '正在录音... 点击停止' : '点击开始录音'}
                </p>
                {isListening && (
                    <div className="mt-2 flex gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                )}
            </div>

            {/* Error */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            {/* Result */}
            {showResult && (
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    {/* Score header with big number */}
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-bold text-slate-700 text-lg">评分结果</h4>
                        <span className={`text-3xl font-black ${score >= 80 ? 'text-green-600' : score >= 50 ? 'text-orange-600' : 'text-red-600'}`}>
                            {score}分
                        </span>
                    </div>

                    {/* Score progress bar */}
                    <div className="mb-6">
                        <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-700 ease-out ${score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-orange-500' : 'bg-red-500'}`}
                                style={{ width: `${score}%` }}
                            />
                        </div>
                    </div>

                    {/* Scoring calculation breakdown */}
                    <div className="mb-6 bg-slate-50 rounded-xl p-5">
                        <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">评分计算过程</p>
                        <div className="flex items-center justify-center gap-3 text-center">
                            <div className="bg-green-100 rounded-lg px-4 py-2">
                                <div className="text-2xl font-black text-green-700">{wordResults.filter(r => r.matched).length}</div>
                                <div className="text-xs text-green-600 font-medium">命中词数</div>
                            </div>
                            <div className="text-2xl text-slate-300 font-bold">÷</div>
                            <div className="bg-blue-100 rounded-lg px-4 py-2">
                                <div className="text-2xl font-black text-blue-700">{wordResults.length}</div>
                                <div className="text-xs text-blue-600 font-medium">目标总词数</div>
                            </div>
                            <div className="text-2xl text-slate-300 font-bold">×</div>
                            <div className="bg-slate-200 rounded-lg px-4 py-2">
                                <div className="text-2xl font-black text-slate-700">100</div>
                                <div className="text-xs text-slate-500 font-medium">百分比</div>
                            </div>
                            <div className="text-2xl text-slate-300 font-bold">=</div>
                            <div className={`rounded-lg px-4 py-2 ${score >= 80 ? 'bg-green-100' : score >= 50 ? 'bg-orange-100' : 'bg-red-100'}`}>
                                <div className={`text-2xl font-black ${score >= 80 ? 'text-green-700' : score >= 50 ? 'text-orange-700' : 'text-red-700'}`}>{score}</div>
                                <div className={`text-xs font-medium ${score >= 80 ? 'text-green-600' : score >= 50 ? 'text-orange-600' : 'text-red-600'}`}>最终得分</div>
                            </div>
                        </div>
                    </div>

                    {/* Recognized text */}
                    <div className="mb-6">
                        <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">语音识别结果</p>
                        <p className="text-slate-700 bg-slate-50 p-4 rounded-xl text-lg font-medium">
                            "{transcript}"
                        </p>
                    </div>

                    {/* Word-by-word comparison */}
                    <div className="mb-6">
                        <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">逐词对比</p>
                        <div className="flex flex-wrap gap-2">
                            {wordResults.map((wr, idx) => (
                                <span
                                    key={idx}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-bold border-2 ${wr.matched
                                            ? 'border-green-300 bg-green-50 text-green-700'
                                            : 'border-red-300 bg-red-50 text-red-700'
                                        }`}
                                >
                                    {wr.matched ? <CheckCircle2 size={12} className="inline mr-1" /> : <XCircle size={12} className="inline mr-1" />}
                                    {wr.word}
                                </span>
                            ))}
                        </div>
                        <div className="mt-3 flex gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded bg-green-200 border border-green-300 inline-block"></span>
                                命中 {wordResults.filter(r => r.matched).length} 词
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded bg-red-200 border border-red-300 inline-block"></span>
                                未命中 {wordResults.filter(r => !r.matched).length} 词
                            </span>
                        </div>
                    </div>

                    {/* Score feedback */}
                    <div className={`p-4 rounded-xl text-sm font-medium ${score >= 80 ? 'bg-green-50 text-green-800' : score >= 50 ? 'bg-orange-50 text-orange-800' : 'bg-red-50 text-red-800'}`}>
                        {score >= 80 ? '很好！发音准确，继续保持！' :
                            score >= 50 ? '不错，但部分词汇需要多练习。点击喇叭再听一遍。' :
                                '加油！多听几遍再试试，注意每个词的发音。'}
                    </div>
                </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center">
                <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl disabled:opacity-30 flex items-center gap-2"
                >
                    <ChevronLeft size={20} /> 上一句
                </button>

                <button
                    onClick={() => speak(currentSentence.spanish)}
                    className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 flex items-center gap-2"
                >
                    <Volume2 size={18} /> 再听一遍
                </button>

                <button
                    onClick={handleNext}
                    disabled={currentIndex >= sentences.length - 1}
                    className="px-6 py-3 bg-spanish-red text-white rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2"
                >
                    下一句 <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}
