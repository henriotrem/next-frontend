export class Universe {
  _id: string;
  createdAt: Date;

  constructor(public key: string,
              public description: string,
              public dimensions: [{
                  key: string,
                  base: {
                    root: string;
                    bit: number;
                    alphabet: string
                  }
                }],
              public precision: number,
              public limit: number) {}
}
