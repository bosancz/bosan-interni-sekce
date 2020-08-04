import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { DashboardComponent } from './dashboard.component';

import { SharedModule } from 'app/shared/shared.module';
import { DashboardCalendarComponent } from './views/dashboard-calendar/dashboard-calendar.component';
import { DashboardLeadEventComponent } from './views/dashboard-lead-event/dashboard-lead-event.component';
import { DashboardNewsComponent } from './views/dashboard-news/dashboard-news.component';
import { DashboardMyEventsComponent } from "./views/dashboard-my-events/dashboard-my-events.component";

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardCalendarComponent,
    DashboardLeadEventComponent,
    DashboardNewsComponent,
    DashboardMyEventsComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule
  ]
})
export class DashboardModule { }
