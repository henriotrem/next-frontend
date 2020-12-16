export class Photo {
  _id: string;
  createdAt: Date;
  originId: string;
  url: string;
  filename: string;
  metadata: any;
  mimeType: string;
  geospatiality: number[];
  temporality: number;
  universes: string[];

  constructor() {}
}
