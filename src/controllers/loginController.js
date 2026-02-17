const Login = require('../models/LoginModel');

// Página de login
exports.index = (req, res) => {
    if (req.session.user) {
        return res.render('login-logado');
    }
    return res.render('login');
};

// Registro de usuário
exports.register = async function (req, res) {
    try {
        const login = new Login(req.body);
        await login.register();

        if (login.errors.length > 0) {
            req.flash('errors', login.errors);
            return req.session.save(() =>
                res.redirect('/login/index')
            );
        }

        req.flash('success', 'Usuário cadastrado com sucesso!');
        return req.session.save(() =>
            res.redirect('/login/index')
        );

    } catch (e) {
        console.error(e);
        return res.render('404');
    }
};

// Autenticação
exports.login = async function (req, res) {
    try {
        const login = new Login(req.body);
        await login.login();

        if (login.errors.length > 0) {
            req.flash('errors', login.errors);
            return req.session.save(() =>
                res.redirect('/login/index')
            );
        }

        // Regenera a sessão para evitar session fixation
        req.session.regenerate(err => {
            if (err) {
                console.error(err);
                return res.render('404');
            }

            req.session.user = {
                id: login.user.id,
                email: login.user.email
            };

            req.flash('success', 'Login realizado com sucesso!');
            return req.session.save(() =>
                res.redirect('/login/index')
            );
        });

    } catch (e) {
        console.error(e);
        return res.render('404');
    }
};

// Logout
exports.logout = function (req, res) {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.render('404');
        }

        res.clearCookie('connect.sid');
        return res.redirect('/');
    });
};
