import { Injectable } from '@angular/core';
import {Position} from '../models/Position.model';
import {Subject} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {UniversesService} from "./universes.service";
import {ConstantsService} from "./constants.service";
import {AuthService} from "./auth.service";
import {min} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PositionsService {

  positions: Position[] = [];
  positionsSubject = new Subject<Position[]>();

  constructor(private universesService: UniversesService,
              private constantsService: ConstantsService,
              private authService: AuthService,
              private http: HttpClient) {}

  emitPositions(): void {
    this.positionsSubject.next(this.positions);
  }

  addPositions(positions: Position[]): any {
    return new Promise((resolve, reject) => {
      this.http.post( this.constantsService.baseAppUrl + '/api/positions/', {positions: positions}).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getAllPositions(): void {
    this.http.get(this.constantsService.baseAppUrl + '/api/positions/').subscribe(
      (positions: Position[]) => {

        if (positions) {
          this.positions = positions;
          this.emitPositions();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getPositions(ids: string): any {
    return new Promise((resolve, reject) => {
      this.http.get(this.constantsService.baseAppUrl + '/api/positions/' + ids).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  removePosition(position: Position): any {
    return new Promise((resolve, reject) => {
      this.http.delete(this.constantsService.baseAppUrl + '/api/positions/' + position._id).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  updatePositionsSegmentId(segmentId: string, minTimestamp: number, maxTimestamp: number): any {

    let body = {
      userId: this.authService.userId,
      filter: {
        temporality: {
          "$gte": minTimestamp,
          "$lt": maxTimestamp
        }
      } ,
      setter: {
        segmentId: segmentId
      }
    };

    return new Promise((resolve, reject) => {
      this.http.put( this.constantsService.baseAppUrl + '/api/positions', body).subscribe(
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
