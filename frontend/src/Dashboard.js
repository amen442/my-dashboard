import React, { useEffect, useState } from 'react';
import './Dashboard.css';

export default function Dashboard({ token, onLogout, onAjoutTicket, onListeTickets }) {
  const [data, setData] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('http://localhost:5000/dashboard-data', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const json = await res.json();
          setData(json.data);
        } else {
          setError('Accès refusé. Token invalide.');
          onLogout();
        }
      } catch (err) {
        setError("Erreur lors de la récupération des données.");
      }
    };

    fetchDashboardData();
  }, [token, onLogout]);

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Bienvenue sur le tableau de bord</h2>

      {error && <p className="dashboard-error">{error}</p>}

      {data ? (
        <div className="dashboard-data">
          <p>Données reçues :</p>
          <pre>{data}</pre>
        </div>
      ) : (
        <p>Chargement des données...</p>
      )}

      <div className="dashboard-buttons">
        <button onClick={onAjoutTicket} className="dashboard-button">
          ➕ Créer un ticket
        </button>
        <button onClick={onListeTickets} className="dashboard-button">
          📋 Voir mes tickets
        </button>
      </div>

      <button onClick={onLogout} className="logout-button">
        Se déconnecter
      </button>
    </div>
  );
}
