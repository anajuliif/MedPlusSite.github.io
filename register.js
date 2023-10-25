const mysql = require('mysql2');
//const bcrypt = require('bcrypt');//

// Configurar a conexão com o banco de dados MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'phpmyadmin',
  password: '123456',
  database: 'medical',
});

// Função para cadastrar um novo usuário
async function registerUser(username,password) {
  try {
    // Verificar se o usuário já existe
    const [existingUsers] = await db.promise().query('SELECT * FROM users WHERE username = ?', [username]);

    if (existingUsers.length > 0) {
      throw new Error('Usuário já existe');
    }

    // Hash da senha usando bcrypt
   // const hashedPassword = await bcrypt.hash(password, 10);//

    // Inserir o novo usuário no banco de dados
    const [result] = await db.promise().query('INSERT INTO users (username, password) VALUES (?, ?)', [username,password]);

    if (result.insertId) {
      return result.insertId;
    } else {
      throw new Error('Erro ao cadastrar o usuário.');
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  registerUser,
};
