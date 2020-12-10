import {Component, Input, OnInit} from '@angular/core';
import {Source} from '../../models/Source.model';
import {Api} from '../../models/Api.model';
import {File} from '../../models/File.model';
import {ApisService} from '../../services/apis.service';
import {ItemsService} from '../../services/items.service';

@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.scss']
})
export class ApiComponent implements OnInit {

  @Input() source: Source;
  @Input() itemsService: ItemsService;
  @Input() api: Api;

  constructor(private apisService: ApisService) { }

  ngOnInit(): void {}

}
