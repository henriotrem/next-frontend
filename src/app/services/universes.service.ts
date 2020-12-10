import { Injectable } from '@angular/core';
import {Universe} from '../models/Universe.model';
import { HttpClient } from '@angular/common/http';

import * as viewer from './library/viewer';
import {ConstantsService} from './constants.service';

@Injectable({
  providedIn: 'root'
})
export class UniversesService {

  constructor(private constantsService: ConstantsService, private http: HttpClient) {}

  saveUniverse(universe: Universe): any {
    return this.http.post(this.constantsService.baseAppUrl + '/api/universes', universe);
  }

  getUniverses(): any {
    return this.http.get(this.constantsService.baseAppUrl + '/api/universes');
  }

  getUniverse(key: string): any {
    return this.http.get(this.constantsService.baseAppUrl + '/api/universes/' + key);
  }

  removeUniverse(universe: Universe): any {
    return this.http.delete(this.constantsService.baseAppUrl + '/api/universes/' + universe.key);
  }

  initSearch(universes, origin , filter, step, callback): any {
    viewer.init(this, universes, origin , filter, step, callback);
  }

  resumeSearch(): void {
    viewer.more();
  }

  getIndexes(key: string, ids: string): any {
    return this.http.get(this.constantsService.baseAppUrl + '/api/universes/' + key + '/indexes/' + ids);
  }

  getLists(key: string, ids: string): any {
    return this.http.get(this.constantsService.baseAppUrl + '/api/universes/' + key + '/lists/' + ids);
  }

  addElement(universe: string, object: any): any {
    return this.http.post(this.constantsService.baseAppUrl + '/api/universes/' + universe + '/element', object);
  }
}
