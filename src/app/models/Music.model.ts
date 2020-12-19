export class Music {
  _id: string;
  createdAt: Date;
  originId: string;
  track: string;
  artists: string[];
  albumUrl: string;
  geospatiality: any;
  temporality: number;

  constructor() {}
}
