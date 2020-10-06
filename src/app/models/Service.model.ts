export class Service {
  _id: string;

  constructor(
              public userId: string,
              public name: string,
              public token: string,
              public scopes: string[]) {}
}
