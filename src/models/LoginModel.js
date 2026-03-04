const validator = require('validator');
const bcrypt = require('bcryptjs');
const db = require('../database/connection');

class Login {
    constructor(body) {
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    // Login
    async login() {
        this.valida();
        if (this.errors.length > 0) return;

        const user = await db.get(
            `SELECT id, email, password
             FROM users
             WHERE email = ?`,
            [this.body.email]
        );

        if (!user) {
            this.errors.push('Usuário não cadastrado!');
            return;
        }

        const senhaValida = await bcrypt.compare(
            this.body.password,
            user.password
        );

        if (!senhaValida) {
            this.errors.push('Senha inválida!');
            return;
        }

        this.user = {
            id: user.id,
            email: user.email
        };
    }

    // Registro
    async register() {
        this.valida();
        if (this.errors.length > 0) return;

        await this.userExists();

        if(this.errors.length > 0) return;

        try {
            const salt = await bcrypt.genSalt(12);
            const hash = await bcrypt.hash(this.body.password, salt);

            const result = await db.run(
                `INSERT INTO users (email, password)
                 VALUES (?, ?)`,
                [this.body.email, hash]
            );

            this.user = {
                id: result.id,
                email: this.body.email
            };

        } catch (error) {

            // Tratamento correto de UNIQUE constraint
            if (error.message.includes('UNIQUE')) {
                this.errors.push('Usuário já existe.');
                return;
            }

            throw error;
        }
    }

    async userExists(   ){
        const user = await db.get(
            `SELECT id, email, password
             FROM users
             WHERE email = ?`,
            [this.body.email]
        );
        if(user) this.errors.push('Usuário já existe.');
    }

    // Validação
    valida() {
        this.cleanUp();

        if (!this.body.email || !validator.isEmail(this.body.email)) {
            this.errors.push('E-mail inválido');
        }

        if (!this.body.password) {
            this.errors.push('Senha é obrigatória');
        }

        if (
            this.body.password &&
            (this.body.password.length < 6 ||
             this.body.password.length > 50)
        ) {
            this.errors.push(
                'Senha deve ter entre 6 e 50 caracteres.'
            );
        }
    }

    // Sanitização
    cleanUp() {
        for (let key in this.body) {
            if (typeof this.body[key] !== 'string') {
                this.body[key] = '';
            }
        }

        this.body = {
            email: this.body.email || '',
            password: this.body.password || ''
        };
    }
}

module.exports = Login;
