export class Photo {
  _id: string;

  constructor(public userId: string,
              public url: string,
              public filename: string,
              public metadata: any,
              public mimeType: string,
              public geospatiality: number[],
              public temporality: number,
              public universes: string[]) {}
}
