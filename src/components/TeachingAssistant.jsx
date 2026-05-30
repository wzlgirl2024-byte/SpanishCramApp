import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

export default function TeachingAssistant({ apiKey }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Load conversation history from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('teaching_assistant_history');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setMessages(parsed);
            } catch (e) {
                console.error('Failed to load chat history', e);
            }
        }
    }, []);

    // Save messages when they change
    useEffect(() => {
        localStorage.setItem('teaching_assistant_history', JSON.stringify(messages));
    }, [messages]);

    // Clear history if API key changes (different user)
    useEffect(() => {
        const lastKey = localStorage.getItem('teaching_assistant_owner');
        if (lastKey && lastKey !== apiKey) {
            setMessages([]);
            localStorage.removeItem('teaching_assistant_history');
        }
        if (apiKey) {
            localStorage.setItem('teaching_assistant_owner', apiKey);
        }
    }, [apiKey]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = { role: 'user', content: input.trim() };
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInput('');
        setLoading(true);

        try {
            const response = await fetch('https://api.xiaomimimo.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'mimo-v2.5',
                    messages: [
                        {
                            role: 'system',
                            content: `你是一位新东方西班牙语老师，名字叫Carlos。你热情、专业、幽默，擅长用生动的例子讲解西班牙语语法、词汇、文化。你的回答要简洁、清晰，尽量用中文解释，必要时穿插西班牙语例句。你可以回答关于西班牙语学习、西班牙及拉美文化、旅行、历史等任何问题。如果学生的问题超出你的知识范围，你可以诚实地说不知道，但尽量提供相关资源。请保持友好鼓励的语气，适当使用表情符号。`
                        },
                        ...updatedMessages.map(msg => ({
                            role: msg.role,
                            content: msg.content
                        }))
                    ],
                    temperature: 0.7,
                    max_tokens: 2000
                })
            });

            if (!response.ok) {
                throw new Error(`API请求失败: ${response.status}`);
            }

            const data = await response.json();
            const assistantMessage = { role: 'assistant', content: data.choices[0].message.content };
            setMessages([...updatedMessages, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: '抱歉，我暂时无法回答。请检查API Key或网络连接。' }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const clearChat = () => {
        if (window.confirm('确定要清空对话记录吗？')) {
            setMessages([]);
            localStorage.removeItem('teaching_assistant_history');
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed left-0 top-1/2 -translate-y-1/2 z-50 bg-white border border-slate-200 shadow-lg p-2 rounded-r-xl transition-all hover:bg-slate-50 text-slate-600 flex flex-col items-center gap-1 ${isOpen ? '-translate-x-[320px]' : 'translate-x-0'}`}
                style={{ transition: 'transform 0.3s ease-in-out' }}
                title="助教AI"
            >
                {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                <span className="text-xs font-bold writing-vertical-rl py-2 tracking-widest">
                    助教AI
                </span>
                <Sparkles size={16} />
            </button>

            {/* Sidebar Panel */}
            <div
                className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-40 transform transition-transform duration-300 ease-in-out border-r border-slate-200 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex items-center gap-2 text-slate-800 font-bold">
                        <Bot size={20} className="text-blue-600" />
                        <div>
                            <div className="text-sm">新东方西语老师 Carlos</div>
                            <div className="text-xs text-slate-500 font-normal">随时解答你的困惑</div>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-1 hover:bg-slate-200 rounded-lg text-slate-400 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
                    {messages.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-6">
                            <MessageCircle size={48} className="mb-4 opacity-30" />
                            <h3 className="font-bold text-slate-500 mb-2">欢迎向助教提问！</h3>
                            <p className="text-sm">你可以询问西班牙语语法、词汇、文化等任何问题。</p>
                            <div className="mt-6 text-xs text-slate-400 space-y-1">
                                <p>试试问：</p>
                                <p>• “ser 和 estar 有什么区别？”</p>
                                <p>• “西班牙有哪些传统节日？”</p>
                                <p>• “帮我解释一下虚拟式”</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                                        {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                                    </div>
                                    <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white border border-slate-200 text-slate-800'}`}>
                                        <div className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</div>
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-green-100 text-green-600">
                                        <Bot size={16} />
                                    </div>
                                    <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-slate-200 bg-white">
                    <div className="flex gap-2">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="输入你的问题..."
                            className="flex-1 border border-slate-300 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            rows="2"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={loading || !input.trim()}
                            className="self-end bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-xs text-slate-400">
                        <button
                            onClick={clearChat}
                            className="hover:text-red-500 transition-colors"
                        >
                            清空对话
                        </button>
                        <span>按 Enter 发送，Shift+Enter 换行</span>
                    </div>
                </div>
            </div>
        </>
    );
}