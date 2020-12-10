export class Website {
  _id: string;
  createdAt: Date;

  constructor(public originId: string,
              public sourceUrl: string,
              public geospatiality: any,
              public temporality: number) {}
}
