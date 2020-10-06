import { Component, OnInit } from '@angular/core';
import {Photo} from "../../models/Photo.model";
import {ActivatedRoute, Router} from "@angular/router";
import {PhotosService} from "../../services/photos.service";
import {Service} from "../../models/Service.model";
import {ServicesService} from "../../services/services.service";
import {ExternalService} from "../../services/external.service";

@Component({
  selector: 'app-single-service',
  templateUrl: './single-service.component.html',
  styleUrls: ['./single-service.component.scss']
})
export class SingleServiceComponent implements OnInit {

  service: Service;

  constructor(private route: ActivatedRoute,
              private servicesService: ServicesService,
              private externalService: ExternalService,
              private router: Router) { }

  ngOnInit(): void {
    this.service = new Service( '', '', '', []);
    const id = this.route.snapshot.params.id;

    this.servicesService.getServices(id).then(
      (services: Service[]) => {
        this.service = services[0];
      }
    );
  }

  onLoadPhotos(): void {

    this.externalService.loadGooglePhotos();
  }

  onDeleteService(service: Service): void {
    this.servicesService.removeService(service);
    this.router.navigate(['/services']);
  }

  onBack(): void {
    this.router.navigate(['/services']);
  }

}
