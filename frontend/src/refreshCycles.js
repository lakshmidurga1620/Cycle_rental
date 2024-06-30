import React, { useState, useEffect } from 'react';
import CycleCard from './CycleCard';
import { fetchCycles } from './api';

const ParentComponent = () => {
    const [cycles, setCycles] = useState([]);

    const fetchCycleData = () => {
        fetchCycles()
            .then(response => {
                setCycles(response.data);
            })
            .catch(error => {
                console.error('Error fetching cycles:', error);
            });
    };

    useEffect(() => {
        fetchCycleData();
    }, []);

    return (
        <div className="cycle-list">
            {cycles.map(cycle => (
                <CycleCard
                    key={cycle._id}
                    _id={cycle._id}
                    brand={cycle.brand}
                    price={cycle.price}
                    image={cycle.image}
                    available={cycle.available}
                    refreshCycles={fetchCycleData}  // Pass the refresh function as a prop
                />
            ))}
        </div>
    );
};

export default ParentComponent;
