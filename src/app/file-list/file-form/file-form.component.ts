import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PositionsService} from "../../services/positions.service";
import {Position} from "../../models/Position.model";
import {AuthService} from "../../services/auth.service";
import {File} from "../../models/File.model";
import {FilesService} from "../../services/files.service";
import {ConstantsService} from "../../services/constants.service";
import {async} from "@angular/core/testing";


@Component({
  selector: 'app-upload-form',
  templateUrl: './file-form.component.html',
  styleUrls: ['./file-form.component.scss']
})
export class FileFormComponent implements OnInit {

  file: File;
  locations = null;
  disabled = true;
  chunk = 1000;
  creation = false;
  stop = true;
  positions = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private positionsService: PositionsService,
              private filesService: FilesService,
              public constantsService: ConstantsService) { }

  ngOnInit(): void {

    this.file = new File('', '', 'No file', 0, '',0,0, ['positions']);
    let signature = this.route.snapshot.params.signature;

    if(signature) {
      this.filesService.getFiles(signature).then(
        (files: File[]) => {
          this.file = files[0];
        }
      )
    } else {
      this.creation = true;
    }
  }

  onFilePick(event: Event) {

    let input = (event.target as HTMLInputElement).files[0];

    this.file.userId = this.authService.userId;
    this.file.name = input.name
    this.file.size = input.size
    this.file.type = input.type;

    this.filesService.signFile(input, (signature) => {

      if(this.creation || this.file.signature === signature) {

        this.file.signature = signature;

        this.filesService.readLocations(input, (locations) => {

          this.file.total = locations.length;
          this.locations = locations;

          this.disabled = false;
        });
      } else {

        console.log('Wrong file selected!');
      }
    });
  }

  onUpload(): void {

    this.disabled = true;
    this.creation = false;
    this.stop = false;
    this.filesService.addFile(this.file).then(this.uploadPositions());
  }

  onContinue(): void {

    this.disabled = true;
    this.stop = false;
    this.uploadPositions();
  }

  uploadPositions(): void {

    this.positions = [];

    for(let i = this.file.processed; i < (this.file.processed + this.chunk) && i < this.locations.length; i++) {

      let location = this.locations[i];

      let geospatiality = {
        latitude: location.latitudeE7 / 10000000,
        longitude: location.longitudeE7 / 10000000,
        accuracy: location.accuracy
      }

      let temporality = location.timestampMs / 1000;
      let position = new Position(this.authService.userId, geospatiality, temporality);

      this.positions.push(position);
    }

    if(this.positions.length > 0) {

      this.file.processed += this.positions.length;
      (async () => {

        try {

          await this.positionsService.addPositions(this.positions);
          this.checkFile();
        } catch(e) {

        }
      })();
    } else {

      this.stop = true;
      this.disabled = false;
    }
  }

  checkFile(): void {

    //this.filesService.updateFile(this.file);

    if(this.stop) {
      this.disabled = false;
      this.stop = false;
    } else {
      this.uploadPositions();
    }
  }

  onStop(): void {
    this.stop = true;
  }

  onBack(): void {
    this.router.navigate(['/files']);
  }

}

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}
