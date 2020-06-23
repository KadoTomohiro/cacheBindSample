import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent, CacheRepository, LocalStorageCacheRepository } from './app.component';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule
  ],
  providers: [
    {provide: CacheRepository, useClass: LocalStorageCacheRepository}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
