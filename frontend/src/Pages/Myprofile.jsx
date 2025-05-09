import  { useEffect, useState } from 'react'
import axios from 'axios'

const Myprofile = () => {
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    numero_tel: ''
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get('http://localhost:5000/auth/me', {
          withCredentials: true
        })
        setUser(res.data)
        setFormData({
          nom: res.data.nom,
          prenom: res.data.prenom,
          email: res.data.email,
          numero_tel: res.data.numero_tel
        })
      } catch (err) {
        console.error(err)
      }
    }

    fetchUser()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {

    e.preventDefault()
   

    try {

      const res = await axios.put(`http://localhost:5000/auth/users/me`, formData, {
        withCredentials: true
      })
      console.log("this is our res",  res)    
       setMessage('Mise à jour réussie ✅')
    } catch (err) {
      console.error(err)
      setMessage('Erreur lors de la mise à jour ❌')
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Mon profil</h2>
      {user ? (
        <form onSubmit={handleSubmit} className="bg-blue-400 shadow rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">Nom</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="mt-1 block w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Prénom</label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              className="mt-1 block w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Numéro de téléphone</label>
            <input
              type="text"
              name="numero_tel"
              value={formData.numero_tel}
              onChange={handleChange}
              className="mt-1 block w-full border rounded p-2"
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
            Enregistrer
          </button>
          {message && <p className="mt-2 text-sm">{message}</p>}
        </form>
      ) : (
        <p>Chargement des données...</p>
      )}
    </div>
  )
}

export default Myprofile
