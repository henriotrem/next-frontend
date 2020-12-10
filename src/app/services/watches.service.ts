import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantsService } from './constants.service';
import { ItemsService } from './items.service';
import { Watch } from '../models/Watch.model';

@Injectable({
  providedIn: 'root'
})
export class WatchesService extends ItemsService {

  constructor(private constantsService: ConstantsService,
              private http: HttpClient) {
    super();
  }

  addWatches(watches: Watch[]): any {
    return this.http.post(this.constantsService.baseAppUrl + '/api/watches', {watches});
  }

  updateWatch(watch: Watch): any {
    return this.http.put(this.constantsService.baseAppUrl + '/api/watches/' + watch._id, watch);
  }

  patchWatch(watch: Watch, set: any): any {
    return this.http.delete(this.constantsService.baseAppUrl + '/api/watches/' + watch._id, set);
  }

  patchWatches(params: any, set: any): any {
    return this.http.patch(this.constantsService.baseAppUrl + '/api/watches'
      + this.constantsService.formatQuery(params), set);
  }

  deleteWatch(watch: Watch): any {
    return this.http.delete(this.constantsService.baseAppUrl + '/api/watches/' + watch._id);
  }

  deleteWatches(params: any): any {
    return this.http.delete(this.constantsService.baseAppUrl + '/api/watches'
      + this.constantsService.formatQuery(params));
  }

  getWatches(params: any): any {
    return this.http.get(this.constantsService.baseAppUrl + '/api/watches'
      + this.constantsService.formatQuery(params));
  }

  countWatches(params: any): any {
    return this.http.head(this.constantsService.baseAppUrl + '/api/watches'
      + this.constantsService.formatQuery(params));
  }

  uploadItems(items: any[]): any {
    return this.addWatches(items);
  }

  getItems(params: any): any {
    return this.getWatches(params);
  }

  fileToArray(file: any): any {
    return file;
  }

  objectToItem(obj: any): any {

    const temporality = (new Date(Date.parse(obj.time))).getTime() / 1000;
    const watch = new Watch('', obj.title, obj.titleUrl, null, temporality);

    return watch;
  }
}
