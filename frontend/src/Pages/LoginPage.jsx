import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erreur, setErreur] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErreur('');

    try {
      const res = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErreur(data.message || 'Erreur de connexion');
      } else {
        console.log('Connexion réussie:', data);
        if (data.role === 'admin') {
          navigate('/AdminDashboard');
        } else {
          navigate('/user/dashboard');
        }
      }
    } catch (error) {
      console.error('Erreur de requête:', error);
      setErreur('Erreur réseau ou serveur');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: `url('../../public/login.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative p-8 rounded-lg max-w-md w-full backdrop-blur-md bg-white/20 border border-white/30 shadow-lg">
        <h2 className="mt-16 text-3xl text-center font-bold text-blue-700">eCourrier BMT</h2>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-1">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded bg-white/70 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">
              Mot de passe
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded bg-white/70 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-gray-700"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>
          </div>
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Se connecter
          </button>
        </form>
        {erreur && <p className="mt-2 text-center text-red-300">{erreur}</p>}
      </div>
    </div>
  );
};

export default LoginPage;
