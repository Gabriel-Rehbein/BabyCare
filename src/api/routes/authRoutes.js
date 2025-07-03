const express = require('express');
const router = express.Router();
const passport = require('passport');

// Rota para iniciar o processo de login com Google
// O passport.authenticate redireciona para o Google
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email'] // O que queremos pedir de informação ao Google
}));

// Rota de callback, para onde o Google redireciona após o login
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login-falhou' }), (req, res) => {
    // Login bem-sucedido, redireciona para uma página de perfil ou para o frontend
    res.redirect('/auth/perfil');
});

// Rota simples de perfil para verificar se o login funcionou
router.get('/perfil', (req, res) => {
    if (!req.user) {
        return res.redirect('/');
    }
    // req.user é populado pelo Passport com os dados do usuário da sessão
    res.send(`<h1>Olá, ${req.user.id}!</h1><a href="/auth/logout">Logout</a>`);
});

// Rota de logout
router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;