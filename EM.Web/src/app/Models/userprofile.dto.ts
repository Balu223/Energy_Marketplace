export interface UserProfileDto{
  user_Id: number;
  username: string;
  email: string;
  address: string | null;
  role: string;
}