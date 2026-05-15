import { useTranslation } from 'react-i18next';

interface DressCodeProps {
  onTipSelect: (id: number | null) => void;
  activeTip: number | null;
}

const DressCode = ({ onTipSelect, activeTip }: DressCodeProps) => {
  const { t } = useTranslation();

  return (
    <section className="py-20 px-4 bg-xv-pearl text-center relative">
      <div className="max-w-[480px] mx-auto">
        <h2 className="text-center font-playfair italic text-4xl text-xv-red mb-8 animate-shimmer">{t('dresscode.title')}</h2>

        <div className="font-josefin uppercase tracking-[0.15em] text-lg text-xv-black-bg mb-4 font-bold">
          {t('dresscode.subtitle')}
        </div>
        
        <p className="font-cormorant text-lg text-gray-600 mb-10 leading-relaxed px-2">
          {t('dresscode.desc')}
        </p>

        {/* Tips Section Title */}
        <div className="font-playfair italic text-2xl text-xv-gold mb-6 mt-4">
          Tips y Notas
        </div>

        {/* Note Cards Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {/* Tip 1 */}
          <div 
            onClick={() => onTipSelect(activeTip === 1 ? null : 1)}
            className={`relative cursor-pointer p-4 rounded-2xl border transition-all duration-300 shadow-md flex flex-col items-center justify-center min-h-[140px]
              ${activeTip === 1 
                ? 'bg-[#4A0008] border-xv-gold text-white scale-105 shadow-xl' 
                : 'bg-[#6E1423] border-xv-gold/30 text-white hover:bg-[#5a101c] shadow-[0_0_15px_rgba(212,175,55,0.25)]'}`}
          >
            <div className="text-4xl mb-2">👗</div>
            <h3 className="font-josefin font-bold text-xv-gold uppercase tracking-widest text-sm mb-1">Tip 1</h3>
            <p className={`font-cormorant italic text-white/70 text-xs ${activeTip !== 1 ? 'animate-strong-pulse' : ''}`}>
              {activeTip === 1 ? 'Cerrar detalles' : 'Toca para más detalles'}
            </p>
            <div className="absolute -bottom-2 -right-1 text-2xl animate-hand-1 drop-shadow-lg z-20">
              👆
            </div>
          </div>

          {/* Tip 2 */}
          <div 
            onClick={() => onTipSelect(activeTip === 2 ? null : 2)}
            className={`relative cursor-pointer p-4 rounded-2xl border transition-all duration-300 shadow-md flex flex-col items-center justify-center min-h-[140px]
              ${activeTip === 2 
                ? 'bg-[#4A0008] border-xv-gold text-white scale-105 shadow-xl' 
                : 'bg-[#6E1423] border-xv-gold/30 text-white hover:bg-[#5a101c] shadow-[0_0_15px_rgba(212,175,55,0.25)]'}`}
          >
            <div className="text-4xl mb-2">📝</div>
            <h3 className="font-josefin font-bold text-xv-gold uppercase tracking-widest text-sm mb-1">Tip 2</h3>
            <p className={`font-cormorant italic text-white/70 text-xs ${activeTip !== 2 ? 'animate-strong-pulse' : ''}`}>
              {activeTip === 2 ? 'Cerrar detalles' : 'Toca para más detalles'}
            </p>
            <div className="absolute -bottom-2 -right-1 text-2xl animate-hand-2 drop-shadow-lg z-20">
              👆
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default DressCode;
