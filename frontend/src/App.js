import React, { useState, useEffect } from 'react';
import LoginClient from './LoginClient';
import LoginAdmin from './LoginAdmin';
import Register from './Register';
import AjoutTicket from './AjoutTicket';
import ListeTickets from './ListeTickets';
import AdminDashboard from './AdminDashboard';
import Reclamation from './Reclamation';
import Dashboard from './Dashboard';
import './SelectLogin.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userEmail, setUserEmail] = useState(localStorage.getItem('email') || '');
  const [userRole, setUserRole] = useState(localStorage.getItem('role') || '');
  const [currentPage, setCurrentPage] = useState(
    token ? (userRole === 'admin' ? 'adminDashboard' : 'dashboard') : 'selectLogin'
  );
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      localStorage.setItem('email', userEmail);
      localStorage.setItem('role', userRole);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('email');
      localStorage.removeItem('role');
    }
  }, [token, userEmail, userRole]);

  const handleLoginSuccess = (token, email, role) => {
    setToken(token);
    setUserEmail(email);
    setUserRole(role);
    setCurrentPage(role === 'admin' ? 'adminDashboard' : 'dashboard');
  };

  const handleLogout = () => {
    setToken('');
    setUserEmail('');
    setUserRole('');
    setCurrentPage('selectLogin');
  };

  if (currentPage === 'selectLogin') {
    return (
      <div className="select-page">
        <div className="select-container">
          <h2>Choisissez votre type de connexion</h2>
          <button onClick={() => setCurrentPage('loginClient')} className="select-button">
            Connexion Client
          </button>
          <button onClick={() => setCurrentPage('loginAdmin')} className="select-button">
            Connexion Admin
          </button>
          <button onClick={() => setCurrentPage('register')} className="create-account-button">
            Créer un compte
          </button>
        </div>
      </div>
    );
  }

  if (currentPage === 'loginClient') {
    return (
      <LoginClient
        onSuccess={handleLoginSuccess}
        onBack={() => setCurrentPage('selectLogin')}
      />
    );
  }

  if (currentPage === 'loginAdmin') {
    return (
      <LoginAdmin
        onSuccess={handleLoginSuccess}
        onBack={() => setCurrentPage('selectLogin')}
      />
    );
  }

  if (currentPage === 'register') {
    return <Register onSwitch={() => setCurrentPage('selectLogin')} />;
  }

  if (currentPage === 'dashboard') {
    return (
      <Dashboard
        token={token}
        onLogout={handleLogout}
        onAjoutTicket={() => setCurrentPage('ajoutTicket')}
        onListeTickets={() => setCurrentPage('listeTickets')}
      />
    );
  }

  if (currentPage === 'adminDashboard') {
    return <AdminDashboard email={userEmail} onLogout={handleLogout} />;
  }

  if (currentPage === 'ajoutTicket') {
    return (
      <AjoutTicket
        onBack={() => setCurrentPage(userRole === 'admin' ? 'adminDashboard' : 'dashboard')}
      />
    );
  }

  if (currentPage === 'listeTickets') {
    return (
      <ListeTickets
        onBack={() => setCurrentPage(userRole === 'admin' ? 'adminDashboard' : 'dashboard')}
        onReclamer={(id) => {
          setSelectedTicketId(id);
          setCurrentPage('reclamation');
        }}
      />
    );
  }

  if (currentPage === 'reclamation') {
    return (
      <Reclamation
        ticketId={selectedTicketId}
        onBack={() => setCurrentPage('listeTickets')}
      />
    );
  }

  return null;
}

export default App;
