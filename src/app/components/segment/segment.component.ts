import {Component, Input, OnInit} from '@angular/core';
import {Segment} from '../../models/Segment.model';
import {ConstantsService} from '../../services/constants.service';
import {ExternalService} from '../../services/external.service';

@Component({
  selector: 'app-segment',
  templateUrl: './segment.component.html',
  styleUrls: ['./segment.component.scss']
})
export class SegmentComponent implements OnInit {

  @Input() segment: Segment;
  @Input() context: any;
  address: string;
  imageUrl: string;

  constructor(private externalService: ExternalService,
              public constantsService: ConstantsService) { }

  ngOnInit(): void {
    if (this.segment.distance === 0) {

      const params = {
        sourceId: this.context.source._id,
        apiId: this.context.api._id,
        location: this.segment.location.latitude + ',' + this.segment.location.longitude
      };
      this.externalService.getExternalContext(params)
        .subscribe((result) => {
          this.address = result.locations[0].vicinity;
        });
    }
  }
}
