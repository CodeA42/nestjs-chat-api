export type DecodedToken = {
  user: TokenUser;
  iat: number;
  exp: number;
};

export type TokenUser = {
  id: string;
  username: string;
  email: string;
};
