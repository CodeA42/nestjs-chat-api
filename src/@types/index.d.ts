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
  user: User;
  iat: number;
  exp: number;
};

export type User = {
  id: string;
  username: string;
  email: string;
};
