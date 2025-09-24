import express from 'express';
import pg from 'pg';
const router = express.Router();
const pool = new pg.Pool({
  host: 'shuttle.proxy.rlwy.net',
  port: 25434,
  database: 'railway',
  user: 'postgres',
  password: 'hFynXDBJLarEoZCduqeSvagEUSpLoSot',
  ssl: false
});

// Listar productos
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM productos');
  res.render('productos', { productos: result.rows });
});

// Crear producto
router.post('/add', async (req, res) => {
  const { nombre, descripcion, precio } = req.body;
  await pool.query('INSERT INTO productos (nombre, descripcion, precio) VALUES ($1, $2, $3)', [nombre, descripcion, precio]);
  res.redirect('/productos');
});

export default router;
