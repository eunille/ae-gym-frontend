import React from "react";
import { Views } from "@/components/charts/view";
import Cards from "@/components/charts/cards";
import { PieCard } from "@/components/charts/piecard";

const AnalyticsPage = () => {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 ml-56 mt-5">
        <Cards />
      </div>

      {/* Views and PieCard Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2  mt-10">
        <div className="ml-40"> <Views /></div>
        <PieCard />
      </div>
    </div>
  );
};

export default AnalyticsPage;