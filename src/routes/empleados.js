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

// Listar empleados
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM empleados');
  res.render('empleados', { empleados: result.rows });
});

// Crear empleado
router.post('/add', async (req, res) => {
  const { nombre, email, telefono, rol } = req.body;
  await pool.query('INSERT INTO empleados (nombre, email, telefono, rol) VALUES ($1, $2, $3, $4)', [nombre, email, telefono, rol]);
  res.redirect('/empleados');
});

export default router;
