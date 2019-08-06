import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http'; 
import { FormsModule } from '@angular/forms';

import { MatTableModule, MatExpansionModule, MatFormFieldModule,
  MatInputModule, MatButtonModule, MatCheckboxModule, MatOptionModule, MatSelectModule, 
  MatListModule, MatIconModule, MatToolbar, MatToolbarModule, MatSnackBarModule } from '@angular/material';

import { environment } from './environment';
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';

@NgModule({
  imports:      [ 
    BrowserModule, 
    FormsModule 
    ],
  declarations: [ 
    AppComponent,
    HelloComponent 
    ],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }


