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

// Listar mesas
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM mesas');
  res.render('mesas', { mesas: result.rows });
});

// Crear mesa
router.post('/add', async (req, res) => {
  const { numero, capacidad } = req.body;
  await pool.query('INSERT INTO mesas (numero, capacidad) VALUES ($1, $2)', [numero, capacidad]);
  res.redirect('/mesas');
});

// Actualizar estado de mesa (tiempo real)
router.post('/estado', async (req, res) => {
  const { id, estado } = req.body;
  await pool.query('UPDATE mesas SET estado = $1 WHERE id = $2', [estado, id]);
  res.json({ success: true });
});

export default router;
