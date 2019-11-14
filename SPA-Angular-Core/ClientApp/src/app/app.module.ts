import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { SPA } from './SPA';
@NgModule({
  imports: [BrowserModule, ReactiveFormsModule, HttpModule, JsonpModule],
  declarations: [SPA],
  bootstrap: [SPA]
})
export class AppModule { }
