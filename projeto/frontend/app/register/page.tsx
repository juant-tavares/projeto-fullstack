'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Versão simplificada sem senha
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Falha ao registrar usuário');
      }

      const userData = await response.json();
      
      // Salvar usuário no localStorage
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Redirecionar para o dashboard
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao registrar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5', padding: '1rem' }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-header">
          <h1 className="card-title">Criar uma conta</h1>
          <p>Preencha os campos abaixo para se registrar</p>
        </div>
        <div className="card-content">
          {error && (
            <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Nome</label>
              <input
                id="name"
                className="form-input"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            {/* Removemos os campos de senha temporariamente */}
            <button
              type="submit"
              className="button button-primary"
              style={{ width: '100%', marginTop: '1rem' }}
              disabled={isLoading}
            >
              {isLoading ? 'Registrando...' : 'Registrar'}
            </button>
          </form>
        </div>
        <div className="card-footer" style={{ justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', fontSize: '0.875rem' }}>
            Já tem uma conta?{' '}
            <Link href="/login" style={{ color: '#3b82f6', textDecoration: 'none' }}>
              Faça login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}