export interface User {
  userId: string;
  userName: string;
  userEmail: string;
  password: string | null;
  role: string;
  phoneNumber: string | null;
  googleId: string | null;
  facebookId: string | null;
  }