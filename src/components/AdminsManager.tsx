import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, doc, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

interface AdminsManagerProps {
  onClose: () => void;
}

const AdminsManager: React.FC<AdminsManagerProps> = ({ onClose }) => {
  const [admins, setAdmins] = useState<{ id: string; email: string }[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'admins'));
    const unsub = onSnapshot(q, (snap) => {
      const data: any[] = [];
      snap.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
      setAdmins(data);
    });
    return () => unsub();
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const emailToSave = newEmail.trim().toLowerCase();
    if (!emailToSave) return;
    
    if (!emailToSave.includes('@') || !emailToSave.includes('.')) {
      setError('Por favor ingresa un correo válido.');
      return;
    }

    if (admins.find(a => a.email === emailToSave)) {
      setError('Este correo ya es administrador.');
      return;
    }

    try {
      await addDoc(collection(db, 'admins'), { email: emailToSave });
      setSuccess('Administrador agregado con éxito.');
      setNewEmail('');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al guardar en la base de datos.');
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
      <div className="flex items-center mb-6 mt-2">
        <button 
          onClick={onClose}
          className="p-2 mr-2 bg-white/10 hover:bg-white/20 rounded-full transition-all text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-serif text-white">Administradores</h2>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 pr-1 scrollbar-thin">
        <div className="bg-white/5 rounded-xl p-5 border border-white/10">
          <h3 className="text-sm font-serif text-xv-gold mb-1">Agregar Nuevo</h3>
          <p className="text-[10px] text-white/70 font-josefin leading-tight mb-4">
            Escribe el correo de Google de la persona a la que quieres darle acceso al panel.
          </p>
          
          <form onSubmit={handleAddAdmin} className="flex gap-3">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="ejemplo@gmail.com"
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white placeholder-white/40 focus:outline-none focus:border-xv-gold transition-colors text-xs"
              required
            />
            <button
              type="submit"
              className="bg-xv-gold text-xv-black-bg px-4 py-2 rounded-xl font-bold uppercase text-[10px] tracking-wider hover:bg-[#D4AF37] transition-colors"
            >
              Añadir
            </button>
          </form>
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
