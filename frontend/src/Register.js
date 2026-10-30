import React, { useState } from 'react';

function Register({ onSwitch }) {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [message, setMessage] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: motDePasse }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Compte créé avec succès !');
        // يمكن ترجع للـ login مباشرة:
        // onSwitch();
      } else {
        setMessage(`❌ Erreur : ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      setMessage('❌ Erreur de connexion au serveur');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>Créer un compte</h2>
        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email :</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Mot de passe :</label>
            <input
              type="password"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              style={styles.input}
              required
            />
          </div>
          <button type="submit" style={styles.button}>S'inscrire</button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
        <p style={styles.linkText}>
          Vous avez déjà un compte ?{' '}
          <button
            onClick={onSwitch}
            style={styles.linkButton}
            type="button"
          >
            Se connecter
          </button>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #4e54c8, #8f94fb)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  container: {
    width: '100%',
    maxWidth: '420px',
    padding: '30px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
    fontFamily: 'Segoe UI, sans-serif',
  },
  title: {
    textAlign: 'center',
    marginBottom: '25px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  label: {
    marginBottom: '6px',
    fontWeight: '600',
    display: 'block',
  },
  input: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    width: '100%',
    fontSize: '15px',
  },
  button: {
    padding: '12px',
    backgroundColor: '#4e54c8',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '10px',
  },
  message: {
    marginTop: '20px',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#4e54c8',
  },
  linkText: {
    marginTop: '16px',
    textAlign: 'center',
    fontSize: '14px',
    color: '#555',
  },
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#4e54c8',
    fontWeight: 'bold',
    cursor: 'pointer',
    padding: 0,
    fontSize: '14px',
  },
};

export default Register;
