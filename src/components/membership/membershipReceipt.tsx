import React from 'react'
import logo from "@/assets/images/gym-logo.png";
import dataFetch from "@/service/data-service";
import { useAuth } from "@/context/auth-context";




const membershipReceipt = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-gray-600 font-semibold text-lg">Receipt</h2>
            <p className="text-gray-500 mt-1">
            </p>
          </div>
          <img src={logo} alt="Logo" className="h-16 w-16 object-contain" />
        </div>


        {/* Customer Information */}
        <div>
          <p className="text-gray-800 font-semibold">Customer Information</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-500">Name:</span>
            <span className="text-gray-800">Date Registered:  </span>
            <span className="text-gray-800">Membership Type:  </span>
          </div>
        </div>

        {/* Confirm and Cancel Buttons */}
        <div className="mt-6 flex justify-around">
          <button
            className="px-6 py-2 text-black bg-[#FCD301] rounded-md shadow-md focus:outline-none focus:ring-2 border-2 border-black"
          
          >
            Confirm
          </button>
          <button
            className="px-6 py-2 text-white bg-red-400 rounded-md shadow-md hover:bg-red-500 focus:outline-none focus:ring-2"
          
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
  )
}

export default membershipReceipt