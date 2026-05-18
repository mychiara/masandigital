'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Settings, Sun, Moon, Grid, List, Layers, Check, RefreshCw } from 'lucide-react';

export default function ThemeCustomizer() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const [colorScheme, setColorScheme] = useState<'blue' | 'green' | 'purple' | 'orange'>('blue');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list' | 'magazine'>('grid');
  const [isHomepage, setIsHomepage] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Check if we are on the homepage
  useEffect(() => {
    setIsHomepage(window.location.pathname === '/');
  }, []);

  // Initialize settings from localStorage on mount
  useEffect(() => {
    // 1. Theme Mode (Light/Dark)
    const savedMode = localStorage.getItem('masandigital_mode');
    if (savedMode === 'dark' || savedMode === 'light') {
      setMode(savedMode);
      document.documentElement.setAttribute('data-mode', savedMode);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialMode = prefersDark ? 'dark' : 'light';
      setMode(initialMode);
      document.documentElement.setAttribute('data-mode', initialMode);
    }

    // 2. Color Scheme
    const savedColor = localStorage.getItem('masandigital_color');
    if (savedColor === 'blue' || savedColor === 'green' || savedColor === 'purple' || savedColor === 'orange') {
      setColorScheme(savedColor);
      document.documentElement.setAttribute('data-color-scheme', savedColor);
    } else {
      document.documentElement.setAttribute('data-color-scheme', 'blue');
    }

    // 3. Homepage Layout
    const savedLayout = localStorage.getItem('masandigital_layout');
    if (savedLayout === 'grid' || savedLayout === 'list' || savedLayout === 'magazine') {
      setLayoutMode(savedLayout as any);
    }
  }, []);

  // Close panel on clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleMode = () => {
    const nextMode = mode === 'light' ? 'dark' : 'light';
    setMode(nextMode);
    localStorage.setItem('masandigital_mode', nextMode);
    document.documentElement.setAttribute('data-mode', nextMode);
    // Dispatch event so other components can react
    window.dispatchEvent(new CustomEvent('masandigital_mode_change', { detail: nextMode }));
  };

  const changeColorScheme = (color: 'blue' | 'green' | 'purple' | 'orange') => {
    setColorScheme(color);
    localStorage.setItem('masandigital_color', color);
    document.documentElement.setAttribute('data-color-scheme', color);
    window.dispatchEvent(new CustomEvent('masandigital_color_change', { detail: color }));
  };

  const changeLayout = (layout: 'grid' | 'list' | 'magazine') => {
    setLayoutMode(layout);
    localStorage.setItem('masandigital_layout', layout);
    window.dispatchEvent(new CustomEvent('masandigital_layout_change', { detail: layout }));
  };

  const resetToDefault = () => {
    setMode('light');
    setColorScheme('blue');
    setLayoutMode('grid');
    
    localStorage.setItem('masandigital_mode', 'light');
    localStorage.setItem('masandigital_color', 'blue');
    localStorage.setItem('masandigital_layout', 'grid');
    
    document.documentElement.setAttribute('data-mode', 'light');
    document.documentElement.setAttribute('data-color-scheme', 'blue');
    
    window.dispatchEvent(new CustomEvent('masandigital_mode_change', { detail: 'light' }));
    window.dispatchEvent(new CustomEvent('masandigital_color_change', { detail: 'blue' }));
    window.dispatchEvent(new CustomEvent('masandigital_layout_change', { detail: 'grid' }));
  };

  const colors = [
    { name: 'blue', label: 'Sapphire Blue', class: 'bg-[#1d4ed8]' },
    { name: 'green', label: 'Emerald Green', class: 'bg-[#047857]' },
    { name: 'purple', label: 'Amethyst Purple', class: 'bg-[#6d28d9]' },
    { name: 'orange', label: 'Sunset Orange', class: 'bg-[#ea580c]' },
  ] as const;

  return (
    <div className="fixed bottom-6 right-6 z-[9999]" ref={panelRef}>
      {/* Floating Activator Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 rounded-full brand-gradient-bg text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 relative group cursor-pointer border border-white/10"
        title="Customize Website Theme"
      >
        <Settings className={`w-5 h-5 ${isOpen ? 'rotate-90' : 'group-hover:rotate-45'} transition-transform duration-500`} />
        {/* Pulse effect */}
        <span className="absolute -inset-0.5 rounded-full bg-primary/20 -z-10 animate-ping opacity-60"></span>
      </button>

      {/* Glassmorphic Settings Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 rounded-2xl glassmorphism p-6 space-y-6 animate-fade-in border border-outline-variant/30 select-none">
          <div className="flex justify-between items-center pb-3 border-b border-outline-variant/10">
            <div>
              <h4 className="text-sm font-extrabold tracking-tight text-on-surface">Visual Customizer</h4>
              <p className="text-[10px] text-on-surface-variant">Personalize your reading experience</p>
            </div>
            <button
              onClick={resetToDefault}
              title="Reset to default"
              className="p-1.5 rounded-lg hover:bg-surface-container-high/40 text-on-surface-variant hover:text-primary transition-all duration-300 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mode Switcher (A) */}
          <div className="space-y-2">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
              {mode === 'dark' ? <Moon className="w-3.5 h-3.5 text-secondary" /> : <Sun className="w-3.5 h-3.5 text-secondary" />}
              Display Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => mode !== 'light' && toggleMode()}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all duration-300 cursor-pointer ${
                  mode === 'light'
                    ? 'bg-primary text-white border-primary shadow-md'
                    : 'bg-surface-container-lowest/40 border-outline-variant/25 text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                Light
              </button>
              <button
                onClick={() => mode !== 'dark' && toggleMode()}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all duration-300 cursor-pointer ${
                  mode === 'dark'
                    ? 'bg-primary text-white border-primary shadow-md'
                    : 'bg-surface-container-lowest/40 border-outline-variant/25 text-on-surface hover:bg-surface-container-high'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                Dark
              </button>
            </div>
          </div>

          {/* Color Schemes (B) */}
          <div className="space-y-2">
            <label className="text-[11px] font-extrabold uppercase tracking-wider text-primary">
              Accent Color Scheme
            </label>
            <div className="grid grid-cols-4 gap-2.5">
              {colors.map((c) => (
                <button
                  key={c.name}
                  onClick={() => changeColorScheme(c.name)}
                  title={c.label}
                  className={`aspect-square rounded-full ${c.class} relative flex items-center justify-center shadow-inner hover:scale-105 active:scale-95 transition-all duration-300 border border-white/20 cursor-pointer`}
                >
                  {colorScheme === c.name && (
                    <Check className="w-4 h-4 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Layout Switcher (C) - Only shown on Homepage */}
          {isHomepage && (
            <div className="space-y-2 pt-2 border-t border-outline-variant/10">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <Grid className="w-3.5 h-3.5 text-secondary" />
                Homepage Layout
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => changeLayout('grid')}
                  className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl border text-[10px] font-bold transition-all duration-300 cursor-pointer ${
                    layoutMode === 'grid'
                      ? 'bg-primary/10 text-primary border-primary/45 font-extrabold'
                      : 'bg-surface-container-lowest/40 border-outline-variant/25 text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                  Grid
                </button>
                <button
                  onClick={() => changeLayout('list')}
                  className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl border text-[10px] font-bold transition-all duration-300 cursor-pointer ${
                    layoutMode === 'list'
                      ? 'bg-primary/10 text-primary border-primary/45 font-extrabold'
                      : 'bg-surface-container-lowest/40 border-outline-variant/25 text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <List className="w-4 h-4" />
                  List
                </button>
                <button
                  onClick={() => changeLayout('magazine')}
                  className={`flex flex-col items-center justify-center gap-1 py-2 px-1 rounded-xl border text-[10px] font-bold transition-all duration-300 cursor-pointer ${
                    layoutMode === 'magazine'
                      ? 'bg-primary/10 text-primary border-primary/45 font-extrabold'
                      : 'bg-surface-container-lowest/40 border-outline-variant/25 text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  Magazine
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
