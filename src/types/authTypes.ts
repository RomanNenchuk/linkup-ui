type User = {
  id: string;
  displayName: string;
  email: string;
  isVerified: boolean;
};

type RegisterPayload = {
  email: string;
  displayName: string;
  password: string;
};
