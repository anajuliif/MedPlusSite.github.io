exports.fazerLog = function () {
app.get('/', (req, res) => {
res.render('login');
});

// Rota para processar o formulário de login
app.post('/login', (req, res) => {
const { username, password } = req.body;

const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

db.query(query, [username, password], (err, results) => {
if (err) throw err;

if (results.length > 0) {
req.session.loggedin = true;
req.session.username = username;
res.redirect('/dashboard');
} else {
res.send('Credenciais incorretas. <a href="/">Tente novamente</a>');
}
});
});
}
