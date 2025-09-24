import express from 'express';
import bcrypt from 'bcrypt';
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

// Ruta inicial
router.get('/', (req, res) => {
  res.redirect('/login');
});

// Login
router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
  if (result.rows.length === 0) return res.render('login', { error: 'Usuario no encontrado' });
  const user = result.rows[0];
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.render('login', { error: 'Contraseña incorrecta' });
  req.session.user = { id: user.id, nombre: user.nombre, rol: user.rol };
  res.redirect('/dashboard');
});

// Registro de usuario (solo para pruebas)
router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { nombre, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  try {
    await pool.query('INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3)', [nombre, email, hash]);
    res.redirect('/login');
  } catch (err) {
    res.render('register', { error: 'Error al registrar usuario' });
  }
});

// Dashboard
router.get('/dashboard', (req, res) => {
  if (!req.session.user) return res.redirect('/login');
  res.render('dashboard', { user: req.session.user });
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

export default router;
