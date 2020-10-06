export class File {
  _id: string;

  constructor(
              public signature: string,
              public userId: string,
              public name: string,
              public size: number,
              public type: string,
              public total: number,
              public processed: number,
              public universes: string[]) {}
}
