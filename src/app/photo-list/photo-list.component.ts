import { Component, OnInit } from '@angular/core';
import {Subscription} from "rxjs";
import {PhotosService} from "../services/photos.service";
import {Router} from "@angular/router";
import {Photo} from "../models/Photo.model";

@Component({
  selector: 'app-photo-list',
  templateUrl: './photo-list.component.html',
  styleUrls: ['./photo-list.component.scss']
})
export class PhotoListComponent implements OnInit {

  timestamp = 1599661800;
  gallery: Photo[][];
  columns = 4;
  photosSubscription: Subscription;

  constructor(private photosService: PhotosService, private router: Router) { }

  ngOnInit(): void {
    this.photosSubscription = this.photosService.photosSubject.subscribe(
      (photos: Photo[]) => {

        this.gallery = [];

        for(let c = 0; c < this.columns; c++) {
          this.gallery[c] = [];
          for (let i = c; i < photos.length; i = i + this.columns)
            this.gallery[c].push(photos[i]);
        }

      }
    );
    this.photosService.getAllPhotos(this.timestamp);
    this.photosService.emitPhotos();
  }

  onNewPhoto(): void {
    this.router.navigate(['/photos', 'new']);
  }

  onViewPhoto(photo: Photo): void {
    this.router.navigate(['/photos', 'view', photo._id]);
  }

  ngOnDestroy(): void {
    this.photosSubscription.unsubscribe();
  }
}
