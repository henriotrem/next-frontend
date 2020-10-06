import { Injectable } from '@angular/core';
import {Segment} from '../models/Segment.model';
import {Subject} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {UniversesService} from "./universes.service";
import {ConstantsService} from "./constants.service";

@Injectable({
  providedIn: 'root'
})
export class SegmentsService {

  segments: Segment[] = [];
  segmentsSubject = new Subject<Segment[]>();

  constructor(private universesService: UniversesService,  private constantsService: ConstantsService, private http: HttpClient) {}

  emitSegments(): void {
    this.segmentsSubject.next(this.segments);
  }

  addSegment(segment: Segment): any {
    return new Promise((resolve, reject) => {
      this.http.post( this.constantsService.baseAppUrl + '/api/segments/', segment).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getAllSegments(start: number): void {
    this.http.get(this.constantsService.baseAppUrl + '/api/segments?start=' + start).subscribe(
      (segments: Segment[]) => {

        if (segments) {
          this.segments = segments;
          this.emitSegments();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getSegments(ids: string): any {
    return new Promise((resolve, reject) => {
      this.http.get(this.constantsService.baseAppUrl + '/api/segments/' + ids).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  removeSegment(segment: Segment): any {
    return new Promise((resolve, reject) => {
      this.http.delete(this.constantsService.baseAppUrl + '/api/segments/' + segment._id).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }
}
