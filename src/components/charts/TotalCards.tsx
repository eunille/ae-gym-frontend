import React, { useEffect, useState } from 'react';
import axios from 'axios';
import decryptionService from '@/service/decryption-service';
import { useAuth } from '@/context/auth-context';

const Cards = () => {
  const [totalMembersMonth, setTotalMembersMonth] = useState(0);
  const [membershipEarningsMonth, setMembershipEarningsMonth] = useState(0);
  const [productEarningsMonth, setProductEarningsMonth] = useState(0);
  const [dailyPrice, setDailyPrice] = useState(0);
  const [monthlyPrice, setMonthlyPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  // Fetch membership prices
  const fetchMemberPrice = async () => {
    try {
      const response = await axios.get("api/memberships/", { headers: { Authorization: `Bearer ${token}` } });
      const secret = await axios.get("api/secret-key/", { headers: { Authorization: `Bearer ${token}` } });
      const decryptedMemberships = decryptionService(secret.data, response.data); 

      const dailyMembership = decryptedMemberships.find((m: { membership_type: string; price: number }) => m.membership_type === "Daily");
      const monthlyMembership = decryptedMemberships.find((m: { membership_type: string; price: number }) => m.membership_type === "Monthly");

      if (dailyMembership) setDailyPrice(dailyMembership.price)
      if (monthlyMembership) setMonthlyPrice(monthlyMembership.price);

      console.log('Fetched Membership Prices:', dailyMembership.price, monthlyMembership.price);
    } catch (error) {
      console.error("Failed to fetch membership prices", error);
    }
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
  
        const membersResponse = await axios.get('http://127.0.0.1:8000/api/analytics/members/month/');
        setTotalMembersMonth(membersResponse.data.members);

        const earningsResponse = await axios.get('http://127.0.0.1:8000/api/analytics/membership-earnings/month/');
        setMembershipEarningsMonth(earningsResponse.data.membership_earning);

        const productResponse = await axios.get('http://127.0.0.1:8000/api/analytics/product-earnings/month/');
        setProductEarningsMonth(productResponse.data.product_earning);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
    fetchMemberPrice(); 
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
    
      <div className="p-6 bg-white text-black border rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="text-lg font-semibold">Total Members</div>
        <div className="text-3xl font-bold mt-3">{totalMembersMonth}</div>
        <div className="text-sm mt-2 text-gray-600">New members registered this month</div>
      </div>

    
      <div className="p-6 bg-white text-black border rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="text-lg font-semibold">Membership Earnings </div>
        <div className="text-3xl font-bold mt-3">₱{membershipEarningsMonth.toFixed(2)}</div>
        <div className="text-sm mt-2 text-gray-600">Revenue from memberships</div>
      </div>

    
      <div className="p-6 bg-white text-black border rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <div className="text-lg font-semibold">Product Earnings </div>
        <div className="text-3xl font-bold mt-3">₱{productEarningsMonth.toFixed(2)}</div>
        <div className="text-sm mt-2 text-gray-600">Revenue from products sold</div>
      </div>
    </div>
  );
};

export default Cards;
