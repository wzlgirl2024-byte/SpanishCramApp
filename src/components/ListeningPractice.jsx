import { useState, useEffect, useCallback, useRef } from 'react';
import { Headphones, Play, Pause, RotateCcw, Volume2, Loader2, RefreshCw, CheckCircle2, XCircle, HelpCircle, Eye, EyeOff } from 'lucide-react';
import { generateListeningExercise } from '../utils/mimoAPI';

/**
 * 听力练习组件
 * 使用浏览器TTS朗读对话，区分男女性别声音，模拟DELE A1/A2考试语速
 * 配套一道四选一听力理解选择题
 */
export default function ListeningPractice({ vocab, grammarTitle, lessonTitle, lessonId, previousKnowledge }) {
    const [exercise, setExercise] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // 播放状态
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentLine, setCurrentLine] = useState(-1);
    const [hasPlayed, setHasPlayed] = useState(false);

    // 字幕开关（默认关闭，先盲听）
    const [showSubtitles, setShowSubtitles] = useState(false);

    // 答题状态
    const [selectedOption, setSelectedOption] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [showExplanation, setShowExplanation] = useState(false);

    // 语音列表（浏览器加载异步）
    const [voices, setVoices] = useState([]);

    const synthRef = useRef(window.speechSynthesis);
    const isPlayingRef = useRef(false);
    const timeoutIdsRef = useRef([]); // 追踪所有 setTimeout，以便清除

    // 加载浏览器语音列表
    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = synthRef.current.getVoices();
            if (availableVoices.length > 0) {
                setVoices(availableVoices);
            }
        };

        loadVoices();
        synthRef.current.onvoiceschanged = loadVoices;

        return () => {
            synthRef.current.cancel();
            synthRef.current.onvoiceschanged = null;
        };
    }, []);

    // 获取西班牙语语音（区分性别）
    const getSpanishVoice = useCallback((gender) => {
        const spanishVoices = voices.filter(v =>
            v.lang.startsWith('es') || v.lang.includes('Spanish')
        );

        if (spanishVoices.length === 0) return null;

        const genderKeywords = {
            male: ['male', 'hombre', 'jorge', 'diego', 'carlos', 'pablo', 'juan', 'man'],
            female: ['female', 'mujer', 'ana', 'maria', 'elena', 'lucia', 'paula', 'woman', 'girl']
        };

        const keywords = genderKeywords[gender] || genderKeywords.male;

        for (const voice of spanishVoices) {
            const nameLower = voice.name.toLowerCase();
            for (const kw of keywords) {
                if (nameLower.includes(kw)) return voice;
            }
        }

        if (spanishVoices.length === 1) return spanishVoices[0];

        return gender === 'female'
            ? spanishVoices[0]
            : (spanishVoices[1] || spanishVoices[0]);
    }, [voices]);

    // 停止当前朗读（清除 synth 队列 + 所有待执行的 setTimeout）
    const stopSpeaking = useCallback(() => {
        synthRef.current.cancel();
        // 清除所有排队中的 setTimeout，防止旧回调在新题目后仍然触发
        timeoutIdsRef.current.forEach(id => clearTimeout(id));
        timeoutIdsRef.current = [];
        isPlayingRef.current = false;
        setIsPlaying(false);
        setCurrentLine(-1);
    }, []);

    // 朗读整段对话
    const playDialogue = useCallback(() => {
        if (!exercise || !exercise.dialogue) return;

        stopSpeaking();
        isPlayingRef.current = true;
        setIsPlaying(true);
        setHasPlayed(true);
        setCurrentLine(0);

        // 逐句朗读，每句之间加停顿
        let delay = 300;

        exercise.dialogue.forEach((line, index) => {
            const speaker = exercise.speakers[line.speaker];
            const gender = speaker?.gender || 'male';
            const voice = getSpanishVoice(gender);

            const utterance = new SpeechSynthesisUtterance(line.text);
            utterance.lang = 'es-ES';
            utterance.rate = 0.82;
            utterance.pitch = gender === 'female' ? 1.2 : 0.85;

            if (voice) utterance.voice = voice;

            utterance.onstart = () => {
                if (isPlayingRef.current) setCurrentLine(index);
            };

            utterance.onend = () => {
                if (index === exercise.dialogue.length - 1) {
                    const tid = setTimeout(() => {
                        isPlayingRef.current = false;
                        setIsPlaying(false);
                        setCurrentLine(-1);
                    }, 500);
                    timeoutIdsRef.current.push(tid);
                }
            };

            utterance.onerror = () => {
                if (index === exercise.dialogue.length - 1) {
                    isPlayingRef.current = false;
                    setIsPlaying(false);
                    setCurrentLine(-1);
                }
            };

            const tid = setTimeout(() => {
                if (isPlayingRef.current) {
                    synthRef.current.speak(utterance);
                }
            }, delay);
            timeoutIdsRef.current.push(tid);

            delay += (line.text.length * 80) + 1200;
        });

    }, [exercise, getSpanishVoice, stopSpeaking]);

    // 重新播放
    const replay = useCallback(() => {
        stopSpeaking();
        const tid = setTimeout(() => playDialogue(), 200);
        timeoutIdsRef.current.push(tid);
    }, [stopSpeaking, playDialogue]);

    // 生成新题目
    const generateNew = useCallback(async () => {
        stopSpeaking();
        setLoading(true);
        setError(null);
        // 保留当前 exercise，生成成功后再替换，失败则保留旧的
        setSelectedOption(null);
        setIsSubmitted(false);
        setShowExplanation(false);
        setHasPlayed(false);
        setShowSubtitles(false);

        try {
            const grammarTopic = grammarTitle ? { title: grammarTitle, content: '' } : null;
            const result = await generateListeningExercise(vocab, grammarTopic, previousKnowledge, lessonTitle);
            setExercise(result);
            setSelectedOption(null);
            setIsSubmitted(false);
        } catch (err) {
            // 如果之前有题目，保留它，只显示小提示
            if (exercise) {
                setError(null); // 不覆盖整个页面
                alert('生成新对话失败：' + (err.message || '请重试'));
            } else {
                setError(err.message || '生成听力练习失败，请重试');
            }
        } finally {
            setLoading(false);
        }
    }, [vocab, grammarTitle, previousKnowledge, lessonTitle, stopSpeaking]);

    // 初次加载自动生成；切换课程时清理
    useEffect(() => {
        if (vocab && vocab.length > 0) {
            generateNew();
        }
        return () => stopSpeaking();
    }, [lessonId]); // eslint-disable-line react-hooks/exhaustive-deps

    // 组件卸载时彻底清理
    useEffect(() => {
        return () => {
            synthRef.current.cancel();
            timeoutIdsRef.current.forEach(id => clearTimeout(id));
            timeoutIdsRef.current = [];
        };
    }, []);

    // 提交答案
    const handleSubmit = () => {
        if (selectedOption === null) return;
        setIsSubmitted(true);
        setShowExplanation(true);
    };

    // 获取西班牙语语音数量
    const spanishVoiceCount = voices.filter(v =>
        v.lang.startsWith('es') || v.lang.includes('Spanish')
    ).length;

    // ========== 渲染 ==========

    // 初次加载（无题目且正在加载）
    if (loading && !exercise) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
                <Loader2 size={40} className="text-spanish-red animate-spin" />
                <p className="text-slate-500 font-medium">正在生成听力材料...</p>
                <p className="text-slate-400 text-sm">AI正在根据本课内容创作对话</p>
            </div>
        );
    }

    // 完全失败（无题目且有错误）
    if (error && !exercise) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-2">
                    <Headphones size={32} className="text-red-400" />
                </div>
                <p className="text-red-500 font-medium">{error}</p>
                <button
                    onClick={generateNew}
                    className="px-5 py-2.5 bg-spanish-red text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center gap-2"
                >
                    <RefreshCw size={16} />
                    重新生成
                </button>
            </div>
        );
    }

    if (!exercise) return null;

    const correctAnswer = exercise.question?.answer;
    const isCorrect = selectedOption === correctAnswer;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* 标题区 */}
            <div className="text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-3">
                    <Headphones size={18} className="text-blue-600" />
                    <span className="text-blue-700 font-bold text-sm">听力练习 · Listening</span>
                </div>
                <h2 className="text-xl font-bold text-slate-800">{exercise.title}</h2>
                <p className="text-sm text-slate-500 mt-1">
                    说话者：
                    {exercise.speakers?.map((s, i) => (
                        <span key={i} className="mx-1">
                            <span className={`inline-block w-2 h-2 rounded-full mr-1 ${s.gender === 'female' ? 'bg-pink-400' : 'bg-blue-400'}`}></span>
                            <span className="font-medium">{s.name}</span>
                            <span className="text-slate-400 text-xs ml-0.5">
                                ({s.gender === 'female' ? '女' : '男'})
                            </span>
                        </span>
                    ))}
                </p>
            </div>

            {/* 播放控制区 */}
            <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200">
                <div className="flex items-center justify-center gap-3 mb-5">
                    {/* 播放/暂停 */}
                    <button
                        onClick={isPlaying ? stopSpeaking : playDialogue}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${isPlaying
                            ? 'bg-slate-600 hover:bg-slate-700 text-white'
                            : 'bg-gradient-to-br from-spanish-red to-red-600 hover:from-red-700 hover:to-red-700 text-white'
                            }`}
                        title={isPlaying ? '暂停' : '播放听力'}
                    >
                        {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                    </button>

                    {/* 重新播放 */}
                    <button
                        onClick={replay}
                        disabled={isPlaying}
                        className="w-10 h-10 rounded-full bg-white border border-slate-300 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        title="重新播放"
                    >
                        <RotateCcw size={18} />
                    </button>

                    {/* 字幕开关 */}
                    <button
                        onClick={() => setShowSubtitles(prev => !prev)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all ${showSubtitles
                            ? 'bg-amber-50 border-amber-300 text-amber-700 hover:bg-amber-100'
                            : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
                            }`}
                        title={showSubtitles ? '关闭字幕（盲听模式）' : '开启字幕'}
                    >
                        {showSubtitles ? <Eye size={16} /> : <EyeOff size={16} />}
                        {showSubtitles ? '字幕: 开' : '字幕: 关'}
                    </button>

                    {/* 语速标签 */}
                    <div className="flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-1.5 rounded-full border border-slate-200">
                        <Volume2 size={14} />
                        <span>DELE A1/A2</span>
                    </div>
                </div>

                {/* 未播放提示 */}
                {!hasPlayed && (
                    <div className="text-center py-4">
                        <p className="text-slate-500 text-sm animate-pulse">
                            👆 点击播放按钮，仔细听对话内容
                        </p>
                        <p className="text-slate-400 text-xs mt-1">
                            默认关闭字幕，锻炼纯听力能力
                        </p>
                    </div>
                )}

                {/* 对话内容 */}
                {hasPlayed && (
                    <div className="space-y-2 mt-2">
                        {exercise.dialogue?.map((line, index) => {
                            const speaker = exercise.speakers[line.speaker];
                            const isFemale = speaker?.gender === 'female';
                            const isCurrentLine = currentLine === index;

                            return (
                                <div
                                    key={index}
                                    className={`flex items-start gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isCurrentLine
                                        ? 'bg-white shadow-md border-2 border-spanish-yellow scale-[1.01]'
                                        : 'bg-white/60 border border-transparent'
                                        }`}
                                >
                                    {/* 说话者头像 */}
                                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${isFemale ? 'bg-pink-400' : 'bg-blue-500'
                                        }`}>
                                        {speaker?.name?.[0] || '?'}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className={`text-xs font-bold ${isFemale ? 'text-pink-600' : 'text-blue-600'
                                                }`}>
                                                {speaker?.name}
                                            </span>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isFemale ? 'bg-pink-50 text-pink-500' : 'bg-blue-50 text-blue-500'
                                                }`}>
                                                {isFemale ? '♀ 女' : '♂ 男'}
                                            </span>
                                            {isCurrentLine && (
                                                <span className="text-[10px] text-spanish-yellow font-bold animate-pulse">
                                                    ● 正在朗读
                                                </span>
                                            )}
                                        </div>
                                        {/* 字幕内容：根据开关决定是否显示 */}
                                        {showSubtitles ? (
                                            <p className={`text-base leading-relaxed ${isCurrentLine ? 'text-slate-900 font-semibold' : 'text-slate-700'
                                                }`}>
                                                {line.text}
                                            </p>
                                        ) : (
                                            <p className="text-base leading-relaxed text-slate-300 select-none tracking-widest">
                                                · · · · · · · ·
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 听力理解题 */}
            {exercise.question && (
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-slate-200">
                        <div className="flex items-center gap-2">
                            <HelpCircle size={18} className="text-blue-600" />
                            <h3 className="font-bold text-slate-800">听力理解题</h3>
                        </div>
                        <p className="text-slate-700 mt-2 text-base leading-relaxed">
                            {exercise.question.question}
                        </p>
                    </div>

                    <div className="p-6 space-y-3">
                        {exercise.question.options.map((option, index) => {
                            let optionStyle = 'bg-slate-50 border-slate-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer';

                            if (isSubmitted) {
                                if (index === correctAnswer) {
                                    optionStyle = 'bg-green-50 border-green-400 text-green-800';
                                } else if (index === selectedOption && !isCorrect) {
                                    optionStyle = 'bg-red-50 border-red-400 text-red-800';
                                } else {
                                    optionStyle = 'bg-slate-50 border-slate-200 text-slate-400';
                                }
                            } else if (selectedOption === index) {
                                optionStyle = 'bg-blue-50 border-blue-400 ring-2 ring-blue-200 cursor-pointer';
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={() => !isSubmitted && setSelectedOption(index)}
                                    disabled={isSubmitted}
                                    className={`w-full text-left px-5 py-3.5 rounded-xl border-2 transition-all flex items-center gap-3 ${optionStyle}`}
                                >
                                    <span className={`shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold ${isSubmitted && index === correctAnswer
                                        ? 'border-green-500 bg-green-500 text-white'
                                        : isSubmitted && index === selectedOption && !isCorrect
                                            ? 'border-red-500 bg-red-500 text-white'
                                            : selectedOption === index
                                                ? 'border-blue-500 bg-blue-500 text-white'
                                                : 'border-slate-300 text-slate-500'
                                        }`}>
                                        {isSubmitted && index === correctAnswer ? (
                                            <CheckCircle2 size={14} />
                                        ) : isSubmitted && index === selectedOption && !isCorrect ? (
                                            <XCircle size={14} />
                                        ) : (
                                            String.fromCharCode(65 + index)
                                        )}
                                    </span>
                                    <span className="text-sm">{option}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* 提交/结果区 */}
                    <div className="px-6 pb-6">
                        {!isSubmitted ? (
                            <button
                                onClick={handleSubmit}
                                disabled={selectedOption === null}
                                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                提交答案
                            </button>
                        ) : (
                            <div className={`p-4 rounded-xl ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    {isCorrect ? (
                                        <CheckCircle2 size={20} className="text-green-600" />
                                    ) : (
                                        <XCircle size={20} className="text-red-600" />
                                    )}
                                    <span className={`font-bold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                        {isCorrect ? '回答正确！🎉' : '回答错误'}
                                    </span>
                                </div>
                                {showExplanation && exercise.question.explanation && (
                                    <p className="text-sm text-slate-600 leading-relaxed mt-1">
                                        💡 {exercise.question.explanation}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* 底部操作栏 */}
            <div className="flex items-center justify-between pt-2 pb-4">
                <div className="text-xs text-slate-400">
                    {loading
                        ? '⏳ 正在生成新对话...'
                        : spanishVoiceCount > 0
                            ? `已加载 ${spanishVoiceCount} 个西班牙语语音`
                            : '未检测到西班牙语语音，使用默认语音'
                    }
                </div>
                <button
                    onClick={generateNew}
                    disabled={loading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                    {loading ? '生成中...' : '换一段对话'}
                </button>
            </div>
        </div>
    );
}
