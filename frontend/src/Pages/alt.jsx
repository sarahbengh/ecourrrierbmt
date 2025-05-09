import React, { useEffect, useState } from 'react';
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
    // Récupérer le user connecté
    axios.get('http://localhost:5000/auth/me', { withCredentials: true })
      .then(res => setCurrentUser(res.data))
      .catch(err => console.error("Erreur récupération user connecté", err));

    // Récupérer tous les utilisateurs
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
        headers: {
          'X-CSRF-TOKEN': csrfToken
        },
        withCredentials: true
      });
  
      alert(res.data.message); // Affiche "Déconnexion réussie"
      navigate('/LoginPage');
    } catch (err) {
      console.error('Erreur de déconnexion:', err);
      setError('Impossible de se déconnecter');
    }
  };
  
  

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Déconnexion
        </button>
      </div>

      {/* Affichage Bienvenue */}
      {currentUser && (
        <div className="mb-4 text-lg text-gray-700">
          Bienvenue <span className="font-semibold">{currentUser.nom} {currentUser.prenom}</span> !
        </div>
      )}

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
  );
}

export default AdminDashboard;
