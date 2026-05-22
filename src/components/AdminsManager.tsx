import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, deleteDoc, addDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { db, auth } from '../firebase';

interface AdminsManagerProps {
  onClose: () => void;
}

const AdminsManager: React.FC<AdminsManagerProps> = ({ onClose }) => {
  const [admins, setAdmins] = useState<{ id: string; email: string }[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'admins'));
    const unsub = onSnapshot(q, (snap) => {
      const data: any[] = [];
      snap.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
      setAdmins(data);
    });
    return () => unsub();
  }, []);

  const handleGoogleAuth = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      
      const email = result.user.email;
      if (!email) throw new Error('No se pudo obtener el correo.');

      if (admins.find(a => a.email === email)) {
        setError('Este correo ya es administrador.');
        setIsLoading(false);
        return;
      }

      await addDoc(collection(db, 'admins'), { email });
      setSuccess('Cuenta de Google autorizada. Cerrando sesión...');
      setTimeout(() => signOut(auth), 2000);
      
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Error al conectar con Google.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const emailToSave = newEmail.trim().toLowerCase();
    
    if (!emailToSave || !newPassword) {
      setError('Por favor llena los campos requeridos.');
      return;
    }
    
    if (!emailToSave.includes('@') || !emailToSave.includes('.')) {
      setError('Por favor ingresa un correo válido.');
      return;
    }

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (admins.find(a => a.email === emailToSave)) {
      setError('Este correo ya es administrador.');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Create the Auth account
      await createUserWithEmailAndPassword(auth, emailToSave, newPassword);
      
      // 2. Add to admins collection
      await addDoc(collection(db, 'admins'), { email: emailToSave });
      
      setSuccess('Cuenta creada. Cerrando sesión por seguridad...');
      setNewEmail('');
      setNewPassword('');
      
      setTimeout(() => {
        signOut(auth);
      }, 2000);
      
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('El correo ya tiene una cuenta en el sistema.');
      } else {
        setError('Error al crear la cuenta. Intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveAdmin = async (id: string, email: string) => {
    if (window.confirm(`¿Estás seguro de que quieres quitarle el acceso a ${email}?`)) {
      try {
        await deleteDoc(doc(db, 'admins', id));
      } catch (err) {
        alert('Error al eliminar administrador.');
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-transparent font-josefin">
      <div className="flex-1 overflow-y-auto space-y-6 pr-1 scrollbar-thin p-6">
        <div className="bg-white/5 rounded-xl p-5 border border-white/10">
          <h3 className="text-sm font-serif text-xv-gold mb-1">Agregar Nuevo</h3>
          <p className="text-[10px] text-white/70 font-josefin leading-tight mb-6">
            Otorga acceso autorizando una cuenta de Google, o creando una cuenta manualmente con correo y contraseña.
          </p>
          
          <div className="flex flex-col gap-4">
            <button
              type="button"
              disabled={isLoading}
              onClick={handleGoogleAuth}
              className="w-full flex items-center justify-center gap-3 py-2 px-4 rounded-xl bg-white text-gray-800 font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 text-xs"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                <path d="M1 1h22v22H1z" fill="none"/>
              </svg>
              Continuar con Google
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10"></div>
              <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">o bien</span>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>

            <form onSubmit={handleAddAdmin} className="flex flex-col gap-3">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="correo@ejemplo.com"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-xv-gold transition-colors text-xs"
                required
              />
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Contraseña (mínimo 6 caracteres)"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-xv-gold transition-colors text-xs"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-xv-gold text-xv-black-bg px-4 py-2 rounded-xl font-bold uppercase text-[10px] tracking-wider hover:bg-[#D4AF37] transition-colors disabled:opacity-50 mt-1"
              >
                {isLoading ? 'Procesando...' : 'Crear Cuenta Manual'}
              </button>
            </form>
          </div>
          {error && <p className="text-red-400 text-[10px] font-bold mt-2 animate-pulse">{error}</p>}
          {success && <p className="text-green-400 text-[10px] font-bold mt-2">{success}</p>}
        </div>

        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="p-3 border-b border-white/10 bg-black/20">
            <h3 className="font-serif text-sm text-xv-gold">Cuentas Autorizadas</h3>
          </div>
          
          {admins.length === 0 ? (
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-xl">👥</span>
              </div>
              <p className="text-white/60 text-xs">No hay administradores agregados aún.</p>
              <p className="text-white/40 text-[10px] mt-1">Solo tú puedes entrar con la cuenta principal.</p>
            </div>
          ) : (
            <ul className="divide-y divide-white/5">
              {admins.map(admin => (
                <li key={admin.id} className="p-3 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-xv-gold/20 rounded-full flex items-center justify-center text-xv-gold">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="font-medium text-white/90 text-xs">{admin.email}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveAdmin(admin.id, admin.email)}
                    className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                    title="Revocar acceso"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminsManager;
