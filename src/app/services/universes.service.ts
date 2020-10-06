import { Injectable } from '@angular/core';
import {Universe} from '../models/Universe.model';
import {Subject} from 'rxjs';
import { HttpClient } from '@angular/common/http';

import * as viewer from './library/viewer';
import {ConstantsService} from "./constants.service";

@Injectable({
  providedIn: 'root'
})
export class UniversesService {

  universes: Universe[] = [];
  universesSubject = new Subject<Universe[]>();

  constructor(private constantsService: ConstantsService, private http: HttpClient) {}

  emitUniverses(): void {
    this.universesSubject.next(this.universes);
  }

  saveUniverse(universe: Universe) {
    return new Promise((resolve, reject) => {
      this.http.post(this.constantsService.baseAppUrl + '/api/universes', universe).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getUniverses(): void {
    this.http.get(this.constantsService.baseAppUrl + '/api/universes').subscribe(
      (universes: Universe[]) => {

        if (universes) {
          this.universes = universes;
          this.emitUniverses();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getUniverse(key: string): any {
    return new Promise((resolve, reject) => {
      this.http.get(this.constantsService.baseAppUrl + '/api/universes/' + key).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  removeUniverse(universe: Universe): any {
    return new Promise((resolve, reject) => {
      this.http.delete(this.constantsService.baseAppUrl + '/api/universes/' + universe.key).subscribe(
        (response) => {
          this.getUniverses();
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  initSearch(universes, origin , filter, step, callback): any {

    viewer.init(this, universes, origin , filter, step, callback);
  }

  resumeSearch(): void {

    viewer.more();
  }

  getIndexes(key: string, ids: string): any {
    return new Promise((resolve, reject) => {
      this.http.get(this.constantsService.baseAppUrl + '/api/universes/' + key + '/indexes/' + ids).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getLists(key: string, ids: string): any {
    return new Promise((resolve, reject) => {
      this.http.get(this.constantsService.baseAppUrl + '/api/universes/' + key + '/lists/' + ids).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  addUniverse(universe: Universe): void {
    this.universes.push(universe);
    this.saveUniverse(universe);
    this.emitUniverses();
  }

  addElement(universe: string, object: any): any {
    return new Promise((resolve, reject) => {
      this.http.post(this.constantsService.baseAppUrl + '/api/universes/' + universe + '/element', object).subscribe(
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
