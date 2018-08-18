import { Component, OnInit } from '@angular/core';

import { TitleService } from "../../services/title.service";

@Component({
  selector: 'news-view',
  templateUrl: './news-view.component.html',
  styleUrls: ['./news-view.component.css']
})
export class NewsViewComponent implements OnInit {

  constructor(private titleService:TitleService) { }

  ngOnInit() {
    this.titleService.setTitle("Aktuálně");
  }

}
