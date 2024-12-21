import { Database } from "bun:sqlite";

const db = new Database("bot-rss.sqlite");

// Création de la table feeds
db.run(`
  CREATE TABLE IF NOT EXISTS feeds (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    link TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// Création de la table tweets
db.run(`
  CREATE TABLE IF NOT EXISTS tweets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    link TEXT NOT NULL,
    title TEXT NOT NULL,
    pub_date TEXT NOT NULL,
    sended INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expire_at DATETIME DEFAULT (datetime('now', '+7 days'))
  )
`);

export default db;
