import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as geminiService from '../services/geminiService';
import { ImageSize, ImageAspectRatio, VideoAspectRatio } from '../types';
import Markdown from 'react-markdown';
import LiveAssistant from './LiveAssistant';
import { ObjectDetector } from './ObjectDetector';

const AILab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analyze' | 'generate' | 'transcribe' | 'search' | 'live' | 'detect'>('analyze');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Analyze State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analyzePrompt, setAnalyzePrompt] = useState('Analyze this football-related media and provide key insights.');

  // Generate State
  const [genType, setGenType] = useState<'image' | 'video'>('image');
  const [genPrompt, setGenPrompt] = useState('');
  const [imgSize, setImgSize] = useState<ImageSize>('1K');
  const [imgRatio, setImgRatio] = useState<ImageAspectRatio>('16:9');
  const [vidRatio, setVidRatio] = useState<VideoAspectRatio>('16:9');

  // Transcribe State
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await geminiService.analyzeMedia(selectedFile, analyzePrompt);
      setResult(res);
    } catch (err) {
      setError("Failed to analyze media. Ensure you have selected a valid image or video.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!genPrompt.trim()) return;
    
    // Check for API key selection for Veo and Nano Banana Pro
    if (window.aistudio) {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (!hasKey) {
        await window.aistudio.openSelectKey();
        // After opening, we proceed assuming success as per guidelines
      }
    }

    setIsLoading(true);
    setError(null);
    try {
      if (genType === 'image') {
        const url = await geminiService.generateImageNano(genPrompt, imgSize, imgRatio);
        setResult({ url, type: 'image', prompt: genPrompt });
      } else {
        const url = await geminiService.generateVideoVeo(genPrompt, vidRatio);
        setResult({ url, type: 'video', prompt: genPrompt });
      }
    } catch (err) {
      setError("Generation failed. This might be due to safety filters or API limits.");
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => setAudioBlob(new Blob(chunks, { type: 'audio/webm' }));
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      setError("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleTranscribe = async () => {
    if (!audioBlob) return;
    setIsLoading(true);
    setError(null);
    try {
      const text = await geminiService.transcribeAudio(audioBlob);
      setResult({ text });
    } catch (err) {
      setError("Transcription failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const text = await geminiService.searchGroundingQuery(searchQuery);
      setResult({ text });
    } catch (err) {
      setError("Search grounding failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setSelectedFile(null);
    setAudioBlob(null);
  };

  return (
    <div className="bg-gray-800/40 rounded-3xl border border-white/5 overflow-hidden flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-white/5 bg-black/20">
        {[
          { id: 'analyze', icon: '🔍', label: 'Analyze' },
          { id: 'generate', icon: '🎨', label: 'Create' },
          { id: 'live', icon: '🎙️', label: 'Live' },
          { id: 'transcribe', icon: '🎤', label: 'Voice' },
          { id: 'search', icon: '🌐', label: 'Grounding' },
          { id: 'detect', icon: '👁️', label: 'Detect' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id as any); reset(); }}
            className={`flex-1 py-4 flex flex-col items-center gap-1 transition-all relative ${
              activeTab === tab.id ? 'text-pitch-green-light' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {tab.icon}
            <span className="text-[9px] font-black uppercase tracking-widest">{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div layoutId="activeTabLab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-pitch-green" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {result ? (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-pitch-green uppercase tracking-widest">AI Result</h3>
              <button onClick={reset} className="text-gray-500 hover:text-white transition-colors text-lg">
                🗑️
              </button>
            </div>

            {result.url ? (
              <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
                {result.type === 'video' ? (
                  <video src={result.url} controls className="w-full aspect-video" autoPlay loop />
                ) : (
                  <img src={result.url} alt="Generated" className="w-full object-contain max-h-[400px]" />
                )}
                <div className="p-4 bg-gray-900/80 backdrop-blur-md">
                  <p className="text-[10px] text-gray-400 font-medium italic">"{result.prompt}"</p>
                  <a 
                    href={result.url} 
                    download={`ai_${result.type}_${Date.now()}`}
                    className="mt-3 flex items-center justify-center gap-2 bg-pitch-green hover:bg-pitch-green-light text-white py-2 rounded-xl text-[10px] font-black uppercase transition-all"
                  >
                    📥 Download {result.type}
                  </a>
                </div>
              </div>
            ) : (
              <div className="bg-gray-900/60 p-6 rounded-2xl border border-white/5 prose prose-invert prose-sm max-w-none">
                <Markdown>{result.text}</Markdown>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col">
            {activeTab === 'analyze' && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">Media Intelligence</h2>
                  <p className="text-gray-500 text-xs">Upload match footage or player photos for deep AI analysis.</p>
                </div>

                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  <div className={`border-2 border-dashed rounded-3xl p-12 flex flex-col items-center gap-4 transition-all ${
                    selectedFile ? 'border-pitch-green bg-pitch-green/5' : 'border-white/10 hover:border-pitch-green/50 bg-black/20'
                  }`}>
                    {selectedFile ? (
                      <>
                        {selectedFile.type.startsWith('image/') ? <span className="text-4xl">🖼️</span> : <span className="text-4xl">🎥</span>}
                        <div className="text-center">
                          <p className="text-white font-bold text-sm">{selectedFile.name}</p>
                          <p className="text-gray-500 text-[10px]">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 group-hover:scale-110 transition-transform text-3xl">
                          📤
                        </div>
                        <p className="text-gray-400 text-sm font-medium">Drop image or video here</p>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Analysis Prompt</label>
                  <textarea
                    value={analyzePrompt}
                    onChange={(e) => setAnalyzePrompt(e.target.value)}
                    className="w-full bg-chocolate border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-pitch-green transition-colors h-24 resize-none"
                  />
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={!selectedFile || isLoading}
                  className="w-full bg-pitch-green hover:bg-pitch-green-light disabled:opacity-50 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-pitch-green-dark/20 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? <span className="animate-spin">⏳</span> : '✨'}
                  Analyze with Gemini Pro
                </button>
              </div>
            )}

            {activeTab === 'generate' && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">AI Media Creator</h2>
                  <p className="text-gray-500 text-xs">Generate hyper-realistic football visuals using Veo 3 & Nano Banana.</p>
                </div>

                <div className="flex bg-black/20 p-1 rounded-2xl border border-white/5">
                  <button
                    onClick={() => setGenType('image')}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      genType === 'image' ? 'bg-pitch-green text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    Image (Nano)
                  </button>
                  <button
                    onClick={() => setGenType('video')}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      genType === 'video' ? 'bg-pitch-green text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    Video (Veo 3)
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Visual Prompt</label>
                  <textarea
                    value={genPrompt}
                    onChange={(e) => setGenPrompt(e.target.value)}
                    placeholder={genType === 'image' ? "e.g. A futuristic stadium in the clouds, neon lights..." : "e.g. A cinematic shot of a player scoring a bicycle kick..."}
                    className="w-full bg-chocolate border border-white/10 rounded-2xl p-4 text-sm text-white focus:outline-none focus:border-pitch-green transition-colors h-32 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {genType === 'image' ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                          📏 Size
                        </label>
                        <select 
                          value={imgSize} 
                          onChange={(e) => setImgSize(e.target.value as any)}
                          className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        >
                          <option value="1K">1K Resolution</option>
                          <option value="2K">2K Resolution</option>
                          <option value="4K">4K Resolution</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                          📐 Ratio
                        </label>
                        <select 
                          value={imgRatio} 
                          onChange={(e) => setImgRatio(e.target.value as any)}
                          className="w-full bg-gray-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                        >
                          {['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9'].map(r => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  ) : (
                    <div className="col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        📐 Aspect Ratio
                      </label>
                      <div className="flex gap-2">
                        {['16:9', '9:16'].map(r => (
                          <button
                            key={r}
                            onClick={() => setVidRatio(r as any)}
                            className={`flex-1 py-2 rounded-xl border transition-all text-[10px] font-black ${
                              vidRatio === r ? 'bg-pitch-green/20 border-pitch-green text-pitch-green-light' : 'border-white/5 text-gray-500'
                            }`}
                          >
                            {r === '16:9' ? 'Landscape (16:9)' : 'Portrait (9:16)'}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={!genPrompt.trim() || isLoading}
                  className="w-full bg-pitch-green hover:bg-pitch-green-light disabled:opacity-50 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-pitch-green-dark/20 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? <span className="animate-spin">⏳</span> : '✨'}
                  Generate {genType === 'image' ? 'Image' : 'Video'}
                </button>
              </div>
            )}

            {activeTab === 'live' && (
              <LiveAssistant />
            )}

            {activeTab === 'transcribe' && (
              <div className="space-y-6 flex flex-col items-center justify-center h-full">
                <div className="text-center space-y-2 mb-8">
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">Voice Transcription</h2>
                  <p className="text-gray-500 text-xs">Speak your thoughts and let Gemini transcribe them instantly.</p>
                </div>

                <div className="relative">
                  <AnimatePresence>
                    {isRecording && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1.5, opacity: 0.2 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute inset-0 bg-red-500 rounded-full"
                      />
                    )}
                  </AnimatePresence>
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all relative z-10 ${
                      isRecording ? 'bg-red-500 text-white scale-110' : 'bg-chocolate text-pitch-green hover:bg-gray-700'
                    }`}
                  >
                    {isRecording ? <span className="text-4xl">⏹️</span> : <span className="text-4xl">🎤</span>}
                  </button>
                </div>

                <div className="mt-8 w-full space-y-4">
                  {audioBlob && !isRecording && (
                    <div className="bg-black/20 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-pitch-green/20 flex items-center justify-center text-pitch-green">
                          ▶️
                        </div>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recording Ready</span>
                      </div>
                      <button
                        onClick={handleTranscribe}
                        disabled={isLoading}
                        className="bg-pitch-green hover:bg-pitch-green-light text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2"
                      >
                        {isLoading ? <span className="animate-spin">⏳</span> : '✍️'}
                        Transcribe
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'search' && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">Google Search Grounding</h2>
                  <p className="text-gray-500 text-xs">Get real-time, accurate data from the web powered by Google Search.</p>
                </div>

                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg">🔍</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="e.g. Latest transfer news for Real Madrid..."
                    className="w-full bg-chocolate border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-pitch-green transition-colors"
                  />
                </div>

                <button
                  onClick={handleSearch}
                  disabled={!searchQuery.trim() || isLoading}
                  className="w-full bg-pitch-green hover:bg-pitch-green-light disabled:opacity-50 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-pitch-green-dark/20 transition-all flex items-center justify-center gap-2"
                >
                  {isLoading ? <span className="animate-spin">⏳</span> : '🔍'}
                  Search with Grounding
                </button>

                <div className="bg-pitch-green/5 border border-pitch-green/10 p-4 rounded-2xl">
                  <p className="text-[10px] text-pitch-green/60 leading-relaxed italic">
                    "Grounding ensures that Gemini uses the most recent information from the web to verify facts and provide up-to-date answers."
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'detect' && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-black text-white uppercase tracking-tight">Real-time Detection</h2>
                  <p className="text-gray-500 text-xs">Detect objects in real-time using TensorFlow.js.</p>
                </div>
                <ObjectDetector />
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border-t border-red-500/20 text-red-400 text-[10px] font-bold text-center">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};

export default AILab;
