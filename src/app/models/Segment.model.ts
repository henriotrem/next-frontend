export class Segment {
  _id: string;

  constructor(public userId: string,
              public duration: any,
              public distance: number,
              public location: any,
              public path: any[],
              public activities: string[]) {
  }
}
