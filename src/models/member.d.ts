export interface Member {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: string;
  gender: string;
  contact: string;
  emergency_contact: string;
  purchasedMembership?: Membership;
  isExpired: boolean;
}

export interface Membership {
  id: number;
  membership_type: string;
  price: string;
}

export interface MembershipTransaction {
  id: string;
  member: Member;
  membership: Membership;
  registered_at: string;
}

export interface Transac {
  id: number;
  member: number;
  membership: number;
  registered_at: string;
}
