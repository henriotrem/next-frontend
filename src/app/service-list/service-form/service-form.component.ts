import { Component, OnInit } from '@angular/core';
import {WindowService} from "../../services/window.service";
import {AuthService} from "../../services/auth.service";
import {ServicesService} from "../../services/services.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-service-form',
  templateUrl: './service-form.component.html',
  styleUrls: ['./service-form.component.scss']
})
export class ServiceFormComponent implements OnInit {

  nativeWindow: any;

  constructor(private windowService: WindowService, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.nativeWindow = this.windowService.getNativeWindow();
  }

  onNewGoogle(): void {
    this.nativeWindow.open('http://127.0.0.1:3000/api/external/google?userId=' + this.authService.userId);
    this.router.navigate(['/']);
  }

  onBack(): void {
    this.router.navigate(['/services']);
  }
}
