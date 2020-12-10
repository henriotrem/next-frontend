import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConstantsService} from './constants.service';
import {ItemsService} from './items.service';
import {Music} from '../models/Music.model';
import * as moment from 'moment-timezone';

@Injectable({
  providedIn: 'root'
})
export class MusicsService extends ItemsService {

  constructor(private constantsService: ConstantsService,
              private http: HttpClient) {
    super();
  }

  addMusics(musics: Music[]): any {
    return this.http.post(this.constantsService.baseAppUrl + '/api/musics', {musics});
  }

  updateMusic(music: Music): any {
    return this.http.put(this.constantsService.baseAppUrl + '/api/musics/' + music._id, music);
  }

  patchMusic(music: Music, set: any): any {
    return this.http.delete(this.constantsService.baseAppUrl + '/api/musics/' + music._id, set);
  }

  patchMusics(params: any, set: any): any {
    return this.http.patch(this.constantsService.baseAppUrl + '/api/musics'
      + this.constantsService.formatQuery(params), set);
  }

  deleteMusic(music: Music): any {
    return this.http.delete(this.constantsService.baseAppUrl + '/api/musics/' + music._id);
  }

  deleteMusics(params: any): any {
    return this.http.delete(this.constantsService.baseAppUrl + '/api/musics'
      + this.constantsService.formatQuery(params));
  }

  getMusics(params: any): any {
    return this.http.get(this.constantsService.baseAppUrl + '/api/musics'
      + this.constantsService.formatQuery(params));
  }

  countMusics(params: any): any {
    return this.http.head(this.constantsService.baseAppUrl + '/api/musics'
      + this.constantsService.formatQuery(params));
  }

  uploadItems(items: any[]): any {
    return this.addMusics(items);
  }

  getItems(params: any): any {
    return this.getMusics(params);
  }

  fileToArray(file: any): any {
    return file;
  }

  objectToItem(obj: any): any {

    const endTime = moment.tz(obj.endTime, 'Europe/Paris').unix();
    const temporality = endTime - (obj.msPlayed / 1000);

    return new Music('', obj.trackName, obj.artistName.split(', '), null, temporality);
  }
}
