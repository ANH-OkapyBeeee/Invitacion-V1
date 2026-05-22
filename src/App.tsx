import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Invitation from './pages/Invitation';
import AdminDashboard from './pages/AdminDashboard';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

function App() {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.email === 'admin@misxv.com') {
          setIsAdmin(true);
        } else {
          // Check admins collection
          const q = query(collection(db, 'admins'), where('email', '==', user.email));
          const snap = await getDocs(q);
          setIsAdmin(!snap.empty);
        }
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsub();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Invitation />} />
        <Route 
          path="/admin" 
          element={<AdminDashboard isAdmin={isAdmin} />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
