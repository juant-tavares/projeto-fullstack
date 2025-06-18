'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';

interface User {
  id: number;
  email: string;
  name: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
  }, []);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfileMenu]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setShowProfileMenu(false);
    window.location.reload();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header className="header">
        <div className="container header-content">
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>Blog App</h1>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user ? (
              // Menu de perfil para usuário logado
              <div ref={menuRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                  title={`Perfil de ${user.name}`}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                >
                  {getInitials(user.name)}
                </button>
                
                {showProfileMenu && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: '0',
                    marginTop: '0.5rem',
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                    minWidth: '200px',
                    zIndex: 50,
                    animation: 'fadeIn 0.15s ease-out'
                  }}>
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e5e7eb' }}>
                      <p style={{ margin: 0, fontWeight: '500', fontSize: '0.875rem' }}>{user.name}</p>
                      <p style={{ margin: 0, color: '#666', fontSize: '0.75rem' }}>{user.email}</p>
                    </div>
                    
                    <div style={{ padding: '0.5rem 0' }}>
                      <Link 
                        href="/dashboard"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 1rem',
                          textDecoration: 'none',
                          color: '#374151',
                          fontSize: '0.875rem',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        onClick={() => setShowProfileMenu(false)}
                      >
                        📊 Dashboard
                      </Link>
                      
                      <Link 
                        href="/dashboard/posts"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 1rem',
                          textDecoration: 'none',
                          color: '#374151',
                          fontSize: '0.875rem',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        onClick={() => setShowProfileMenu(false)}
                      >
                        📝 Meus Posts
                      </Link>
                      
                      <Link 
                        href="/posts"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 1rem',
                          textDecoration: 'none',
                          color: '#374151',
                          fontSize: '0.875rem',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        onClick={() => setShowProfileMenu(false)}
                      >
                        👁️ Posts Públicos
                      </Link>
                    </div>
                    
                    <div style={{ borderTop: '1px solid #e5e7eb', padding: '0.5rem 0' }}>
                      <button
                        onClick={handleLogout}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 1rem',
                          width: '100%',
                          border: 'none',
                          backgroundColor: 'transparent',
                          color: '#dc2626',
                          fontSize: '0.875rem',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        🚪 Sair
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Botões para usuário não logado
              <>
                <Link href="/login" className="button button-outline">Login</Link>
                <Link href="/register" className="button button-primary">Registrar</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        <section style={{ 
          width: '100%', 
          padding: '3rem 0 6rem 0', 
          backgroundColor: '#f8fafc' 
        }}>
          <div className="container" style={{ 
            padding: '0 1rem', 
            textAlign: 'center' 
          }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '1rem' 
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <h1 style={{ 
                  fontSize: 'clamp(2rem, 5vw, 4rem)', 
                  fontWeight: 'bold', 
                  marginBottom: '1rem',
                  lineHeight: '1.1'
                }}>
                  Bem-vindo ao Blog App
                </h1>
                <p style={{ 
                  maxWidth: '700px', 
                  color: '#64748b', 
                  fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                  lineHeight: '1.6',
                  margin: '0 auto'
                }}>
                  Uma plataforma para compartilhar suas ideias e conectar-se com outros escritores.
                </p>
              </div>
              
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '1rem',
                minWidth: '200px'
              }}>
                {user ? (
                  // Ações para usuário logado
                  <>
                    <Link href="/dashboard" className="button button-primary" style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}>
                      📊 Ir para Dashboard
                    </Link>
                    <Link href="/posts" className="button button-outline" style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}>
                      👁️ Ver posts públicos
                    </Link>
                  </>
                ) : (
                  // Ações para usuário não logado
                  <>
                    <Link href="/login" className="button button-primary" style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}>
                      Começar agora
                    </Link>
                    <Link href="/posts" className="button button-outline" style={{ fontSize: '1.1rem', padding: '0.75rem 2rem' }}>
                      Ver posts
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section style={{ width: '100%', padding: '3rem 0 6rem 0' }}>
          <div className="container" style={{ padding: '0 1rem' }}>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '1rem',
              textAlign: 'center'
            }}>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ 
                  fontSize: 'clamp(1.5rem, 4vw, 3rem)', 
                  fontWeight: 'bold', 
                  marginBottom: '1rem' 
                }}>
                  Recursos
                </h2>
                <p style={{ 
                  maxWidth: '700px', 
                  color: '#64748b', 
                  fontSize: 'clamp(1rem, 2vw, 1.25rem)',
                  margin: '0 auto'
                }}>
                  Explore os recursos do nosso aplicativo de blog.
                </p>
              </div>
              
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '2rem',
                width: '100%',
                maxWidth: '900px'
              }}>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '1rem',
                  padding: '1.5rem'
                }}>
                  <div style={{ 
                    borderRadius: '50%', 
                    backgroundColor: '#f1f5f9', 
                    padding: '1rem',
                    fontSize: '2rem'
                  }}>
                    ✏️
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>Crie Posts</h3>
                  <p style={{ color: '#64748b', margin: 0, textAlign: 'center' }}>
                    Compartilhe suas ideias com o mundo.
                  </p>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '1rem',
                  padding: '1.5rem'
                }}>
                  <div style={{ 
                    borderRadius: '50%', 
                    backgroundColor: '#f1f5f9', 
                    padding: '1rem',
                    fontSize: '2rem'
                  }}>
                    👁️
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>Veja os posts da comunidade</h3>
                  <p style={{ color: '#64748b', margin: 0, textAlign: 'center' }}>
                    Interaja com outros escritores.
                  </p>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  gap: '1rem',
                  padding: '1.5rem'
                }}>
                  <div style={{ 
                    borderRadius: '50%', 
                    backgroundColor: '#f1f5f9', 
                    padding: '1rem',
                    fontSize: '2rem'
                  }}>
                    👤
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>Perfil</h3>
                  <p style={{ color: '#64748b', margin: 0, textAlign: 'center' }}>
                    Gerencie seu perfil e publicações.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer style={{ borderTop: '1px solid #e5e7eb', padding: '1.5rem 0' }}>
        <div className="container" style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          gap: '1rem', 
          padding: '0 1rem', 
          textAlign: 'center' 
        }}>
          <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
            © 2024 Blog App. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}