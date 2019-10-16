import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {HttpClientModule} from '@angular/common/http';
import {AppComponent} from './app.component';
import {HomeComponent} from './home/home.component';
import {UserListComponent} from './users/user-list.component';
import {UserListService} from './users/user-list.service';
import {MachineListComponent} from "./machines/machine-list.component";
import {MachineListService} from "./machines/machine-list.service";

import {Routing} from './app.routes';
import {APP_BASE_HREF} from '@angular/common';

import {CustomModule} from './custom.module';
import {AddUserComponent} from './users/add-user.component';
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatRadioModule} from "@angular/material/radio";


@NgModule({
  imports: [
    BrowserModule,
    HttpClientModule,
    Routing,
    CustomModule,
    MatOptionModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,

  ],
  declarations: [
    AppComponent,
    HomeComponent,
    UserListComponent,
    AddUserComponent,
    MachineListComponent
  ],
  providers: [
    UserListService,
    {provide: APP_BASE_HREF, useValue: '/'},
    MachineListService,
    {provide: APP_BASE_HREF, useValue: '/'}
  ],
  entryComponents: [
    AddUserComponent,
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
