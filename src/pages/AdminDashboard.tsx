import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, getDocs, onSnapshot, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AdminsManager from '../components/AdminsManager';

interface AdminDashboardProps {
  isAdmin: boolean | null;
}

function AdminDashboard({ isAdmin }: AdminDashboardProps) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  
  const [adminSubView, setAdminSubView] = useState<'moderation' | 'published' | 'developer' | 'admins'>('moderation');
  const [pendingPhotos, setPendingPhotos] = useState<any[]>([]);
  const [approvedPhotos, setApprovedPhotos] = useState<any[]>([]);
  const [globalSettings, setGlobalSettings] = useState<any>({});

  // Real-time subscription to global settings
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'global'), (snap) => {
      if (snap.exists()) {
        setGlobalSettings(snap.data());
      }
    });
    return () => unsub();
  }, []);

  const toggleDevMode = async () => {
    const newValue = !globalSettings.devMode;
    try {
      await updateDoc(doc(db, 'settings', 'global'), { devMode: newValue });
    } catch (e: any) {
      if (e.code === 'not-found') {
        await setDoc(doc(db, 'settings', 'global'), { devMode: newValue });
      }
    }
  };

  const togglePearlTheme = () => {
    const isPearl = localStorage.getItem('theme') === 'pearl';
    localStorage.setItem('theme', !isPearl ? 'pearl' : 'dark');
    // Force a small visual feedback for the admin 
    alert(`Tema cambiado a: ${!isPearl ? 'Perla/Rojo' : 'Oscuro/Dorado'}. Verás el cambio al volver a la invitación.`);
  };

  const toggleLanguage = () => {
    const newLang = i18n.language === 'es' ? 'en' : 'es';
    i18n.changeLanguage(newLang);
    alert(`Idioma cambiado a: ${newLang === 'es' ? 'Español' : 'Inglés'}`);
  };

  // Subscribe to photos
  useEffect(() => {
    if (!isAdmin) return;

    const qPending = query(collection(db, 'photos'), where('status', '==', 'pending'));
    const unsubPending = onSnapshot(qPending, (snapshot) => {
      const photos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      photos.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setPendingPhotos(photos);
    });

    const qApproved = query(collection(db, 'photos'), where('status', '==', 'approved'));
    const unsubApproved = onSnapshot(qApproved, (snapshot) => {
      const photos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      photos.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
      setApprovedPhotos(photos);
    });

    return () => {
      unsubPending();
      unsubApproved();
    };
  }, [isAdmin]);

  const handleApprovePhoto = async (photoId: string) => {
    try {
      await updateDoc(doc(db, 'photos', photoId), { status: 'approved' });
    } catch (err) {
      console.error("Error approving photo:", err);
    }
  };

  const handleRejectPhoto = async (photoId: string) => {
    try {
      await deleteDoc(doc(db, 'photos', photoId));
    } catch (err) {
      console.error("Error rejecting photo:", err);
    }
  };

  const handleUnpublishPhoto = async (photoId: string) => {
    try {
      await updateDoc(doc(db, 'photos', photoId), { status: 'pending' });
    } catch (err) {
      console.error('Error unpublishing photo:', err);
    }
  };

  const handleDownloadAllPhotos = async () => {
    try {
      if (approvedPhotos.length === 0) {
        alert('No hay fotos aprobadas para descargar todavía.');
        return;
      }
      for (let i = 0; i < approvedPhotos.length; i++) {
        const photo = approvedPhotos[i];
        const link = document.createElement('a');
        link.href = photo.url;
        link.download = photo.fileName || `foto_${i + 1}.webp`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        await new Promise(res => setTimeout(res, 600));
      }
    } catch (err) {
      console.error('Error downloading photos:', err);
      alert('Hubo un error al descargar las fotos.');
    }
  };

  if (isAdmin === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-xv-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="min-h-screen bg-black/95 flex items-center justify-center p-4 font-josefin">
        <div className="bg-[#1a1a1a] w-full max-w-sm rounded-3xl shadow-2xl border border-xv-gold/30 p-8">
          <div className="text-center mb-6">
            <h3 className="font-playfair italic text-2xl text-xv-gold mb-2">Acceso Restringido</h3>
            <div className="w-12 h-0.5 bg-xv-gold/40 mx-auto" />
          </div>
          
          <p className="text-white/80 text-center mb-6 text-sm font-semibold">
            Panel de Administración
          </p>

          <form onSubmit={async (e) => {
            e.preventDefault();
            setIsAuthenticating(true);
            setLoginError('');
            try {
              const emailToUse = loginUser.trim().toLowerCase() === 'anh' ? 'admin@misxv.com' : loginUser.trim();
              await signInWithEmailAndPassword(auth, emailToUse, loginPass);
            } catch (error: any) {
              setLoginError('Usuario o contraseña incorrectos');
            } finally {
              setIsAuthenticating(false);
            }
          }}>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={loginUser}
                  onChange={(e) => setLoginUser(e.target.value)}
                  placeholder="Usuario o Correo"
                  className="w-full bg-white/10 border border-xv-gold/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-xv-gold transition-colors"
                  autoComplete="username"
                  required
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  placeholder="Contraseña"
                  className="w-full bg-white/10 border border-xv-gold/30 rounded-xl px-4 py-3 pr-12 text-white focus:outline-none focus:border-xv-gold transition-colors"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus:outline-none p-1"
                >
                  {showPassword ? 'Ocultar' : 'Ver'}
                </button>
              </div>
              
              {loginError && (
                <p className="text-red-400 text-xs text-center font-bold animate-pulse">
                  {loginError}
                </p>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 py-3 px-4 rounded-xl uppercase tracking-wider text-xs font-bold bg-white/10 text-white/60 hover:bg-white/20 transition-colors"
              >
                Volver
              </button>
              <button
                type="submit"
                disabled={isAuthenticating}
                className="flex-1 py-3 px-4 rounded-xl uppercase tracking-wider text-xs font-bold bg-xv-gold text-black hover:bg-[#D4AF37] transition-colors disabled:opacity-50"
              >
                {isAuthenticating ? 'Cargando...' : 'Entrar'}
              </button>
            </div>

            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-xv-gold/20" />
              <span className="text-xs text-gray-400">O bien</span>
              <div className="flex-1 h-px bg-xv-gold/20" />
            </div>

            <button
              type="button"
              disabled={isAuthenticating}
              onClick={async () => {
                setIsAuthenticating(true);
                setLoginError('');
                try {
                  const provider = new GoogleAuthProvider();
                  provider.setCustomParameters({
                    prompt: 'select_account'
                  });
                  const result = await signInWithPopup(auth, provider);
                  
                  if (result.user.email === 'admin@misxv.com') return;

                  const q = query(collection(db, 'admins'), where('email', '==', result.user.email));
                  const snap = await getDocs(q);
                  
                  if (snap.empty) {
                    await signOut(auth);
                    setLoginError('No tienes permisos de administrador con esta cuenta.');
                  }
                } catch (error: any) {
                  if (error.code !== 'auth/popup-closed-by-user') {
                    setLoginError('Error con Google. Intenta de nuevo.');
                  }
                } finally {
                  setIsAuthenticating(false);
                }
              }}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-white text-gray-800 font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                <path d="M1 1h22v22H1z" fill="none"/>
              </svg>
              Google
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex font-josefin text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111111] border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <div>
            <h1 className="font-playfair italic text-2xl text-xv-gold">Admin</h1>
            <p className="text-[10px] text-white/40 tracking-widest uppercase mt-1">Dashboard</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {[
            { id: 'moderation', icon: '📸', label: 'Moderar Fotos', badge: pendingPhotos.length },
            { id: 'published', icon: '✨', label: 'Fotos Publicadas', badge: approvedPhotos.length },
            { id: 'developer', icon: '🛠️', label: 'Modo Desarrollador' },
            { id: 'admins', icon: '🛡️', label: 'Administradores' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setAdminSubView(item.id as any)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all group ${
                adminSubView === item.id ? 'bg-xv-gold/10 text-xv-gold' : 'hover:bg-white/5 text-white/70 hover:text-white'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <div className="flex-1 flex justify-between items-center">
                <span className="text-xs uppercase tracking-wider font-semibold">{item.label}</span>
                {!!item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    adminSubView === item.id ? 'bg-xv-gold text-black' : 'bg-white/10 text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          ))}

          <div className="pt-4 mt-4 border-t border-white/5 space-y-2">
            {[
              { id: 'theme', icon: '🎨', label: 'Cambiar Tema', action: togglePearlTheme },
              { id: 'lang', icon: '🌐', label: `Idioma: ${i18n.language === 'es' ? 'ES' : 'EN'}`, action: toggleLanguage },
              { id: 'time', icon: '🕐', label: 'Simulador (Próx.)', disabled: true },
              { id: 'guests', icon: '👥', label: 'Invitados (Próx.)', disabled: true },
              { id: 'video', icon: '🎬', label: 'Video (Próx.)', disabled: true },
              { id: 'voice', icon: '🎙️', label: 'Mensajes (Próx.)', disabled: true },
            ].map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                disabled={item.disabled}
                className="w-full flex items-center gap-3 p-2 rounded-xl text-left transition-all hover:bg-white/5 text-white/50 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <span className="text-sm">{item.icon}</span>
                <span className="text-[10px] uppercase tracking-wider font-semibold">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-4 mt-4 border-t border-white/5">
            <button
              onClick={handleDownloadAllPhotos}
              className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all hover:bg-white/5 text-white/70 hover:text-white"
            >
              <span className="text-lg">📥</span>
              <span className="text-xs uppercase tracking-wider font-semibold">Descargar Fotos</span>
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <button
            onClick={() => navigate('/')}
            className="w-full py-2 px-4 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 hover:text-white transition-colors text-xs uppercase tracking-wider"
          >
            Ver Invitación
          </button>
          <button
            onClick={() => signOut(auth)}
            className="w-full py-2 px-4 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors text-xs uppercase tracking-wider font-bold"
          >
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-[#111111] p-6 border-b border-white/5">
          <h2 className="text-xl font-playfair italic text-white">
            {adminSubView === 'moderation' && 'Moderar Fotos Pendientes'}
            {adminSubView === 'published' && 'Galería de Fotos Publicadas'}
            {adminSubView === 'developer' && 'Configuración de Desarrollador'}
            {adminSubView === 'admins' && 'Gestión de Administradores'}
          </h2>
        </header>

        <div className="p-6 max-w-5xl mx-auto">
          {adminSubView === 'moderation' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingPhotos.length === 0 ? (
                <div className="col-span-full py-20 text-center bg-[#111111] rounded-3xl border border-white/5">
                  <p className="text-3xl mb-4">🎉</p>
                  <p className="text-xl font-playfair text-xv-gold mb-2">¡Todo al día!</p>
                  <p className="text-white/50 text-sm">No hay fotos pendientes de moderación.</p>
                </div>
              ) : (
                pendingPhotos.map((photo) => (
                  <div key={photo.id} className="flex gap-4 p-4 bg-[#111111] rounded-2xl border border-white/5 items-center">
                    <img src={photo.url} alt="Pendiente" className="w-24 h-24 object-cover rounded-xl cursor-pointer hover:opacity-80 transition-opacity" onClick={() => window.open(photo.url, '_blank')} />
                    <div className="flex-1">
                      <p className="text-xs text-white/50 truncate mb-3">{photo.fileName}</p>
                      <div className="flex gap-2">
                        <button onClick={() => handleApprovePhoto(photo.id)} className="flex-1 py-2 bg-green-500/20 text-green-400 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-green-500 hover:text-black transition-colors">
                          Aprobar
                        </button>
                        <button onClick={() => handleRejectPhoto(photo.id)} className="flex-1 py-2 bg-red-500/20 text-red-400 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-red-500 hover:text-white transition-colors">
                          Rechazar
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {adminSubView === 'published' && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {approvedPhotos.length === 0 ? (
                <div className="col-span-full py-20 text-center bg-[#111111] rounded-3xl border border-white/5">
                  <p className="text-3xl mb-4">📷</p>
                  <p className="text-xl font-playfair text-xv-gold mb-2">Sin fotos</p>
                  <p className="text-white/50 text-sm">Aún no hay fotos aprobadas en la galería.</p>
                </div>
              ) : (
                approvedPhotos.map((photo) => (
                  <div key={photo.id} className="relative group bg-[#111111] p-2 rounded-2xl border border-white/5">
                    <img src={photo.url} alt="Publicada" className="w-full aspect-square object-cover rounded-xl" />
                    <div className="absolute inset-2 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <button onClick={() => handleUnpublishPhoto(photo.id)} className="px-4 py-2 bg-orange-500/20 text-orange-400 border border-orange-500/50 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-orange-500 hover:text-black transition-colors">
                        Ocultar
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {adminSubView === 'developer' && (
            <div className="bg-[#111111] rounded-3xl border border-white/5 p-8 max-w-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-playfair text-xv-gold mb-2">Fotos de Prueba (MISXV)</h3>
                  <p className="text-sm text-white/60">
                    Sobrescribe la galería pública para mostrar las 5 fotos de prueba. Esto afectará a todos los invitados.
                  </p>
                </div>
                <button
                  onClick={toggleDevMode}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none flex-shrink-0 ${globalSettings?.devMode ? 'bg-xv-gold' : 'bg-gray-700'}`}
                >
                  <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${globalSettings?.devMode ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          )}

          {adminSubView === 'admins' && (
            <div className="bg-[#111111] rounded-3xl border border-white/5 max-w-2xl h-[600px] overflow-hidden">
              <AdminsManager onClose={() => {}} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
