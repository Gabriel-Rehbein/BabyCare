const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const usuarioRepository = require('../api/repository/usuarioRepository');

// Salva o ID do usuário na sessão
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await usuarioRepository.buscarPorId(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

passport.use(
    new GoogleStrategy({
        // Opções da estratégia do Google
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
        // Esta função é chamada quando o usuário faz login com sucesso
        console.log('Perfil do Google recebido:', profile);

        try {
            // 1. Verificar se o usuário já existe no nosso banco de dados
            let usuario = await usuarioRepository.buscarPorGoogleId(profile.id);

            if (usuario) {
                // Se existe, continue com o login
                console.log('Usuário já existe:', usuario);
                return done(null, usuario);
            } else {
                // Se não existe, crie um novo usuário
                const novoUsuario = {
                    googleId: profile.id,
                    nome: profile.displayName,
                    email: profile.emails[0].value,
                    // Defina valores padrão para outros campos se necessário
                    tipo: 'aluno', 
                    curso: null
                };
                usuario = await usuarioRepository.criar(novoUsuario);
                console.log('Novo usuário criado:', usuario);
                return done(null, usuario);
            }
        } catch (error) {
            return done(error, null);
        }
    })
);