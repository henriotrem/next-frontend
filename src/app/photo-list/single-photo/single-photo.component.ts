import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Photo} from "../../models/Photo.model";
import {PhotosService} from "../../services/photos.service";

@Component({
  selector: 'app-single-photo',
  templateUrl: './single-photo.component.html',
  styleUrls: ['./single-photo.component.scss']
})
export class SinglePhotoComponent implements OnInit {

  photo: Photo;

  constructor(private route: ActivatedRoute,
              private photosService: PhotosService,
              private router: Router) { }

  ngOnInit(): void {
    this.photo = new Photo( '', '', '', null, '', [], 0, []);
    const id = this.route.snapshot.params.id;

    this.photosService.getPhotos(id).then(
      (photos: Photo[]) => {
        this.photo = photos[0];
      }
    );
  }

  onDeletePhoto(photo: Photo): void {
    this.photosService.removePhoto(photo);
    this.router.navigate(['/photos']);
  }

  onBack(): void {
    this.router.navigate(['/photos']);
  }
}
