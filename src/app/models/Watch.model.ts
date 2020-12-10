export class Watch {
  _id: string;
  createdAt: Date;

  constructor(public originId: string,
              public title: string,
              public sourceUrl: string,
              public geospatiality: any,
              public temporality: number) {}
}
