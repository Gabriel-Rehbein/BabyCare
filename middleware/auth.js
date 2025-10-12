const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // 1. Pega o token do cabeçalho da requisição
    const authHeader = req.header('Authorization');

    // Se não houver o header 'Authorization', nega o acesso
    if (!authHeader) {
        return res.status(401).json({ msg: 'Acesso negado. Nenhum token fornecido.' });
    }

    // O formato do header é "Bearer <token>". Precisamos extrair apenas o token.
    const token = authHeader.split(' ')[1];
    
    // Se não houver o token após "Bearer ", nega o acesso
    if (!token) {
        return res.status(401).json({ msg: 'Formato de token inválido.' });
    }

    // 2. Verifica se o token é válido
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Se for válido, anexa as informações do usuário na requisição
        req.user = decoded.user;
        
        // 4. Deixa a requisição continuar
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token inválido ou expirado.' });
    }
};