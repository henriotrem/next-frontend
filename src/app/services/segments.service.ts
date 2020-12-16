import { Injectable } from '@angular/core';
import {Segment} from '../models/Segment.model';
import { HttpClient } from '@angular/common/http';
import {ConstantsService} from './constants.service';
import {map} from 'rxjs/operators';
import {Photo} from '../models/Photo.model';

@Injectable({
  providedIn: 'root'
})
export class SegmentsService {

  segments: Segment[] = [];

  constructor(private constantsService: ConstantsService,
              private http: HttpClient) {}

  getSegments(params: any): any {
    return this.http.get(this.constantsService.baseAppUrl + '/api/segments'
      + this.constantsService.formatQuery(params))
      .pipe(
        map((result: any) => {
          for (let i = 0; i < result.segments.length; i++) {
            result.segments[i] = Object.assign(new Segment(), result.segments[i]);
          }
          return result;
        })
      );
  }
}
