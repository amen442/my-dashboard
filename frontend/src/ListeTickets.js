import React, { useEffect, useState } from 'react';

function ListeTickets({ onBack, onReclamer }) {
  const [tickets, setTickets] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem('token');
      if (!token) return setMessage("⛔ Accès refusé");

      try {
        const res = await fetch('http://localhost:5000/tickets', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await res.json();

        if (res.ok) {
          setTickets(data);
        } else {
          setMessage(`❌ ${data.message}`);
        }
      } catch (err) {
        console.error(err);
        setMessage("❌ Erreur serveur");
      }
    };

    fetchTickets();
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>🎫 Mes Tickets</h2>

        {message && <p style={styles.message}>{message}</p>}

        {tickets.length === 0 && !message ? (
          <p style={styles.message}>Aucun ticket trouvé.</p>
        ) : (
          tickets.map((ticket, index) => (
            <div key={index} style={styles.ticket}>
              <h4>{ticket.sujet}</h4>
              <p>{ticket.description}</p>
              <p><strong>Statut:</strong> {ticket.statut}</p>
              <p><em>{new Date(ticket.date).toLocaleString()}</em></p>

              <button 
                onClick={() => onReclamer(ticket._id)} 
                style={styles.reclamerBtn}
              >
                📝 Réclamer
              </button>
            </div>
          ))
        )}

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
    maxWidth: '600px',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '25px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
    fontFamily: 'Segoe UI, sans-serif'
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  message: {
    textAlign: 'center',
    marginBottom: '10px',
    color: '#4e54c8',
    fontWeight: 'bold'
  },
  ticket: {
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '15px',
    marginBottom: '15px',
    backgroundColor: '#f9f9f9'
  },
  reclamerBtn: {
    marginTop: '8px',
    padding: '8px 12px',
    backgroundColor: '#f39c12',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  backBtn: {
    marginTop: '10px',
    padding: '10px 16px',
    backgroundColor: '#4e54c8',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer'
  }
};

export default ListeTickets;
