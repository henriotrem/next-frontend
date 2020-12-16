import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConstantsService } from './constants.service';
import { ItemsService } from './items.service';
import { Website } from '../models/Website.model';
import {map} from 'rxjs/operators';
import {Api} from '../models/Api.model';

@Injectable({
  providedIn: 'root'
})
export class WebsitesService extends ItemsService {

  constructor(private constantsService: ConstantsService,
              private http: HttpClient) {
    super();
  }

  addWebsites(websites: Website[]): any {
    return this.http.post(this.constantsService.baseAppUrl + '/api/websites', {websites});
  }

  updateWebsite(website: Website): any {
    return this.http.put(this.constantsService.baseAppUrl + '/api/websites/' + website._id, website);
  }

  patchWebsite(website: Website, set: any): any {
    return this.http.delete(this.constantsService.baseAppUrl + '/api/websites/' + website._id, set);
  }

  patchWebsites(params: any, set: any): any {
    return this.http.patch(this.constantsService.baseAppUrl + '/api/websites'
      + this.constantsService.formatQuery(params), set);
  }

  deleteWebsite(website: Website): any {
    return this.http.delete(this.constantsService.baseAppUrl + '/api/websites/' + website._id);
  }

  deleteWebsites(params: any): any {
    return this.http.delete(this.constantsService.baseAppUrl + '/api/websites'
      + this.constantsService.formatQuery(params));
  }

  getWebsites(params: any): any {
    return this.http.get(this.constantsService.baseAppUrl + '/api/websites'
      + this.constantsService.formatQuery(params))
      .pipe(
        map((result: any) => {
          for (let i = 0; i < result.websites.length; i++) {
            result.websites[i] = Object.assign(new Website(), result.websites[i]);
          }
          return result;
        })
      );
  }

  countWebsites(params: any): any {
    return this.http.head(this.constantsService.baseAppUrl + '/api/websites'
      + this.constantsService.formatQuery(params));
  }

  getItems(params: any): any {
    return this.getWebsites(params);
  }

  fileToArray(file: any): any {
    return file;
  }

  objectToItem(obj: any): any {

    const temporality = (new Date(Date.parse(obj.time))).getTime() / 1000;
    const website = new Website();

    website.sourceUrl = obj.url;
    website.temporality = temporality;

    return website;
  }
}
