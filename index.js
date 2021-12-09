const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');
// Extraer valores de variables.env
require('dotenv').config({ path: 'variables.env'});

// helpers con algunas funciones
const helpers = require('./helpers');

// Crear la conexión a la base de datos
const db = require('./config/db');
const { networkInterfaces } = require('os');

// Importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync()
    .then(() => console.log('Conectado al servidor'))
    .catch(error => console.log(error));

// Crear una app de express
const app = express();

// Donde cargar los archivos estáticos
app.use(express.static('public'));

// Habilitar Pug
app.set('view engine', 'pug');

// Habilitar bodyParser para leer datos del formulario
app.use(bodyParser.urlencoded({extended: true}));

// Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

// Agregar flash messages
app.use(flash());

app.use(cookieParser());

// Sessiones nos permiten navegar entre distintas páginas sin volvernos a autenticar
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// Pasar var dump a la aplicación
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
});

app.use('/', routes());

// Servidor y Puerto
const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('El servidor está funcionando.');
});