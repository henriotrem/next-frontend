export class Music {
  _id: string;
  createdAt: Date;

  constructor(public originId: string,
              public track: string,
              public artists: string[],
              public geospatiality: any,
              public temporality: number) {}
}
