import React from "react";

const EditProducts = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-md p-8">
        <h1 className="text-xl font-semibold mb-6 text-gray-800">Edit Product</h1>
        <div className="flex space-x-8">
          <div className="w-1/2 flex flex-col items-center justify-center space-y-4">
            <div className="relative w-3/4 h-80 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
              <span className="text-gray-400">Image Preview</span>
              <label className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex items-center justify-center text-white font-semibold cursor-pointer transition-opacity">
                <span>Click to Upload Image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </label>
            </div>
          </div>
          <div className="w-1/2 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Product Name</label>
              <input
                type="text"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                placeholder="Enter product name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
                placeholder="Enter price"
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-4 mt-8">
          <button
            className="py-2 px-4 bg-[#FCD301] text-black font-semibold rounded-lg shadow border-2 border-black"
          >
            Save Changes
          </button>
          <button
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProducts;
