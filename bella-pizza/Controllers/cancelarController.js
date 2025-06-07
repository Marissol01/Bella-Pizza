//--------------JULIANA EM 07/06

const db = require('../Models/init-db');

exports.cancelarReserva = async (req, res) => {
    const { id, mesa } = req.body;

    try {
        // Inicia transação
        await db.run('BEGIN TRANSACTION'); 

        // Atualiza status da reserva
        await db.run(
            `UPDATE reservas 
            SET status = 'cancelada' 
            WHERE id = ?`,
            [id]
        );

        // Atualiza disponibilidade da mesa
        await db.run(
            `UPDATE mesas 
            SET disponibilidade = 1 
            WHERE id = ?`,
            [mesa]
        );

        // Confirma transação
        await db.run('COMMIT');
        
        res.json({ 
            success: true,
            message: 'Reserva e mesa atualizadas com sucesso'
        });

    } catch (error) {
        // Reverte transação em caso de erro
        await db.run('ROLLBACK');
        console.error('Erro no cancelamento:', error);
        res.status(500).json({ 
            success: false,
            message: error.message 
        });
    }
};
  
console.log("Requisição recebida:", req.body); 
  
module.exports = { cancelarReserva };