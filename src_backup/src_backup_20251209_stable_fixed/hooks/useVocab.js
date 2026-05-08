import { useState, useEffect } from 'react';

const STORAGE_KEY = 'spanish_cram_vocab';

export function useVocab() {
    const [vocabList, setVocabList] = useState([]);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setVocabList(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse vocab", e);
            }
        }
    }, []);

    const addWord = (spanish, chinese) => {
        const newWord = {
            id: Date.now().toString(),
            spanish: spanish.trim(),
            chinese: chinese.trim(),
            lesson: 'Custom', // Default to custom for now
            mastered: false,
            createdAt: new Date().toISOString(),
        };

        const updated = [newWord, ...vocabList];
        setVocabList(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return newWord;
    };

    const deleteWord = (id) => {
        const updated = vocabList.filter(w => w.id !== id);
        setVocabList(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    const toggleMastered = (id) => {
        const updated = vocabList.map(w =>
            w.id === id ? { ...w, mastered: !w.mastered } : w
        );
        setVocabList(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    };

    return { vocabList, addWord, deleteWord, toggleMastered };
}
