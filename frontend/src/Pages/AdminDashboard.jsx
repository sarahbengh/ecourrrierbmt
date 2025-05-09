import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar'; // ← appel de ton composant Sidebar
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return null;
}

function AdminDashboard() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/auth/me', { withCredentials: true })
      .then(res => setCurrentUser(res.data))
      .catch(err => console.error("Erreur récupération user connecté", err));

    axios.get('http://localhost:5000/auth/users', { withCredentials: true })
      .then(res => setUtilisateurs(res.data.utilisateurs))
      .catch(err => {
        if (err.response?.status === 403) {
          navigate('/unauthorized');
        } else {
          setError("Impossible de récupérer les utilisateurs");
        }
      });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const csrfToken = getCookie('csrf_access_token');
      const res = await axios.post('http://localhost:5000/auth/logout', {}, {
        headers: { 'X-CSRF-TOKEN': csrfToken },
        withCredentials: true
      });
      alert(res.data.message);
      navigate('/LoginPage');
    } catch (err) {
      console.error('Erreur de déconnexion:', err);
      setError('Impossible de se déconnecter');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {/* ✅ Sidebar importée */}
      <Sidebar />

      {/* ✅ Main content */}
      <div className="flex-1 flex flex-col p-8 overflow-y-auto relative">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">Dashboard Admin</h1>
          {currentUser && (
            <div className="relative group">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer shadow">
                {currentUser.role?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute right-0 top-12 bg-white shadow-lg rounded p-4 hidden group-hover:block z-50">
                <p className="font-bold text-gray-700">{currentUser.nom} {currentUser.prenom}</p>
                <p className="text-sm text-gray-500">{currentUser.role}</p>
                <div className="mt-2 space-y-2">
                  <button className="text-blue-600 hover:underline w-full text-left">Mon profil</button>
                  <button onClick={handleLogout} className="text-red-500 hover:underline w-full text-left">Déconnexion</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message de bienvenue */}
        {currentUser && (
          <div className="mb-4 text-lg text-gray-700">
            Bienvenue <span className="font-semibold">{currentUser.nom} {currentUser.prenom}</span> !
          </div>
        )}

        {/* Tableau */}
        {error && <div className="text-red-500">{error}</div>}
        <table className="w-full bg-white rounded shadow-md">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">Nom</th>
              <th className="p-2">Prénom</th>
              <th className="p-2">Email</th>
              <th className="p-2">Téléphone</th>
              <th className="p-2">Rôle</th>
            </tr>
          </thead>
          <tbody>
            {utilisateurs.map(user => (
              <tr key={user.id} className="border-t">
                <td className="p-2">{user.nom}</td>
                <td className="p-2">{user.prenom}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.numero_tel}</td>
                <td className="p-2">{user.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
