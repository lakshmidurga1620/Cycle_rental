import React, { useEffect, useState } from 'react';
import CycleCard from './CycleCard';
import axios from 'axios';
import './styles.css';

const CycleRental = ({ token, setToken }) => {
  const [cycles, setCycles] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/cycles')
      .then(response => {
        setCycles(response.data);
      })
      .catch(error => {
        console.error('Error fetching cycles:', error);
        alert('Failed to fetch cycles. Please try again later.');
      });
  }, []);

  const handleLogout = () => {
    setToken(null);
  };

  const updateCycleCount = (cycleId, newCount) => {
    setCycles(prevCycles =>
      prevCycles.map(cycle =>
        cycle._id === cycleId ? { ...cycle, count: newCount } : cycle
      )
    );
  };

  return (
    <div className="background primary-foreground">
      <nav className="navbar">
        <a href="/" className="branding">
          Cycle Rental Club
        </a>
        <button onClick={handleLogout} className="logout-button">Logout</button>
      </nav>
      <div className="grid-container">
        {cycles.map(cycle => (
          <CycleCard 
            key={cycle._id} 
            {...cycle} 
            token={token} 
            updateCycleCount={updateCycleCount}
          />
        ))}
      </div>
    </div>
  );
};

export default CycleRental;
