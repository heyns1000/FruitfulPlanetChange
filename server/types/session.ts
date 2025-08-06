declare module 'express-session' {
  interface SessionData {
    accessUser?: {
      id: number;
      type: string;
      email: string;
      data: any;
    };
  }
}

export {};