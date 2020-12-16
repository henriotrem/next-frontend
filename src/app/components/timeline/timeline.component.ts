import {Component, OnInit} from '@angular/core';
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

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  timestamp: number;

  activities: any[] = [];
  segments: Segment[] = [];
  items = [];

  constructor(private segmentsService: SegmentsService,
              private photosService: PhotosService,
              private musicsService: MusicsService,
              private watchesService: WatchesService,
              private websitesService: WebsitesService,
              private externalService: ExternalService,
              public constantsService: ConstantsService) { }

  ngOnInit(): void {
    this.timestamp = 1600300800;
    this.refreshAllItems();
  }

  onPreviousDay(): void {
    this.timestamp -= 3600 * 24;
    this.refreshAllItems();
  }

  onNextDay(): void {
    this.timestamp += 3600 * 24;
    this.refreshAllItems();
  }

  refreshAllItems(): void {

    const params = {start: this.timestamp, end: this.timestamp + 3600 * 24};

    this.segments = [];
    this.items = [];

    let requests = 5;

    this.segmentsService.getSegments(params)
      .subscribe((result) => {
        this.segments.push(...result.segments);
        if (!--requests) {
          this.getActivities();
        }
      });
    this.photosService.getPhotos(params)
      .subscribe((result: { photos: Photo[] }) => {
        this.items.push(...result.photos);
        if (!--requests) {
          this.getActivities();
        }
      });
    this.musicsService.getMusics(params)
      .subscribe((result: { musics: Music[] }) => {
        this.items.push(...result.musics);
        if (!--requests) {
          this.getActivities();
        }
      });
    this.watchesService.getWatches(params)
      .subscribe((result: { watches: Watch[] }) => {
        this.items.push(...result.watches);
        if (!--requests) {
          this.getActivities();
        }
      });
    this.websitesService.getWebsites(params)
      .subscribe((result: { websites: Website[] }) => {
        this.items.push(...result.websites);
        if (!--requests) {
          this.getActivities();
        }
      });
    /*this.externalService.getExternalData(externalPhotoSource, params)
      .subscribe((result: any) => this.photos.concat(result.photos));*/

  }

  getActivities(): void {

    this.activities = [];

    for (const segment of this.segments) {
      const activity = {
        segment,
        contents: this.getContents(segment)
      };
      this.activities.push(activity);
    }

    console.log(this.activities);
  }

  getContents(segment: Segment): any {

    const contents = [];
    let content = { type: 'Undefined', data: [] };
    const items = this.items
      .filter((item) => item.temporality >= segment.duration.start && item.temporality < segment.duration.end)
      .sort((a, b) => a.temporality > b.temporality ? 1 : -1);
    for (const item of items) {
      if (content.data && content.type !== item.constructor.name) {
        contents.push(content);
        content = { type: item.constructor.name, data: [item] };
      } else {
        content.data.push(item);
      }
    }
    if (content.data.length > 0) {
      contents.push(content);
    }

    return contents;
  }
}
