const express = require('express');
const router = express.Router();
const db = require('../db/connection');
// Obtener todos los productos
router.get('/', (req, res) => {
db.query('SELECT * FROM productos', (err, results) => {
if (err) return res.status(500).json({ error: err });
res.json(results);
});
});
// Obtener un producto por ID
router.get('/:id', (req, res) => {
const { id } = req.params;
db.query('SELECT * FROM productos WHERE id = ?', [id], (err, results) => {
if (err) return res.status(500).json({ error: err });
if (results.length === 0) return res.status(404).json({ mensaje: 'Producto no encontrado' });
res.json(results[0]);
});
});
// Crear un nuevo producto
router.post('/', (req, res) => {
const { nombre, precio, stock } = req.body;
db.query('INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)',
[nombre, precio, stock], (err, result) => {
if (err) return res.status(500).json({ error: err });
res.json({ id: result.insertId, nombre, precio, stock });
});
});
// Actualizar un producto
router.put('/:id', (req, res) => {
const { id } = req.params;
const { nombre, precio, stock } = req.body;
db.query('UPDATE productos SET nombre=?, precio=?, stock=? WHERE id=?',
[nombre, precio, stock, id], (err) => {
if (err) return res.status(500).json({ error: err });
res.json({ mensaje: 'Producto actualizado' });
});
});
// Eliminar un producto
router.delete('/:id', (req, res) => {
const { id } = req.params;
db.query('DELETE FROM productos WHERE id=?', [id], (err) => {
if (err) return res.status(500).json({ error: err });
res.json({ mensaje: 'Producto eliminado' });
});
});
module.exports = router;