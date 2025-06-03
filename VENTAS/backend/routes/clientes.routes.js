const express = require('express');
const router = express.Router();
const db = require('../Database/connection');

// Obtener todos los clientes
router.get('/', (req, res) => {
  db.query('SELECT * FROM clientes', (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

// Obtener un cliente por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM clientes WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    res.json(results[0]);
  });
});

// Buscar cliente por documento
router.get('/buscar/:documento', (req, res) => {
  const { documento } = req.params;
  db.query('SELECT * FROM clientes WHERE documento_identidad = ?', [documento], (err, results) => {
    if (err) return res.status(500).json({ error: err });
    if (results.length === 0) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    res.json(results[0]);
  });
});

// Crear un nuevo cliente
router.post('/', (req, res) => {
  const { nombre, documento_identidad, direccion, telefono } = req.body;
  db.query('INSERT INTO clientes (nombre, documento_identidad, direccion, telefono) VALUES (?, ?, ?, ?)',
    [nombre, documento_identidad, direccion, telefono], (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ id: result.insertId, nombre, documento_identidad, direccion, telefono });
    });
});

// Actualizar un cliente
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, documento_identidad, direccion, telefono } = req.body;
  db.query('UPDATE clientes SET nombre=?, documento_identidad=?, direccion=?, telefono=? WHERE id=?',
    [nombre, documento_identidad, direccion, telefono, id], (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ mensaje: 'Cliente actualizado' });
    });
});

// Eliminar un cliente
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM clientes WHERE id=?', [id], (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ mensaje: 'Cliente eliminado' });
  });
});

module.exports = router;