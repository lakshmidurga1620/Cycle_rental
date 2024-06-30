import React from 'react';
import axios from 'axios';

const CARD_CLASS = "bg-card rounded-lg overflow-hidden shadow-lg relative transform transition-transform duration-300 hover:scale-105";
const BUTTON_CONTAINER_CLASS = "flex justify-center items-center bg-black text-white rounded-lg py-2 w-full mt-2";
const BUTTON_CLASS = "w-full py-2 rounded-lg hover:bg-gray-800 transition-colors duration-300";
const PRICE_CLASS = "text-sm font-semibold text-muted-foreground mt-2";
const TEXT_CLASS = "text-lg font-medium mt-1";

const CycleCard = ({ _id, brand, price, image, count }) => {
    const handleRentButtonClick = () => {
        axios.patch(`http://localhost:5000/cycles/rent/${_id}`)
            .then(response => {
                console.log('Cycle rented successfully:', response.data);
                // Optionally handle success (update UI, etc.)
            })
            .catch(error => {
                console.error('Error renting cycle:', error);
                // Handle error (display message, etc.)
            });
    };

    return (
        <div className={CARD_CLASS}>
            <img src={process.env.PUBLIC_URL + image} alt={brand} className="w-full h-48 object-contain" />
            <div className="p-4">
                <h3 className={TEXT_CLASS}>{brand}</h3>
                <p className={PRICE_CLASS}>{price}</p>
                <p>Count: {count}</p>
                <div className={BUTTON_CONTAINER_CLASS}>
                    <button
                        className={BUTTON_CLASS}
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
