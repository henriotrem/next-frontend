import {Component, Input, OnInit} from '@angular/core';
import {Segment} from '../../models/Segment.model';
import {SegmentsService} from '../../services/segments.service';
import {ConstantsService} from '../../services/constants.service';
import {Photo} from '../../models/Photo.model';
import {MusicsService} from '../../services/musics.service';
import {Music} from '../../models/Music.model';
import {Watch} from '../../models/Watch.model';
import {WatchesService} from '../../services/watches.service';
import {ExternalService} from '../../services/external.service';
import {Website} from '../../models/Website.model';
import {WebsitesService} from '../../services/websites.service';
import {PhotosService} from '../../services/photos.service';
import {Source} from '../../models/Source.model';

@Component({
  selector: 'app-segment',
  templateUrl: './segment.component.html',
  styleUrls: ['./segment.component.scss']
})
export class SegmentComponent implements OnInit {

  @Input() segment: Segment;
  @Input() contents: any[];

  constructor(private externalService: ExternalService,
              public constantsService: ConstantsService) { }

  ngOnInit(): void {
  }

  photoFilter(item: any): boolean {
    return item.constructor.name === 'Photo';
  }
  musicFilter(item: any): boolean {
    return item.constructor.name === 'Music';
  }
  watchFilter(item: any): boolean {
    return item.constructor.name === 'Watch';
  }
  websiteFilter(item: any): boolean {
    return item.constructor.name === 'Website';
  }
}
