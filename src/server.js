import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import bcrypt from 'bcrypt';

// Configuración
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// DB
const pool = new pg.Pool({
  host: 'shuttle.proxy.rlwy.net',
  port: 25434,
  database: 'railway',
  user: 'postgres',
  password: 'hFynXDBJLarEoZCduqeSvagEUSpLoSot',
  ssl: false
});

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));
app.use(express.static(path.join(__dirname, '../public')));

// Rutas
import authRoutes from './routes/auth.js';
import productosRoutes from './routes/productos.js';
import empleadosRoutes from './routes/empleados.js';
import mesasRoutes from './routes/mesas.js';

app.use('/', authRoutes);
app.use('/productos', productosRoutes);
app.use('/empleados', empleadosRoutes);
app.use('/mesas', mesasRoutes);

// Socket.io para mesas
io.on('connection', (socket) => {
  console.log('Cliente conectado');
  socket.on('actualizarMesa', (data) => {
    socket.broadcast.emit('mesaActualizada', data);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});