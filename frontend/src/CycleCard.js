import React from 'react';
import axios from 'axios';
import './styles.css';

const CycleCard = ({ _id, brand, price, image, count, token, updateCycleCount }) => {
  const handleRentButtonClick = () => {
    axios.patch(`http://localhost:8080/cycles/rent/${_id}`, {}, {
      headers: {
        'Authorization': token
      }
    })
      .then(response => {
        console.log('Cycle rented successfully:', response.data);
        // Update the count in the parent component
        updateCycleCount(_id, response.data.count);
      })
      .catch(error => {
        console.error('Error renting cycle:', error);
        alert('Failed to rent the cycle. Please try again later.');
      });
  };

  return (
    <div className="card">
      <img src={process.env.PUBLIC_URL + image} alt={brand} className="w-full h-48 object-contain" />
      <div className="p-4">
        <h3 className="text">{brand}</h3>
        <p className="price">{price}</p>
        <p>Count: {count}</p>
        <div className="button-container">
          <button
            className="button"
            onClick={handleRentButtonClick}
            disabled={count <= 0}
          >
            {count <= 0 ? 'Unavailable' : 'Rent Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CycleCard;
