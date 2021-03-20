import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Source} from '../../models/Source.model';
import {ItemsService} from '../../services/items.service';
import {Api} from '../../models/Api.model';
import {ApisService} from '../../services/apis.service';
import {File} from '../../models/File.model';
import {FilesService} from '../../services/files.service';
import {WindowService} from '../../services/window.service';
import {ConstantsService} from '../../services/constants.service';

@Component({
  selector: 'app-source',
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.scss']
})
export class SourceComponent implements OnInit, OnDestroy {

  @Input() source: Source;
  @Input() itemsService: ItemsService;

  nativeWindow: any;

  apis: Api[] = [];
  api: Api;
  files: File[] = [];
  file: File;
  input: any;
  items: any[];
  eta = { state: true, pause: false };

  constructor(private windowService: WindowService,
              private apisService: ApisService,
              private filesService: FilesService,
              private constantsService: ConstantsService) { }

  ngOnInit(): void {

    this.nativeWindow = this.windowService.getNativeWindow();

    this.apisService.getApis(this.source, {}).subscribe(
      (result) => {
        this.apis = result.apis;
      },
      (error) => {
        console.log(error);
      }
    );

    this.filesService.getFiles(this.source, {}).subscribe(
      (result) => {
        this.files = result.files;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  apiFilter(source: Source): boolean {
    return source.type.indexOf('api') !== -1;
  }
  fileFilter(source: Source): boolean {
    return source.type.indexOf('file') !== -1;
  }

  onNewApi(): void {
    this.nativeWindow.open(this.constantsService.baseAppUrl + '/api/providers/' + this.source.providerId + '/oauth2?origin='
      + localStorage.getItem('user_id') + '-' + this.source._id);
  }

  onFilePick(event: Event): void {
    this.eta.state = false;
    this.eta.pause = false;
    this.file = new File();
    this.input = (event.target as HTMLInputElement).files[0];
    this.filesService.uploadFile(this.source, this.files, this.file, this.itemsService, this.input, this.eta, (id, items) => {
      this.file = this.files.filter(f => f._id === id)[0];
      this.items = items;
      this.filesService.uploadItems(this.source, this.file, this.itemsService, this.items, this.eta);
    });
  }

  onStop(): void {
    this.eta.state = true;
  }

  onResume(): void {
    this.eta.state = false;
    this.eta.pause = false;
    this.filesService.uploadItems(this.source, this.file, this.itemsService, this.items, this.eta);
  }

  ngOnDestroy(): void {
    console.log('destroy');
  }
}
