import express from 'express';
import dotenv from 'dotenv';
import { getModemInfo } from '../zte';

dotenv.config();

const app = express();
const port = process.env.APP_PORT || 3000;

app.use(express.json());

app.get('/api/zte-info', async (req, res) => {
    try {
        const modemInfo = await getModemInfo();
        res.json(modemInfo);
    } catch (error) {
        console.error('Erro ao obter informações do modem:', error);
        res.status(500).json({ error: 'Erro ao obter informações do modem' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
    console.log(`Para obter as informações do modem, faça uma requisição GET em: http://localhost:${port}/api/zte-info`);
}); 