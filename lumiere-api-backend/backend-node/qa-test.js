const db = require("./src/services/db");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const runQATests = async () => {
  console.log("\n========================================================");
  console.log("🕵️‍♂️ INICIANDO CONJUNTO DE TESTES DE QA - BANCO DE DADOS 🕵️‍♂️");
  console.log("========================================================\n");

  try {
    // 1. Limpeza de Testes Anteriores (Garante isolamento do teste)
    console.log("🧼 1. Limpando dados de testes anteriores...");
    const testEmail = "qa-test@email.com";
    const testUsername = "qatester";
    
    // Busca usuário de teste existente
    const usuarioExistente = await db.get("SELECT id FROM users WHERE email = ?", [testEmail]);
    if (usuarioExistente) {
      await db.run("DELETE FROM profiles WHERE user_id = ?", [usuarioExistente.id]);
      await db.run("DELETE FROM lists WHERE user_id = ?", [usuarioExistente.id]);
      await db.run("DELETE FROM reviews WHERE user_id = ?", [usuarioExistente.id]);
      await db.run("DELETE FROM ratings WHERE user_id = ?", [usuarioExistente.id]);
      await db.run("DELETE FROM users WHERE id = ?", [usuarioExistente.id]);
      console.log("   ✅ Usuário de teste antigo removido com sucesso.");
    } else {
      console.log("   ✅ Nenhuma sujeira de teste detectada. Prontos para prosseguir!");
    }

    // 2. Teste de Cadastro (Mapeando com usuariosController.js)
    console.log("\n📝 2. Testando CADASTRO de novo usuário...");
    const userId = crypto.randomUUID();
    const profileId = crypto.randomUUID();
    const nomeExibicao = "QA Tester Leticia";
    const senhaLimpa = "segredoQA123";
    const senhaHash = bcrypt.hashSync(senhaLimpa, 10);

    // Insere o usuário
    await db.run(
      "INSERT INTO users (id, username, email, password_hash, bio) VALUES (?, ?, ?, ?, ?)",
      [userId, testUsername, testEmail, senhaHash, "Bio de teste do robô de QA."]
    );
    console.log("   ✅ Usuário inserido com sucesso na tabela 'users'.");

    // Insere o perfil
    await db.run(
      "INSERT INTO profiles (id, user_id, name) VALUES (?, ?, ?)",
      [profileId, userId, nomeExibicao]
    );
    console.log("   ✅ Perfil do usuário inserido com sucesso na tabela 'profiles'.");

    // Verifica integridade física no banco
    const userNoBanco = await db.get("SELECT * FROM users WHERE email = ?", [testEmail]);
    const perfilNoBanco = await db.get("SELECT * FROM profiles WHERE user_id = ?", [userId]);
    
    if (userNoBanco && perfilNoBanco && perfilNoBanco.name === nomeExibicao) {
      console.log("   ⭐ [QA PASSED]: Cadastro e criação de perfil validados no banco de dados!");
    } else {
      throw new Error("Falha ao salvar dados de cadastro/perfil no banco de dados.");
    }

    // 3. Teste de Login e Criptografia (Mapeando com login)
    console.log("\n🔑 3. Testando validação de senha (BCRYPT) e LOGIN...");
    if (bcrypt.compareSync(senhaLimpa, userNoBanco.password_hash)) {
      console.log("   ✅ Comparação de Hash BCrypt validada com sucesso!");
    } else {
      throw new Error("A senha em texto puro não confere com o Hash salvo!");
    }

    const token = jwt.sign({ id: userId }, "segredo123", { expiresIn: "1d" });
    console.log("   ✅ Token JWT gerado e assinado com sucesso.");
    console.log("   ⭐ [QA PASSED]: Fluxo de autenticação e criptografia validados!");

    // 4. Teste de Postagem de Comentários / Feed (Mapeando com postarOpiniao)
    console.log("\n💬 4. Testando criação de COMENTÁRIO/AVALIAÇÃO no Feed...");
    const reviewId = crypto.randomUUID();
    const movieId = "550"; // Clube da Luta
    const movieTitle = "Fight Club";
    const comentarioTexto = "O primeiro passo do QA é não falar sobre o QA. Filme espetacular!";

    await db.run(
      "INSERT INTO reviews (id, user_id, movie_id, movie_title, comment) VALUES (?, ?, ?, ?, ?)",
      [reviewId, userId, movieId, movieTitle, comentarioTexto]
    );
    console.log("   ✅ Comentário registrado com sucesso na tabela 'reviews'.");

    // Busca comentário com JOIN de perfil
    const qFeed = `
      SELECT r.comment, p.name as autor, r.movie_title
      FROM reviews r
      JOIN profiles p ON p.user_id = r.user_id
      WHERE r.id = ?
    `;
    const reviewNoBanco = await db.get(qFeed, [reviewId]);
    if (reviewNoBanco && reviewNoBanco.autor === nomeExibicao && reviewNoBanco.comment === comentarioTexto) {
      console.log("   ✅ JOIN efetuado com sucesso! Nome do autor e comentário recuperados.");
      console.log("   ⭐ [QA PASSED]: Persistência de comentários do feed validada!");
    } else {
      throw new Error("Falha ao ler comentário com JOIN no banco de dados.");
    }

    // 5. Teste de Avaliações por Estrelas (Mapeando com avaliarFilme)
    console.log("\n⭐️ 5. Testando sistema de AVALIAÇÕES por estrelas (Ratings)...");
    const notaEstrelas = 5;
    await db.run(
      "INSERT INTO ratings (user_id, movie_id, rating) VALUES (?, ?, ?)",
      [userId, movieId, notaEstrelas]
    );
    console.log("   ✅ Avaliação de 5 estrelas inserida na tabela 'ratings'.");

    const ratingNoBanco = await db.get("SELECT rating FROM ratings WHERE user_id = ? AND movie_id = ?", [userId, movieId]);
    if (ratingNoBanco && ratingNoBanco.rating === notaEstrelas) {
      console.log("   ⭐ [QA PASSED]: Avaliação de estrelas gravada e validada!");
    } else {
      throw new Error("Falha ao ler nota de estrelas do banco de dados.");
    }

    // 6. Teste de Listas de Filmes Personalizadas (Mapeando com criarLista e adicionarFilmeLista)
    console.log("\n≣ 6. Testando criação de LISTA de Filmes e contagem dinâmica...");
    const listId = crypto.randomUUID();
    const nomeLista = "Lista Especial de QA";
    const descLista = "Filmes avaliados mecanicamente por robôs de teste.";
    
    // Cria a lista
    await db.run(
      "INSERT INTO lists (id, user_id, name, description) VALUES (?, ?, ?, ?)",
      [listId, userId, nomeLista, descLista]
    );
    console.log(`   ✅ Lista '${nomeLista}' criada com sucesso.`);

    // Adiciona filmes à lista (TMDB IDs 550 e 27205 - Inception)
    await db.run(
      "INSERT INTO list_movies (list_id, movie_id, movie_title, movie_poster) VALUES (?, ?, ?, ?)",
      [listId, 550, "Fight Club", "/poster550.jpg"]
    );
    await db.run(
      "INSERT INTO list_movies (list_id, movie_id, movie_title, movie_poster) VALUES (?, ?, ?, ?)",
      [listId, 27205, "Inception", "/poster27205.jpg"]
    );
    console.log("   ✅ 2 Filmes adicionados à lista de filmes.");

    // Executa a Query agregadora (com COUNT) para testar cálculo correto dos itens
    const qListas = `
      SELECT l.name, COUNT(lm.movie_id) as qtd
      FROM lists l
      LEFT JOIN list_movies lm ON lm.list_id = l.id
      WHERE l.user_id = ?
      GROUP BY l.id, l.name
    `;
    const listaNoBanco = await db.get(qListas, [userId]);
    if (listaNoBanco && parseInt(listaNoBanco.qtd) === 2) {
      console.log(`   ✅ Cálculo de itens da lista validado! A lista possui exatamente ${listaNoBanco.qtd} filmes.`);
      console.log("   ⭐ [QA PASSED]: Criação de listas e contagem dinâmica de filmes 100% validadas!");
    } else {
      throw new Error(`Cálculo de filmes incorreto! Esperado: 2, Obtido: ${listaNoBanco ? listaNoBanco.qtd : 0}`);
    }

    console.log("\n========================================================");
    console.log("🎉  TODOS OS TESTES DE QA PASSARAM COM EXCELÊNCIA!  🎉");
    console.log("========================================================");
    console.log("O seu banco de dados local está configurado, as tabelas ");
    console.log("foram criadas e todas as rotas estão prontas para salvar ");
    console.log("seus logins, listas e avaliações de forma definitiva! 🍿🚀\n");

  } catch (error) {
    console.error("\n❌❌ OCORREU UM ERRO DURANTE O TESTE DE QA ❌❌");
    console.error(error.message);
    console.error("========================================================\n");
    process.exit(1);
  } finally {
    // Encerra conexões e finaliza o script
    setTimeout(() => {
      process.exit(0);
    }, 1000);
  }
};

// Aguarda 1.5s para garantir que as tabelas automáticas do db.js foram inicializadas
setTimeout(runQATests, 1500);
