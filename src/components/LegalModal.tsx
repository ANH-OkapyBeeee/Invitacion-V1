import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab: 'privacy' | 'terms' | 'cookies';
}

const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, defaultTab }) => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = React.useState<'privacy' | 'terms' | 'cookies'>(defaultTab);

  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  if (!isOpen) return null;

  const isEn = i18n.language === 'en';

  const getTabTitle = () => {
    if (activeTab === 'privacy') return isEn ? 'Privacy Policy' : 'Política de Privacidad';
    if (activeTab === 'terms') return isEn ? 'Terms & Conditions' : 'Términos y Condiciones';
    return isEn ? 'Cookie Policy' : 'Política de Cookies';
  };

  const handleTabChange = (tab: 'privacy' | 'terms' | 'cookies') => {
    navigator.vibrate?.(15);
    setActiveTab(tab);
  };

  const handleClose = () => {
    navigator.vibrate?.(30);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center px-4 py-6 md:p-12 select-none transform translate-z-0"
      role="dialog"
      aria-modal="true"
    >
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-black border-2 border-xv-gold/40 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9),_0_0_30px_rgba(212,175,55,0.15)] flex flex-col max-h-[85vh] md:max-h-[80vh] transition-all duration-300 scale-100 animate-scale-up z-10">
        
        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 border-b border-white/10 flex justify-between items-center bg-white/5 backdrop-blur-md flex-shrink-0">
          <h3 className="font-playfair text-xl sm:text-2xl md:text-2xl text-xv-gold uppercase tracking-wider font-bold leading-tight pr-4">
            <span className="md:hidden">{getTabTitle()}</span>
            <span className="hidden md:inline">{isEn ? 'Legal Information' : 'Información Legal'}</span>
          </h3>
          <button 
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-xv-gold hover:bg-white/10 hover:border-xv-gold/30 transition-all duration-300 cursor-pointer focus:outline-none text-xl flex-shrink-0"
            title={isEn ? 'Close' : 'Cerrar'}
          >
            &times;
          </button>
        </div>

        {/* Tab Selection */}
        <div className="hidden md:flex md:flex-row border-b border-white/10 bg-white/5 backdrop-blur-md flex-shrink-0 font-josefin text-xs uppercase tracking-widest font-bold">
          <button 
            onClick={() => handleTabChange('privacy')}
            className={`flex-1 px-5 text-center cursor-pointer transition-all duration-300 border-b-2 outline-none h-12 md:h-14 flex items-center justify-center leading-none ${
              activeTab === 'privacy' 
                ? 'text-xv-gold border-xv-gold bg-white/10' 
                : 'text-gray-400 border-white/5 md:border-transparent hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            {isEn ? 'Privacy Policy' : 'Política de Privacidad'}
          </button>
          <button 
            onClick={() => handleTabChange('terms')}
            className={`flex-1 px-5 text-center cursor-pointer transition-all duration-300 border-b-2 outline-none h-12 md:h-14 flex items-center justify-center leading-none ${
              activeTab === 'terms' 
                ? 'text-xv-gold border-xv-gold bg-white/10' 
                : 'text-gray-400 border-white/5 md:border-transparent hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            {isEn ? 'Terms & Conditions' : 'Términos y Condiciones'}
          </button>
          <button 
            onClick={() => handleTabChange('cookies')}
            className={`flex-1 px-5 text-center cursor-pointer transition-all duration-300 border-b-2 outline-none h-12 md:h-14 flex items-center justify-center leading-none ${
              activeTab === 'cookies' 
                ? 'text-xv-gold border-xv-gold bg-white/10' 
                : 'text-gray-400 border-white/5 md:border-transparent hover:text-gray-200 hover:bg-white/5'
            }`}
          >
            {isEn ? 'Cookie Policy' : 'Política de Cookies'}
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 font-cormorant text-base md:text-lg text-gray-300 leading-relaxed space-y-6 scroll-smooth select-text custom-scrollbar">
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <section className="space-y-2">
                <h4 className="font-josefin text-xs uppercase tracking-widest text-xv-gold font-bold">
                  1. {isEn ? 'Responsible Entity' : 'Responsable del Tratamiento'}
                </h4>
                <p>
                  {isEn 
                    ? "The organizing family of Betzy Lupita's 15th Birthday party, in cooperation with GuGu | Laboratorio Creativo® as the platform developer, is responsible for the collection and processing of your personal data under the terms described below."
                    : "La familia organizadora de la celebración de XV años de Betzy Lupita, en colaboración con GuGu | Laboratorio Creativo® como desarrollador técnico de la plataforma, son los responsables del tratamiento de los datos personales que se recopilan a través de este sitio web."}
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-josefin text-xs uppercase tracking-widest text-xv-gold font-bold">
                  2. {isEn ? 'Data Collected' : 'Datos Personales Recopilados'}
                </h4>
                <p>
                  {isEn
                    ? "We collect only data provided voluntarily by visitors, consisting of: (a) Photographs and videos uploaded through the 'Capture the Moment' section to be displayed in the event gallery, and (b) The name or alias you choose to assign to those files."
                    : "Para el uso óptimo del sitio, únicamente recopilamos información proporcionada de manera voluntaria por ti, consistente en: (a) Archivos de imagen y video que decidas subir a través de la sección \"Captura el Momento\", y (b) El nombre o apodo que decidas asociar a dichas fotos."}
                </p>
                <p>
                  {isEn
                    ? "We do not request passwords, credit card numbers, or any sensitive personal information."
                    : "En ningún momento solicitamos contraseñas, claves, datos de pago ni datos personales de categoría sensible."}
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-josefin text-xs uppercase tracking-widest text-xv-gold font-bold">
                  3. {isEn ? 'Purpose of Processing' : 'Finalidades del Tratamiento'}
                </h4>
                <p>
                  {isEn
                    ? "Your information is processed for the following purposes:"
                    : "El tratamiento de los datos se realiza estrictamente para las siguientes finalidades:"}
                </p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>
                    {isEn 
                      ? "To display the pictures/videos in the digital gallery on this invitation site." 
                      : "Mostrar las fotografías y videos subidos en la galería digital interactiva del sitio."}
                  </li>
                  <li>
                    {isEn 
                      ? "To build a digital memory album for the Quinceañera and her family." 
                      : "Generar un álbum digital de recuerdos para la Quinceañera y su familia."}
                  </li>
                  <li>
                    {isEn 
                      ? "To review and moderate uploads, ensuring a safe and family-friendly environment." 
                      : "Monitorear e impedir la visualización de imágenes inapropiadas o ajenas al evento."}
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="font-josefin text-xs uppercase tracking-widest text-xv-gold font-bold">
                  4. {isEn ? 'Access, Rectification, Cancellation, and Opposition (ARCO Rights)' : 'Derechos ARCO (Acceso, Rectificación, Cancelación y Oposición)'}
                </h4>
                <p>
                  {isEn
                    ? "As the owner of your uploaded content, you have the right to access, rectify, cancel, or oppose its display. If you wish to delete a photo or video you uploaded, you may request it by sending a WhatsApp message to GuGu | Laboratorio Creativo® at +52 720 422 3213, and it will be deleted immediately from our systems and Firebase databases."
                    : "Como titular del contenido, tienes en todo momento el derecho de acceder, rectificar, cancelar u oponerte a su visualización. Si deseas eliminar cualquier foto o video que hayas subido, puedes solicitarlo enviando un mensaje al WhatsApp de GuGu | Laboratorio Creativo® (+52 720 422 3213) y la eliminaremos de forma inmediata de nuestros servidores y base de datos de Firebase."}
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-josefin text-xs uppercase tracking-widest text-xv-gold font-bold">
                  5. {isEn ? 'Security and Laws' : 'Disposiciones Legales y Seguridad'}
                </h4>
                <p>
                  {isEn
                    ? "This policy complies with the Federal Law on Protection of Personal Data Held by Private Parties (LFPDPPP) in Mexico and incorporates international best practices aligned with the General Data Protection Regulation (GDPR)."
                    : "Este aviso de privacidad se alinea con la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) en los Estados Unidos Mexicanos y adopta los estándares y mejores prácticas del Reglamento General de Protección de Datos (GDPR) de la Unión Europea."}
                </p>
              </section>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-6">
              <section className="space-y-2">
                <h4 className="font-josefin text-xs uppercase tracking-widest text-xv-gold font-bold">
                  1. {isEn ? 'Acceptance of Terms' : 'Aceptación de los Términos'}
                </h4>
                <p>
                  {isEn
                    ? "By accessing this digital invitation and using its interactive sections, you agree to be bound by these Terms and Conditions. If you do not agree, please refrain from uploading content to this site."
                    : "Al acceder a esta invitación digital y utilizar sus secciones interactivas, manifiestas tu aceptación incondicional a los presentes Términos y Condiciones. Si no estás de acuerdo con ellos, te solicitamos abstenerte de hacer uso de la carga de fotos."}
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-josefin text-xs uppercase tracking-widest text-xv-gold font-bold">
                  2. {isEn ? 'Permitted Use' : 'Uso Autorizado y Carácter de la Plataforma'}
                </h4>
                <p>
                  {isEn
                    ? "This website is a private digital wedding/birthday tool designed for personal, non-commercial use by the family and invited guests of Betzy Lupita. Any unauthorized distribution, reverse engineering, or commercial exploitation of this site is strictly prohibited."
                    : "Este sitio web es una herramienta digital de carácter privado, familiar y recreativo creada exclusivamente para los invitados de la quinceañera Betzy Lupita. Queda prohibida la reproducción, distribución o explotación comercial no autorizada del sitio web o sus elementos."}
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-josefin text-xs uppercase tracking-widest text-xv-gold font-bold">
                  3. {isEn ? 'Content Guidelines and Uploads' : 'Reglas de Carga de Contenido'}
                </h4>
                <p>
                  {isEn
                    ? "When uploading files to the 'Capture the Moment' gallery, you declare that you are the author of the media or have the consent of the individuals appearing in it. You are strictly prohibited from uploading content that is:"
                    : "Al cargar fotos o videos a la sección de la galería, declaras ser el titular de los derechos de autor de dicho material o contar con el consentimiento de las personas que aparezcan en él. Queda estrictamente prohibido subir contenido que sea:"}
                </p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>{isEn ? "Defamatory, offensive, violent, or sexually explicit." : "Ofensivo, violento, difamatorio, ilegal o con contenido de carácter sexual explícito."}</li>
                  <li>{isEn ? "Infringing on third-party intellectual property or copyrights." : "Que infrinja derechos de marca, propiedad intelectual o derechos de imagen de terceros."}</li>
                  <li>{isEn ? "Unrelated to the celebration of the XV Birthday party." : "Ajeno al evento social o de índole publicitaria/spam."}</li>
                </ul>
                <p>
                  {isEn
                    ? "Site administrators reserve the absolute right to delete any image or video without prior notice."
                    : "Los administradores y el desarrollador técnico se reservan el derecho absoluto de filtrar, moderar o retirar cualquier imagen sin previo aviso y sin responsabilidad alguna."}
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-josefin text-xs uppercase tracking-widest text-xv-gold font-bold">
                  4. {isEn ? 'Intellectual Property' : 'Propiedad Intelectual'}
                </h4>
                <p>
                  {isEn
                    ? "All interface designs, branding, source code, custom graphics, and the name GuGu | Laboratorio Creativo® are the intellectual property of GuGu | Laboratorio Creativo® and are protected under international laws."
                    : "Todos los diseños, código fuente, ilustraciones, animaciones, logotipos e identidad comercial de GuGu | Laboratorio Creativo® pertenecen a sus respectivos desarrolladores y están protegidos por las leyes locales e internacionales de propiedad industrial e intelectual."}
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-josefin text-xs uppercase tracking-widest text-xv-gold font-bold">
                  5. {isEn ? 'Limitation of Liability' : 'Exclusión de Responsabilidades'}
                </h4>
                <p>
                  {isEn
                    ? "This invitation and gallery service are provided 'as is'. We do not guarantee continuous uptime or absolute prevention of data loss. We are not responsible for how other guests or third parties use or share the photos displayed in the public gallery."
                    : "El servicio se brinda \"tal cual\". No se garantiza la disponibilidad permanente del sitio ni la inmutabilidad de los datos ante posibles incidentes técnicos ajenos a nuestro control. El responsable no asume responsabilidad alguna por el uso que terceros den a las imágenes que tú decidas compartir de forma pública en la galería del evento."}
                </p>
              </section>
            </div>
          )}

          {activeTab === 'cookies' && (
            <div className="space-y-6">
              <section className="space-y-2">
                <h4 className="font-josefin text-xs uppercase tracking-widest text-xv-gold font-bold">
                  1. {isEn ? 'What are Cookies?' : '¿Qué son las Cookies?'}
                </h4>
                <p>
                  {isEn
                    ? "Cookies are small text files saved to your web browser that store basic preferences to optimize and personalize your experience on websites."
                    : "Las cookies son pequeños archivos de texto que los sitios web guardan en el navegador de tu computadora o dispositivo móvil para recordar preferencias y facilitar un funcionamiento más ágil y personalizado."}
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-josefin text-xs uppercase tracking-widest text-xv-gold font-bold">
                  2. {isEn ? 'Technical and Essential Storage Only' : 'Uso de Cookies y Almacenamiento Técnico'}
                </h4>
                <p>
                  {isEn
                    ? "This website does NOT use advertising cookies, third-party profiling, or analytics trackers. We use local browser storage (localStorage) only for strictly technical purposes:"
                    : "Este sitio web NO utiliza cookies publicitarias, rastreadores comerciales de comportamiento ni perfiles de mercadotecnia. Únicamente empleamos el almacenamiento local del navegador (localStorage) para fines puramente técnicos y operativos:"}
                </p>
                <ul className="list-disc pl-6 space-y-1.5">
                  <li>
                    <strong>{isEn ? "Language Selection: " : "Selección de Idioma: "}</strong>
                    {isEn ? "To remember if you selected English or Spanish." : "Para recordar si seleccionaste Español o Inglés."}
                  </li>
                  <li>
                    <strong>{isEn ? "Preloader State: " : "Estado de Carga (Preloader): "}</strong>
                    {isEn ? "To avoid showing you the loading animation multiple times in the same session." : "Para evitar mostrarte la pantalla de carga repetidamente en una misma visita."}
                  </li>
                  <li>
                    <strong>{isEn ? "Music Player Settings: " : "Preferencias de Audio: "}</strong>
                    {isEn ? "To remember if you chose to play or mute the background music." : "Para recordar si elegiste mantener activado o silenciado el reproductor de música."}
                  </li>
                </ul>
              </section>

              <section className="space-y-2">
                <h4 className="font-josefin text-xs uppercase tracking-widest text-xv-gold font-bold">
                  3. {isEn ? 'Your Consent' : 'Tu Consentimiento'}
                </h4>
                <p>
                  {isEn
                    ? "By continuing to browse this digital invitation and using its buttons, you consent to the use of these essential technical files."
                    : "Al interactuar con esta invitación y mantenerte navegando en sus secciones, aceptas que almacenemos esta información de funcionalidad mínima en tu navegador."}
                </p>
              </section>

              <section className="space-y-2">
                <h4 className="font-josefin text-xs uppercase tracking-widest text-xv-gold font-bold">
                  4. {isEn ? 'Disabling Cookies' : 'Bloqueo y Eliminación de Cookies'}
                </h4>
                <p>
                  {isEn
                    ? "You can configure your browser to block, limit, or delete cookies and local storage through your browser's security/privacy preferences. Please note that disabling these options may reset your preferences (like having the music play automatically or language switching) on your next visit."
                    : "Puedes cambiar la configuración de tu navegador para rechazar, bloquear o borrar el almacenamiento técnico en cualquier momento desde el menú de privacidad de tu dispositivo. Ten en cuenta que si bloqueas estas configuraciones, no podremos recordar tus preferencias (como el estado del silenciador de música o el idioma) y estas se restablecerán la próxima vez que ingreses."}
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/10 flex justify-end bg-white/5 backdrop-blur-md flex-shrink-0">
          <button 
            onClick={handleClose}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-xv-gold to-[#8A5A19] text-white font-josefin text-xs uppercase tracking-widest font-bold shadow-[0_4px_12px_rgba(212,175,55,0.3)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none"
          >
            {isEn ? 'Close' : 'Cerrar'}
          </button>
        </div>

      </div>
    </div>
  );
};

export default LegalModal;
