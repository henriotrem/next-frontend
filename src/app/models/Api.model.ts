export class Api {
  _id: string;
  createdAt: Date;
  sourceId: string;
  email: string;
  token: string;
  refreshToken: string;
  callback: string;
  scopes: string[];

  constructor() {}
}
