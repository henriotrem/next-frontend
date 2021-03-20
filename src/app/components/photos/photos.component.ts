import {Component, Input, OnInit} from '@angular/core';
import {Photo} from '../../models/Photo.model';
import {Source} from '../../models/Source.model';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.component.html',
  styleUrls: ['./photos.component.scss']
})
export class PhotosComponent implements OnInit {

  @Input() photos: Photo[];
  @Input() context: any;

  gallery: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.createGallery();
  }

  createGallery(): void {

    const fullWidth = 1100;
    const baseHeight = 300;
    const margin = 8;

    let photos = [];
    let rowWidth = 0;

    for (const photo of this.photos) {
      const width = photo.metadata.width * baseHeight / photo.metadata.height;

      if (rowWidth + width + photos.length * margin > fullWidth) {
        this.gallery.push({height: baseHeight * fullWidth / rowWidth, photos});
        photos = [];
        rowWidth = 0;
      } else {
        photos.push(photo);
        rowWidth += width;
      }
    }

    this.gallery.push({height: baseHeight, photos});
  }

}
