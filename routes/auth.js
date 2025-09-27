const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- ROTA DE LOGIN ---
// URL: POST http://localhost:5000/api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validação básica de entrada
    if (!email || !password) {
        return res.status(400).json({ msg: 'Por favor, forneça email e senha.' });
    }

    try {
        // --- SIMULAÇÃO DE BANCO DE DADOS ---
        // Em um projeto real, você buscaria o usuário no seu banco:
        // const user = await User.findOne({ email });
        
        // Para este exemplo, vamos usar um usuário fixo:
        const userInDb = {
            id: 'user_12345',
            email: 'usuario@babycare.com',
            // O hash abaixo corresponde à senha "senha123"
            passwordHash: '$2b$10$0MdnqCriCAnlTnPwCAtQpuIAOATy54SEr8ZfHSa0NekhWLcOpWCpq'
        };
        // --- FIM DA SIMULAÇÃO ---

        // Verifica se o email corresponde
        if (email.toLowerCase() !== userInDb.email) {
            return res.status(400).json({ msg: 'Credenciais inválidas.' });
        }

        // Compara a senha enviada com o hash salvo no "banco"
        const isMatch = await bcrypt.compare(password, userInDb.passwordHash);

        if (!isMatch) {
            // Mensagem genérica por segurança (não dizer se foi o email ou a senha que errou)
            return res.status(400).json({ msg: 'Credenciais inválidas.' });
        }

        // Se a senha estiver correta, criar o "crachá" (JWT)
        const payload = {
            user: {
                id: userInDb.id
            }
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token expira em 1 hora
        );

        // Envia o token de volta para o front-end
        res.json({ token });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor');
    }
});

module.exports = router;