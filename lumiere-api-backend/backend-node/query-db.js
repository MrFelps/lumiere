const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, './database.db');
const db = new sqlite3.Database(dbPath);

const id = '48ec0c90-af7b-4a45-b88f-595121202aa4'; // A lista 'nerd'

const q = `
  SELECT l.id, l.name as nome, l.description, p.name as creator, u.username
  FROM lists l
  JOIN users u ON u.id = l.user_id
  JOIN profiles p ON p.user_id = l.user_id
  WHERE l.id = ?
`;

db.get(q, [id], (err, row) => {
  if (err) console.error("Erro query lista:", err);
  else console.log("Resultado query lista:", row);
});

db.all("SELECT * FROM list_movies WHERE list_id = ?", [id], (err, rows) => {
  if (err) console.error("Erro query filmes:", err);
  else console.log("Resultado query filmes:", rows);
});
