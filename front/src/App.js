import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:5000/api/etudiants"
  : "/api/etudiants";

function App() {
  const [etudiants, setEtudiants] = useState([]);
  const [formData, setFormData] = useState({ nom: '', email: '', age: '' });
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    chargerEtudiants();
  }, []);

  const chargerEtudiants = async () => {
    try {
      const res = await axios.get(API_URL);
      setEtudiants(res.data);
    } catch (err) {
      afficherMessage("Erreur de connexion avec le backend.", "bg-red-50 text-red-600 border-red-200");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await axios.put(`${API_URL}/${editId}`, formData);
        afficherMessage("Étudiant modifié avec succès !", "bg-emerald-50 text-emerald-700 border-emerald-200");
      } else {
        await axios.post(API_URL, formData);
        afficherMessage("Étudiant ajouté avec succès !", "bg-emerald-50 text-emerald-700 border-emerald-200");
      }
      resetForm();
      chargerEtudiants();
    } catch (err) {
      afficherMessage("Une erreur est survenue lors de l'enregistrement.", "bg-red-50 text-red-600 border-red-200");
    }
  };

  const supprimerEtudiant = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cet étudiant ?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        afficherMessage("Étudiant supprimé avec succès !", "bg-emerald-50 text-emerald-700 border-emerald-200");
        chargerEtudiants();
      } catch (err) {
        afficherMessage("Erreur lors de la suppression.", "bg-red-50 text-red-600 border-red-200");
      }
    }
  };

  const preparerModification = (etudiant) => {
    setEditId(etudiant._id);
    setFormData({ nom: etudiant.nom, email: etudiant.email, age: etudiant.age });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setFormData({ nom: '', email: '', age: '' });
    setEditId(null);
  };

  const afficherMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* En-tête */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight sm:text-4xl">
            🎓 Gestion des Étudiants
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Plateforme Full-Stack MERN (React & Node.js/Express)
          </p>
        </div>

        {/* Message d'alerte */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl border text-center text-sm font-medium shadow-sm transition-all duration-300 ${message.type}`}>
            {message.text}
          </div>
        )}

        {/* Formulaire stylisé */}
        <form onSubmit={handleSubmit} className="gestion-form">
          <div className="flex items-center justify-between mb-4">
            <h2>
              {editId ? "✏️ Modifier l'étudiant" : "➕ Ajouter un étudiant"}
            </h2>
            {editId && (
              <span className="text-xs bg-amber-50 text-amber-700 font-semibold px-2.5 py-1 rounded-full border border-amber-200">
                Mode édition
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <input 
              type="text" 
              placeholder="Nom complet" 
              required 
              value={formData.nom} 
              onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            />
            <input 
              type="email" 
              placeholder="E-mail" 
              required 
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <input 
              type="number" 
              placeholder="Âge" 
              required 
              value={formData.age} 
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
          </div>

          <div className="flex gap-3">
            <button type="submit" className={`text-white shadow-md ${editId ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
              {editId ? "Enregistrer les modifications" : "Ajouter l'étudiant"}
            </button>
            {editId && (
              <button type="button" onClick={resetForm} className="bg-slate-200 text-slate-700 hover:bg-slate-300">
                Annuler
              </button>
            )}
          </div>
        </form>

        {/* Liste des étudiants */}
        <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-800">📋 Liste des étudiants</h2>
            <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
              Total : {etudiants.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Nom</th>
                  <th className="py-3 px-4">E-mail</th>
                  <th className="py-3 px-4">Âge</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {etudiants.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-8 text-slate-400 font-medium">
                      Aucun étudiant enregistré pour le moment.
                    </td>
                  </tr>
                ) : (
                  etudiants.map((etudiant) => (
                    <tr key={etudiant._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 font-semibold text-slate-700">{etudiant.nom}</td>
                      <td className="py-4 px-4 text-slate-600">{etudiant.email}</td>
                      <td className="py-4 px-4 text-slate-600">
                        <span className="bg-slate-100 px-2.5 py-1 rounded-md font-medium text-xs">
                          {etudiant.age} ans
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center space-x-2">
                        <button 
                          onClick={() => preparerModification(etudiant)} 
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                        >
                          Éditer
                        </button>
                        <button 
                          onClick={() => supprimerEtudiant(etudiant._id)} 
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors"
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;