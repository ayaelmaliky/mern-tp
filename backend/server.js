const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// --- CONFIGURATION CORS (Autorise toutes les origines pour le développement) ---
app.use(cors({
  origin: "*", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware pour parser le JSON
app.use(express.json());

// --- CONNEXION MONGODB ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/gestion-etudiants";

mongoose.connect(MONGO_URI)
  .then(() => console.log("Connecté à MongoDB avec succès"))
  .catch((err) => console.error("Erreur de connexion MongoDB :", err));

// --- MODÈLE ÉTUDIANT ---
const etudiantSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  email: { type: String, required: true },
  age: { type: Number, required: true }
});

const Etudiant = mongoose.model('Etudiant', etudiantSchema);

// --- ROUTES API ---

// 1. GET : Récupérer tous les étudiants
app.get('/api/etudiants', async (req, res) => {
  try {
    const etudiants = await Etudiant.find();
    res.json(etudiants);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. POST : Ajouter un étudiant
app.post('/api/etudiants', async (req, res) => {
  try {
    const nouvelEtudiant = new Etudiant(req.body);
    const savedEtudiant = await nouvelEtudiant.save();
    res.status(201).json(savedEtudiant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 3. PUT : Modifier un étudiant
app.put('/api/etudiants/:id', async (req, res) => {
  try {
    const updatedEtudiant = await Etudiant.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!updatedEtudiant) return res.status(404).json({ error: "Étudiant non trouvé" });
    res.json(updatedEtudiant);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4. DELETE : Supprimer un étudiant
app.delete('/api/etudiants/:id', async (req, res) => {
  try {
    const deletedEtudiant = await Etudiant.findByIdAndDelete(req.params.id);
    if (!deletedEtudiant) return res.status(404).json({ error: "Étudiant non trouvé" });
    res.json({ message: "Étudiant supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// --- LANCEMENT DU SERVEUR ---
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});