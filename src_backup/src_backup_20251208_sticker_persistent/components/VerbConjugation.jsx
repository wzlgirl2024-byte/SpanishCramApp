import { useState, useMemo } from 'react';
import { ListChecks, Eye, EyeOff, PlayCircle, CheckCircle2, XCircle, RotateCcw, Sparkles } from 'lucide-react';

export default function VerbConjugation({ verbs, lessonId, smartVerbs, previousKnowledge }) {
    const [mode, setMode] = useState('study'); // 'study' or 'test'
    const [hiddenCells, setHiddenCells] = useState({}); // { verbIndex-person: boolean }
    const [userInputs, setUserInputs] = useState({}); // { verbIndex-person: string }
    const [results, setResults] = useState({}); // { verbIndex-person: boolean }
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Merge static verbs with smart verbs, removing duplicates
    const allVerbs = useMemo(() => {
        const merged = [...verbs];

        if (smartVerbs) {
            smartVerbs.forEach(sv => {
                // 1. Check if already in current lesson's static verbs
                const inCurrent = merged.find(v => v.infinitive.toLowerCase() === sv.infinitive.toLowerCase());

                // 2. Check if already in previous lessons (if previousKnowledge is provided)
                const inPrevious = previousKnowledge?.verbs?.find(v => v.infinitive.toLowerCase() === sv.infinitive.toLowerCase());

                if (!inCurrent && !inPrevious) {
                    merged.push(sv);
                }
            });
        }
        return merged;
    }, [verbs, smartVerbs, previousKnowledge]);

    const persons = ['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos'];
    const personLabels = {
        yo: '我',
        tú: '你',
        él: '他/她/您',
        nosotros: '我们',
        vosotros: '你们',
        ellos: '他们/您们'
    };

    const toggleCellVisibility = (verbIdx, person) => {
        const key = `${verbIdx}-${person}`;
        setHiddenCells(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleInputChange = (verbIdx, person, value) => {
        const key = `${verbIdx}-${person}`;
        setUserInputs(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleKeyDown = (verbIdx, person, e) => {
        if (isSubmitted) return;
        const personIndex = persons.indexOf(person);
        let nextVerbIdx = verbIdx;
        let nextPersonIndex = personIndex;

        if (e.key === 'Enter' || e.key === 'ArrowDown') {
            // Move to next person
            nextPersonIndex++;
            if (nextPersonIndex >= persons.length) {
                nextPersonIndex = 0;
                nextVerbIdx++;
                if (nextVerbIdx >= allVerbs.length) {
                    nextVerbIdx = 0; // wrap around
                }
            }
            e.preventDefault();
        } else if (e.key === 'ArrowUp') {
            // Move to previous person
            nextPersonIndex--;
            if (nextPersonIndex < 0) {
                nextPersonIndex = persons.length - 1;
                nextVerbIdx--;
                if (nextVerbIdx < 0) {
                    nextVerbIdx = allVerbs.length - 1; // wrap around
                }
            }
            e.preventDefault();
        } else {
            return;
        }

        const nextPerson = persons[nextPersonIndex];
        const nextId = `input-${nextVerbIdx}-${nextPerson}`;
        const nextInput = document.getElementById(nextId);
        if (nextInput) {
            nextInput.focus();
            nextInput.select();
        }
    };

    const checkAnswers = () => {
        const newResults = {};
        allVerbs.forEach((verb, vIdx) => {
            persons.forEach(person => {
                const key = `${vIdx}-${person}`;
                const correct = verb.conjugation[person].toLowerCase();
                const user = (userInputs[key] || '').toLowerCase().trim();
                newResults[key] = user === correct;
            });
        });
        setResults(newResults);
        setIsSubmitted(true);
    };

    const resetTest = () => {
        setUserInputs({});
        setResults({});
        setIsSubmitted(false);
    };

    if (allVerbs.length === 0) {
        return <div className="p-8 text-center text-slate-500">本课暂无重点动词</div>;
    }

    return (
        <div className="max-w-5xl mx-auto mt-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <ListChecks className="text-spanish-red" />
                    动词变位表
                </h2>
                <div className="flex bg-white rounded-lg p-1 border border-slate-200 shadow-sm">
                    <button
                        onClick={() => setMode('study')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${mode === 'study'
                                ? 'bg-spanish-red text-white shadow-sm'
                                : 'text-slate-500 hover:bg-slate-50'
                            }`}
                    >
                        学习模式
                    </button>
                    <button
                        onClick={() => setMode('test')}
                        className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${mode === 'test'
                                ? 'bg-spanish-red text-white shadow-sm'
                                : 'text-slate-500 hover:bg-slate-50'
                            }`}
                    >
                        测试模式
                    </button>
                </div>
            </div>

            {smartVerbs && smartVerbs.length > 0 && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center gap-3 text-blue-800 text-sm">
                    <Sparkles size={18} />
                    <span>AI 已自动为您补充了本课出现的不规则动词。</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allVerbs.map((verb, idx) => (
                    <div key={idx} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-black text-slate-800">{verb.infinitive}</h3>
                                <p className="text-sm text-slate-500">{verb.meaning}</p>
                            </div>
                            {mode === 'study' && (
                                <button
                                    onClick={() => {
                                        const allHidden = persons.every(p => hiddenCells[`${idx}-${p}`]);
                                        const newHidden = {};
                                        persons.forEach(p => newHidden[`${idx}-${p}`] = !allHidden);
                                        setHiddenCells(prev => ({ ...prev, ...newHidden }));
                                    }}
                                    className="text-slate-400 hover:text-spanish-red transition-colors"
                                >
                                    {persons.every(p => hiddenCells[`${idx}-${p}`]) ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            )}
                        </div>

                        <div className="p-4 space-y-2">
                            {persons.map(person => {
                                const key = `${idx}-${person}`;
                                const isHidden = hiddenCells[key];
                                const isCorrect = results[key];
                                const userInput = userInputs[key] || '';

                                return (
                                    <div key={person} className="flex items-center justify-between text-sm">
                                        <span className="text-slate-400 font-medium w-16">{personLabels[person]}</span>

                                        {mode === 'study' ? (
                                            <div
                                                className="flex-1 text-right font-bold text-slate-700 cursor-pointer hover:bg-slate-50 p-1 rounded transition-colors select-none"
                                                onClick={() => toggleCellVisibility(idx, person)}
                                            >
                                                {isHidden ? (
                                                    <span className="text-slate-200">••••••</span>
                                                ) : (
                                                    verb.conjugation[person]
                                                )}
                                            </div>
                                        ) : (
                                            <div className="flex-1 relative">
                                                <input
                                                    id={`input-${idx}-${person}`}
                                                    type="text"
                                                    value={userInput}
                                                    onChange={(e) => handleInputChange(idx, person, e.target.value)}
                                                    onKeyDown={(e) => handleKeyDown(idx, person, e)}
                                                    disabled={isSubmitted}
                                                    className={`w-full text-right p-1 rounded border-b-2 outline-none transition-all font-bold ${isSubmitted
                                                            ? isCorrect
                                                                ? 'border-green-500 text-green-600 bg-green-50'
                                                                : 'border-red-500 text-red-600 bg-red-50'
                                                            : 'border-slate-200 focus:border-spanish-yellow'
                                                        }`}
                                                />
                                                {isSubmitted && !isCorrect && (
                                                    <div className="text-xs text-red-500 text-right mt-1">
                                                        {verb.conjugation[person]}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {mode === 'test' && (
                <div className="mt-8 flex justify-center">
                    {!isSubmitted ? (
                        <button
                            onClick={checkAnswers}
                            className="px-8 py-3 bg-spanish-red text-white rounded-xl font-bold shadow-lg shadow-red-200 hover:bg-red-700 hover:scale-105 transition-all flex items-center gap-2"
                        >
                            <CheckCircle2 size={20} /> 提交检查
                        </button>
                    ) : (
                        <button
                            onClick={resetTest}
                            className="px-8 py-3 bg-slate-800 text-white rounded-xl font-bold shadow-lg hover:bg-slate-700 hover:scale-105 transition-all flex items-center gap-2"
                        >
                            <RotateCcw size={20} /> 重置测试
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
