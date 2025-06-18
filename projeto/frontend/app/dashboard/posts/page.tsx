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
  author?: { name: string };
  createdAt?: string;
}

export default function PostsPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/posts');
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        }
      } catch (error) {
        console.error('Erro ao buscar posts:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Filtrar posts do usuário atual
  const userPosts = posts.filter(post => post.authorId === user?.id);

  const handleDeletePost = async (id: number) => {
    if (confirm('Tem certeza que deseja excluir este post?')) {
      try {
        const response = await fetch(`http://localhost:3000/api/posts/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setPosts(posts.filter(post => post.id !== id));
        }
      } catch (error) {
        console.error('Erro ao excluir post:', error);
      }
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Meus Posts</h1>
          <p style={{ color: '#666' }}>Gerencie suas publicações</p>
        </div>
        <Link href="/dashboard/posts/new" className="button button-primary">
          ➕ Novo Post
        </Link>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Todos os Posts ({userPosts.length})</h2>
        </div>
        <div className="card-content">
          {isLoading ? (
            <p>Carregando posts...</p>
          ) : userPosts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {userPosts.map((post) => (
                <div key={post.id} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '1rem',
                  border: '1px solid #eee',
                  borderRadius: '8px',
                  backgroundColor: '#fff'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{post.title}</h3>
                      <span style={{ 
                        padding: '0.25rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        backgroundColor: post.published ? '#dcfce7' : '#fef3c7',
                        color: post.published ? '#166534' : '#92400e'
                      }}>
                        {post.published ? 'Publicado' : 'Rascunho'}
                      </span>
                    </div>
                    <p style={{ margin: 0, color: '#666', fontSize: '0.875rem' }}>
                      {post.content ? post.content.substring(0, 100) + '...' : 'Sem conteúdo'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link href={`/dashboard/posts/edit/${post.id}`} className="button button-outline">
                      ✏️ Editar
                    </Link>
                    <button 
                      onClick={() => handleDeletePost(post.id)}
                      className="button button-danger"
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <p style={{ marginBottom: '1rem', color: '#666' }}>Você ainda não criou nenhum post.</p>
              <Link href="/dashboard/posts/new" className="button button-primary">
                ➕ Criar seu primeiro post
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}