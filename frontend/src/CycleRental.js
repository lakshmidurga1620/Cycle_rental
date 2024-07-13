import React, { useEffect, useState } from 'react';
import CycleCard from './CycleCard';
import axios from 'axios';
import './styles.css'; // Import the CSS file

const CycleRental = () => {
    const [cycles, setCycles] = useState([]);

    useEffect(() => {
        // Fetch cycles data from API
        axios.get('http://localhost:8080/cycles')
            .then(response => {
                setCycles(response.data);
            })
            .catch(error => {
                console.error('Error fetching cycles:', error);
            });
    }, []);

    return (
        <div className="background primary-foreground">
            <nav className="navbar">
                <a href="/" className="branding">
                    Cycle Rental System
                </a>
            </nav>
            <div className="grid-container">
                {cycles.map(cycle => (
                    <CycleCard key={cycle._id} {...cycle} />
                ))}
            </div>
        </div>
    );
};

export default CycleRental;
