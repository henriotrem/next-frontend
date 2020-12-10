export class Photo {
  _id: string;
  createdAt: Date;

  constructor(public originId: string,
              public url: string,
              public filename: string,
              public metadata: any,
              public mimeType: string,
              public geospatiality: number[],
              public temporality: number,
              public universes: string[]) {}
}
