export {};

declare module 'express' {
  interface Request {
    user: {
      id: string;
      username: string;
      email: string;
    };
  }
}

export type JwtPayload = {
  user: TokenUser;
  iat: number;
  exp: number;
};

export type TokenUser = {
  id: string;
  username: string;
  email: string;
};
