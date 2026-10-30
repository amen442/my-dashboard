import React, { useState } from 'react';

function Reclamation({ ticketId, onBack }) {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const token = localStorage.getItem('token');
    if (!token) {
      setMessage("⛔ Vous devez être connecté.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/reclamations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ticketId,
          content
        })
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Réclamation envoyée avec succès !");
        setContent('');
      } else {
        setMessage(`❌ ${data.message || 'Erreur'}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Erreur serveur");
    }

    setLoading(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>Réclamation pour le ticket</h2>

        {message && <p style={styles.message}>{message}</p>}

        <form onSubmit={handleSubmit}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Écrivez votre réclamation ici..."
            rows={6}
            required
            style={styles.textarea}
          />
          <br />
          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Envoi...' : 'Envoyer'}
          </button>
          <button type="button" onClick={onBack} style={styles.backBtn}>
            ⬅️ Retour
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f12711, #f5af19)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  container: {
    maxWidth: '600px',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '25px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
    fontFamily: 'Segoe UI, sans-serif',
    textAlign: 'center'
  },
  title: {
    marginBottom: '20px',
    color: '#333',
  },
  message: {
    marginBottom: '15px',
    fontWeight: 'bold',
    color: '#f39c12',
  },
  textarea: {
    width: '100%',
    borderRadius: '10px',
    border: '1px solid #ccc',
    padding: '10px',
    fontSize: '16px',
    resize: 'vertical'
  },
  submitBtn: {
    marginTop: '10px',
    marginRight: '10px',
    padding: '10px 20px',
    backgroundColor: '#f39c12',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  backBtn: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#7f8c8d',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
  }
};

export default Reclamation;
