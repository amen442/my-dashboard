import React, { useState } from 'react';
import './LoginAdmin.css';

function LoginAdmin({ onSuccess, onBack }) {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: motDePasse }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.role !== 'admin') {
          setMessage('❌ Ce compte n\'est pas un admin');
          setLoading(false);
          return;
        }
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('email', email);
        setMessage('✅ Connexion réussie !');
        onSuccess(data.token, email, data.role);
      } else {
        setMessage(`❌ Erreur : ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Connexion Admin</h2>
        <form onSubmit={handleLogin} className="login-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="login-input"
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
            className="login-input"
            disabled={loading}
          />
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        {message && (
          <p
            className="login-message"
            style={{ color: message.startsWith('❌') ? '#e74c3c' : '#2ecc71' }}
          >
            {message}
          </p>
        )}
        <button onClick={onBack} className="login-back-button" disabled={loading}>
          ⬅️ Retour
        </button>
      </div>
    </div>
  );
}

export default LoginAdmin;
