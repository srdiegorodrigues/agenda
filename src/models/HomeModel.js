const db = require('../database/connection');

class Home {

    // Criar registro
    static async create(dados) {
        if (!dados || !dados.titulo || !dados.descricao) {
            throw new Error('Dados inválidos para criação.');
        }

        const db = await initDB();

        const result = await db.run(
            `INSERT INTO home (titulo, descricao)
             VALUES (?, ?)`,
            [dados.titulo, dados.descricao]
        );

        return {
            id: result.id,
            titulo: dados.titulo,
            descricao: dados.descricao
        };
    }

    // Buscar todos
    static async buscarTodos() {
        const db = await initDB();

        return db.all(
            `SELECT id, titulo, descricao
             FROM home
             ORDER BY id DESC`
        );
    }

    // Buscar por id
    static async buscarPorId(id) {
        if (!id || isNaN(id)) return null;

        const db = await initDB();

        return db.get(
            `SELECT id, titulo, descricao
             FROM home
             WHERE id = ?`,
            [id]
        );
    }

    // Atualizar
    static async update(id, dados) {
        if (!id || isNaN(id)) return null;
        if (!dados || !dados.titulo || !dados.descricao) return null;

        const db = await initDB();

        const result = await db.run(
            `UPDATE home
             SET titulo = ?, descricao = ?
             WHERE id = ?`,
            [dados.titulo, dados.descricao, id]
        );

        if (result.changes === 0) return null;

        return this.buscarPorId(id);
    }

    // Deletar
    static async delete(id) {
        if (!id || isNaN(id)) return null;

        const db = await initDB();

        const result = await db.run(
            `DELETE FROM home
             WHERE id = ?`,
            [id]
        );

        if (result.changes === 0) return null;

        return { deleted: true };
    }
}

module.exports = Home;
