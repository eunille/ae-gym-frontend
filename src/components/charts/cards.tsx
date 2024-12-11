import React from 'react';

const Cards = () => {
  const data = [
    { title: 'Total Members', value: '$329.50', change: '50.43%', trend: 'up' },
    { title: ' Gym Earnings', value: '$829.30', change: '25.12%', trend: 'up' },
    { title: ' Product & Services Earnings', value: '$529.20', change: '15.10%', trend: 'down' },
   
    
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
      {data.map((card, index) => (
        <div
          key={index}
          className="p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow w-full"
        >
         
          <div className="text-lg font-bold text-gray-900">{card.value}</div>
          <div className="mt-2">
            
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cards;
