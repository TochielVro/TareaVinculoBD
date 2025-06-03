const express = require('express');
const cors = require('cors');
const app = express();
const productosRoutes = require('./routes/productos.routes');

app.use(cors());
app.use(express.json());
app.use('/api/productos', productosRoutes);
app.listen(3001, () => {
console.log('Servidor corriendo en http://localhost:3001');
});