const path = require('path');

// Determine which db to use based on env configurations
const usePostgres = !!(process.env.DB_HOST || process.env.DATABASE_URL);
let dbInstance = null;

// Unified wrapper to keep the queries completely transparent in both SQLite and PG
const db = {
  isPostgres: usePostgres,
  
  async query(text, params) {
    if (usePostgres) {
      const res = await dbInstance.query(text, params);
      return res.rows;
    } else {
      return new Promise((resolve, reject) => {
        dbInstance.all(text, params || [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    }
  },

  async get(text, params) {
    if (usePostgres) {
      const res = await dbInstance.query(text, params);
      return res.rows[0] || null;
    } else {
      return new Promise((resolve, reject) => {
        dbInstance.get(text, params || [], (err, row) => {
          if (err) reject(err);
          else resolve(row || null);
        });
      });
    }
  },

  async run(text, params) {
    if (usePostgres) {
      const res = await dbInstance.query(text, params);
      return { lastID: null, changes: res.rowCount };
    } else {
      return new Promise((resolve, reject) => {
        dbInstance.run(text, params || [], function(err) {
          if (err) reject(err);
          else resolve({ lastID: this.lastID, changes: this.changes });
        });
      });
    }
  }
};

const initDb = async () => {
  if (usePostgres) {
    try {
      const { Pool } = require('pg');
      const poolConfig = process.env.DATABASE_URL 
        ? { connectionString: process.env.DATABASE_URL }
        : {
            host: process.env.DB_HOST,
            port: process.env.DB_PORT || 5432,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
          };
      
      dbInstance = new Pool(poolConfig);
      console.log("🔋 Conectado ao banco de dados PostgreSQL!");
    } catch (err) {
      console.error("❌ Falha ao iniciar pool PostgreSQL. Tentando fallback para SQLite local...", err);
      setupSQLite();
    }
  } else {
    setupSQLite();
  }

  // Create tables if they do not exist
  try {
    const isPg = db.isPostgres;
    const pkType = isPg ? "UUID PRIMARY KEY" : "TEXT PRIMARY KEY";

    // 1. Users table
    await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id ${pkType},
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        profile_image TEXT,
        bio TEXT,
        is_premium BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 2. Profiles table
    await db.run(`
      CREATE TABLE IF NOT EXISTS profiles (
        id ${pkType},
        user_id TEXT NOT NULL,
        name VARCHAR(100) NOT NULL,
        avatar_url TEXT,
        is_kids BOOLEAN DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 3. Lists table
    await db.run(`
      CREATE TABLE IF NOT EXISTS lists (
        id ${pkType},
        user_id TEXT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 4. List Movies table
    await db.run(`
      CREATE TABLE IF NOT EXISTS list_movies (
        list_id TEXT NOT NULL,
        movie_id INT NOT NULL,
        movie_title VARCHAR(255),
        movie_poster TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (list_id, movie_id)
      )
    `);

    // 5. Reviews (Comentários/Opiniões) table
    await db.run(`
      CREATE TABLE IF NOT EXISTS reviews (
        id ${pkType},
        user_id TEXT NOT NULL,
        movie_id INT NOT NULL,
        movie_title VARCHAR(255),
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 6. Ratings (Avaliações) table
    await db.run(`
      CREATE TABLE IF NOT EXISTS ratings (
        user_id TEXT NOT NULL,
        movie_id INT NOT NULL,
        rating INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, movie_id)
      )
    `);

    // 7. Follows (Seguidores) table
    await db.run(`
      CREATE TABLE IF NOT EXISTS follows (
        follower_id TEXT NOT NULL,
        followed_id TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (follower_id, followed_id)
      )
    `);

    // 8. Watched (Assistidos) table
    await db.run(`
      CREATE TABLE IF NOT EXISTS watched (
        user_id TEXT NOT NULL,
        movie_id INT NOT NULL,
        movie_title VARCHAR(255),
        movie_poster TEXT,
        runtime INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (user_id, movie_id)
      )
    `);

    console.log("⚡ Tabelas do banco de dados verificadas/criadas com sucesso!");
  } catch (err) {
    console.error("❌ Erro ao criar tabelas do banco de dados:", err);
  }
};

function setupSQLite() {
  const sqlite3 = require('sqlite3').verbose();
  const dbPath = path.resolve(__dirname, '../../database.db');
  dbInstance = new sqlite3.Database(dbPath);
  db.isPostgres = false;
  console.log(`🔋 Conectado ao banco de dados SQLite local em: ${dbPath}`);
}

initDb();

module.exports = db;
