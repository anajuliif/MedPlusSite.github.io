
//////////////////////////////////Login


const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const flash = require('connect-flash');
const port = 3000;
const register = require('./register.js');
const app = express();

// Configurar a conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'phpmyadmin',
  password: 'isabila',
  database: 'medical',
});

// Configurar o middleware bodyParser
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar sessões
app.use(session({ secret: 'secreto', resave: false, saveUninitialized: false }));

// Inicializar o Passport
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


// Configurar a estratégia de autenticação local
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      console.log('Tentando autenticar usuário:', username);
      const [rows] = await db.promise().query('SELECT * FROM user WHERE username = ?', [username]);
      const user = rows[0];

      if (!user) {
        console.log('Usuário não encontrado:', username);
        return done(null, false, { message: 'Usuário não encontrado.' });
      }

      // Verificar a senha usando bcrypt
      const isPasswordValid = await bcrypt.compare(password, user.password);
      //const isPasswordValid = true;
      
      if (!isPasswordValid) {
        console.log('Senha incorreta para o usuário:', username);
        return done(null, false, { message: 'Senha incorreta.' });
      }
      console.log('Usuário autenticado com sucesso:', username);
      return done(null, user);
    } catch (err) {
      console.error('Erro durante a autenticação:', err);
      return done(err);
    }
  }
));

app.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    const userId = await register.registerUser(username,password);
    // Usuário cadastrado com sucesso
    res.status(200).send(`Usuário cadastrado com sucesso. ID: ${userId}`);
  } catch (error) {
    // Lidar com erros de cadastro
    res.status(400).send(`Erro no cadastro: ${error.message}`);
  }
});

//Serializar
passport.serializeUser((user, done) => {
  console.log('Serializando usuário:', user.id);
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  console.log('Desserializando usuário com ID:', id);
  try {
    const [rows] = await db.promise().query('SELECT * FROM user WHERE id = ?', [id]);
    const user = rows[0];

    if (!user) {
      console.log('Usuário não encontrado para ID:', id);
      return done(null, false); // Usuário não encontrado
    }

    console.log('Usuário recuperado:', user);
    done(null, user);
  } catch (err) {
    console.error('Erro durante a desserialização:', err);
    done(err);
  }
});


// Configurar EJS como o motor de visualização
app.set('view engine', 'ejs');

// Rota para a página index
app.get('/', (req, res) => {
  res.render('index'); // Use o mecanismo de visualização que preferir
});

// Rota para a página de login
app.get('/login', (req, res) => {
  res.render('login'); // Use o mecanismo de visualização que preferir
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/fechar.html', // Redirecionamento após login bem-sucedido
  failureRedirect: '/login',    // Redirecionamento após falha de login
  failureFlash: true,          // Permite o uso de mensagens flash
}));

app.get('/formulario', (req, res) => {
  res.render('formulario'); // Use o mecanismo de visualização que preferir
});

// Rota protegida - exemplo da página de dashboard
//app.get('/fechar.html', (req, res) => {
 // if (req.isAuthenticated()) {
  //  res.send('Você está logado.');
   // console.log('Usuário logado');
  
    //res.redirect('window.close;');
 // } else {
   // console.log('Usuário inválido');
   // res.redirect('/login');
 // }
//});

// Servir arquivos estáticos
app.use(express.static(__dirname + '/'));

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor Express está rodando na porta ${port}`);
});



