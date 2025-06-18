'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  content?: string;
  published: boolean;
  authorId: number;
  author?: { name: string };
  createdAt?: string;
}

interface User {
  id: number;
  email: string;
  name: string;
}

export default function PublicPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Verificar se há um usuário logado
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('user');
      }
    }

    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/posts');
        if (response.ok) {
          const data = await response.json();
          // Filtrar apenas posts publicados
          const publishedPosts = data.filter((post: Post) => post.published);
          setPosts(publishedPosts);
        }
      } catch (error) {
        console.error('Erro ao buscar posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Data desconhecida';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header com navegação condicional */}
      <header className="header">
        <div className="container header-content">
          <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {user ? (
              // Se estiver logado, mostrar opções do usuário logado
              <>
                <span style={{ color: '#666' }}>Olá, {user.name}!</span>
                <Link href="/dashboard" className="button button-outline">
                  📊 Dashboard
                </Link>
                <Link href="/dashboard/posts/new" className="button button-primary">
                  ➕ Novo Post
                </Link>
                <button onClick={handleLogout} className="button button-outline">
                  🚪 Sair
                </button>
              </>
            ) : (
              // Se não estiver logado, mostrar opções de login/registro
              <>
                <Link href="/" className="button button-outline">🏠 Home</Link>
                <Link href="/login" className="button button-outline">🔑 Login</Link>
                <Link href="/register" className="button button-primary">📝 Registrar</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main style={{ padding: '2rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Posts do Blog</h1>
            <p style={{ color: '#666', fontSize: '1.2rem' }}>
              Explore os posts mais recentes da nossa comunidade de escritores.
            </p>
          </div>

          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p>Carregando posts...</p>
            </div>
          ) : posts.length > 0 ? (
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
              gap: '2rem' 
            }}>
              {posts.map((post) => (
                <div key={post.id} className="card" style={{ height: 'fit-content' }}>
                  <div className="card-header">
                    <h2 className="card-title" style={{ 
                      fontSize: '1.25rem',
                      lineHeight: '1.4',
                      marginBottom: '0.5rem'
                    }}>
                      {post.title}
                    </h2>
                    <p style={{ color: '#666', fontSize: '0.875rem', margin: 0 }}>
                      por {post.author?.name || 'Autor desconhecido'}
                    </p>
                  </div>
                  <div className="card-content">
                    <p style={{ 
                      color: '#666', 
                      lineHeight: '1.6',
                      marginBottom: '1rem'
                    }}>
                      {post.content 
                        ? post.content.length > 150 
                          ? post.content.substring(0, 150) + '...' 
                          : post.content
                        : 'Sem conteúdo'
                      }
                    </p>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center' 
                    }}>
                      <p style={{ 
                        fontSize: '0.875rem', 
                        color: '#666', 
                        margin: 0 
                      }}>
                        {formatDate(post.createdAt)}
                      </p>
                      <Link 
                        href={`/posts/${post.id}`} 
                        className="button button-outline"
                        style={{ fontSize: '0.875rem' }}
                      >
                        Ler mais →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <p style={{ marginBottom: '1rem', color: '#666', fontSize: '1.1rem' }}>
                Nenhum post publicado ainda.
              </p>
              {user ? (
                <Link href="/dashboard/posts/new" className="button button-primary">
                  Criar seu primeiro post
                </Link>
              ) : (
                <Link href="/login" className="button button-primary">
                  Faça login para criar um post
                </Link>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}