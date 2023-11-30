const express = require('express');
const path = require('path');
const morgan = require('morgan');
const mysql = require('mysql');
const myConnection = require('express-myconnection');

const app = express();

// Configuraciones
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(morgan('dev'));
app.use(myConnection(mysql, {
  host: 'localhost',
  user: 'root',
  password: '',
  port: 3306,
  database: 'gestionbd'
}, 'single'));
app.use(express.urlencoded({ extended: false }));


const session = require('express-session');
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}));


// Importando rutas
const personaRoutes = require('./routes/persona');
const homeRoutes = require('./routes/home');
const loginRoutes = require('./routes/login');
const reservaRoutes = require('./routes/reserva');
const salaRoutes = require('./routes/sala');
const usuarioRoutes = require('./routes/usuario');
const menuRoutes = require('./routes/menu');


// Routes
app.use('/persona', personaRoutes);
app.use('/', homeRoutes);
app.use('/login', loginRoutes);
app.use('/reserva', reservaRoutes);
app.use('/salas', salaRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/menu', menuRoutes);


// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Iniciar el servidor
app.listen(app.get('port'), () => {
  console.log('Server is running on port 3000');
});
