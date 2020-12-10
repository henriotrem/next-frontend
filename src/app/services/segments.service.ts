import { Injectable } from '@angular/core';
import {Segment} from '../models/Segment.model';
import { HttpClient } from '@angular/common/http';
import {ConstantsService} from './constants.service';

@Injectable({
  providedIn: 'root'
})
export class SegmentsService {

  segments: Segment[] = [];

  constructor(private constantsService: ConstantsService,
              private http: HttpClient) {}

  getSegments(params: any): any {
    return this.http.get(this.constantsService.baseAppUrl + '/api/segments'
      + this.constantsService.formatQuery(params));
  }
}
