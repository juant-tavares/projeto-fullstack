-- Criar tabelas manualmente
CREATE TABLE IF NOT EXISTS "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT,
    "password" TEXT
);

CREATE TABLE IF NOT EXISTS "Post" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "authorId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "postId" INTEGER NOT NULL,
    "authorId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Criar índices
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

-- Inserir dados de teste
INSERT OR IGNORE INTO "User" ("id", "email", "name", "password") VALUES 
(1, 'admin@test.com', 'Admin', '$2b$10$example.hash.here'),
(2, 'user@test.com', 'User Test', '$2b$10$example.hash.here');

INSERT OR IGNORE INTO "Post" ("id", "title", "content", "published", "authorId") VALUES 
(1, 'Primeiro Post', 'Este é o conteúdo do primeiro post.', true, 1),
(2, 'Segundo Post', 'Este é o conteúdo do segundo post.', true, 2);
