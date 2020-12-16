import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {ConstantsService} from './constants.service';
import {Source} from '../models/Source.model';
import {map} from 'rxjs/operators';
import {Segment} from '../models/Segment.model';

@Injectable({
  providedIn: 'root'
})
export class SourcesService {

  constructor(private constantsService: ConstantsService,
              private http: HttpClient) {
  }

  addSources(sources: Source[]): any {
    return this.http.post(this.constantsService.baseAppUrl + '/api/sources', {sources});
  }

  updateSource(source: Source): any {
    return this.http.put(this.constantsService.baseAppUrl + '/api/sources/' + source._id, source);
  }

  patchSource(source: Source, set: any): any {
    return this.http.delete(this.constantsService.baseAppUrl + '/api/sources/' + source._id, set);
  }

  patchSources(params: any, set: any): any {
    return this.http.patch(this.constantsService.baseAppUrl + '/api/sources'
      + this.constantsService.formatQuery(params), set);
  }

  deleteSource(source: Source): any {
    return this.http.delete(this.constantsService.baseAppUrl + '/api/sources/' + source._id);
  }

  deleteSources(params: any): any {
    return this.http.delete(this.constantsService.baseAppUrl + '/api/sources'
      + this.constantsService.formatQuery(params));
  }

  getSources(params: any): any {
    return this.http.get(this.constantsService.baseAppUrl + '/api/sources'
      + this.constantsService.formatQuery(params))
      .pipe(
        map((result: any) => {
          for (let i = 0; i < result.sources.length; i++) {
            result.sources[i] = Object.assign(new Source(), result.sources[i]);
          }
          return result;
        })
      );
  }

  countSources(params: any): any {
    return this.http.head(this.constantsService.baseAppUrl + '/api/sources'
      + this.constantsService.formatQuery(params));
  }
}
