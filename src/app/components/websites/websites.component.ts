import {Component, Input, OnInit} from '@angular/core';

import {Website} from '../../models/Website.model';

@Component({
  selector: 'app-websites',
  templateUrl: './websites.component.html',
  styleUrls: ['./websites.component.scss']
})
export class WebsitesComponent implements OnInit {

  @Input() websites: Website[];

  constructor() { }

  ngOnInit(): void {
  }

}
