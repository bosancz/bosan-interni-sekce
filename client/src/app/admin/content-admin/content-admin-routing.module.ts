import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/* MAIN ADMIN COMPONENT */
import { ContentAdminComponent } from './content-admin.component';

/* ADMIN MODULES */
import { ErrorsAdminComponent } from './views/errors-admin/errors-admin.component';
import { ErrorAdminComponent } from './views/error-admin/error-admin.component';

import { EventsAdminComponent } from './views/events-admin/events-admin.component';
import { EventAdminComponent } from './views/event-admin/event-admin.component';

import { AlbumsAdminComponent } from './views/albums-admin/albums-admin.component';
import { AlbumAdminComponent } from './views/album-admin/album-admin.component';

import { MembersAdminComponent } from './views/members-admin/members-admin.component';
import { MemberAdminComponent } from './views/member-admin/member-admin.component';

import { UsersAdminComponent } from './views/users-admin/users-admin.component';
import { UserAdminComponent } from './views/user-admin/user-admin.component';

import { WebAdminComponent } from './views/web-admin/web-admin.component';


/* SERVICES */


const routes:Routes = [


  {
    path: '',
    component: ContentAdminComponent,
    children: [
      {path: 'clenove/:member/:cat', component: MemberAdminComponent},
      {path: 'clenove/:member', redirectTo: "clenove/:member/osobni", pathMatch: "full"},
      {path: 'clenove', component: MembersAdminComponent},

      {path: 'akce/:event/:cat', component: EventAdminComponent},
      {path: 'akce/:event', redirectTo: "akce/:event/upravit", pathMatch: "full"},
      {path: 'akce', component: EventsAdminComponent},

      {path: 'galerie/:album/:cat', component: AlbumAdminComponent},
      {path: 'galerie/:album', redirectTo: "galerie/:album/upravit", pathMatch: "full"},
      {path: 'galerie', component: AlbumsAdminComponent},
      
      {path: 'uzivatele/:user/:cat', component: UserAdminComponent},      
      {path: 'uzivatele/:user', redirectTo: "uzivatele/:user/ucet", pathMatch: "full"}, 
      {path: 'uzivatele', component: UsersAdminComponent},   

      {path: 'nastaveni-webu/:cat', component: WebAdminComponent},
      {path: 'nastaveni-webu', redirectTo: "nastaveni-webu/obecne", pathMatch: "full"},

      {path: 'chyby/:chyba', component: ErrorAdminComponent},   
      {path: 'chyby', component: ErrorsAdminComponent},   
  
      {path: '', redirectTo: "akce", pathMatch: "full"},
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentAdminRoutingModule { }