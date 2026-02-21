
import React, { useState, useRef, useEffect } from 'react';
import { ADVANTAGE_PRODUCTS } from '../constants';
import { Language } from '../types';

const TELEGRAM_BOT_TOKEN = '8268291221:AAGjOqG-nKzXxjbd4uuZ0A9OBnRtRnE7Lco'; 
const TELEGRAM_CHAT_ID = '1205997493'; 

interface AdvantageModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: any) => string;
  lang: Language;
  setLang: (l: Language) => void;
}

const AdvantageModal: React.FC<AdvantageModalProps> = ({ isOpen, onClose, t, lang, setLang }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [error, setError] = useState(false);
  
  const [pharmacyName, setPharmacyName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [productQuantities, setProductQuantities] = useState<Record<number, number>>({});

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleVerify = () => {
    if (password.toLowerCase() === 'ox') {
      setIsVerified(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1000);
      setPassword('');
    }
  };

  const calculateMF = (qty: number) => {
    if (qty >= 50) return 10;
    if (qty >= 20) return 5;
    if (qty >= 10) return 2;
    return 0;
  };

  const updateScrollProgress = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const totalScroll = scrollWidth - clientWidth;
      if (totalScroll > 0) {
        const progress = (scrollLeft / totalScroll) * 100;
        setScrollProgress(progress);
      }
    }
  };

  useEffect(() => {
    if (isVerified) {
      const el = scrollRef.current;
      if (el) {
        el.addEventListener('scroll', updateScrollProgress, { passive: true });
        updateScrollProgress();
        return () => el.removeEventListener('scroll', updateScrollProgress);
      }
    }
  }, [isVerified]);

  const sendToTelegram = async (message: string) => {
    try {
      const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        })
      });
      return response.ok;
    } catch (err) {
      return false;
    }
  };

  const handleLocationAndSend = () => {
    if (!pharmacyName || !contactInfo) {
      alert(t('form_missing')); 
      return;
    }
    setIsLocating(true);
    if (!navigator.geolocation) {
      alert(t('location_error'));
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const locationLink = `https://www.google.com/maps?q=${lat},${lng}`;
        const message = `🚀 *Boutique Partnership Inquiry*\n🏢 *Pharmacy:* ${pharmacyName}\n📞 *Contact:* ${contactInfo}\n📍 [View Location](${locationLink})`;
        const success = await sendToTelegram(message);
        setIsLocating(false);
        if (success) {
          setIsSubmitted(true);
          setTimeout(() => { 
            setIsSubmitted(false); 
            setShowRegister(false); 
            setPharmacyName(''); 
            setContactInfo(''); 
          }, 3000);
        }
      },
      (err) => { setIsLocating(false); alert(t('location_error')); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex flex-col bg-white animate-fade-in overflow-hidden">
      
      {/* Global Close Button */}
      <button 
        onClick={onClose} 
        className="fixed top-6 right-6 md:top-10 md:right-10 w-14 h-14 rounded-full bg-brand-black text-white flex items-center justify-center hover:bg-brand-gold hover:scale-110 transition-all duration-500 z-[300] shadow-2xl group"
      >
        <span className="text-xl group-hover:rotate-90 transition-transform">✕</span>
      </button>

      <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar bg-white">
        
        {!isVerified && !showRegister ? (
          /* LÜKS ŞİFRE EKRANI */
          <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-brand-white relative">
            <div className="absolute inset-0 bg-brand-gold/[0.02] pointer-events-none"></div>
            
            <div className={`w-full max-w-xl space-y-12 text-center transition-all duration-700 ${error ? 'animate-shake' : ''}`}>
              <div className="space-y-6">
                <div className="w-24 h-24 bg-brand-black rounded-full mx-auto flex items-center justify-center shadow-2xl mb-10 border border-brand-gold/10">
                   <span className="text-brand-gold text-2xl font-header font-black tracking-widest">OX</span>
                </div>
                <span className="text-brand-gold text-[10px] md:text-[12px] font-bold tracking-[0.8em] uppercase block">
                  {t('expert_badge')}
                </span>
                <h2 className="text-5xl md:text-7xl font-header font-black uppercase tracking-widest text-brand-black">
                  BOUTIQUE ACCESS
                </h2>
                <p className="text-brand-black/40 text-sm md:text-base italic font-light">
                  {t('advantage_desc')}
                </p>
              </div>

              <div className="space-y-8 relative z-10">
                <div className="relative max-w-md mx-auto">
                  <input 
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                    placeholder={t('advantage_password_placeholder')}
                    className={`w-full bg-brand-gray border rounded-[2rem] px-10 py-6 text-center focus:outline-none transition-all duration-500 text-xl font-bold tracking-[0.2em] ${error ? 'border-red-500 bg-red-50 animate-shake' : 'border-brand-border focus:border-brand-gold/50 shadow-inner'}`}
                  />
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-brand-black/20 hover:text-brand-gold transition-colors"
                  >
                    {showPassword ? '✕' : '👁'}
                  </button>
                </div>

                <div className="flex flex-col gap-4 max-w-md mx-auto">
                  <button 
                    onClick={handleVerify}
                    className="w-full py-6 bg-brand-black text-white font-bold uppercase tracking-[0.5em] text-[11px] rounded-[2rem] hover:bg-brand-gold active:scale-95 transition-all duration-700 shadow-xl"
                  >
                    {t('btn_login')}
                  </button>
                  <button 
                    onClick={() => setShowRegister(true)}
                    className="text-[10px] font-bold text-brand-black/20 hover:text-brand-black uppercase tracking-[0.4em] transition-colors"
                  >
                    {t('btn_register_toggle')}
                  </button>
                </div>
              </div>

              <div className="pt-20 opacity-[0.03] grayscale pointer-events-none select-none">
                 <h3 className="text-[10rem] font-header font-black tracking-tighter uppercase leading-none">OX SERIES</h3>
              </div>
            </div>
          </div>
        ) : showRegister ? (
          /* BAYİ KAYIT EKRANI */
          <div className="min-h-screen flex items-center justify-center p-8 bg-brand-gray/30 animate-fade-in">
            <div className="w-full max-w-4xl bg-white rounded-[4rem] p-12 md:p-20 shadow-3xl border border-brand-border text-center space-y-12">
              {isSubmitted ? (
                <div className="space-y-8 py-10 animate-fade-up">
                  <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto text-4xl border border-green-100">✓</div>
                  <h3 className="text-4xl md:text-6xl font-header font-black uppercase tracking-widest">{t('form_success')}</h3>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    <h2 className="text-5xl md:text-8xl font-header font-black uppercase tracking-widest text-brand-black">{t('partner_form_title')}</h2>
                    <p className="text-brand-black/40 text-sm italic">{lang === 'tr' ? 'OX dünyasına profesyonel adımınızı atın.' : 'Step into the OX professional world.'}</p>
                  </div>

                  <div className="space-y-6 max-w-2xl mx-auto">
                    <input 
                      type="text" 
                      placeholder={t('pharmacy_placeholder')}
                      value={pharmacyName}
                      onChange={(e) => setPharmacyName(e.target.value)}
                      className="w-full bg-brand-gray border border-brand-border rounded-3xl px-8 py-6 focus:outline-none focus:border-brand-gold transition-all"
                    />
                    <input 
                      type="text" 
                      placeholder={t('contact_placeholder')}
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      className="w-full bg-brand-gray border border-brand-border rounded-3xl px-8 py-6 focus:outline-none focus:border-brand-gold transition-all"
                    />
                    <button 
                      onClick={handleLocationAndSend}
                      disabled={isLocating}
                      className="w-full py-6 bg-brand-black text-white font-bold uppercase tracking-[0.5em] text-[11px] rounded-3xl hover:bg-brand-gold transition-all duration-700 shadow-xl"
                    >
                      {isLocating ? t('form_processing') : t('btn_send_location')}
                    </button>
                    <button 
                      onClick={() => setShowRegister(false)}
                      className="text-[10px] font-bold text-brand-black/20 hover:text-brand-black uppercase tracking-[0.3em] mt-4"
                    >
                      {t('btn_back')}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ) : (
          /* ÜRÜN KATALOĞU */
          <div className="min-h-screen p-8 md:p-16 lg:p-24 flex flex-col bg-white animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-12 border-b border-brand-border pb-16">
              <div className="space-y-8">
                <h2 className="text-7xl md:text-[10rem] font-header font-black tracking-tighter uppercase leading-[0.8] text-brand-black">
                  Premier <br /> <span className="text-brand-gold italic">Advantage</span>
                </h2>
                <div className="px-6 py-2 bg-brand-black text-white rounded-full text-[11px] font-bold uppercase tracking-[0.3em] w-fit">
                  {lang === 'tr' ? 'BAYİ MARJI: %60' : 'PARTNER MARGIN: %60'}
                </div>
              </div>
              <button 
                onClick={() => setLang(lang === 'tr' ? 'en' : 'tr')}
                className="px-6 py-2 bg-brand-gray rounded-full text-[10px] font-black uppercase tracking-widest"
              >
                {lang === 'tr' ? 'ENGLISH' : 'TÜRKÇE'}
              </button>
            </div>

            <div className="relative flex-1">
              <div 
                ref={scrollRef}
                className="flex gap-10 md:gap-16 lg:gap-20 overflow-x-auto hide-scrollbar snap-x snap-mandatory pb-24 -mx-8 px-8 md:mx-0 md:px-0"
              >
                {ADVANTAGE_PRODUCTS.map((prod, i) => (
                  <div 
                    key={i} 
                    className="flex-shrink-0 w-[85vw] md:w-[500px] snap-center bg-white border border-brand-border rounded-[4rem] overflow-hidden hover:shadow-2xl transition-all duration-700 flex flex-col group"
                  >
                    <div className="aspect-square bg-brand-gray relative overflow-hidden">
                      <img 
                        src={prod.image} 
                        alt={prod.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s]" 
                        loading="lazy"
                      />
                      <div className="absolute top-8 right-8 px-5 py-2 bg-brand-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full">{prod.volume}</div>
                    </div>

                    <div className="p-10 flex-1 flex flex-col justify-between">
                      <div className="space-y-8">
                        <div className="space-y-3">
                          <h4 className="text-4xl md:text-5xl font-header font-black uppercase tracking-widest text-brand-black">{prod.name}</h4>
                          <p className="text-sm md:text-base text-brand-black/50 italic">{prod.description}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-y-8 border-t border-brand-border/40 pt-8">
                           <div className="space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-widest opacity-20">{t('price')}</span>
                              <p className="text-2xl font-header font-black text-brand-gold">{prod.price}</p>
                           </div>
                           <div className="space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-widest opacity-20">{t('margin')}</span>
                              <p className="text-2xl font-header font-black">%{prod.margin.replace('%','')}</p>
                           </div>
                           <div className="space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-widest opacity-20">{t('cost')}</span>
                              <p className="text-xl font-header font-bold text-brand-black/30">{prod.cost}</p>
                           </div>
                           <div className="space-y-1">
                              <span className="text-[10px] font-bold uppercase tracking-widest opacity-20">{t('profit')}</span>
                              <p className="text-xl font-header font-bold text-green-600">+{prod.profit}</p>
                           </div>
                        </div>
                      </div>

                      {/* Prominent Bottom Section for Quantity and MF */}
                      <div className="mt-12 pt-8 border-t border-brand-border flex gap-4 md:gap-6 items-stretch">
                        <div className="flex-1 space-y-3">
                          <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-brand-black/30 block ml-2">{t('label_quantity')}</label>
                          <input 
                            type="number"
                            placeholder="0"
                            value={productQuantities[i] || ''}
                            onChange={(e) => setProductQuantities({ ...productQuantities, [i]: parseInt(e.target.value) || 0 })}
                            className="w-full bg-brand-gray rounded-[1.5rem] px-4 md:px-6 py-5 text-center text-xl font-black focus:outline-none focus:border-brand-gold border-2 border-brand-border transition-all duration-300"
                          />
                        </div>
                        <div className="flex-1 space-y-3">
                          <label className="text-[10px] md:text-[11px] font-black uppercase tracking-widest text-brand-black/30 block ml-2">{t('label_mf')}</label>
                          <div className={`w-full py-5 rounded-[1.5rem] flex items-center justify-center font-header text-3xl font-black transition-all duration-500 border-2 ${calculateMF(productQuantities[i] || 0) > 0 ? 'bg-brand-black text-brand-gold border-brand-black' : 'bg-brand-gray text-brand-black/10 border-brand-border'}`}>
                            {calculateMF(productQuantities[i] || 0)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="w-full max-w-sm mx-auto h-1 bg-brand-gray rounded-full overflow-hidden mt-12 mb-10">
              <div 
                className="h-full bg-brand-black transition-all duration-300" 
                style={{ width: `${scrollProgress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #0A0A0A; border-radius: 10px; }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-10px); }
          40%, 80% { transform: translateX(10px); }
        }
        .animate-shake { animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
      `}} />
    </div>
  );
};

export default AdvantageModal;
