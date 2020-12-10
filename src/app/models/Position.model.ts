export class Position {
  _id: string;
  createdAt: Date;

  constructor(public originId: string,
              public geospatiality: any,
              public temporality: number) {}
}
