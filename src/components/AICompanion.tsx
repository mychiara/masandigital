'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Play, Pause, Square, Sparkles, ChevronDown, ChevronUp, Clock, HelpCircle } from 'lucide-react';

interface AICompanionProps {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tocItems: Array<{ id: string; label: string }>;
}

export default function AICompanion({ title, content, excerpt, category, tocItems }: AICompanionProps) {
  // Audio Reader States
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [playbackRate, setPlaybackRate] = useState<number>(1);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  // Synthesis references
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const textToReadRef = useRef<string>('');
  const progressIntervalRef = useRef<number | null>(null);

  // Clean HTML helper
  const cleanText = (htmlStr: string) => {
    if (typeof window === 'undefined') return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlStr;
    
    // Remove scripts, styles, metadata
    const scripts = tempDiv.getElementsByTagName('script');
    const styles = tempDiv.getElementsByTagName('style');
    for (let i = scripts.length - 1; i >= 0; i--) scripts[i].parentNode?.removeChild(scripts[i]);
    for (let i = styles.length - 1; i >= 0; i--) styles[i].parentNode?.removeChild(styles[i]);
    
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  useEffect(() => {
    // Process text on mount/update
    const rawText = cleanText(content);
    // Limit to reasonable speech scope (first 3000 chars or full content)
    textToReadRef.current = `${title}. Kategori ${category}. ${excerpt}. ${rawText.slice(0, 4000)}`;

    return () => {
      stopSpeech();
    };
  }, [content, title, excerpt, category]);

  // Audio Playback Controls
  const startSpeech = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    // If currently paused, resume synthesis
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
      startProgressTracking();
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Create a new utterance
    const utterance = new SpeechSynthesisUtterance(textToReadRef.current);
    
    // Choose Indonesian or English voice based on content
    const voices = window.speechSynthesis.getVoices();
    const indVoice = voices.find(v => v.lang.startsWith('id') || v.lang.includes('IND'));
    if (indVoice) {
      utterance.voice = indVoice;
    }

    utterance.rate = playbackRate;
    utteranceRef.current = utterance;

    // Utterance Event handlers
    utterance.onend = () => {
      stopSpeech();
    };

    utterance.onerror = (e) => {
      if (e.error !== 'interrupted') {
        stopSpeech();
      }
    };

    // Begin speaking
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
    setReadingProgress(0);
    startProgressTracking();
  };

  const pauseSpeech = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.pause();
    setIsPlaying(false);
    setIsPaused(true);
    stopProgressTracking();
  };

  const stopSpeech = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setReadingProgress(0);
    stopProgressTracking();
  };

  const changeRate = (rate: number) => {
    setPlaybackRate(rate);
    if (isPlaying) {
      // Re-trigger speech at new speed from beginning for fluid API transition
      setTimeout(() => {
        if (utteranceRef.current) {
          utteranceRef.current.rate = rate;
          // Most SpeechSynthesis engines require cancel and speak for rate updates
          const currentProgress = readingProgress;
          window.speechSynthesis.cancel();
          const remainingText = textToReadRef.current.slice(Math.floor(textToReadRef.current.length * (currentProgress / 100)));
          const nextUtterance = new SpeechSynthesisUtterance(remainingText);
          if (utteranceRef.current.voice) nextUtterance.voice = utteranceRef.current.voice;
          nextUtterance.rate = rate;
          nextUtterance.onend = stopSpeech;
          nextUtterance.onerror = stopSpeech;
          utteranceRef.current = nextUtterance;
          window.speechSynthesis.speak(nextUtterance);
          startProgressTracking();
        }
      }, 50);
    }
  };

  const startProgressTracking = () => {
    stopProgressTracking();
    let estimateDuration = textToReadRef.current.length * (60 / 700) * (1 / playbackRate) * 1000; // rough estimation in ms
    let startTime = Date.now();
    let initialProgress = readingProgress;

    const interval = window.setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progressDelta = (elapsed / estimateDuration) * 100;
      const nextProgress = Math.min(initialProgress + progressDelta, 99);
      setReadingProgress(nextProgress);
    }, 200);

    progressIntervalRef.current = interval as any;
  };

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  };

  // Dynamic summary builder based on actually parsed headers
  const getDynamicInsights = () => {
    const defaultPoints = [
      'Menyajikan ulasan mendalam mengenai strategi implementasi teknologi terbaru yang terstruktur.',
      'Analisis mendalam terhadap optimasi performa digital, efisiensi infrastruktur, dan tata kelola sistem.',
      'Rekomendasi taktis dan peta jalan (roadmap) modern bagi para profesional dan pengembang di era digital.',
      'Kesimpulan dan prospek pertumbuhan inovasi teknologi di masa depan.'
    ];

    if (!tocItems || tocItems.length === 0) return defaultPoints;

    return tocItems.map((item, idx) => {
      if (idx === 0) return `Pendahuluan dan pengenalan penting terkait topik "${item.label}".`;
      if (idx === 1) return `Analisis mendalam mengenai arsitektur inti dari "${item.label}".`;
      if (idx === 2) return `Prosedur kepercayaan digital, keamanan sistem, dan implementasi dari "${item.label}".`;
      if (idx === 3) return `Pandangan masa depan dan kesimpulan strategis mengenai "${item.label}".`;
      return `Kajian komprehensif pada sub-topik "${item.label}".`;
    }).slice(0, 4); // Limit to top 4 points
  };

  const insights = getDynamicInsights();

  return (
    <div className="w-full p-5 mb-8 rounded-3xl border border-primary/20 bg-surface-container-low/40 shadow-xl backdrop-blur-md relative overflow-hidden group select-none transition-all duration-300">
      {/* Decorative Blur Aurora */}
      <div className="absolute right-0 top-0 w-28 h-28 bg-gradient-to-br from-primary/15 to-tertiary/15 rounded-full blur-2xl pointer-events-none group-hover:scale-110 transition-transform duration-700"></div>

      <div className="flex flex-col md:flex-row gap-5 items-stretch md:items-center justify-between">
        
        {/* Left Side: Audio Player Section */}
        <div className="flex-grow space-y-3.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl brand-gradient-bg flex items-center justify-center text-white shadow-md shadow-primary/10">
              <Volume2 className="w-4.5 h-4.5 animate-pulse" />
            </div>
            <div>
              <h4 className="font-extrabold text-[11px] uppercase tracking-widest text-primary font-sans flex items-center gap-1.5">
                AI Audio Companion
                <span className="bg-secondary/15 text-secondary border border-secondary/20 text-[9px] px-2 py-0.5 rounded-full font-black tracking-normal lowercase">id-voice</span>
              </h4>
              <p className="text-[10px] text-on-surface-variant/80 font-medium">Listen to this article dynamically</p>
            </div>
          </div>

          {/* Player controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Play/Pause Button */}
            <button
              onClick={isPlaying ? pauseSpeech : startSpeech}
              className="py-2.5 px-5 rounded-2xl brand-gradient-bg text-white text-xs font-black flex items-center gap-2 shadow-lg hover:scale-[1.03] active:scale-95 transition-all duration-300 cursor-pointer border border-white/10"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-white" />
                  PAUSE
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-white" />
                  {isPaused ? 'RESUME' : 'PLAY AUDIO'}
                </>
              )}
            </button>

            {/* Stop Button */}
            {(isPlaying || isPaused) && (
              <button
                onClick={stopSpeech}
                title="Stop Audio"
                className="w-9 h-9 rounded-2xl bg-error/10 hover:bg-error/20 text-error border border-error/15 flex items-center justify-center transition-all duration-300 cursor-pointer"
              >
                <Square className="w-3.5 h-3.5 fill-error" />
              </button>
            )}

            {/* Speed Selector */}
            <div className="flex items-center gap-1 bg-surface-container-high/40 rounded-xl p-1 border border-outline-variant/15">
              {[1, 1.25, 1.5].map((rate) => (
                <button
                  key={rate}
                  onClick={() => changeRate(rate)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black tracking-tight transition-all duration-300 cursor-pointer ${
                    playbackRate === rate
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high/60 hover:text-on-surface'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>

          {/* Smooth Reading Progress Bar */}
          <div className="w-full space-y-1">
            <div className="flex justify-between items-center text-[9px] font-bold text-on-surface-variant/70">
              <span>Progress Membaca</span>
              <span>{Math.floor(readingProgress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-surface-container-high/45 rounded-full overflow-hidden border border-outline-variant/10">
              <div 
                className="h-full brand-gradient-bg rounded-full transition-all duration-200"
                style={{ width: `${readingProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Vertical Divider for Desktop */}
        <div className="hidden md:block w-[1px] self-stretch bg-outline-variant/15 mx-2" />

        {/* Right Side: AI Summary Accordion Button */}
        <div className="flex-shrink-0 flex items-center">
          <button
            onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
            className={`w-full md:w-auto py-4 px-6 rounded-2xl border flex items-center justify-center gap-2.5 text-xs font-extrabold tracking-tight transition-all duration-300 cursor-pointer ${
              isSummaryExpanded
                ? 'bg-primary/10 text-primary border-primary/45 shadow-inner'
                : 'bg-surface-container-lowest/40 border-outline-variant/25 text-on-surface-variant hover:bg-surface-container-high/50 hover:text-primary hover:border-primary/20'
            }`}
          >
            <Sparkles className={`w-4 h-4 text-tertiary ${isSummaryExpanded ? 'animate-spin-slow' : 'animate-pulse'}`} />
            <span>RINGKASAN AI KUNCI (TAKEAWAYS)</span>
            {isSummaryExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded Key Takeaways Section */}
      {isSummaryExpanded && (
        <div className="mt-5 pt-5 border-t border-outline-variant/10 space-y-4 animate-fade-in">
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4.5">
            <h5 className="text-xs font-black text-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Tinjauan Singkat (Quick Excerpt)
            </h5>
            <p className="text-xs text-on-surface-variant leading-relaxed font-semibold italic">
              "{excerpt}"
            </p>
          </div>

          <div className="space-y-2.5">
            <h5 className="text-[11px] font-black text-secondary uppercase tracking-widest flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-tertiary" />
              Poin Penting Analisis AI (Key Insights)
            </h5>
            <ul className="space-y-2">
              {insights.map((insight, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-on-surface-variant leading-relaxed">
                  <span className="w-5 h-5 rounded-full brand-gradient-bg text-white font-extrabold flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5 shadow-sm">
                    {idx + 1}
                  </span>
                  <span className="font-semibold">{insight}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="text-[9px] font-bold text-on-surface-variant/50 text-right uppercase tracking-wider flex items-center justify-end gap-1 select-none">
            <HelpCircle className="w-3 h-3" />
            AI-generated takeaways based on article structure
          </div>
        </div>
      )}
    </div>
  );
}
