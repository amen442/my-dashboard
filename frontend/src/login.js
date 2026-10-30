import React, { useState } from 'react';

function Login({ role, onSuccess, onBack }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if(data.role !== role) {
          setMessage(`❌ Ce compte n'est pas un ${role}`);
          return;
        }
        onSuccess(data.token, email, data.role);
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      setMessage('❌ Erreur serveur');
    }
  };

  return (
    <div style={{maxWidth: 400, margin: '40px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8}}>
      <h2 style={{textAlign: 'center'}}>Connexion {role === 'admin' ? 'Admin' : 'Client'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{width: '100%', padding: 8, marginBottom: 12, borderRadius: 4, border: '1px solid #ccc'}}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{width: '100%', padding: 8, marginBottom: 12, borderRadius: 4, border: '1px solid #ccc'}}
        />
        <button type="submit" style={{width: '100%', padding: 10, backgroundColor: '#4e54c8', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer'}}>
          Se connecter
        </button>
      </form>
      {message && <p style={{color: 'red', marginTop: 10, textAlign: 'center'}}>{message}</p>}
      <button onClick={onBack} style={{marginTop: 15, background: 'none', border: 'none', color: '#4e54c8', cursor: 'pointer', textDecoration: 'underline'}}>
        ← Retour
      </button>
    </div>
  );
}

export default Login;
