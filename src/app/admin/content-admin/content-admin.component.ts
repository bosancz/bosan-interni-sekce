import { Component, OnInit, OnDestroy } from '@angular/core';

import { TitleService } from "app/services/title.service";
import { LayoutService } from "app/services/layout.service";

@Component({
  selector: 'content-admin',
  templateUrl: 'content-admin.component.html',
  styleUrls: ['content-admin.component.scss']
})
export class ContentAdminComponent implements OnInit, OnDestroy {

  constructor(private titleService:TitleService, private layoutService:LayoutService) { }

  ngOnInit() {
    this.titleService.setTitle("Správa obsahu");
    this.layoutService.hideFooter(true);
  }
  
  ngOnDestroy(){
    this.layoutService.hideFooter(false);
  }
}
