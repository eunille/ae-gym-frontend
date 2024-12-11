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
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-semibold text-gray-600">{card.title}</h2>
            <span
              className={`text-sm font-medium ${
                card.trend === 'up' ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {card.change} {card.trend === 'up' ? '↑' : '↓'}
            </span>
          </div>
          <div className="text-lg font-bold text-gray-900">{card.value}</div>
          <div className="mt-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-full h-8 text-green-500"
            >
              {/* Replace this with an actual sparkline or small chart */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 17l5-5 4 4 5-5 4 4"
              />
            </svg>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cards;
