const Contato = require('../models/ContatoModel');

exports.index = async function (req, res) {
    try {
        const contatos = await Contato.buscaContatos();

        return res.render('index', {
            contatos: contatos || []
        });

    } catch (e) {
        console.error(e);
        return res.render('404');
    }
};
