import { Injectable } from '@angular/core';
import {Service} from '../models/Service.model';
import {Subject} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {ConstantsService} from "./constants.service";
import * as crypto from 'crypto-js';
import {AuthService} from "./auth.service";
import {PositionsService} from "./positions.service";
import {Photo} from "../models/Photo.model";

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  services: Service[] = [];
  servicesSubject = new Subject<Service[]>();
  lastOffset = 0;

  constructor(private authService: AuthService, private positionsService: PositionsService, private constantsService: ConstantsService, private http: HttpClient) {}

  emitServices(): void {
    this.servicesSubject.next(this.services);
  }

  getServices(ids: string): any {
    return new Promise((resolve, reject) => {
      this.http.get(this.constantsService.baseAppUrl + '/api/services/' + ids).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getAllServices(): void {
    this.http.get(this.constantsService.baseAppUrl + '/api/services/').subscribe(
      (services: Service[]) => {

        if (services) {
          this.services = services;
          this.emitServices();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  removeService(service: Service): any {
    return new Promise((resolve, reject) => {
      this.http.delete(this.constantsService.baseAppUrl + '/api/services/' + service._id).subscribe(
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
