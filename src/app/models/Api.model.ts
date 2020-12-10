export class Api {
  _id: string;
  createdAt: Date;

  constructor(public sourceId: string,
              public email: string,
              public token: string,
              public refreshToken: string,
              public callback: string,
              public scopes: string[]) {}
}
