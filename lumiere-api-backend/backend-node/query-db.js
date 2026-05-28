const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, './database.db');
const db = new sqlite3.Database(dbPath);

console.log("\n🎬 === LUMIÈRE LOCAL DATABASE VIEWER === 🎬\n");

const runQueries = () => {
  // 1. Mostrar avaliações e comentários salvos
  const qReviews = `
    SELECT p.name as "Usuario", r.movie_title as "Filme", r.comment as "Critica_Comentario"
    FROM reviews r
    JOIN profiles p ON p.user_id = r.user_id
    ORDER BY r.created_at DESC
  `;

  db.all(qReviews, [], (err, rows) => {
    if (err) {
      console.error("Erro ao ler avaliações:", err);
    } else {
      console.log("⭐ [TABELA: REVIEWS & COMENTARIOS DE FILMES]");
      if (rows.length === 0) {
        console.log("(Nenhuma avaliação cadastrada ainda)\n");
      } else {
        console.table(rows);
        console.log("\n");
      }
    }

    // 2. Mostrar notas em estrelas
    const qRatings = `
      SELECT p.name as "Usuario", r.movie_id as "ID Filme", r.rating as "Estrelas (1-5)"
      FROM ratings r
      JOIN profiles p ON p.user_id = r.user_id
    `;

    db.all(qRatings, [], (err, rows) => {
      if (err) {
        console.error("Erro ao ler estrelas:", err);
      } else {
        console.log("📈 [TABELA: RATINGS / NOTAS DO USUARIO]");
        if (rows.length === 0) {
          console.log("(Nenhuma nota registrada ainda)\n");
        } else {
          console.table(rows);
          console.log("\n");
        }
      }

      // 3. Mostrar filmes assistidos e tempos
      const qWatched = `
        SELECT p.name as "Usuario", w.movie_title as "Filme Assistido", w.runtime as "Minutos"
        FROM watched w
        JOIN profiles p ON p.user_id = w.user_id
      `;

      db.all(qWatched, [], (err, rows) => {
        if (err) {
          console.error("Erro ao ler assistidos:", err);
        } else {
          console.log("👁️ [TABELA: WATCHED / HISTORICO DE FILMES ASSISTIDOS]");
          if (rows.length === 0) {
            console.log("(Nenhum filme assistido cadastrado ainda)\n");
          } else {
            console.table(rows);
            console.log("\n");
          }
        }

        // 4. Mostrar listas criadas
        const qLists = `
          SELECT p.name as "Criador", l.name as "Nome da Lista", l.description as "Descricao"
          FROM lists l
          JOIN profiles p ON p.user_id = l.user_id
        `;

        db.all(qLists, [], (err, rows) => {
          if (err) {
            console.error("Erro ao ler listas:", err);
          } else {
            console.log("≣ [TABELA: LISTS / MINHAS LISTAS CRIADAS]");
            if (rows.length === 0) {
              console.log("(Nenhuma lista criada ainda)\n");
            } else {
              console.table(rows);
              console.log("\n");
            }
          }

          // 5. Mostrar logins e cadastros ativos (Mascarando com as bolinhas de proteção que o usuário prefere)
          const qUsers = `
            SELECT username as "Nome de Usuario", email as "E-mail de Login"
            FROM users
          `;

          db.all(qUsers, [], (err, rows) => {
            if (err) {
              console.error("Erro ao ler logins:", err);
            } else {
              console.log("🔐 [TABELA: USERS / CADASTROS E LOGINS ATIVOS]");
              if (rows.length === 0) {
                console.log("(Nenhum usuário cadastrado ainda)\n");
              } else {
                // Mapeia para colocar a máscara de bolinhas super elegante
                const formatted = rows.map(r => ({
                  "Nome de Usuario": r["Nome de Usuario"],
                  "E-mail de Login": r["E-mail de Login"],
                  "Senha": "••••••••"
                }));
                console.table(formatted);
                console.log("\n");
              }
            }
            db.close();
          });
        });
      });
    });
  });
};

runQueries();
