import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // Assurez-vous d'avoir le composant Sidebar

// Fonction pour récupérer les informations de l'utilisateur connecté
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return null;
}

const CourriersDepart = () => {
  const [utilisateur, setUtilisateur] = useState(null);
  const [courriersDepart, setCourriersDepart] = useState([]); // État pour les courriers départ
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    // Étape 1 : Récupération des infos utilisateur connecté
    axios.get('http://localhost:5000/auth/me', { withCredentials: true })
      .then(res => setUtilisateur(res.data))
      .catch(err => {
        console.error('Erreur récupération utilisateur connecté', err);
        setError('Impossible de récupérer les informations de l\'utilisateur');
      });
  }, []);
  
  useEffect(() => {
    // Étape 2 : Une fois utilisateur défini, récupérer les courriers départ
    if (utilisateur) {
      axios.post(
        'http://localhost:5000/courrier/get_courriers',
        { type_courrier: 'depart' },
        { withCredentials: true }
      )
      .then(res => setCourriersDepart(res.data))
      .catch(err => {
        console.error('Erreur récupération courriers départ', err);
        setError('Impossible de récupérer les courriers départ');
      });
    }
  }, [utilisateur]);
  

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

  if (!utilisateur) {
    return <div>Chargement des informations de l'utilisateur...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <Sidebar />

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col p-8 overflow-y-auto relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-700">Courriers envoyés</h1>
          <div className="relative group">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer shadow">
              {utilisateur.role?.charAt(0).toUpperCase()}
            </div>
            <div className="absolute right-0 top-12 bg-white shadow-lg rounded p-4 hidden group-hover:block z-50">
              <p className="font-bold text-gray-700">{utilisateur.nom} {utilisateur.prenom}</p>
              <p className="text-sm text-gray-500">{utilisateur.role}</p>
              <div className="mt-2 space-y-2">
                <button className="text-blue-600 hover:underline w-full text-left">Mon profil</button>
                <button onClick={handleLogout} className="text-red-500 hover:underline w-full text-left">Déconnexion</button>
              </div>
            </div>
          </div>
        </div>

        {/* Message de bienvenue */}
        <div className="mb-4 text-lg text-gray-700">
          Bienvenue <span className="font-semibold">{utilisateur.nom} {utilisateur.prenom}</span> !
        </div>

        {/* Affichage d'erreur si problème de récupération des informations */}
        {error && <div className="text-red-500">{error}</div>}

        {/* Tableau des courriers départ */}
        <div className="mt-4">
          <h2 className="text-2xl font-bold text-blue-700">Courriers Départ</h2>
          <table className="w-full bg-white rounded shadow-md mt-4">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2">Objet</th>
                <th className="p-2">Priorité</th>
                <th className="p-2">Date d'envoi</th>
              </tr>
            </thead>
            <tbody>
              {courriersDepart.map(courrier => (
                <tr key={courrier.id} className="border-t">
                  <td className="p-2">{courrier.object}</td>
                  <td className="p-2">{courrier.priority}</td>
                  <td className="p-2">{courrier.arrival_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CourriersDepart;
