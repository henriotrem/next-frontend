import { Injectable } from '@angular/core';
import {File} from '../models/File.model';
import {Subject} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {ConstantsService} from "./constants.service";
import * as crypto from 'crypto-js';
import {AuthService} from "./auth.service";
import {PositionsService} from "./positions.service";

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  files: File[] = [];
  filesSubject = new Subject<File[]>();
  lastOffset = 0;

  constructor(private authService: AuthService, private positionsService: PositionsService, private constantsService: ConstantsService, private http: HttpClient) {}

  emitFiles(): void {
    this.filesSubject.next(this.files);
  }

  getFiles(ids: string): any {
    return new Promise((resolve, reject) => {
      this.http.get(this.constantsService.baseAppUrl + '/api/files/' + ids).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  getAllFiles(): void {
    this.http.get(this.constantsService.baseAppUrl + '/api/files/').subscribe(
      (files: File[]) => {

        if (files) {
          this.files = files;
          this.emitFiles();
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }

  addFile(file: File): any {
    return new Promise((resolve, reject) => {
      this.http.post( this.constantsService.baseAppUrl + '/api/files/', file).subscribe(
        (response) => {
          this.files.push(file);
          this.emitFiles();
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  updateFile(file: File): any {
    return new Promise((resolve, reject) => {
      this.http.put( this.constantsService.baseAppUrl + '/api/files/' + file.signature, file).subscribe(
        (response) => {
          resolve(response);
        },
        (error) => {
          reject(error);
        }
      );
    });
  }

  signFile(input: any, callback) {

    this.lastOffset = 0;

    let SHA256 = crypto.algo.SHA256.create();

    this.loadFile(input,
      function (data) {
        let wordBuffer = crypto.lib.WordArray.create(data);
        SHA256.update(wordBuffer);
      }, function () {
        callback(SHA256.finalize().toString());
      });
  }

  loadFile(file, callbackProgress, callbackFinal) {
    let chunkSize  = 1024*1024; // bytes
    let offset     = 0;
    let size=chunkSize;
    let partial;
    let index = 0;

    if(file.size===0){
      callbackFinal();
    }
    while (offset < file.size) {
      partial = file.slice(offset, offset+size);
      const reader = new FileReader();
      reader.onload = function(evt) {
        this.context.callbackRead(this, file, evt, callbackProgress, callbackFinal);
      }.bind({ context: this, size: chunkSize, offset: offset, index: index });
      reader.readAsArrayBuffer(partial);
      offset += chunkSize;
      index += 1;
    }
  }

  callbackRead(reader, file, evt, callbackProgress, callbackFinal){
    if(this.lastOffset === reader.offset) {
      // in order chunk
      this.lastOffset = reader.offset+reader.size;
      callbackProgress(evt.target.result);
      if ( reader.offset + reader.size >= file.size ){
        callbackFinal();
      }
    } else {
      // not in order chunk
      setTimeout(() => {
        this.callbackRead(reader,file,evt, callbackProgress, callbackFinal);
      }, 10);
    }
  }

  readLocations(input: any, callback) {

    const reader = new FileReader();
    reader.readAsText(input, 'utf8');
    reader.onload = () => {
      try {

        const archive = JSON.parse(reader.result as string);
        callback(archive.locations)

      } catch (e) { }
    };
  }
}
