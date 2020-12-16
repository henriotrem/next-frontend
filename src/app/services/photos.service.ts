import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantsService } from './constants.service';
import { ItemsService } from './items.service';
import { Photo } from '../models/Photo.model';
import {map} from 'rxjs/operators';
import {Music} from '../models/Music.model';

@Injectable({
  providedIn: 'root'
})
export class PhotosService extends ItemsService {

  constructor(private constantsService: ConstantsService,
              private http: HttpClient) {
    super();
  }

  addPhotos(photos: Photo[]): any {
    return this.http.post(this.constantsService.baseAppUrl + '/api/photos', {photos});
  }

  updatePhoto(photo: Photo): any {
    return this.http.put(this.constantsService.baseAppUrl + '/api/photos/' + photo._id, photo);
  }

  patchPhoto(photo: Photo, set: any): any {
    return this.http.delete(this.constantsService.baseAppUrl + '/api/photos/' + photo._id, set);
  }

  patchPhotos(params: any, set: any): any {
    return this.http.patch(this.constantsService.baseAppUrl + '/api/photos'
      + this.constantsService.formatQuery(params), set);
  }

  deletePhoto(photo: Photo): any {
    return this.http.delete(this.constantsService.baseAppUrl + '/api/photos/' + photo._id);
  }

  deletePhotos(params: any): any {
    return this.http.delete(this.constantsService.baseAppUrl + '/api/photos'
      + this.constantsService.formatQuery(params));
  }

  getPhotos(params: any): any {
    return this.http.get(this.constantsService.baseAppUrl + '/api/photos'
      + this.constantsService.formatQuery(params))
      .pipe(
        map((result: any) => {
          for (let i = 0; i < result.photos.length; i++) {
            result.photos[i] = Object.assign(new Photo(), result.photos[i]);
          }
          return result;
        })
      );
  }

  countPhotos(params: any): any {
    return this.http.head(this.constantsService.baseAppUrl + '/api/photos'
      + this.constantsService.formatQuery(params));
  }

  uploadItems(items: any[]): any {
    return this.addPhotos(items);
  }

  getItems(params: any): any {
    return this.getPhotos(params);
  }

  fileToArray(file: any): any {
    return file;
  }

  objectToItem(obj: any): any {
    return null;
  }
}
