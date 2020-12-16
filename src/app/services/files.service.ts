import { Injectable } from '@angular/core';
import {Source} from '../models/Source.model';
import { HttpClient } from '@angular/common/http';
import {ConstantsService} from './constants.service';
import * as crypto from 'crypto-js';
import {File} from '../models/File.model';
import {ItemsService} from './items.service';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(private constantsService: ConstantsService,
              private http: HttpClient) {}

  addFiles(source: Source, files: File[]): any {
    return this.http.post(this.constantsService.baseAppUrl + '/api/sources/' + source._id + '/files', {files});
  }

  getFiles(source: Source, params: any): any {
    return this.http.get(this.constantsService.baseAppUrl + '/api/sources/' + source._id + '/files'
      + this.constantsService.formatQuery(params))
      .pipe(
        map((result: any) => {
          for (let i = 0; i < result.files.length; i++) {
            result.files[i] = Object.assign(new File(), result.files[i]);
          }
          return result;
        })
      );
  }

  patchFileProcessed(source: Source, file: File, increment: number): any {
    return this.http.patch(this.constantsService.baseAppUrl + '/api/sources/' + source._id + '/files/' + file._id + '/processed' ,
      {increment});
  }

  uploadFile(source: Source, files: File[], file: File, itemsService: ItemsService, input, eta: any, callback): void {

    file.sourceId = source._id;
    file.name = input.name;
    file.size = input.size;

    this.signFile(input, (signature) => {
      file.signature = signature;
      this.readItems(input, itemsService, (items) => {
        file.total = items.length;
        this.prepareFile(source, files, file, itemsService, items, eta, (id) => {
          callback(id, items);
        });
      });
    });
  }

  signFile(input: any, callback): void {

    const information = {
      chunkSize: 1024 * 1024,
      offset: 0,
      lastOffset: 0
    };

    let size = 0;
    const array = [];

    for (let offset = 0; offset < input.size; offset += information.chunkSize) {
      const partial = input.slice(information.offset, information.offset + information.chunkSize);
      const reader = new FileReader();
      reader.onload = function(evt): void {
        array[this.index] = {};
        array[this.index].wordBuffer = crypto.lib.WordArray.create(evt.target.result);
        if (--size === 0) {
          const SHA256 = crypto.algo.SHA256.create();
          for (const element of array) {
            SHA256.update(element.wordBuffer);
          }
          callback(SHA256.finalize().toString());
        }
      }.bind({ context: this, index: size});
      reader.readAsArrayBuffer(partial);
      size++;
    }
  }

  readItems(input: any, itemsService: ItemsService, callback): void {

    const reader = new FileReader();
    reader.readAsText(input, 'utf8');
    reader.onload = () => {
      try {

        const archive = JSON.parse(reader.result as string);
        const array = itemsService.fileToArray(archive);
        let items = [];
        for (const element of array) {
          const item = itemsService.objectToItem(element);
          items.push(item);
        }
        items = [...new Map(items.map(item => [item.temporality, item])).values()];

        callback(items);

      } catch (e) {
        console.log(e);
      }
    };
  }

  prepareFile(source: Source, files: File[], file: File, itemsService: ItemsService, items: any[], eta: any, callback): void {

    const matchingFiles = files.filter(f => f.signature === file.signature);

    if (matchingFiles.length === 0) {
      itemsService.getItems({ temporality: items[0].temporality }).subscribe(
        (result1) => {
          const array = result1[Object.keys(result1)[0]];
          if (array.length === 0) {
            this.addFiles(source, [file])
              .subscribe(
                (result2) => {
                  files.push(result2.files[0]);
                  callback(result2.files[0]._id);
                });
          } else {
            const matchingFile = files.filter(o => o._id === array[0].originId)[0];
            if (matchingFile.processed < file.total) {
              callback(matchingFile._id);
            } else {
              eta.state = true;
            }
          }
        }
      );
    } else if (matchingFiles[0].processed < file.total) {
      callback(matchingFiles[0]._id);
    } else {
      eta.state = true;
    }
  }

  uploadItems(source: Source, file: File, itemsService: ItemsService, items: any[], eta: any): void {

    const partial = items.slice(file.processed, file.processed + 200).map(obj => ({ ...obj, originId: file._id}));
    itemsService.uploadItems(partial).subscribe(
      () => {
        this.patchFileProcessed(source, file, partial.length).subscribe(
          (result) => {
            file.processed = result.processed;
            if (file.processed === file.total) {
              eta.state = true;
            } else if (!eta.state) {
              this.uploadItems(source, file, itemsService, items, eta);
            } else {
              eta.pause = true;
            }
          });
      });
  }
}
