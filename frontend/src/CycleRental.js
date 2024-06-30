import React, { useEffect, useState } from 'react';
import CycleCard from './CycleCard';
import axios from 'axios';

const NAVBAR_CLASS = "flex items-center justify-between px-4 py-2 bg-primary";
const BRANDING_CLASS = "text-2xl font-bold text-black cursor-pointer";
const GRID_CONTAINER_CLASS = "container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4";

const CycleRental = () => {
    const [cycles, setCycles] = useState([]);

    useEffect(() => {
        // Fetch cycles data from API
        axios.get('http://localhost:5000/cycles')
            .then(response => {
                setCycles(response.data);
            })
            .catch(error => {
                console.error('Error fetching cycles:', error);
            });
    }, []);

    return (
        <div className="bg-background text-primary-foreground min-h-screen">
            <nav className={NAVBAR_CLASS}>
                <a href="/" className={BRANDING_CLASS}>
                    Cycle Rental System
                </a>
            </nav>
            <div className={GRID_CONTAINER_CLASS}>
                {cycles.map(cycle => (
                    <CycleCard key={cycle._id} {...cycle} />
                ))}
            </div>
        </div>
    );
};

export default CycleRental;
