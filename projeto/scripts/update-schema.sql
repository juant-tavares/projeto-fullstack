-- Script para atualizar o schema com cascade delete
-- Execute este script após atualizar o schema.prisma

-- Primeiro, fazer backup dos dados
CREATE TABLE User_backup AS SELECT * FROM User;
CREATE TABLE Post_backup AS SELECT * FROM Post;
CREATE TABLE Comment_backup AS SELECT * FROM Comment;

-- Recriar as tabelas com cascade delete
DROP TABLE IF EXISTS Comment;
DROP TABLE IF EXISTS Post;
DROP TABLE IF EXISTS User;

-- Recriar User
CREATE TABLE User (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    password TEXT
);

-- Recriar Post com cascade delete
CREATE TABLE Post (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT,
    published BOOLEAN DEFAULT FALSE,
    authorId INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (authorId) REFERENCES User(id) ON DELETE CASCADE
);

-- Recriar Comment com cascade delete
CREATE TABLE Comment (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    postId INTEGER NOT NULL,
    authorId INTEGER NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (postId) REFERENCES Post(id) ON DELETE CASCADE,
    FOREIGN KEY (authorId) REFERENCES User(id) ON DELETE CASCADE
);

-- Restaurar dados
INSERT INTO User SELECT * FROM User_backup;
INSERT INTO Post SELECT * FROM Post_backup;
INSERT INTO Comment SELECT * FROM Comment_backup;

-- Limpar backups
DROP TABLE User_backup;
DROP TABLE Post_backup;
DROP TABLE Comment_backup;
