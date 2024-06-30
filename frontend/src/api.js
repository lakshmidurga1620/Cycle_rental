import axios from 'axios';

export const updateCycleAvailability = (cycleId, availability) => {
    return axios.patch(`/cycles/${cycleId}`, { available: availability });
};

export const increaseCycleCount = (cycleId) => {
    return axios.patch(`/cycles/increase/${cycleId}`);
};

export const fetchCycles = () => {
    return axios.get('/cycles');
};
