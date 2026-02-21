
import React, { useRef, useState } from 'react';

interface RitualProps {
  t: (key: any) => string;
}

const Ritual: React.FC<RitualProps> = ({ t }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { 
      title: t('ritual_step1_title'),
      desc: t('ritual_step1_desc'),
      label: 'PREPARATION',
      phase: '01',
      bg: 'https://lh3.googleusercontent.com/d/1M3FV2FCuA36VX38M1bK83I4KJbMXT7tG'
    },
    { 
      title: t('ritual_step2_title'),
      desc: t('ritual_step2_desc'),
      label: 'APPLICATION',
      phase: '02',
      bg: 'https://lh3.googleusercontent.com/d/1QIEDv4B50zPlmG3mvA4-Tmie2oZkjMce'
    },
    { 
      title: t('ritual_step3_title'),
      desc: t('ritual_step3_desc'),
      label: 'PURITY',
      phase: '03',
      bg: 'https://lh3.googleusercontent.com/d/14S0mveVLlbd350EXYZR6LHA1BPisw-ja'
    }
  ];

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const cardWidth = container.querySelector('div')?.clientWidth || 0;
    if (cardWidth === 0) return;
    const index = Math.round(scrollLeft / cardWidth);
    if (index !== activeStep && index >= 0 && index < steps.length) {
      setActiveStep(index);
    }
  };

  const renderDesc = (text: string) => {
    const parts = text.split(/(Dikkat:|Attention:)/i);
    return parts.map((part, i) => {
      const isWarning = part.toLowerCase() === 'dikkat:' || part.toLowerCase() === 'attention:';
      if (isWarning) {
        return (
          <span key={i} className="inline-flex flex-col mb-4 w-full">
            <span className="bg-brand-black text-white font-header px-3 py-1 text-[11px] tracking-[0.2em] uppercase w-fit mb-2">
              {part.replace(':', '')}
            </span>
          </span>
        );
      }
      return <span key={i} className={i > 0 ? "block border-l-2 border-brand-gold/30 pl-4 py-1" : ""}>{part}</span>;
    });
  };

  return (
    <section id="ritual" className="py-24 md:py-32 bg-white text-brand-black overflow-hidden scroll-mt-20 border-t border-brand-border">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 mb-20 md:mb-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="space-y-6">
            <span className="text-[10px] font-bold tracking-[0.5em] uppercase block text-brand-black/40">
              {t('section_ritual')}
            </span>
            <h2 className="text-5xl md:text-7xl lg:text-[6.5rem] font-header font-black tracking-widest uppercase leading-none">
              {t('ritual_title')}
            </h2>
          </div>
          <div className="max-w-md border-l border-brand-black/10 pl-8">
            <p className="text-sm md:text-base font-medium uppercase tracking-widest leading-relaxed text-brand-black/60">
              {t('ritual_subtitle')}
            </p>
          </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-0 border-y border-brand-border bg-brand-gray"
      >
        {steps.map((step, i) => (
          <div 
            key={i}
            className="flex-shrink-0 w-full md:w-[70vw] lg:w-[50vw] snap-start aspect-square md:aspect-[4/5] lg:aspect-[3/4] bg-white border-r border-brand-border group relative overflow-hidden"
          >
            <div className="absolute inset-0 overflow-hidden">
              <img 
                src={step.bg} 
                alt={step.title} 
                className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105" 
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="absolute inset-0 z-10 p-8 md:p-12 flex flex-col justify-between pointer-events-none">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-black tracking-[0.3em] uppercase bg-brand-black text-white px-3 py-1 self-start">PHASE {step.phase}</span>
                <div className="text-4xl font-header font-black text-brand-black/5 tracking-widest">OX</div>
              </div>
              
              <div className="bg-white/90 backdrop-blur-md p-8 md:p-10 border border-brand-border self-start max-w-[90%] md:max-w-[80%] pointer-events-auto shadow-sm space-y-6 will-change-transform">
                <h3 className="text-3xl md:text-5xl font-header font-black uppercase tracking-widest text-brand-black">{step.title}</h3>
                <div className="text-sm md:text-lg text-brand-black/70 font-medium leading-relaxed tracking-wide">
                  {renderDesc(step.desc)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="max-w-[1800px] mx-auto px-6 md:px-12 mt-12 md:mt-20 flex justify-between items-center">
        <div className="flex gap-4">
          {steps.map((_, i) => (
            <button 
              key={i}
              className={`h-1 transition-all duration-700 ${activeStep === i ? 'w-16 bg-brand-black' : 'w-8 bg-brand-black/10'}`}
            />
          ))}
        </div>
        <div className="font-header text-5xl md:text-7xl font-black tracking-widest text-brand-black/10">0{activeStep + 1}</div>
      </div>
    </section>
  );
};

export default Ritual;
