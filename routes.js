const express = require('express');
const route = express.Router();
const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const contatoController = require('./src/controllers/contatoController');

const { loginRequired } = require('./src/middlewares/middleware');

// tudo que for a página incial da rota, chamará index

// rotas da home
route.get('/index', homeController.index);
route.get('/', homeController.index);

// para cada rota preciso de um controllers
// rotas de login
route.get('/login/index', loginController.index);
route.post('/login/login', loginController.login);
route.post('/login/register', loginController.register);
route.get('/login/logout', loginController.logout);


// Rotas de contato
// loginRequired é um middleware para restringir acesso
route.get('/contato/index/', loginRequired, contatoController.index);
route.post('/contato/register',loginRequired, contatoController.register);
route.get('/contato/index/:id', loginRequired, contatoController.editIndex);
route.post('/contato/edit/:id',loginRequired, contatoController.edit);
route.get('/contato/delete/:id',loginRequired, contatoController.delete);
// exportando as rotas e sobrescrevendo o exports
module.exports = route;