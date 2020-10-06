export class Position {
  _id: string;

  constructor(public userId: string,
              public geospatiality: any,
              public temporality: number) {}
}
