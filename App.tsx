/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Terminal, AlertCircle, CheckCircle2, Loader2, Code2, MessageSquare, ArrowRight, Play, Send, User, Bot, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { PYTHON_RULES, ErrorRule, QUERY_RESPONSES } from './rules';

interface ChatMessage {
  role: 'user' | 'bot';
  content: string;
}

export default function App() {
  const [sourceCode, setSourceCode] = useState('def greet(name)\n    print("Hello " + name)\n\ngreet("World")');
  const [compilerOutput, setCompilerOutput] = useState('');
  const [currentError, setCurrentError] = useState<ErrorRule | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [queryInput, setQueryInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const runMockCompiler = () => {
    setIsAnalyzing(true);
    setCompilerOutput('');
    setCurrentError(null);
    setChatHistory([]);

    setTimeout(() => {
      let error = "";
      // Simple mock syntax checks
      if (sourceCode.includes('def ') && !sourceCode.includes(':')) {
        error = "  File \"script.py\", line 1\n    def greet(name)\n                  ^\nSyntaxError: invalid syntax";
      } else if (sourceCode.includes('print(') && !sourceCode.includes('print("') && sourceCode.includes('Hello')) {
        error = "  File \"script.py\", line 2\n    print(Hello + name)\nNameError: name 'Hello' is not defined";
      } else {
        // Default mock error if code looks okay but we want to demonstrate the tool
        error = "  File \"script.py\", line 1\n    def greet(name)\n                  ^\nSyntaxError: invalid syntax";
      }

      setCompilerOutput(error);
      parseError(error);
      setIsAnalyzing(false);
    }, 800);
  };

  const parseError = (errorStr: string) => {
    const foundRule = PYTHON_RULES.find(rule => rule.pattern.test(errorStr));
    if (foundRule) {
      setCurrentError(foundRule);
      setChatHistory([
        { 
          role: 'bot', 
          content: `**Error Detected: ${foundRule.type}**\n\n${foundRule.meaning}\n\nAsk me anything about this error, like "Why did this happen?" or "How to fix it?"` 
        }
      ]);
    } else {
      setChatHistory([
        { 
          role: 'bot', 
          content: "I detected an error, but I don't have a specific rule for it yet. Try checking your syntax!" 
        }
      ]);
    }
  };

  const handleQuery = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!queryInput.trim() || !currentError) return;

    const userMsg = queryInput.toLowerCase();
    setChatHistory(prev => [...prev, { role: 'user', content: queryInput }]);
    setQueryInput('');

    setTimeout(() => {
      let response = "";
      if (userMsg.includes('why') || userMsg.includes('reason') || userMsg.includes('cause')) {
        response = QUERY_RESPONSES.why(currentError);
      } else if (userMsg.includes('fix') || userMsg.includes('solve') || userMsg.includes('how')) {
        response = QUERY_RESPONSES.fix(currentError);
      } else if (userMsg.includes('simple') || userMsg.includes('beginner') || userMsg.includes('explain')) {
        response = QUERY_RESPONSES.beginner(currentError);
      } else if (userMsg.includes('meaning') || userMsg.includes('what')) {
        response = QUERY_RESPONSES.meaning(currentError);
      } else {
        response = QUERY_RESPONSES.unknown;
      }

      setChatHistory(prev => [...prev, { role: 'bot', content: response }]);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-indigo-500/30 overflow-x-hidden relative">
      {/* Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[120px]"></div>
      </div>

      {/* Header */}
      <header className="bg-white/5 backdrop-blur-md border-b border-white/10 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="vibrant-gradient p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
              <Terminal className="text-white w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">NL-Query Interface</h1>
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em]">Compiler Error Assistant • Rule-Based</p>
            </div>
          </div>
          <div className="hidden lg:flex flex-col items-end text-[10px] text-white/40 font-medium">
            <span>Varthyavath Lavanya</span>
            <span>24CSB0B83-B</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Code & Compiler */}
        <div className="lg:col-span-7 space-y-6">
          {/* Source Code Editor */}
          <section className="glass-card rounded-3xl overflow-hidden border-white/10 flex flex-col h-[400px]">
            <div className="bg-white/5 px-6 py-3 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-bold uppercase tracking-wider">Source Code (Python)</span>
              </div>
              <button 
                onClick={runMockCompiler}
                disabled={isAnalyzing}
                className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 px-4 py-1.5 rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-500/20"
              >
                {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3" />}
                Run & Analyze
              </button>
            </div>
            <textarea
              value={sourceCode}
              onChange={(e) => setSourceCode(e.target.value)}
              className="flex-1 p-6 bg-transparent font-mono text-sm resize-none outline-none text-indigo-100/90 leading-relaxed"
              spellCheck={false}
            />
          </section>

          {/* Compiler Output */}
          <section className="glass-card rounded-3xl overflow-hidden border-white/10 flex flex-col h-[200px]">
            <div className="bg-white/5 px-6 py-3 border-b border-white/10 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-pink-400" />
              <span className="text-sm font-bold uppercase tracking-wider">Compiler Output</span>
            </div>
            <div className="flex-1 p-6 font-mono text-xs text-pink-400/90 overflow-y-auto whitespace-pre bg-black/20">
              {compilerOutput || "# Click 'Run & Analyze' to see compiler output..."}
            </div>
          </section>
        </div>

        {/* Right Column: Natural Language Query Interface */}
        <div className="lg:col-span-5 flex flex-col h-[624px] glass-card rounded-[2.5rem] border-white/10 overflow-hidden">
          <div className="bg-white/5 px-8 py-5 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30">
                <MessageSquare className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold">Query Interface</h2>
                <p className="text-[10px] text-white/40 uppercase tracking-widest">Interactive Explanations</p>
              </div>
            </div>
            {currentError && (
              <div className="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-3 py-1 rounded-full border border-emerald-500/20">
                Active Context: {currentError.type}
              </div>
            )}
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
            {chatHistory.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30 px-10">
                <Info className="w-12 h-12 mb-4" />
                <p className="text-sm font-medium">Run your code to start the interactive query session.</p>
              </div>
            ) : (
              chatHistory.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border ${
                      msg.role === 'user' 
                        ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-400' 
                        : 'bg-pink-500/20 border-pink-500/30 text-pink-400'
                    }`}>
                      {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                        : 'bg-white/5 border border-white/10 text-slate-200'
                    }`}>
                      <div className="prose prose-sm prose-invert max-w-none">
                        <Markdown>{msg.content}</Markdown>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleQuery} className="p-6 bg-white/5 border-t border-white/10">
            <div className="relative flex items-center">
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder={currentError ? "Ask about the error..." : "Run code first to ask questions"}
                disabled={!currentError}
                className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-6 pr-14 text-sm outline-none focus:border-indigo-500/50 transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!currentError || !queryInput.trim()}
                className="absolute right-2 p-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 rounded-xl transition-all shadow-lg shadow-indigo-500/20"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {['Why?', 'How to fix?', 'Explain simply'].map((hint) => (
                <button
                  key={hint}
                  type="button"
                  onClick={() => setQueryInput(hint)}
                  disabled={!currentError}
                  className="whitespace-nowrap px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold hover:bg-white/10 transition-all disabled:opacity-50"
                >
                  {hint}
                </button>
              ))}
            </div>
          </form>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto p-8 text-center border-t border-white/5 mt-8">
        <div className="flex flex-col items-center gap-2">
          <p className="text-[10px] text-white/20 uppercase tracking-[0.4em]">Project Phase 4 • Rule-Based Interface</p>
          <p className="text-xs text-white/40 font-medium">Developed by Varthyavath Lavanya (24CSB0B83-B)</p>
        </div>
      </footer>
    </div>
  );
}
