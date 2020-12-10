export class User {
  _id: string;
  createdAt: Date;

  constructor(public firstname: string,
              public lastname: string,
              public email: string) {}
}
