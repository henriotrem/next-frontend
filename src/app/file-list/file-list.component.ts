import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {File} from "../models/File.model";
import {Subscription} from "rxjs";
import {FilesService} from "../services/files.service";

@Component({
  selector: 'app-upload-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.scss']
})
export class FileListComponent implements OnInit {

  files: File[];
  filesSubscription: Subscription;

  constructor(private filesService: FilesService, private router: Router) { }

  ngOnInit(): void {
    this.filesSubscription = this.filesService.filesSubject.subscribe(
      (files: File[]) => {
        this.files = files;
      }
    );
    this.filesService.getAllFiles();
    this.filesService.emitFiles();
  }

  onNewFile(): void {
    this.router.navigate(['/files', 'new']);
  }

  onViewFile(file: File): void {
    this.router.navigate(['/files', 'view', file.signature]);
  }

  ngOnDestroy(): void {
    this.filesSubscription.unsubscribe();
  }
}
