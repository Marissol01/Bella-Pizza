//CÓDIGO EM REVISÃO DashboardController

const db = require('../Models/init-db');
const fs = require('fs');

//Funcionamento = OK! , Lógica = Ok!
// Função: Relatório de Reservas por Período
function gerarRelatorioReservas(req, res) {
    // Extrai os parâmetros de data do query string (ex: ?inicio=2025-06-01&fim=2025-06-30)
    let { inicio, fim } = req.query;

    //Verifica se as datas foram informadas
    // Se não houverem datas, define padrão: últimos 7 dias
    if (!inicio || !fim) {
        const hoje = new Date();
        const seteDiasAtras = new Date();
        seteDiasAtras.setDate(hoje.getDate() - 7);

        inicio = seteDiasAtras.toISOString().split('T')[0];
        fim = hoje.toISOString().split('T')[0];
    }

    try {
        const stmt = db.prepare(`
            SELECT 
                r.id_reserva AS id, 
                r.data_reserva, 
                r.hora_reserva, 
                r.status, 
                r.id_mesa, 
                r.nome_cliente AS cliente
            FROM reservas r
            WHERE date(r.data_reserva) BETWEEN date(?) AND date(?)
            ORDER BY r.data_reserva, r.hora_reserva
        `);

        const reservas = stmt.all(inicio, fim);

        const atendidas = reservas.filter(r => ['atendida', 'confirmada'].includes(r.status.toLowerCase()));
        const naoAtendidas = reservas.filter(r => ['cancelada', 'pendente'].includes(r.status.toLowerCase()));

        res.json({
            periodo: { inicio, fim },
            atendidas,
            naoAtendidas,
            total: reservas.length,
            totalAtendidas: atendidas.length,
            totalNaoAtendidas: naoAtendidas.length
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao gerar relatório de reservas.' });
    }
}
//Funcionamento = ok! , Lógica = ok!
// Função: Histórico de Reservas por Mesa
function obterHistoricoPorMesa(req, res) {
  const mesaId = req.query.mesaId ? parseInt(req.query.mesaId) : null;

    try {
        if (mesaId && isNaN(mesaId)) {
            return res.status(400).json({ error: 'ID da mesa inválido.' });
        }

        if (mesaId) {
            // Histórico de uma única mesa
            const stmtHistorico = db.prepare(`
                SELECT 
                    r.data_reserva,
                    r.hora_reserva,
                    r.nome_cliente,
                    r.qtd_pessoas,
                    r.status,
                    r.contato,
                    u.nome AS atendente
                FROM reservas r
                LEFT JOIN usuarios u ON r.id_usuario = u.id_usuario
                WHERE r.id_mesa = ?
                ORDER BY r.data_reserva DESC, r.hora_reserva DESC
            `);

            const stmtProxima = db.prepare(`
                SELECT 
                    r.data_reserva,
                    r.hora_reserva,
                    r.nome_cliente,
                    r.qtd_pessoas,
                    r.status,
                    r.contato,
                    u.nome AS atendente
                FROM reservas r
                LEFT JOIN usuarios u ON r.id_usuario = u.id_usuario
                WHERE r.id_mesa = ? AND date(r.data_reserva) > date('now')
                ORDER BY r.data_reserva ASC, r.hora_reserva ASC
                LIMIT 1
            `);

            const historico = stmtHistorico.all(mesaId);
            const proxima = stmtProxima.get(mesaId);

            return res.json({ mesaId, historico, proxima });
        } else {
            // Histórico de todas as mesas
            const stmtTodas = db.prepare(`
                SELECT 
                    m.id_mesa,
                    m.capacidade,
                    m.localidade,
                    r.data_reserva,
                    r.hora_reserva,
                    r.nome_cliente,
                    r.qtd_pessoas,
                    r.status,
                    r.contato,
                    u.nome AS atendente
                FROM reservas r
                JOIN mesas m ON r.id_mesa = m.id_mesa
                LEFT JOIN usuarios u ON r.id_usuario = u.id_usuario
                ORDER BY r.id_mesa, r.data_reserva DESC, r.hora_reserva DESC
            `);

            const resultado = stmtTodas.all();
            return res.json({ totalRegistros: resultado.length, reservas: resultado });
        }
    } catch (err) {
        console.error('Erro ao obter histórico:', err);
        return res.status(500).json({ error: 'Erro ao gerar histórico de reservas.' });
    }
}

//Funcionamente = ok!, Lógica = ok!
// NOVA FUNÇÃO: Relação de mesas confirmadas por garçom
function listarMesasPorGarcom(req, res) {
    try {
        // Consulta todas as reservas confirmadas, ordenadas por data e hora crescentes
        const stmt = db.prepare(`
            SELECT 
                id_reserva, 
                id_mesa, 
                nome_cliente AS cliente, 
                data_reserva, 
                hora_reserva, 
                status 
            FROM reservas 
            WHERE status = 'confirmada'
            ORDER BY data_reserva ASC, hora_reserva ASC
        `);

        const mesasConfirmadas = stmt.all();

        // Retorna o nome do garçom fixo (Mario), e todas as mesas com status 'confirmada'
        res.json({
            garcom: 'Mario',
            total: mesasConfirmadas.length,
            mesasConfirmadas
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao buscar mesas confirmadas.' });
    }
}

// ----------------------------
// RELATÓRIO EM TXT
// ----------------------------
function gerarTextoRelatorio(reservas) {
    let texto = 'Relatório de Reservas\n\n';

    reservas.forEach((reserva, index) => {
        texto += `Reserva ${index + 1}\n`;
        texto += `Cliente: ${reserva.cliente}\n`;
        texto += `Data: ${reserva.data}\n`;
        texto += `Hora: ${reserva.hora}\n`;
        texto += `Mesa: ${reserva.id_mesa}\n`;
        texto += `Status: ${reserva.status}\n\n`;
    });

    return texto;
}

function emitirRelatorioTxt(req, res) {
     try {
        const stmtReservas = db.prepare(`
            SELECT 
                r.nome_cliente AS cliente,
                r.data_reserva AS data,
                r.hora_reserva AS hora,
                r.status,
                r.id_mesa
            FROM reservas r
            ORDER BY r.data_reserva, r.hora_reserva
        `);
        const reservas = stmtReservas.all();

        const stmtHistorico = db.prepare(`
            SELECT 
                m.id_mesa,
                m.capacidade,
                m.localidade,
                r.data_reserva,
                r.hora_reserva,
                r.nome_cliente,
                r.qtd_pessoas,
                r.status,
                r.contato,
                u.nome AS atendente
            FROM reservas r
            JOIN mesas m ON r.id_mesa = m.id_mesa
            LEFT JOIN usuarios u ON r.id_usuario = u.id_usuario
            ORDER BY r.id_mesa, r.data_reserva DESC, r.hora_reserva DESC
        `);
        const historico = stmtHistorico.all();

        const stmtConfirmadas = db.prepare(`
            SELECT 
                id_reserva, 
                id_mesa, 
                nome_cliente AS cliente, 
                data_reserva, 
                hora_reserva, 
                status 
            FROM reservas 
            WHERE status = 'confirmada'
            ORDER BY data_reserva ASC, hora_reserva ASC
        `);
        const mesasConfirmadas = stmtConfirmadas.all();

        const conteudo = gerarTextoRelatorioCompleto(reservas, historico, mesasConfirmadas);

        res.setHeader('Content-Disposition', 'attachment; filename=relatorio_completo.txt');
        res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        res.send(conteudo);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao gerar relatório completo em TXT.' });
    }
}

//Formatação do Arquivo.txt
function gerarTextoRelatorioCompleto(reservas, historico, mesasConfirmadas) {
    let texto = '===== RELATÓRIO GERAL DE RESERVAS =====\n\n';

    texto += '--- 1. RESERVAS POR PERÍODO ---\n\n';
    reservas.forEach((r, i) => {
        texto += `#${i + 1} Cliente: ${r.cliente}\nData: ${r.data}\nHora: ${r.hora}\nMesa: ${r.id_mesa}\nStatus: ${r.status}\n\n`;
    });

    texto += '\n--- 2. HISTÓRICO COMPLETO DE RESERVAS POR MESA ---\n\n';
    historico.forEach((r, i) => {
        texto += `#${i + 1} Mesa ${r.id_mesa} - ${r.localidade}\nCliente: ${r.nome_cliente}\nData: ${r.data_reserva}\nHora: ${r.hora_reserva}\nStatus: ${r.status}\nAtendente: ${r.atendente || 'N/A'}\n\n`;
    });

    texto += '\n--- 3. MESAS CONFIRMADAS PELO GARÇOM (Mario) ---\n\n';
    mesasConfirmadas.forEach((r, i) => {
        texto += `#${i + 1} Mesa: ${r.id_mesa}\nCliente: ${r.cliente}\nData: ${r.data_reserva}\nHora: ${r.hora_reserva}\nStatus: ${r.status}\n\n`;
    });

    return texto;
}

// ----------------------------
// EXPORTAÇÕES
// ----------------------------
module.exports = {
    gerarRelatorioReservas,
    obterHistoricoPorMesa,
    listarMesasPorGarcom,
    emitirRelatorioTxt
};