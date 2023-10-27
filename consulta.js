// consulta.js

const db = require('./app.js'); // Importe o módulo de conexão com o banco de dados, se aplicável.

function marcarConsulta(nomepaciente, nomemedico, horario, dataconsulta) {
  const query = 'SUA_QUERY_SQL_AQUI'; // Substitua por sua consulta SQL.

  return new Promise((resolve, reject) => {
    db.query(query, [nomepaciente, nomemedico, horario, dataconsulta], (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

module.exports = {
  marcarConsulta,
};
