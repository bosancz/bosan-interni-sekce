import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MaterialModule } from 'app/shared/modules/material.module';
import { SharedModule } from 'app/shared/shared.module';
/* COMPONENTS */
import { EventAgeHistogramComponent } from './components/event-age-histogram/event-age-histogram.component';
import { EventBirthdayListComponent } from './components/event-birthday-list/event-birthday-list.component';
import { EventExpensesChartComponent } from './components/event-expenses-chart/event-expenses-chart.component';
import { EventExpensesTableComponent } from './components/event-expenses-table/event-expenses-table.component';
import { EventSubtypeSelectorComponent } from './components/event-subtype-selector/event-subtype-selector.component';
import { EventTypeSelectorComponent } from './components/event-type-selector/event-type-selector.component';
import { EventsRoutingModule } from './events-routing.module';
/* SERVICES */
import { EventsService } from './services/events.service';
/* VIEWS */
import { EventEditComponent } from './views/event-edit/event-edit.component';
import { EventsCreateComponent } from './views/events-create/events-create.component';
import { EventsListComponent } from './views/events-list/events-list.component';
import { EventsViewAccountingComponent } from './views/events-view/events-view-accounting/events-view-accounting.component';
import { EventsViewAttendeesComponent } from './views/events-view/events-view-attendees/events-view-attendees.component';
import { EventsViewInfoComponent } from './views/events-view/events-view-info/events-view-info.component';
import { EventsViewRegistrationComponent } from './views/events-view/events-view-registration/events-view-registration.component';
import { EventsViewComponent } from './views/events-view/events-view.component';
import { EventEditLeadersComponent } from './components/event-edit-leaders/event-edit-leaders.component';
import { EventAddAttendeesComponent } from './components/event-add-attendees/event-add-attendees.component';








@NgModule({
  declarations: [
    EventsListComponent,
    EventsViewComponent,
    EventEditComponent,
    EventsViewRegistrationComponent,

    EventAgeHistogramComponent,
    EventBirthdayListComponent,
    EventExpensesTableComponent,
    EventSubtypeSelectorComponent,
    EventTypeSelectorComponent,
    EventExpensesChartComponent,
    EventsCreateComponent,
    EventsViewAttendeesComponent,
    EventsViewInfoComponent,
    EventsViewAccountingComponent,
    EventEditLeadersComponent,
    EventAddAttendeesComponent,
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    SharedModule,
    MaterialModule
  ],
  providers: [
    EventsService
  ]
})
export class EventsModule { }
