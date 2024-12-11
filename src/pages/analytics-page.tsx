import React, { useState } from "react";
import { Views } from "@/components/charts/view";
import Cards from "@/components/charts/TotalCards";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { UserPlus, ChevronDown } from "lucide-react";
import dataFetch from "@/service/data-service";

const AnalyticsPage = () => {
  const { token } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleExportMembers = async () => {
    try {
      const response = await dataFetch(
        "api/excel/members/",
        "GET",
        {},
        token!,
        "blob"
      );

      const blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);

      window.open(url);
    } catch (error) {
      console.error("Failed to fetch Excel file", error);
    }
  };

  const handleExportMembershipTransactions = async () => {
    try {
      const response = await dataFetch(
        "api/excel/membership-transaction/",
        "GET",
        {},
        token!,
        "blob"
      );

      const blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);

      window.open(url);
    } catch (error) {
      console.error("Failed to fetch Excel file", error);
    }
  };

  const handleExportPurchases = async () => {
    try {
      const response = await dataFetch(
        "api/excel/purchases/",
        "GET",
        {},
        token!,
        "blob"
      );

      const blob = new Blob([response], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);

      window.open(url);
    } catch (error) {
      console.error("Failed to fetch Excel file", error);
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="flex justify-start mb-5 relative ml-56">
        <div className="relative inline-block text-left">
          <Button
            className="bg-black text-white px-6 py-3 rounded-lg shadow-md hover:bg-gray-800 flex items-center gap-2"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <UserPlus className="text-white" />
            <span>Export</span>
            <ChevronDown className="ml-2" />
          </Button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
              <ul>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleExportMembers()}
                >
                  Export Members
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleExportPurchases()}
                >
                  Export Purchases
                </li>
                <li
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleExportMembershipTransactions()}
                >
                 
                  Export Membership Transactions
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 ml-56 mt-5 w-70%">
        <Cards />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 mt-5 ml-16">
        {/* bar chart */}
        <div className="ml-40">
          <Views />
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
