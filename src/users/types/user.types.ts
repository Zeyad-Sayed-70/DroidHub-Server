export type UserType = {
  _id?: string;
  __v?: number;
  username: string;
  email: string;
  hashedPassword?: string;
  avatar?: string;
  role: string;
  communities: string[];
  bio: string;
  probability_being: string;
  since: string;
};
