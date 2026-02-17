// require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');

const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const flash = require('connect-flash');
const helmet = require('helmet');
const csrf = require('csurf');

const routes = require('./routes');
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');

//Segurança
app.use(helmet());

//Middlewares básicos
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, 'public')));

// Views
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// Sessão com sqlite
app.use(session({
    secret: 'asdfasfasf',
    store: new SQLiteStore({
        db: 'sessions.sqlite',
        dir: './database'
    }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
}));

app.use(flash());


// CSRF

app.use(csrf());
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);

// Rotas
app.use(routes);

// Servidor
app.listen(3000, () => {
    console.log('Servidor executando na porta 3000');
});
