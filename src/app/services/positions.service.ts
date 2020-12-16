import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantsService } from './constants.service';
import { ItemsService } from './items.service';
import { Position } from '../models/Position.model';
import {map} from 'rxjs/operators';
import {Photo} from '../models/Photo.model';

@Injectable({
  providedIn: 'root'
})
export class PositionsService extends ItemsService {

  constructor(private constantsService: ConstantsService,
              private http: HttpClient) {
    super();
  }

  addPositions(positions: Position[]): any {
    return this.http.post(this.constantsService.baseAppUrl + '/api/positions?_response=partial', {positions});
  }

  updatePosition(position: Position): any {
    return this.http.put(this.constantsService.baseAppUrl + '/api/positions/' + position._id, position);
  }

  patchPosition(position: Position, set: any): any {
    return this.http.delete(this.constantsService.baseAppUrl + '/api/positions/' + position._id, set);
  }

  patchPositions(params: any, set: any): any {
    return this.http.patch(this.constantsService.baseAppUrl + '/api/positions'
      + this.constantsService.formatQuery(params), set);
  }

  deletePosition(position: Position): any {
    return this.http.delete(this.constantsService.baseAppUrl + '/api/positions/' + position._id);
  }

  deletePositions(params: any): any {
    return this.http.delete(this.constantsService.baseAppUrl + '/api/positions'
      + this.constantsService.formatQuery(params));
  }

  getPositions(params: any): any {
    return this.http.get(this.constantsService.baseAppUrl + '/api/positions'
      + this.constantsService.formatQuery(params))
      .pipe(
        map((result: any) => {
          for (let i = 0; i < result.positions.length; i++) {
            result.positions[i] = Object.assign(new Position(), result.positions[i]);
          }
          return result;
        })
      );
  }

  countPositions(params: any): any {
    return this.http.head(this.constantsService.baseAppUrl + '/api/positions'
      + this.constantsService.formatQuery(params));
  }

  uploadItems(items: any[]): any {
    return this.addPositions(items);
  }

  getItems(params: any): any {
    return this.getPositions(params);
  }

  fileToArray(file: any): any {
    return file.locations;
  }

  objectToItem(obj: any): any {
    const geospatiality = {
      latitude: obj.latitudeE7 / 10000000,
      longitude: obj.longitudeE7 / 10000000,
      accuracy: obj.accuracy
    };

    const temporality = obj.timestampMs / 1000;
    const position = new Position();

    position.geospatiality = geospatiality;
    position.temporality = temporality;

    return position
  }
}
