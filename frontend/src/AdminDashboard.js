import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';

function AdminDashboard({ email, onLogout }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch('http://localhost:5000/admin/tickets', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setTickets(data);
        } else {
          console.error('Erreur lors du fetch');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const total = tickets.length;
  const enAttente = tickets.filter(t => t.statut === 'En attente').length;
  const termines = tickets.filter(t => t.statut === 'Terminé').length;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2>🎛️ Dashboard Admin</h2>
        <p className="admin-email">Connecté en tant que <strong>{email}</strong></p>
        <button onClick={onLogout} className="logout-button">
          🔒 Se déconnecter
        </button>
      </div>

      <div className="stats-box">
        <div className="stat-card">🎫 Total Tickets : <strong>{total}</strong></div>
        <div className="stat-card">🕒 En attente : <strong>{enAttente}</strong></div>
        <div className="stat-card">✅ Terminés : <strong>{termines}</strong></div>
      </div>

      <h3 className="section-title">📋 Liste des tickets</h3>

      {loading ? (
        <p className="loading-text">Chargement des tickets...</p>
      ) : tickets.length === 0 ? (
        <p className="empty-text">Aucun ticket trouvé.</p>
      ) : (
        <div className="table-wrapper">
          <table className="tickets-table">
            <thead>
              <tr>
                <th>Sujet</th>
                <th>Description</th>
                <th>Utilisateur</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Réclamations</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map(ticket => (
                <tr key={ticket._id}>
                  <td>{ticket.sujet}</td>
                  <td>{ticket.description}</td>
                  <td>{ticket.userId?.email || 'N/A'}</td>
                  <td>{ticket.statut}</td>
                  <td>{new Date(ticket.date).toLocaleString()}</td>
                  <td>
                    {ticket.reclamations && ticket.reclamations.length > 0 ? (
                      <ul>
                        {ticket.reclamations.map((rec, idx) => (
                          <li key={idx}>{rec.content}</li>
                        ))}
                      </ul>
                    ) : (
                      <em>Aucune</em>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
