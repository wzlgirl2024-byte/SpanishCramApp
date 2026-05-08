import { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuizMode({ vocabList }) {
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [streak, setStreak] = useState(0);

    const generateQuestion = () => {
        if (vocabList.length < 4) return;

        const targetIndex = Math.floor(Math.random() * vocabList.length);
        const target = vocabList[targetIndex];

        // Generate distractors
        const distractors = [];
        while (distractors.length < 3) {
            const dIndex = Math.floor(Math.random() * vocabList.length);
            if (dIndex !== targetIndex && !distractors.includes(vocabList[dIndex])) {
                distractors.push(vocabList[dIndex]);
            }
        }

        const allOptions = [...distractors, target].sort(() => Math.random() - 0.5);

        setCurrentQuestion(target);
        setOptions(allOptions);
        setSelectedOption(null);
        setIsCorrect(null);
    };

    useEffect(() => {
        if (vocabList.length >= 4 && !currentQuestion) {
            generateQuestion();
        }
    }, [vocabList]);

    const handleSelect = (option) => {
        if (selectedOption) return; // Prevent multiple clicks
        setSelectedOption(option);

        const correct = option.id === currentQuestion.id;
        setIsCorrect(correct);

        if (correct) {
            setStreak(s => s + 1);
            setTimeout(generateQuestion, 1500);
        } else {
            setStreak(0);
        }
    };

    if (vocabList.length < 4) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 p-8 text-center bg-white rounded-xl border border-slate-200">
                <RefreshCw size={48} className="mb-4 opacity-20" />
                <p>至少需要录入 4 个单词才能开始测验</p>
                <p className="text-sm mt-2">当前: {vocabList.length}</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-700">单词突击</h3>
                <div className="text-sm font-medium text-spanish-red">
                    连对: {streak}
                </div>
            </div>

            {/* Question Area */}
            <div className="flex-1 p-6 flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestion?.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-md"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-4xl font-bold text-slate-800 mb-2">
                                {currentQuestion?.spanish}
                            </h2>
                            <p className="text-slate-400 text-sm">选择正确的中文释义</p>
                        </div>

                        <div className="space-y-3">
                            {options.map((option) => {
                                let stateClass = "border-slate-200 hover:border-spanish-yellow hover:bg-yellow-50";
                                if (selectedOption) {
                                    if (option.id === currentQuestion.id) {
                                        stateClass = "border-green-500 bg-green-50 text-green-700";
                                    } else if (option === selectedOption) {
                                        stateClass = "border-red-500 bg-red-50 text-red-700";
                                    } else {
                                        stateClass = "border-slate-100 opacity-50";
                                    }
                                }

                                return (
                                    <button
                                        key={option.id}
                                        onClick={() => handleSelect(option)}
                                        disabled={!!selectedOption}
                                        className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 font-medium ${stateClass}`}
                                    >
                                        <div className="flex items-center justify-between">
                                            {option.chinese}
                                            {selectedOption && option.id === currentQuestion.id && (
                                                <CheckCircle size={20} className="text-green-500" />
                                            )}
                                            {selectedOption && option === selectedOption && option.id !== currentQuestion.id && (
                                                <XCircle size={20} className="text-red-500" />
                                            )}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 text-center">
                <button
                    onClick={generateQuestion}
                    className="text-slate-400 hover:text-slate-600 text-sm flex items-center justify-center gap-2 mx-auto"
                >
                    <RefreshCw size={14} />
                    跳过此题
                </button>
            </div>
        </div>
    );
}
