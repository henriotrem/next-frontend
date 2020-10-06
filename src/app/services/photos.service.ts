import { Injectable } from '@angular/core';
import {Photo} from '../models/Photo.model';
import {Subject} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {UniversesService} from "./universes.service";
import {ConstantsService} from "./constants.service";

@Injectable({
  providedIn: 'root'
})
export class PhotosService {

  photos: Photo[] = [];
  photosSubject = new Subject<Photo[]>();

  constructor(private universesService: UniversesService,  private constantsService: ConstantsService, private http: HttpClient) {}

  emitPhotos(): void {
    this.photosSubject.next(this.photos);
  }

  savePhoto(photo: Photo) {
    return new Promise((resolve, reject) => {
      this.http.post( this.constantsService.baseAppUrl + '/api/photos/', photo).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getAllPhotos(start: number): void {
    this.http.get(this.constantsService.baseAppUrl + '/api/photos?start=' +start).subscribe(
      (photos: Photo[]) => {

        if (photos) {
          this.photos = photos;
          this.emitPhotos();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getPhotos(ids: string): any {
    return new Promise((resolve, reject) => {
      this.http.get(this.constantsService.baseAppUrl + '/api/photos/' + ids).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  removePhoto(photo: Photo): any {
    return new Promise((resolve, reject) => {
      this.http.delete(this.constantsService.baseAppUrl + '/api/photos/' + photo._id).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  addPhoto(photo: Photo): void {
    this.photos.push(photo);
    this.savePhoto(photo).then(
      (photo: Photo) => {
        for(let universe of photo.universes) {
          this.universesService.addElement(universe, photo);
        }
      }
    );
    this.emitPhotos();
  }
}
