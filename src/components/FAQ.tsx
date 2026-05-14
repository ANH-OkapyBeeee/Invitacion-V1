import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const FAQ = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
    { q: t('faq.q6'), a: t('faq.a6') },
    { q: t('faq.q7'), a: t('faq.a7') },
    { q: t('faq.q8'), a: t('faq.a8') }
  ];

  return (
    <section className="py-20 px-4 bg-xv-pearl">
      <div className="max-w-[480px] mx-auto">
        <h2 className="font-playfair italic text-4xl text-xv-red mb-12 text-center animate-shimmer">{t('faq.title')}</h2>

        <div className="flex flex-col gap-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-xv-gold/20 overflow-hidden">
              <button 
                className="w-full text-left p-5 flex justify-between items-center bg-white touch-manipulation"
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <span className="font-playfair text-xv-red text-lg font-bold pr-4">{faq.q}</span>
                <span className={`text-xv-gold text-2xl transition-transform duration-300 flex-shrink-0 ${openIndex === idx ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              
              <div 
                className={`transition-all duration-300 ease-in-out ${openIndex === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="p-5 pt-0 font-cormorant italic text-gray-600 text-lg leading-relaxed border-t border-gray-100 mt-2">
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
