import { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, Volume2, RefreshCw, Loader2, ChevronLeft, ChevronRight, CheckCircle2, XCircle, AlertCircle, History, Trash2, Settings } from 'lucide-react';
import { generateTranslationQuestions } from '../utils/deepseekAPI';

// ==================== 评分算法 ====================

function normalizeText(text) {
    return text.toLowerCase().replace(/[¿¡!?,.:;…—–""''(){}\[\]]/g, '').replace(/\s+/g, ' ').trim();
}

function toWords(text) {
    return normalizeText(text).split(' ').filter(w => w.length > 0);
}

function calculateMatch(targetText, spokenText) {
    const targetWords = toWords(targetText);
    const spokenWords = toWords(spokenText);
    if (targetWords.length === 0) return { score: 0, wordResults: [], matched: 0, total: 0 };
    const spokenPool = [...spokenWords];
    const wordResults = targetWords.map(word => {
        const idx = spokenPool.findIndex(sw => sw === word || sw.includes(word) || word.includes(sw));
        if (idx !== -1) { spokenPool.splice(idx, 1); return { word, matched: true }; }
        return { word, matched: false };
    });
    const matched = wordResults.filter(r => r.matched).length;
    return { score: Math.round((matched / targetWords.length) * 100), wordResults, matched, total: targetWords.length };
}

// ==================== 数据提取 ====================

function extractSentences(reading, translation) {
    const sentences = [];
    if (reading?.text) {
        reading.text.split('\n').forEach(line => {
            const cleaned = line.replace(/^[\s—–‒\-–]+/, '').trim();
            if (cleaned.length > 3 && /[a-záéíóúñü]/i.test(cleaned)) sentences.push({ spanish: cleaned, source: 'reading' });
        });
    }
    if (translation && Array.isArray(translation)) {
        translation.forEach(t => { if (t.type === 'zh-es' && t.a && t.q) sentences.push({ spanish: t.a, chinese: t.q, source: 'translation' }); });
    }
    return sentences;
}

// ==================== localStorage ====================

const STORAGE_KEY = 'spanishcram_speaking_history';
function loadHistory() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } }
function saveHistory(h) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(h)); } catch {} }

// ==================== 环境诊断 ====================

function getDiagnostics() {
    const d = {};
    d.isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    d.protocol = window.location.protocol;
    d.hostname = window.location.hostname;
    d.hasSpeechRecognition = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    d.hasGetUserMedia = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    d.hasSpeechSynthesis = !!window.speechSynthesis;
    d.browser = navigator.userAgent.includes('Chrome') ? 'Chrome' : navigator.userAgent.includes('Edg') ? 'Edge' : navigator.userAgent.includes('Firefox') ? 'Firefox' : navigator.userAgent.includes('Safari') ? 'Safari' : 'Other';
    return d;
}

// ==================== 主组件 ====================

export default function SpeakingPractice({ vocab, lessonId, reading, translation, previousKnowledge }) {
    const [sentences, setSentences] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [score, setScore] = useState(null);
    const [wordResults, setWordResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [manualText, setManualText] = useState('');
    const [showManualInput, setShowManualInput] = useState(false);
    const [history, setHistory] = useState(() => loadHistory());
    const [showHistory, setShowHistory] = useState(false);
    const [showDiagnostics, setShowDiagnostics] = useState(false);
    const [diag, setDiag] = useState(null);

    const recognitionRef = useRef(null);
    const isListeningRef = useRef(false);
    const gotResultRef = useRef(false);
    const interimRef = useRef('');
    const timeoutRef = useRef(null);
    const sentencesRef = useRef([]);
    const currentIndexRef = useRef(0);

    useEffect(() => { sentencesRef.current = sentences; }, [sentences]);
    useEffect(() => { currentIndexRef.current = currentIndex; }, [currentIndex]);
    useEffect(() => { saveHistory(history); }, [history]);

    // Run diagnostics on mount
    useEffect(() => { setDiag(getDiagnostics()); }, []);

    // Initialize sentences
    useEffect(() => {
        const extracted = extractSentences(reading, translation);
        if (extracted.length > 0) {
            setSentences([...extracted].sort(() => Math.random() - 0.5));
            setCurrentIndex(0);
            resetCurrentState();
        }
    }, [lessonId, reading, translation]);

    const resetCurrentState = () => {
        setTranscript(''); setScore(null); setWordResults([]); setShowResult(false); setError(null); setManualText('');
    };

    // TTS
    const speak = useCallback((text) => {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.lang = 'es-ES'; u.rate = 0.85;
        window.speechSynthesis.speak(u);
    }, []);

    // ==================== Speech Recognition ====================

    const createRecognition = useCallback(() => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) return null;

        const recognition = new SR();
        recognition.lang = 'es-ES';
        recognition.interimResults = true;
        recognition.continuous = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
            let finalText = '';
            let interimText = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const t = event.results[i][0].transcript;
                if (event.results[i].isFinal) finalText += t;
                else interimText += t;
            }
            if (interimText) { interimRef.current = interimText; setTranscript(interimText); }
            if (finalText) {
                gotResultRef.current = true;
                setTranscript(finalText);
                setIsListening(false);
                isListeningRef.current = false;
                processResult(finalText);
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech error:', event.error);
            if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
            setIsListening(false); isListeningRef.current = false;
            if (event.error === 'not-allowed') setError('麦克风权限被拒绝');
            else if (event.error === 'no-speech') setError('未检测到语音，请重试');
            else if (event.error === 'network') setError('网络错误 - 语音识别需要网络连接');
            else if (event.error === 'audio-capture') setError('未检测到麦克风');
            else setError(`识别出错: ${event.error}`);
        };

        recognition.onend = () => {
            if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
            if (isListeningRef.current) { setIsListening(false); isListeningRef.current = false; }
            if (!gotResultRef.current && interimRef.current) {
                gotResultRef.current = true;
                setTranscript(interimRef.current);
                processResult(interimRef.current);
            } else if (!gotResultRef.current) {
                setError('未检测到语音，请重试');
            }
        };

        return recognition;
    }, []);

    const processResult = (spokenText) => {
        const sents = sentencesRef.current;
        const idx = currentIndexRef.current;
        const target = sents[idx]?.spanish;
        if (!target) return;
        const result = calculateMatch(target, spokenText);
        setScore(result.score); setWordResults(result.wordResults); setShowResult(true);
        setHistory(prev => [{
            id: Date.now(), target, chinese: sents[idx]?.chinese || '', transcript: spokenText,
            score: result.score, matched: result.matched, total: result.total,
            wordResults: result.wordResults, timestamp: new Date().toLocaleString('zh-CN'), lessonId: lessonId || 'unknown'
        }, ...prev]);
    };

    // ==================== 录音控制 ====================

    const toggleListening = async () => {
        if (isListeningRef.current) {
            if (recognitionRef.current) try { recognitionRef.current.stop(); } catch {}
            if (timeoutRef.current) { clearTimeout(timeoutRef.current); timeoutRef.current = null; }
            setIsListening(false); isListeningRef.current = false;
            return;
        }

        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { setError('浏览器不支持语音识别，请使用 Chrome 或 Edge'); setShowManualInput(true); return; }

        // Abort lingering instance
        if (recognitionRef.current) try { recognitionRef.current.abort(); } catch {}

        setError(null); setTranscript(''); setScore(null); setWordResults([]); setShowResult(false); setManualText('');
        gotResultRef.current = false; interimRef.current = '';

        const recognition = createRecognition();
        if (!recognition) return;
        recognitionRef.current = recognition;

        try {
            recognition.start();
            setIsListening(true); isListeningRef.current = true;
            timeoutRef.current = setTimeout(() => {
                if (isListeningRef.current && recognitionRef.current) try { recognitionRef.current.stop(); } catch {}
            }, 15000);
        } catch (e) {
            console.error('Start failed:', e);
            setIsListening(false); isListeningRef.current = false;
            setError('启动语音识别失败: ' + e.message);
            setShowManualInput(true);
        }
    };

    const handleManualSubmit = () => {
        const text = manualText.trim();
        if (!text) return;
        setError(null); setTranscript(text); processResult(text); setManualText('');
    };

    // ==================== 句子管理 ====================

    const generateNewSentences = async () => {
        if (!vocab || vocab.length === 0) return;
        setLoading(true); setError(null);
        try {
            const questions = await generateTranslationQuestions(vocab, 8, 'zh-es', previousKnowledge);
            const ns = questions.map(q => ({ spanish: q.a, chinese: q.q, source: 'ai' }));
            if (ns.length > 0) { setSentences(ns); setCurrentIndex(0); resetCurrentState(); }
        } catch (err) { setError('生成句子失败'); console.error(err); }
        finally { setLoading(false); }
    };

    const handleNext = () => { if (currentIndex < sentences.length - 1) { setCurrentIndex(i => i + 1); resetCurrentState(); } };
    const handlePrev = () => { if (currentIndex > 0) { setCurrentIndex(i => i - 1); resetCurrentState(); } };
    const clearHistory = () => { setHistory([]); localStorage.removeItem(STORAGE_KEY); };

    // ==================== 统计 ====================

    const totalAttempts = history.length;
    const avgScore = totalAttempts > 0 ? Math.round(history.reduce((s, h) => s + h.score, 0) / totalAttempts) : 0;
    const bestScore = totalAttempts > 0 ? Math.max(...history.map(h => h.score)) : 0;

    // ==================== 诊断面板 ====================

    function DiagnosticsPanel() {
        if (!diag) return null;
        const checks = [
            { label: 'HTTPS / localhost', ok: diag.isSecure, detail: `${diag.protocol}//${diag.hostname}` },
            { label: '浏览器', ok: diag.browser === 'Chrome' || diag.browser === 'Edge', detail: diag.browser },
            { label: 'SpeechRecognition API', ok: diag.hasSpeechRecognition, detail: diag.hasSpeechRecognition ? '可用' : '不可用' },
            { label: 'getUserMedia (麦克风)', ok: diag.hasGetUserMedia, detail: diag.hasGetUserMedia ? '可用' : '不可用' },
            { label: 'SpeechSynthesis (TTS)', ok: diag.hasSpeechSynthesis, detail: diag.hasSpeechSynthesis ? '可用' : '不可用' },
        ];
        return (
            <div className="bg-white p-5 rounded-2xl shadow-lg border border-slate-100 mb-6">
                <h4 className="font-bold text-slate-700 mb-3 flex items-center gap-2">
                    <Settings size={16} /> 环境诊断
                </h4>
                <div className="space-y-2">
                    {checks.map((c, i) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                            <span className="text-slate-600">{c.label}</span>
                            <span className={c.ok ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                                {c.ok ? '✓ ' : '✗ '}{c.detail}
                            </span>
                        </div>
                    ))}
                </div>
                {!diag.isSecure && (
                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-xs">
                        <strong>关键问题：</strong>页面不是通过 HTTPS 或 localhost 访问的。Chrome 的语音识别 API 要求安全连接。
                        <br /><strong>解决方法：</strong>用 <code>npm run dev</code> 启动后访问 <code>http://localhost:5173</code>（不是 IP 地址）
                    </div>
                )}
            </div>
        );
    }

    // ==================== 历史记录 ====================

    function HistorySection() {
        if (totalAttempts === 0) return null;
        return (
            <div className="mt-8 border-t border-slate-200 pt-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <History size={20} className="text-spanish-red" /> 练习记录
                    </h3>
                    <div className="flex items-center gap-2">
                        <button onClick={() => setShowHistory(!showHistory)} className="text-sm text-slate-500 hover:text-slate-700 font-medium">
                            {showHistory ? '收起' : `展开 (${totalAttempts}条)`}
                        </button>
                        <button onClick={clearHistory} className="text-sm text-red-400 hover:text-red-600 font-medium flex items-center gap-1">
                            <Trash2 size={14} /> 清空
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                        <div className="text-2xl font-black text-slate-800">{totalAttempts}</div>
                        <div className="text-xs text-slate-500 font-medium">总练习次数</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                        <div className={`text-2xl font-black ${avgScore >= 80 ? 'text-green-600' : avgScore >= 50 ? 'text-orange-600' : 'text-red-600'}`}>{avgScore}</div>
                        <div className="text-xs text-slate-500 font-medium">平均分</div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
                        <div className="text-2xl font-black text-green-600">{bestScore}</div>
                        <div className="text-xs text-slate-500 font-medium">最高分</div>
                    </div>
                </div>
                {showHistory && (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {history.slice(0, 20).map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs text-slate-400">{item.timestamp}</span>
                                    <span className={`text-lg font-black ${item.score >= 80 ? 'text-green-600' : item.score >= 50 ? 'text-orange-600' : 'text-red-600'}`}>{item.score}分</span>
                                </div>
                                {item.chinese && <p className="text-xs text-slate-500 mb-1">{item.chinese}</p>}
                                <p className="text-sm font-bold text-slate-700 mb-1">{item.target}</p>
                                <p className="text-xs text-slate-500 mb-2">识别: {item.transcript}</p>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className={`h-full rounded-full ${item.score >= 80 ? 'bg-green-500' : item.score >= 50 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${item.score}%` }} />
                                    </div>
                                    <span className="text-xs text-slate-400 shrink-0">{item.matched}/{item.total} 词</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // ==================== 渲染 ====================

    if (sentences.length === 0) {
        return (
            <div className="max-w-3xl mx-auto mt-8">
                <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-4">
                    <p className="mb-4">暂无练习句子</p>
                    <button onClick={generateNewSentences} disabled={loading} className="px-6 py-2 bg-spanish-red text-white rounded-lg font-bold hover:bg-red-700 flex items-center gap-2 disabled:opacity-50">
                        {loading ? <Loader2 className="animate-spin" /> : <RefreshCw size={18} />} AI生成句子
                    </button>
                </div>
                <DiagnosticsPanel />
                <HistorySection />
            </div>
        );
    }

    const currentSentence = sentences[currentIndex];

    return (
        <div className="max-w-3xl mx-auto mt-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Mic className="text-spanish-red" /> 口语练习
                </h2>
                <div className="flex items-center gap-3">
                    <button onClick={() => setShowDiagnostics(!showDiagnostics)} className="text-sm text-slate-400 hover:text-slate-600" title="环境诊断">
                        <Settings size={16} />
                    </button>
                    <button onClick={generateNewSentences} disabled={loading} className="text-sm font-bold text-spanish-red bg-red-50 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors flex items-center gap-1 disabled:opacity-50">
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />} AI生成新句
                    </button>
                    <span className="text-sm font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                        {currentIndex + 1} / {sentences.length}
                    </span>
                </div>
            </div>

            {/* Diagnostics */}
            {showDiagnostics && <DiagnosticsPanel />}

            {/* Target Sentence */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 mb-6">
                {currentSentence.chinese && <p className="text-sm text-slate-500 mb-2">{currentSentence.chinese}</p>}
                <div className="flex items-center gap-4 mb-4">
                    <h3 className="text-2xl font-bold text-slate-800 flex-1">{currentSentence.spanish}</h3>
                    <button onClick={() => speak(currentSentence.spanish)} className="p-3 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors text-slate-600" title="播放语音">
                        <Volume2 size={22} />
                    </button>
                </div>
                <p className="text-xs text-slate-400">点击喇叭听发音，然后点击麦克风录音跟读</p>
            </div>

            {/* Microphone */}
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 mb-6 flex flex-col items-center">
                <button
                    onClick={toggleListening}
                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all shadow-lg ${isListening ? 'bg-red-500 text-white shadow-red-200 scale-110 animate-pulse' : 'bg-spanish-red text-white shadow-red-200 hover:bg-red-700 hover:scale-105'}`}
                >
                    <Mic size={36} />
                </button>
                <p className="mt-4 text-sm font-medium text-slate-500">
                    {isListening ? '正在录音... 说完后自动识别' : '点击麦克风开始录音'}
                </p>
                {isListening && transcript && (
                    <p className="mt-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">识别中: {transcript}</p>
                )}
                {isListening && !transcript && (
                    <div className="mt-2 flex gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                )}
            </div>

            {/* Manual Input */}
            {showManualInput && !showResult && (
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 mb-6">
                    <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">手动输入</p>
                    <div className="flex gap-3">
                        <input type="text" value={manualText} onChange={(e) => setManualText(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleManualSubmit(); }}
                            placeholder="输入你说的西班牙语句子..."
                            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:border-spanish-red focus:ring-2 focus:ring-red-100" />
                        <button onClick={handleManualSubmit} disabled={!manualText.trim()} className="px-6 py-3 bg-spanish-red text-white rounded-xl font-bold hover:bg-red-700 disabled:opacity-50">
                            提交评分
                        </button>
                    </div>
                </div>
            )}

            {/* Error */}
            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <div>
                        <p>{error}</p>
                        <button onClick={() => setShowManualInput(true)} className="text-xs text-red-500 underline mt-1">使用手动输入</button>
                        <button onClick={() => setShowDiagnostics(true)} className="text-xs text-red-500 underline mt-1 ml-3">查看环境诊断</button>
                    </div>
                </div>
            )}

            {/* Result */}
            {showResult && (
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 mb-6">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-bold text-slate-700 text-lg">评分结果</h4>
                        <span className={`text-3xl font-black ${score >= 80 ? 'text-green-600' : score >= 50 ? 'text-orange-600' : 'text-red-600'}`}>{score}分</span>
                    </div>
                    <div className="mb-6">
                        <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-700 ease-out ${score >= 80 ? 'bg-green-500' : score >= 50 ? 'bg-orange-500' : 'bg-red-500'}`} style={{ width: `${score}%` }} />
                        </div>
                    </div>
                    <div className="mb-6 bg-slate-50 rounded-xl p-5">
                        <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">评分计算</p>
                        <div className="flex items-center justify-center gap-3 text-center flex-wrap">
                            <div className="bg-green-100 rounded-lg px-4 py-2">
                                <div className="text-2xl font-black text-green-700">{wordResults.filter(r => r.matched).length}</div>
                                <div className="text-xs text-green-600 font-medium">命中词数</div>
                            </div>
                            <div className="text-2xl text-slate-300 font-bold">&divide;</div>
                            <div className="bg-blue-100 rounded-lg px-4 py-2">
                                <div className="text-2xl font-black text-blue-700">{wordResults.length}</div>
                                <div className="text-xs text-blue-600 font-medium">目标总词数</div>
                            </div>
                            <div className="text-2xl text-slate-300 font-bold">&times; 100 =</div>
                            <div className={`rounded-lg px-4 py-2 ${score >= 80 ? 'bg-green-100' : score >= 50 ? 'bg-orange-100' : 'bg-red-100'}`}>
                                <div className={`text-2xl font-black ${score >= 80 ? 'text-green-700' : score >= 50 ? 'text-orange-700' : 'text-red-700'}`}>{score}</div>
                                <div className={`text-xs font-medium ${score >= 80 ? 'text-green-600' : score >= 50 ? 'text-orange-600' : 'text-red-600'}`}>最终得分</div>
                            </div>
                        </div>
                    </div>
                    <div className="mb-6">
                        <p className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">识别结果</p>
                        <p className="text-slate-700 bg-slate-50 p-4 rounded-xl text-lg font-medium">&ldquo;{transcript}&rdquo;</p>
                    </div>
                    <div className="mb-6">
                        <p className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">逐词对比</p>
                        <div className="flex flex-wrap gap-2">
                            {wordResults.map((wr, idx) => (
                                <span key={idx} className={`px-3 py-1.5 rounded-lg text-sm font-bold border-2 ${wr.matched ? 'border-green-300 bg-green-50 text-green-700' : 'border-red-300 bg-red-50 text-red-700'}`}>
                                    {wr.matched ? <CheckCircle2 size={12} className="inline mr-1" /> : <XCircle size={12} className="inline mr-1" />}
                                    {wr.word}
                                </span>
                            ))}
                        </div>
                        <div className="mt-3 flex gap-4 text-xs text-slate-500">
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-200 border border-green-300 inline-block"></span>命中 {wordResults.filter(r => r.matched).length} 词</span>
                            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-red-200 border border-red-300 inline-block"></span>未命中 {wordResults.filter(r => !r.matched).length} 词</span>
                        </div>
                    </div>
                    <div className={`p-4 rounded-xl text-sm font-medium ${score >= 80 ? 'bg-green-50 text-green-800' : score >= 50 ? 'bg-orange-50 text-orange-800' : 'bg-red-50 text-red-800'}`}>
                        {score >= 80 ? '很好！发音准确，继续保持！' : score >= 50 ? '不错，但部分词汇需要多练习。点击喇叭再听一遍。' : '加油！多听几遍再试试，注意每个词的发音。'}
                    </div>
                </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center mb-8">
                <button onClick={handlePrev} disabled={currentIndex === 0} className="px-6 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl disabled:opacity-30 flex items-center gap-2">
                    <ChevronLeft size={20} /> 上一句
                </button>
                <button onClick={() => speak(currentSentence.spanish)} className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 flex items-center gap-2">
                    <Volume2 size={18} /> 再听一遍
                </button>
                <button onClick={handleNext} disabled={currentIndex >= sentences.length - 1} className="px-6 py-3 bg-spanish-red text-white rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2">
                    下一句 <ChevronRight size={20} />
                </button>
            </div>

            <HistorySection />
        </div>
    );
}
