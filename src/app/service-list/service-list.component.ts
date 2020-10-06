import { Component, OnInit } from '@angular/core';
import {Service} from "../models/Service.model";
import {Subscription} from "rxjs";
import {ServicesService} from "../services/services.service";
import {Router} from "@angular/router";
import {WindowService} from "../services/window.service";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent implements OnInit {

  services: Service[];
  servicesSubscription: Subscription;

  constructor(private windowService: WindowService, private authService: AuthService, private servicesService: ServicesService, private router: Router) {
  }

  ngOnInit(): void {
    this.servicesSubscription = this.servicesService.servicesSubject.subscribe(
      (services: Service[]) => {
        this.services = services;
      }
    );
    this.servicesService.getAllServices();
    this.servicesService.emitServices();
  }

  onNewService(): void {
    this.router.navigate(['/services', 'new']);
  }

  onViewService(service: Service): void {
    this.router.navigate(['/services', 'view', service._id]);
  }

  ngOnDestroy(): void {
    this.servicesSubscription.unsubscribe();
  }
}
