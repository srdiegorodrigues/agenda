const Contato = require('../models/ContatoModel');

exports.index = function (req, res) {
    return res.render('contato', {
        contato: {}
    });
};

exports.register = async function (req, res) {
    try {
        const contato = new Contato(req.body);
        const novoContato = await contato.register(); // <-- pegar o retorno

        if (contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            return req.session.save(() =>
                res.redirect(req.get("Referrer") || "/contato")
            );
        }

        // Redireciona para edição do contato recém-criado
        req.flash('success', 'Contato registrado com sucesso!');
        return req.session.save(() =>
            res.redirect(`/contato/index/${novoContato.id}`) // <-- usar novoContato.id
        );

    } catch (e) {
        console.error(e);
        return res.render('404');
    }
};  


exports.editIndex = async function (req, res) {
    try {
        const { id } = req.params;

        if (!id) return res.render('404');

        const contato = await Contato.buscarPorId(id);
        if (!contato) return res.render('404');

        res.render('contato', { contato });

    } catch (e) {
        console.error(e);
        res.render('404');
    }
};

exports.edit = async function (req, res) {
    try {
        const { id } = req.params;
        if (!id) return res.render('404');
        
        const contato = new Contato(req.body);
        const resultado = await contato.edit(id);

        if (contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(() => res.redirect(`/contato/index/${id}`));
            return;
        }

        // if (!contato) return res.render('404');

        req.flash('success', 'Contato editado com sucesso!');
        req.session.save(() => res.redirect(`/contato/index/${id}`));
        return;
    } catch (e) {
        console.error(e);
        return res.render('404');
    }
};




exports.delete = async function (req, res) {
    try {
        const { id } = req.params;

        if (!id) return res.render('404');

        const contato = await Contato.delete(id);

        if (!contato || contato.changes === 0) {
            return res.render('404');
        }

        req.flash('success', 'Contato excluído com sucesso!');
        req.session.save(() => res.redirect('back'));
        return;

    } catch (e) {
        console.error(e);
        return res.render('404');
    }
};
