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
import {SourcesService} from '../../services/sources.service';
import {Source} from '../../models/Source.model';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  timestamp: number;

  dataSources: Source[] = [];
  contextSources: Source[] = [];
  activities: any[] = [];
  segments: Segment[] = [];
  items = [];

  constructor(private segmentsService: SegmentsService,
              private photosService: PhotosService,
              private musicsService: MusicsService,
              private watchesService: WatchesService,
              private websitesService: WebsitesService,
              private sourcesService: SourcesService,
              private externalService: ExternalService,
              public constantsService: ConstantsService) { }

  ngOnInit(): void {
    this.timestamp = 1602684000;

    this.sourcesService.getSources({})
      .subscribe((result) => {
        this.dataSources.push(...result.sources.filter(s => s.type.indexOf('data') !== -1));
        this.contextSources.push(...result.sources.filter(s => s.type.indexOf('context') !== -1));
        this.refreshAllItems();
      });
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

    let requests = 5 + this.dataSources.length;

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

    for (const source of this.dataSources) {

      if (source.type.indexOf('photo') !== -1) {
        this.externalService.getExternalData(source, params)
          .subscribe((result: { photos: Photo[] }) => {
            this.items.push(...result.photos);
            if (!--requests) {
              this.getActivities();
            }
          });
      } else if (source.type.indexOf('music') !== -1) {
        this.externalService.getExternalData(source, params)
          .subscribe((result: { musics: Music[] }) => {
            this.items.push(...result.musics);
            if (!--requests) {
              this.getActivities();
            }
          });
      } else if (source.type.indexOf('watch') !== -1) {
        this.externalService.getExternalData(source, params)
          .subscribe((result: { watches: Watch[] }) => {
            this.items.push(...result.watches);
            if (!--requests) {
              this.getActivities();
            }
          });
      } else if (source.type.indexOf('website') !== -1) {
        this.externalService.getExternalData(source, params)
          .subscribe((result: { websites: Website[] }) => {
            this.items.push(...result.websites);
            if (!--requests) {
              this.getActivities();
            }
          });
      }
    }
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

    console.log(this.items);
  }

  getContents(segment: Segment): any {

    const contents = [];
    let content = { type: 'Undefined', data: [] };
    const items = this.items
      .filter((item) => item.temporality >= segment.duration.start && item.temporality < segment.duration.end)
      .sort((a, b) => a.temporality > b.temporality ? 1 : -1);
    for (const item of items) {
      if (content.data.length > 0 && content.type !== item.constructor.name) {
        contents.push(content);
        content = { type: item.constructor.name, data: [item] };
      } else {
        content.type = item.constructor.name;
        content.data.push(item);
      }
    }
    if (content.data.length > 0) {
      contents.push(content);
    }

    return contents;
  }

  getContextSource(type: string): Source {
    const contextSources = this.contextSources.filter((source) => source.type.indexOf('context') && source.type.indexOf(type) !== -1);
    return contextSources.length > 0 ? contextSources[0] : null;
  }
}
