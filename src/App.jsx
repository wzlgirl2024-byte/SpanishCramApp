import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { BookOpen, GraduationCap, ArrowLeft, CheckCircle2, Brain, Languages, BookText, ListChecks, Settings, X, Mic } from 'lucide-react';
import { courseData } from './data/course_data';
import VocabDrill from './components/VocabDrill';
import GrammarQuiz from './components/GrammarQuiz';
import ReadingComp from './components/ReadingComp';
import TranslationTrainer from './components/TranslationTrainer';
import VerbConjugation from './components/VerbConjugation';
import ApiKeyManager from './components/ApiKeyManager';
import StudyNotes from './components/StudyNotes';
import TeachingAssistant from './components/TeachingAssistant';
import SpeakingPractice from './components/SpeakingPractice';
import { generateTranslationQuestions, generateGrammarQuiz, generateReadingComprehension, generateSmartContent } from './utils/deepseekAPI';

function App() {
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [activeTab, setActiveTab] = useState('vocab');
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(!!localStorage.getItem('deepseek_api_key'));
  const [apiKey, setApiKey] = useState(localStorage.getItem('deepseek_api_key') || '');

  // Smart Content State
  const [smartContent, setSmartContent] = useState(null);
  const [smartLoading, setSmartLoading] = useState(false);

  // Check if API key exists on first load
  useEffect(() => {
    const hasKey = localStorage.getItem('deepseek_api_key');
    if (!hasKey) {
      setShowSettingsModal(true);
    }
  }, []);

  const activeLesson = courseData.find(l => l.id === activeLessonId);

  // Special handling for Lesson 16 (Review)
  if (activeLesson && activeLesson.id === 16 && activeLesson.vocab.length === 0) {
    // Aggregate vocab from L1-L15
    const allVocab = courseData
      .filter(l => l.id < 16)
      .flatMap(l => l.vocab);
    // Shuffle and pick 50 random words
    activeLesson.vocab = allVocab.sort(() => Math.random() - 0.5).slice(0, 50);
    activeLesson.vocab = allVocab.sort(() => Math.random() - 0.5).slice(0, 50);
  }

  // Calculate cumulative knowledge (previous lessons)
  const previousKnowledge = useMemo(() => {
    if (!activeLessonId) return null;
    let prevLessons;
    if (typeof activeLessonId === 'string') {
      // For special review (e.g., "S1"), include all numeric lessons
      prevLessons = courseData.filter(l => typeof l.id === 'number');
    } else {
      // For numeric lessons, include lessons with smaller id
      prevLessons = courseData.filter(l => l.id < activeLessonId);
    }
    return {
      vocab: prevLessons.flatMap(l => l.vocab),
      grammar: prevLessons.map(l => l.grammar).filter(Boolean),
      verbs: prevLessons.flatMap(l => l.verbs || [])
    };
  }, [activeLessonId]);

  // Smart Lesson Prep
  useEffect(() => {
    if (activeLesson) {
      const loadSmartContent = async () => {
        const cacheKey = `smart_content_${activeLesson.id}`;
        const cached = localStorage.getItem(cacheKey);

        if (cached) {
          setSmartContent(JSON.parse(cached));
        } else {
          setSmartLoading(true);
          try {
            // Only generate if API key is set
            if (localStorage.getItem('deepseek_api_key')) {
              const content = await generateSmartContent(activeLesson);
              setSmartContent(content);
              localStorage.setItem(cacheKey, JSON.stringify(content));
            }
          } catch (err) {
            console.error("Smart Prep Failed:", err);
          } finally {
            setSmartLoading(false);
          }
        }
      };

      loadSmartContent();
    }
  }, [activeLesson]);

  return (
    <div className="h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          {activeLessonId ? (
            <button
              onClick={() => setActiveLessonId(null)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-slate-600" />
            </button>
          ) : (
            <div className="w-8 h-8 bg-gradient-to-br from-spanish-red to-spanish-yellow rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
              ES
            </div>
          )}

          <div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-spanish-red to-orange-600">
              {activeLesson ? `${typeof activeLesson.id === 'string' ? '' : 'L'}${activeLesson.id}: ${activeLesson.title}` : 'Spanish Cram Suite'}
            </h1>
            {activeLesson && (
              <p className="text-xs text-slate-500 font-medium">{activeLesson.subtitle}</p>
            )}
          </div>
        </div>
        <button
          onClick={() => setShowSettingsModal(true)}
          className="p-2 rounded-lg transition-all hover:bg-slate-100 text-slate-600"
          title="API设置"
        >
          <Settings size={20} />
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        {!activeLessonId ? (
          // Dashboard View
          <div className="h-full overflow-y-auto p-6">
            <div className="max-w-5xl mx-auto">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-slate-800 mb-2">20天突击计划</h2>
                <p className="text-slate-500">已解锁 15 课核心内容，点击开始复习</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courseData.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => setActiveLessonId(lesson.id)}
                    className="group bg-white p-5 rounded-xl border border-slate-200 hover:border-spanish-yellow hover:shadow-md transition-all text-left relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                      <span className="text-4xl font-black text-spanish-red">{lesson.id}</span>
                    </div>
                    <div className="relative z-10">
                      <div className="text-xs font-bold text-spanish-red uppercase tracking-wider mb-1">
                        {typeof lesson.id === 'string' ? '专项复习' : 'Lección'} {lesson.id}
                      </div>
                      <h3 className="font-bold text-slate-800 text-lg mb-1 truncate">{lesson.title}</h3>
                      <p className="text-slate-500 text-sm">{lesson.subtitle}</p>

                      <div className="mt-4 flex gap-2">
                        <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600 flex items-center gap-1">
                          <Brain size={12} /> {lesson.vocab?.length || 0} 词
                        </span>
                        <span className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600 flex items-center gap-1">
                          <BookOpen size={12} /> 语法
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          // Lesson Study View
          <div className="h-full flex flex-col max-w-4xl mx-auto w-full bg-white shadow-xl border-x border-slate-200">
            {/* Tabs */}
            <div className="flex border-b border-slate-200">
              <TabButton
                active={activeTab === 'vocab'}
                onClick={() => setActiveTab('vocab')}
                icon={<Brain size={18} />}
                label="单词突击"
              />
              <TabButton
                active={activeTab === 'grammar'}
                onClick={() => setActiveTab('grammar')}
                icon={<BookOpen size={18} />}
                label="语法精讲"
              />
              <TabButton
                active={activeTab === 'reading'}
                onClick={() => setActiveTab('reading')}
                icon={<BookText size={18} />}
                label="阅读理解"
              />
              <TabButton
                active={activeTab === 'translation'}
                onClick={() => setActiveTab('translation')}
                icon={<Languages size={18} />}
                label="翻译特训"
              />
              <TabButton
                active={activeTab === 'verbs'}
                onClick={() => setActiveTab('verbs')}
                icon={<ListChecks size={18} />}
                label="动词变位"
              />
              <TabButton
                active={activeTab === 'speaking'}
                onClick={() => setActiveTab('speaking')}
                icon={<Mic size={18} />}
                label="口语练习"
              />
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-50 p-6">
              <div style={{ display: activeTab === 'vocab' ? 'block' : 'none', height: '100%' }}>
                {activeLesson.vocab && <VocabDrill key={activeLesson.id} vocab={activeLesson.vocab} lessonId={activeLesson.id} />}
              </div>
              <div style={{ display: activeTab === 'grammar' ? 'block' : 'none', height: '100%' }}>
                {activeLesson.grammar && (
                  <GrammarQuiz
                    key={activeLesson.id}
                    data={activeLesson.grammar}
                    vocab={activeLesson.vocab}
                    lessonId={activeLesson.id}
                    previousKnowledge={previousKnowledge}
                    smartContent={smartContent}
                    smartLoading={smartLoading}
                  />
                )}
              </div>
              <div style={{ display: activeTab === 'reading' ? 'block' : 'none', height: '100%' }}>
                {activeLesson.reading && <ReadingComp key={activeLesson.id} data={activeLesson.reading} vocab={activeLesson.vocab} grammarTitle={activeLesson.grammar?.title || ''} lessonId={activeLesson.id} previousKnowledge={previousKnowledge} />}
              </div>
              <div style={{ display: activeTab === 'translation' ? 'block' : 'none', height: '100%' }}>
                {activeLesson.translation && <TranslationTrainer key={activeLesson.id} data={activeLesson.translation} vocab={activeLesson.vocab} lessonId={activeLesson.id} previousKnowledge={previousKnowledge} />}
              </div>
              <div style={{ display: activeTab === 'verbs' ? 'block' : 'none', height: '100%' }}>
                <VerbConjugation
                  key={activeLesson.id}
                  verbs={activeLesson.verbs || []}
                  lessonId={activeLesson.id}
                  smartVerbs={smartContent?.irregularVerbs || []}
                  previousKnowledge={previousKnowledge}
                />
              </div>
              <div style={{ display: activeTab === 'speaking' ? 'block' : 'none', height: '100%' }}>
                <SpeakingPractice
                  key={activeLesson.id}
                  vocab={activeLesson.vocab}
                  lessonId={activeLesson.id}
                  reading={activeLesson.reading}
                  translation={activeLesson.translation}
                  previousKnowledge={previousKnowledge}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Teaching Assistant Sidebar (Left) */}
      <TeachingAssistant apiKey={apiKey} />

      {/* Study Notes Sidebar (Right) */}
      <StudyNotes apiKey={apiKey} />

      {/* Initial API Key Setup Modal */}
      {showSettingsModal && createPortal(
        <div className="modal-backdrop fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: 99999 }}>
          <div className="modal-content bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white relative flex-shrink-0 rounded-t-2xl">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-all"
              >
                <X size={20} />
              </button>
              <h2 className="text-2xl font-bold mb-2">欢迎使用 Spanish Cram Suite！🇪🇸</h2>
              <p className="text-purple-100">开始使用AI功能前，请先设置您的API Key</p>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <ApiKeyManager onKeySet={(key) => {
                setHasApiKey(!!key);
                setApiKey(key || '');
                if (key) setShowSettingsModal(false);
              }} />

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-blue-900 mb-2">💡 温馨提示</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 您的API Key仅保存在本地浏览器中</li>
                  <li>• 每位同学使用自己的DeepSeek账户额度</li>
                  <li>• 可随时在右上角⚙️图标中修改或清除</li>
                  <li>• 不设置也可以使用，但无法使用AI功能</li>
                </ul>
              </div>

              <button
                onClick={() => setShowSettingsModal(false)}
                className="mt-4 w-full py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-all font-medium"
              >
                稍后设置
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

function TabButton({ active, onClick, icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-4 flex items-center justify-center gap-2 text-sm font-bold transition-all border-b-2 ${active
        ? 'border-spanish-red text-spanish-red bg-red-50/50'
        : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
        }`}
    >
      {icon}
      {label}
    </button>
  );
}

export default App;
