import React from "react";

interface RevenueData {
  price_sold: number;
  sold_at: string;
  payment_method: string;
}

interface Revenue {
  revenue: number;
  data: {};
}

const MembershipCard = ({ date_range }: { date_range: string }) => {
  return <div>MembershipCard</div>;
};

export default MembershipCard;
