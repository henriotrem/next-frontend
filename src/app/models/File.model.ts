export class File {
  _id: string;
  createdAt: Date;

  constructor(public sourceId: string,
              public signature: string,
              public name: string,
              public size: number,
              public total: number,
              public processed: number) {}
}
