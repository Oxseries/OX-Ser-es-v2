
import React, { useState, useEffect, useCallback } from 'react';
import { Language } from './types';
import { TRANSLATIONS } from './constants';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Ritual from './components/Ritual';
import Ingredients from './components/Ingredients';
import AIAssistant from './components/AIAssistant';
import PharmacyLocator from './components/PharmacyLocator';
import Footer from './components/Footer';
import AdvantageModal from './components/AdvantageModal';
import ApplicationRequest from './components/ApplicationRequest';

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('tr');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = useCallback((key: keyof typeof TRANSLATIONS['tr']) => {
    return TRANSLATIONS[lang][key] || key;
  }, [lang]);

  return (
    <div className="min-h-screen bg-brand-white text-brand-black selection:bg-brand-gold selection:text-white">
      <Navbar 
        lang={lang} 
        setLang={setLang} 
        isScrolled={isScrolled} 
        t={t} 
      />
      
      <main>
        <Hero t={t} lang={lang} />
        <Ritual t={t} />
        <Ingredients t={t} lang={lang} />
        <ApplicationRequest t={t} />
        <AIAssistant lang={lang} t={t} />
        <PharmacyLocator t={t} lang={lang} />
      </main>

      <Footer t={t} />

      {/* SOS Button */}
      <button 
        onClick={() => {
          const element = document.getElementById('ai');
          element?.scrollIntoView({ behavior: 'smooth' });
        }}
        aria-label="SOS Help"
        className="fixed bottom-6 left-6 w-14 h-14 bg-red-600 text-white rounded-full shadow-2xl flex items-center justify-center font-bold tracking-widest hover:scale-110 active:scale-95 transition-all z-40 border border-white/20 animate-pulse will-change-transform"
      >
        SOS
      </button>

      {/* Floating Action Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        aria-label="Advantage Access"
        className="fixed bottom-6 right-6 w-14 h-14 bg-brand-black text-brand-white rounded-full shadow-2xl flex items-center justify-center font-bold tracking-widest hover:scale-110 active:scale-95 transition-all z-40 border border-brand-gold/20 will-change-transform"
      >
        OX
      </button>

      {isModalOpen && (
        <AdvantageModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          t={t}
          lang={lang}
          setLang={setLang}
        />
      )}
    </div>
  );
};

export default App;
