const express = require('express');
const router = express.Router();
const db = require('../Database/connection');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Obtener todos los usuarios
router.get('/', (req, res) => {
  db.query('SELECT id, nombre, email FROM usuarios', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Obtener un usuario por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT id, nombre, email FROM usuarios WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(results[0]);
  });
});

// Crear un nuevo usuario
router.post('/', async (req, res) => {
  const { nombre, email, password } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    db.query('INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
      [nombre, email, hashedPassword], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ id: result.insertId, nombre, email });
      });
  } catch (error) {
    res.status(500).json({ error: 'Error al encriptar contraseña' });
  }
});

// Actualizar un usuario
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, email, password } = req.body;
  
  try {
    let query = 'UPDATE usuarios SET nombre=?, email=?';
    let params = [nombre, email];
    
    if (password) {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      query += ', password=?';
      params.push(hashedPassword);
    }
    
    query += ' WHERE id=?';
    params.push(id);
    
    db.query(query, params, (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ mensaje: 'Usuario actualizado' });
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al encriptar contraseña' });
  }
});

// Eliminar un usuario
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM usuarios WHERE id=?', [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ mensaje: 'Usuario eliminado' });
  });
});

module.exports = router;