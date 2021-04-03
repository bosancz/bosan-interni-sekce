import { Component, OnInit } from '@angular/core';
import { TitleService } from 'app/core/services/title.service';
import { MenuService } from 'app/core/services/menu.service';
import { UserService } from 'app/core/services/user.service';
import { Router } from '@angular/router';
import { LoginService } from 'app/core/services/login.service';
import { ConfigService } from 'app/core/services/config.service';
import { map } from 'rxjs/operators';
import { Platform } from '@ionic/angular';
import { SwUpdate } from '@angular/service-worker';
import { OnlineService } from 'app/core/services/online.service';

@Component({
  selector: 'admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.scss']
})
export class AdminMenuComponent implements OnInit {

  submenu?: string;

  dropdownsCollapsed = {
    program: true
  };

  environment$ = this.configService.config.pipe(map(config => config.general && config.general.environment));

  constructor(
    public titleService: TitleService,
    public menuService: MenuService,
    public userService: UserService,
    private loginService: LoginService,
    private configService: ConfigService,
    private router: Router,
    public onlineService: OnlineService,
    public swUpdate: SwUpdate,
    public platform: Platform,
  ) { }

  ngOnInit() {
  }


  async logout() {
    await this.loginService.logout();
    this.router.navigate(["/login"]);
  }

  reload() {
    window.location.reload();
  }

}
