export interface Member {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: string;
  gender: string;
  contact: string;
  emergency_contact: string;
  purchasedMembership?: Membership;
}

export interface Membership {
  id: number;
  membership_type: string;
  price: string;
  
}
