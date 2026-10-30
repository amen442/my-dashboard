import React, { useState } from 'react';

function AjoutTicket({ onBack }) {
  const [sujet, setSujet] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) return setMessage("⛔ Vous n'êtes pas connecté");

    try {
      const res = await fetch('http://localhost:5000/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ sujet, description })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('✅ Ticket envoyé avec succès !');
        setSujet('');
        setDescription('');
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
        <h2 style={styles.title}>Créer un Ticket</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="text"
            placeholder="Sujet"
            value={sujet}
            onChange={(e) => setSujet(e.target.value)}
            style={styles.input}
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={styles.textarea}
            required
          />
          <button type="submit" style={styles.button}>Envoyer</button>
        </form>
        {message && <p style={styles.message}>{message}</p>}
        <button onClick={onBack} style={styles.backBtn}>⬅️ Retour</button>
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
    maxWidth: '500px',
    padding: '30px',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
    fontFamily: 'Segoe UI, sans-serif',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    fontSize: '15px',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  textarea: {
    padding: '12px',
    fontSize: '15px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    height: '100px',
  },
  button: {
    padding: '12px',
    backgroundColor: '#4e54c8',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    cursor: 'pointer',
  },
  message: {
    textAlign: 'center',
    marginTop: '10px',
    color: '#4e54c8',
    fontWeight: 'bold',
  },
  backBtn: {
    marginTop: '15px',
    border: 'none',
    background: 'none',
    color: '#4e54c8',
    cursor: 'pointer',
    fontSize: '14px',
    textDecoration: 'underline',
  }
};

export default AjoutTicket;
