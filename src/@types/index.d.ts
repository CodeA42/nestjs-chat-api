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

export type ChatRoomKey = {
  id: string;
  uuid: string;
};

export type KickedUser = {
  chatId: string;
  userId: string;
};

export type BlockedUserDuration = {
  userId: string;
  time: number;
};
