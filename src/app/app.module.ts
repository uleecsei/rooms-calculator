import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTabsModule } from '@angular/material/tabs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProjectOverviewComponent } from './components/project-overview/project-overview.component';
import { ProjectDetailsComponent } from './components/project-details/project-details.component';
import { BasePricingComponent } from './components/base-pricing/base-pricing.component';
import { MasterPricingComponent } from './components/master-pricing/master-pricing.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectOverviewComponent,
    ProjectDetailsComponent,
    BasePricingComponent,
    MasterPricingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatTabsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
