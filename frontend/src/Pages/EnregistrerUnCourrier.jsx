import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return match[2];
  return null;
}

const EnregistrerUnCourrier = () => {
  const [courrier, setCourrier] = useState({
    type_courrier: 'arrivé',
    priority: '',
    object: '',
    sender_id: '',
    diffusion_ids: [],
    file: null,
  });

  const [fileName, setFileName] = useState('');
  const [message, setMessage] = useState('');
  const [diffusionOptions] = useState([
    { id: 2, name: 'DGA' },
    { id: 3, name: 'DO' },
    { id: 4, name: 'DRH' },
  ]);

  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/auth/me', { withCredentials: true })
      .then(res => setCurrentUser(res.data))
      .catch(err => console.error("Erreur récupération user connecté", err));
  }, []);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourrier({ ...courrier, [name]: value });
  };

  const handleDiffusionChange = (e) => {
    const selectedId = parseInt(e.target.value);
    if (!courrier.diffusion_ids.includes(selectedId)) {
      setCourrier({ ...courrier, diffusion_ids: [...courrier.diffusion_ids, selectedId] });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setCourrier({ ...courrier, file });
    setFileName(file.name);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('type_courrier', courrier.type_courrier);
    formData.append('priority', courrier.priority);
    formData.append('object', courrier.object);
    formData.append('sender_id', courrier.sender_id);
    courrier.diffusion_ids.forEach(id => formData.append('diffusion_ids', id));
    if (courrier.file) {
      formData.append('file', courrier.file);
    }

    try {
      const response = await axios.post('http://localhost:5000/courrier/save_courrier', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(response.data.message || 'Courrier enregistré avec succès.');
    } catch (error) {
      console.error('Erreur lors de l’envoi du courrier:', error);
      setMessage(error.response?.data?.message || 'Une erreur est survenue.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6 overflow-y-auto">

        {/* Header avec bulle utilisateur */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Enregistrer un courrier</h2>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label>Type de courrier</label>
            <select
              name="type_courrier"
              value={courrier.type_courrier}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            >
              <option value="arrivé">Arrivé</option>
              <option value="départ">Départ</option>
            </select>
          </div>

          <div>
            <label>Priorité</label>
            <input
              type="text"
              name="priority"
              value={courrier.priority}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label>Objet</label>
            <input
              type="text"
              name="object"
              value={courrier.object}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label>Expéditeur (ID)</label>
            <input
              type="text"
              name="sender_id"
              value={courrier.sender_id}
              onChange={handleChange}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <div>
            <label>Liste de diffusion</label>
            <select onChange={handleDiffusionChange} className="w-full border p-2 rounded">
              <option value="">-- Sélectionner --</option>
              {diffusionOptions.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            <div className="text-sm mt-2">
              Sélectionnés: {courrier.diffusion_ids.map(id => diffusionOptions.find(u => u.id === id)?.name).join(', ')}
            </div>
          </div>

          <div>
            <label>Fichier</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full border p-2 rounded"
              accept=".pdf,.doc,.docx,.jpg,.png"
            />
            {fileName && <p className="text-sm text-gray-600 mt-1">Fichier sélectionné : {fileName}</p>}
          </div>

          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Enregistrer
          </button>
        </form>
        {message && <p className="mt-4 text-green-600">{message}</p>}
        {error && <p className="mt-4 text-red-600">{error}</p>}
      </div>
    </div>
  );
};

export default EnregistrerUnCourrier;
