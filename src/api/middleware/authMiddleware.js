module.exports = {
    isLoggedIn: (req, res, next) => {
        if (req.isAuthenticated()) { // Função do Passport
            return next();
        }
        res.status(401).json({ message: 'Acesso não autorizado.' });
    }
};