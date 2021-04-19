import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, BehaviorSubject, combineLatest, Subject } from "rxjs";
import { debounceTime, map } from 'rxjs/operators';

import { ApiService } from 'app/core/services/api.service';

import { Album, Photo } from "app/schema/album";

type AlbumWithSearchString<T = Photo> = Album<T> & { searchString: string; };

@Component({
  selector: 'albums-list',
  templateUrl: './albums-list.component.html',
  styleUrls: ['./albums-list.component.scss']
})
export class AlbumsListComponent implements OnInit {

  years: number[] = [];
  currentYear?: number;

  albums$ = new Subject<AlbumWithSearchString[]>();
  filteredAlbums$: Observable<Album[]>;

  statuses = [
    { id: "public", name: "zveřejněná" },
    { id: "draft", name: "v přípravě" },
  ];

  statusesIndex = this.statuses.reduce((acc, cur) => (acc[cur.id] = cur.name, acc), {} as { [id: string]: string; });

  showFilter = false;

  loading: boolean = false;

  @ViewChild('filterForm', { static: true }) filterForm!: NgForm;

  search$ = new BehaviorSubject<string>("");

  constructor(
    private api: ApiService,
  ) {

    this.filteredAlbums$ = combineLatest([this.albums$, this.search$.pipe(debounceTime(250))])
      .pipe(map(([events, search]) => this.filterAlbums(events, search)));

  }

  ngOnInit() {
    this.loadYears();
  }

  ngAfterViewInit() {
    this.filterForm.valueChanges!.subscribe(filter => {
      this.loadAlbums(filter);
    });
  }

  async loadYears() {
    this.years = await this.api.get<number[]>("albums:years");
    this.years.sort((a, b) => b - a);
    this.currentYear = this.years[0];
  }

  async loadAlbums(filter: any) {

    if (!filter.year) return;

    this.loading = true;

    const options: any = {
      sort: "dateFrom",
      filter: {
        dateFrom: { $gte: filter.year + "-01-01", $lte: filter.year + "-12-31" }
      }
    };

    if (filter.status) options.filter.status = filter.status;

    const albums = await this.api.get<Album[]>("albums", options);

    this.albums$.next(albums.map(album => {
      const searchString = [
        album.name
      ].filter(item => !!item).join(" ");

      return { ...album, searchString };
    }));

    this.loading = false;
  }

  filterAlbums(events: AlbumWithSearchString[], search: string) {

    if (!search) return events;

    const search_re = new RegExp("(^| )" + search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "i");

    return events.filter(event => search_re.test(event.searchString));
  }

}