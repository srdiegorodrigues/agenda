// nunca deve-se esquecer do next dentro do middleware
// caso contrário a requisição não termina
exports.middlewareGlobal = (req, res, next) => {
    // teremos disponível em todas as páginas o locals.erros para apresentar os erros
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success');
    res.locals.user = req.session.user;
    next();
};

exports.outroMiddleware = (req, res, next) => {
    console.log('Sou outro middleware');
    next();
};

//trata qualquer erro e exibe a caixa 404.
exports.checkCsrfError = (err, req, res, next) =>{
    if(err){
        return res.render('404'); // renderiza a página selecionada(dentro da pasta view) e retorna para o navegador
    }
    next();
};

exports.csrfMiddleware = (req, res, next) => {
    res.locals.csrfToken = req.csrfToken();
    next();
};

exports.loginRequired = (req, res, next) => {
    if(!req.session.user) {
        req.flash('errors', "você precisa fazer login");
        req.session.save(() => res.redirect('/'));
        return;       
    }
    next();
}