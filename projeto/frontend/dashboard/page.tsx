'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth-guard';

interface Post {
  id: number;
  title: string;
  content?: string;
  published: boolean;
  authorId: number;
  author?: {
    id: number;
    name: string;
    email: string;
  };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsRes, usersRes] = await Promise.all([
          fetch('http://localhost:3000/api/posts'),
          fetch('http://localhost:3000/api/users')
        ]);

        if (postsRes.ok && usersRes.ok) {
          const postsData = await postsRes.json();
          const usersData = await usersRes.json();

          setPosts(postsData);
          setUsers(usersData);
        }
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filtrar posts do usuário atual
  const userPosts = posts.filter((post) => post.authorId === user?.id);
  const publishedPosts = posts.filter((post) => post.published).length;
  const draftPosts = posts.filter((post) => !post.published).length;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Dashboard</h1>
        <p style={{ color: '#666' }}>Bem-vindo ao seu painel de controle, {user?.name}!</p>
      </div>

      {/* Cards de Estatísticas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div className="card">
          <div className="card-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#666', margin: 0 }}>Total de Posts</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>
                  {isLoading ? '...' : posts.length}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#666', margin: 0 }}>
                  {isLoading ? '...' : `${userPosts.length} são seus`}
                </p>
              </div>
              <div style={{ fontSize: '2rem' }}>📚</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#666', margin: 0 }}>Posts Publicados</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>
                  {isLoading ? '...' : publishedPosts}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#666', margin: 0 }}>
                  {isLoading ? '...' : `${draftPosts} rascunhos`}
                </p>
              </div>
              <div style={{ fontSize: '2rem' }}>📊</div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '0.875rem', color: '#666', margin: 0 }}>Usuários</p>
                <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0 0 0' }}>
                  {isLoading ? '...' : users.length}
                </p>
                <p style={{ fontSize: '0.75rem', color: '#666', margin: 0 }}>Comunidade ativa</p>
              </div>
              <div style={{ fontSize: '2rem' }}>👥</div>
            </div>
          </div>
        </div>
      </div>

      {/* Seção de Posts Recentes */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">Seus Posts Recentes</h2>
            <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>Gerencie suas publicações recentes</p>
          </div>
          <div className="card-content">
            {isLoading ? (
              <div>Carregando...</div>
            ) : userPosts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {userPosts.slice(0, 5).map((post) => (
                  <div key={post.id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '0.75rem',
                    border: '1px solid #eee',
                    borderRadius: '4px'
                  }}>
                    <div>
                      <p style={{ fontWeight: '500', margin: 0 }}>{post.title}</p>
                      <p style={{ fontSize: '0.875rem', color: '#666', margin: 0 }}>
                        {post.published ? 'Publicado' : 'Rascunho'}
                      </p>
                    </div>
                    <Link href={`/dashboard/posts/edit/${post.id}`} className="button button-outline">
                      Editar
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#666' }}>Você ainda não criou nenhum post.</p>
            )}
          </div>
          <div className="card-footer">
            <Link href="/dashboard/posts" className="button button-primary">
              Ver todos os posts
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Ações Rápidas</h3>
          </div>
          <div className="card-content">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <Link href="/dashboard/posts/new" className="button button-primary">
                ➕ Criar Novo Post
              </Link>
              <Link href="/posts" className="button button-outline">
                👁️ Ver Posts Públicos
              </Link>
              <Link href="/" className="button button-outline">
                🏠 Ir para Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}