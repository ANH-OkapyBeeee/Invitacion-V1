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
    <div className="flex flex-col h-full bg-white font-josefin">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-xv-pearl sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors shadow-sm"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h2 className="font-playfair text-xl text-xv-red italic">Administradores</h2>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto bg-gray-50/50">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Agregar Nuevo</h3>
          <p className="text-sm text-gray-500 mb-4">
            Escribe el correo de Google de la persona a la que quieres darle acceso al panel.
          </p>
          
          <form onSubmit={handleAddAdmin} className="flex gap-3">
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="ejemplo@gmail.com"
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-800 focus:outline-none focus:border-xv-gold focus:bg-white transition-colors"
              required
            />
            <button
              type="submit"
              className="bg-xv-gold text-xv-black-bg px-6 rounded-xl font-bold uppercase text-xs tracking-wider hover:bg-[#D4AF37] transition-colors"
            >
              Añadir
            </button>
          </form>
          {error && <p className="text-red-500 text-xs font-bold mt-3 animate-pulse">{error}</p>}
          {success && <p className="text-green-600 text-xs font-bold mt-3">{success}</p>}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-gray-800">Cuentas Autorizadas</h3>
          </div>
          
          {admins.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">👥</span>
              </div>
              <p className="text-gray-500 text-sm">No hay administradores agregados aún.</p>
              <p className="text-gray-400 text-xs mt-1">Solo tú puedes entrar con la cuenta principal.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {admins.map(admin => (
                <li key={admin.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-xv-gold/10 rounded-full flex items-center justify-center text-xv-gold">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-700">{admin.email}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveAdmin(admin.id, admin.email)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Revocar acceso"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
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
