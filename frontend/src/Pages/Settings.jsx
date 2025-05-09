import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaAddressBook, FaUser, FaCog } from 'react-icons/fa';

function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) return match[2];
    return null;
}

const Settings = () => {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/auth/me', { withCredentials: true })
            .then(res => setCurrentUser(res.data))
            .catch(err => {
                console.error("Erreur récupération utilisateur :", err);
                setError("Erreur de session ou utilisateur non connecté");
            });
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
            console.error("Erreur lors de la déconnexion :", err);
            setError("Impossible de se déconnecter");
        }
    };

    const navigateTo = (path) => {
        navigate(path);
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            {/* Header avec la boule */}
            <div className="flex justify-between items-center p-6 bg-white shadow-md">
                <h1 className="text-3xl font-bold text-blue-700">Paramètres</h1>

                {currentUser && (
                    <div className="relative group">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer shadow">
                            {currentUser.role?.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute right-0 top-12 bg-white shadow-lg rounded p-4 hidden group-hover:block z-50">
                            <p className="font-bold text-gray-700">{currentUser.nom} {currentUser.prenom}</p>
                            <p className="text-sm text-gray-500">{currentUser.role}</p>
                            <div className="mt-2 space-y-2">
                                <button onClick={() => navigate('/Myprofile')} className="text-blue-600 hover:underline w-full text-left">Mon profil</button>
                                <button onClick={handleLogout} className="text-red-500 hover:underline w-full text-left">Déconnexion</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Contenu principal */}
            <div className="flex flex-col items-center justify-center flex-1">
                <div className="flex gap-8 mt-8">
                  
                    <div onClick={() => navigateTo('/Myprofile')} className="cursor-pointer bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
                        <FaUser size={64} className="mb-4 text-green-500" />
                        <h2 className="text-xl font-semibold">Mon Profil</h2>
                    </div>
                    <div onClick={() => navigateTo('/Myaccount')} className="cursor-pointer bg-white shadow-md rounded-lg p-6 flex flex-col items-center">
                        <FaCog size={64} className="mb-4 text-yellow-500" />
                        <h2 className="text-xl font-semibold">Mon Compte</h2>
                    </div>
                </div>
                {error && <p className="mt-6 text-red-500">{error}</p>}
            </div>
        </div>
    );
};

export default Settings;
