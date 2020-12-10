import {Component, Input, OnInit} from '@angular/core';
import {ConstantsService} from '../../services/constants.service';
import {File} from '../../models/File.model';

@Component({
  selector: 'app-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit {

  @Input() file: File;
  @Input() state = 'none';
  @Input() array: [];
  @Input() items: [];

  constructor(public constantsService: ConstantsService) { }

  ngOnInit(): void {
  }

  getProgress(): number {
    return this.file.total === 0 ? 0 : Math.floor((this.file.processed / this.file.total) * 100);
  }
}
