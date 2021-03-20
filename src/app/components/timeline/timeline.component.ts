import {Component, OnInit, ViewChild} from '@angular/core';
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
import {Api} from '../../models/Api.model';
import {ApisService} from '../../services/apis.service';
import {MapComponent} from '../map/map.component';
// import {Hotkey, HotkeysService} from 'angular2-hotkeys';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  @ViewChild(MapComponent) mapComponent: MapComponent;

  timestamp: number;

  sources: Source[] = [];
  dataApis: Api[] = [];
  contextApis: Api[] = [];
  activities: any[] = [];
  segments: Segment[] = [];
  items = [];
  timelineOpacity = 1;
  mapOpacity = 0;
  timelineZIndex = 20;
  mapZIndex = 10;
  menuOpacity = 0;

  constructor(private segmentsService: SegmentsService,
              private photosService: PhotosService,
              private musicsService: MusicsService,
              private watchesService: WatchesService,
              private websitesService: WebsitesService,
              private sourcesService: SourcesService,
              private apisService: ApisService,
              private externalService: ExternalService,
              // private hotKeysService: HotkeysService,
              public constantsService: ConstantsService) { }

  ngOnInit(): void {

    /* this.hotKeysService.add(new Hotkey('left', (event: KeyboardEvent): boolean => {
      this.onPreviousDay();
      return false;
    }));
    this.hotKeysService.add(new Hotkey('right', (event: KeyboardEvent): boolean => {
      this.onNextDay();
      return false;
    })); */

    this.timestamp = 1608386400;

    this.sourcesService.getSources({})
      .subscribe((result1) => {

        this.sources.push(...result1.sources);
        let request = result1.sources.length;

        for (const source of result1.sources) {
          if (source.type.indexOf('api-context') !== -1) {
            this.apisService.getApis(source, {})
              .subscribe((result2) => {
                this.contextApis.push(...result2.apis);
                if (!--request) {
                  this.refreshAllItems();
                }
              });
          } else if (source.type.indexOf('api-data') !== -1) {
            this.apisService.getApis(source, {})
              .subscribe((result2) => {
                this.dataApis.push(...result2.apis);
                if (!--request) {
                  this.refreshAllItems();
                }
              });
          } else {
            if (!--request) {
              this.refreshAllItems();
            }
          }
        }
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

    let requests = 5 + this.dataApis.length;

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

    for (const api of this.dataApis) {

      const source = this.sources.filter((s) => s._id === api.sourceId)[0];
      const externalParams = {
        sourceId: source._id,
        apiId: api._id,
        ...params
      };

      if (source.type.indexOf('photo') !== -1) {
        this.externalService.getExternalData(externalParams)
          .subscribe((result: { photos: Photo[] }) => {
            this.items.push(...result.photos);
            if (!--requests) {
              this.getActivities();
            }
          });
      } else if (source.type.indexOf('music') !== -1) {
        this.externalService.getExternalData(externalParams)
          .subscribe((result: { musics: Music[] }) => {
            this.items.push(...result.musics);
            if (!--requests) {
              this.getActivities();
            }
          });
      } else if (source.type.indexOf('watch') !== -1) {
        this.externalService.getExternalData(externalParams)
          .subscribe((result: { watches: Watch[] }) => {
            this.items.push(...result.watches);
            if (!--requests) {
              this.getActivities();
            }
          });
      } else if (source.type.indexOf('website') !== -1) {
        this.externalService.getExternalData(externalParams)
          .subscribe((result: { websites: Website[] }) => {
            this.items.push(...result.websites);
            if (!--requests) {
              this.getActivities();
            }
          });
      } else {
        if (!--requests) {
          this.getActivities();
        }
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

    if (this.mapComponent) {
      this.mapComponent.onSegmentsChange();
    }
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

  getContext(type: string): any {

    const contextSources = this.sources.filter((s) => s.type.indexOf(type + '-api-context') !== -1);
    const contextSource =  contextSources.length > 0 ? contextSources[0] : null;

    const contextApis = this.contextApis.filter((api) => contextSource && api.sourceId === contextSource._id);
    const contextApi =  contextApis.length > 0 ? contextApis[0] : null;

    return { source: contextSource, api: contextApi};
  }

  captureCoordinate(event): void {

    const positionX = event.clientX / window.innerWidth;
    const positionY = event.clientY / window.innerHeight;

    if (positionX > 0.9) {
      this.mapZIndex = 20;
      this.timelineZIndex = 10;
      this.timelineOpacity = 0;
    } else if (positionX > 0.8) {
      this.timelineOpacity = 1 - (positionX - 0.8) * 10;
    }else {
      this.timelineOpacity = 1;
    }

    if (positionX < 0.1) {
      this.timelineZIndex = 20;
      this.mapZIndex = 10;
      this.mapOpacity = 0;
    } else if (positionX < 0.2) {
      this.mapOpacity = 1 - (0.2 - positionX) * 10;
    } else {
      this.mapOpacity = 1;
    }

    if (positionY > 0.9) {
      this.menuOpacity = 1;
    } else if (positionY > 0.8) {
      this.menuOpacity = (positionY - 0.8) * 10;
    } else {
      this.menuOpacity = 0;
    }
  }
}
