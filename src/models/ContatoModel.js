const validator = require('validator');
const db = require('../database/connection');

class Contato {
    constructor(body) {
        this.body = body;
        this.errors = [];
    }

    // Registrar contato
    async register() {
        this.valida();
        if (this.errors.length > 0) return;

        await this.userExists();
        if (this.errors.length > 0) return;

        const result = await db.run(
            `INSERT INTO contatos (nome, sobrenome, email, telefone)
             VALUES (?, ?, ?, ?)`,
            [
                this.body.nome,
                this.body.sobrenome,
                this.body.email,
                this.body.telefone
            ]
        );

        // Retorna o ID do contato recém-criado
        return { id: result.id };
    }

    // Editar contato
    async edit(id) {
        if (!id) return;

        this.valida();
        if (this.errors.length > 0) return;

        console.log('id', id);
        console.log('this.body.id', this.body.id);

        await this.userExists(id, this.body.email);

        if (this.errors.length > 0) return;

        await db.run(
            `UPDATE contatos
             SET nome = ?, sobrenome = ?, email = ?, telefone = ?
             WHERE id = ?`,
            [
                this.body.nome,
                this.body.sobrenome,
                this.body.email,
                this.body.telefone,
                id
            ]
        );

        return await Contato.buscarPorId(id);
    }

    // Verifica se email já existe
    async userExists(id = null, email) {
        if (!email) return;

        // Busca qualquer contato com o email informado
        const contato = await db.get(
            `SELECT * FROM contatos WHERE email = ?`,
            [email]
        );

        const convertId = id ? Number(id): null
        
        // Se encontrou e não for o mesmo id que está sendo editado
        if (contato && contato.id !== convertId) {
            this.errors.push('Há no banco um contato com este email cadastrado.');
        }
    }
    // Buscar por ID
    static async buscarPorId(id) {
        return await db.get(
            `SELECT * FROM contatos WHERE id = ?`,
            [id]
        );
    }

    // Listar todos os contatos
    static async buscaContatos() {
        return await db.all(
            `SELECT * FROM contatos ORDER BY id DESC;`
        );
    }

    // Excluir contato
    static async delete(id) {
        return await db.run(
            `DELETE FROM contatos WHERE id = ?`,
            [id]
        );
    }

    // Validação dos campos
    valida() {
        this.cleanUp();

        if (this.body.email && !validator.isEmail(this.body.email)) {
            this.errors.push('E-mail inválido');
        }

        if (!this.body.nome) {
            this.errors.push('Nome é obrigatório');
        }

        if (!this.body.email && !this.body.telefone) {
            this.errors.push('Informe email ou telefone');
        }
    }

    // Sanitização
    cleanUp() {
        for (let key in this.body) {
            if (typeof this.body[key] !== 'string') this.body[key] = '';
        }

        this.body = {
            nome: this.body.nome || '',
            sobrenome: this.body.sobrenome || '',
            email: this.body.email || '',
            telefone: this.body.telefone || ''
        };
    }
}

module.exports = Contato;
