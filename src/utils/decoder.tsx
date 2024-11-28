import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  user_id: number;
}

export function decodeToken(token: string) {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}
