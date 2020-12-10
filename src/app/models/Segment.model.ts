export class Segment {
  _id: string;
  createdAt: Date;

  constructor(public duration: any,
              public distance: number,
              public location: any,
              public path: any[],
              public activities: string[]) {
  }
}
