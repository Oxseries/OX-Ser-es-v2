
import React from 'react';

interface TechnicalSheetProps {
  t: (key: any) => string;
}

const TechnicalSheet: React.FC<TechnicalSheetProps> = ({ t }) => {
  return (
    <section id="technical-sheet" className="py-24 md:py-32 bg-white border-t border-brand-border">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col items-center text-center space-y-12">
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-brand-gold">
                {t('technical_sheet_title')}
              </span>
              <h2 className="text-4xl md:text-6xl font-header font-black tracking-widest uppercase">
                {t('technical_sheet_formula')}
              </h2>
              <p className="text-xl md:text-2xl font-serif italic text-brand-black/60">
                {t('technical_sheet_product')}
              </p>
            </div>

            {/* Moved Metadata Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 w-full max-w-3xl mx-auto pt-6 border-t border-brand-border/30">
              <div className="space-y-1">
                <span className="text-[8px] font-bold uppercase tracking-widest opacity-30 block">Batch</span>
                <span className="text-xs font-mono font-bold">OX-2026-V2</span>
              </div>
              <div className="space-y-1">
                <span className="text-[8px] font-bold uppercase tracking-widest opacity-30 block">Origin</span>
                <span className="text-xs font-mono font-bold">Premium</span>
              </div>
              <div className="space-y-1">
                <span className="text-[8px] font-bold uppercase tracking-widest opacity-30 block">Status</span>
                <span className="text-xs font-mono font-bold text-green-600">Verified</span>
              </div>
              <div className="space-y-1">
                <span className="text-[8px] font-bold uppercase tracking-widest opacity-30 block">Type</span>
                <span className="text-xs font-mono font-bold">Serum</span>
              </div>
            </div>

            <div className="flex justify-center gap-8 font-mono text-[10px] tracking-[0.5em] text-brand-black/40 pt-4">
              <span>OX SERIES</span>
              <span>VERIFIED FORMULA</span>
            </div>
          </div>

          <div className="w-full max-w-3xl">
            <div className="border border-brand-border p-4 md:p-8 bg-brand-gray/30 rounded-[2.5rem] flex flex-col items-center">
              {/* Technical Image Section */}
              <div className="w-full flex flex-col items-center">
                <img 
                  src="https://lh3.googleusercontent.com/d/1-yge8FJBElmdQVNQD4CWVmbnZpSatE8j" 
                  alt="Technical Sheet Detail" 
                  className="w-full h-auto rounded-[2rem] shadow-2xl"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/technical/800/600?grayscale';
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechnicalSheet;
