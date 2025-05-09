import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AjouterUser = () => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    numero_tel: '',
    role: 'employe'
  });

  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // 👈 pour afficher/masquer le mot de passe

  useEffect(() => {
    axios.get('http://localhost:5000/auth/me', { withCredentials: true })
      .then(res => setCurrentUser(res.data))
      .catch(err => {
        console.error("Erreur récupération user connecté", err);
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        'http://localhost:5000/auth/add_user',
        formData,
        {
          withCredentials: true,
          headers: {
            'X-User-Name': `${currentUser?.nom} ${currentUser?.prenom}`,
            'X-User-Role': currentUser?.role
          }
        }
      );
      setMessage(res.data.message);
      setFormData({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        numero_tel: '',
        role: 'employe'
      });
    } catch (err) {
      console.error("Erreur lors de la création de l'utilisateur", err);
      if (err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Erreur lors de la création de l'utilisateur");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-700">Ajouter un Utilisateur</h1>
        {currentUser && (
         <div className="relative group">
         <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer shadow">
           {currentUser && currentUser.role ? currentUser.role.charAt(0).toUpperCase() : ''}
         </div>
         {currentUser && (
           <div className="absolute right-0 top-12 bg-white shadow-lg rounded p-4 hidden group-hover:block z-50">
             <p className="font-bold text-gray-700">{currentUser.nom} {currentUser.prenom}</p>
             <p className="text-sm text-gray-500">{currentUser.role}</p>
             <div className="mt-2 space-y-2">
               <button className="text-blue-600 hover:underline w-full text-left">Mon profil</button>
               <button onClick={handleLogout} className="text-red-500 hover:underline w-full text-left">Déconnexion</button>
             </div>
           </div>
         )}
       </div>
       
        )}
      </div>

      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md w-full">
        {message && <div className="mb-4 text-green-600">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="nom" className="font-semibold text-gray-700">Nom</label>
            <input
              type="text"
              id="nom"
              name="nom"
              value={formData.nom}
              onChange={e => setFormData({ ...formData, nom: e.target.value })}
              className="p-2 w-full border rounded"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="prenom" className="font-semibold text-gray-700">Prénom</label>
            <input
              type="text"
              id="prenom"
              name="prenom"
              value={formData.prenom}
              onChange={e => setFormData({ ...formData, prenom: e.target.value })}
              className="p-2 w-full border rounded"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="font-semibold text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className="p-2 w-full border rounded"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="numero_tel" className="font-semibold text-gray-700">Numéro de téléphone</label>
            <input
              type="text"
              id="numero_tel"
              name="numero_tel"
              value={formData.numero_tel}
              onChange={e => setFormData({ ...formData, numero_tel: e.target.value })}
              className="p-2 w-full border rounded"
              required
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="font-semibold text-gray-700">Mot de passe</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="p-2 w-full border rounded pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Optionnel : champ pour choisir le rôle */}
          {/* <div className="space-y-2">
            <label htmlFor="role" className="font-semibold text-gray-700">Rôle</label>
            <select
              id="role"
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
              className="p-2 w-full border rounded"
            >
              <option value="employe">Employé</option>
              <option value="admin">Admin</option>
            </select>
          </div> */}

          <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded mt-4">
            Ajouter Utilisateur
          </button>
        </form>
      </div>
    </div>
  );
};

export default AjouterUser;
