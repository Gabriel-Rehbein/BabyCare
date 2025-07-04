const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login-falhou' }), (req, res) => {
    // Sucess, envia para o dashboard.
    res.redirect('http://localhost:3001/dashboard.html');
});

// Logout
router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('http://localhost:3001/login.html');
    });
});

module.exports = router;