export interface Member {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: string;
  gender: string;
  contact: string;
  emergency_contact: string;
  membership: 1;
  membership_type: Membership;
  registered_at: string;
}

interface Membership {
  id: number;
  membership_type: string;
  price: string;
  
}
