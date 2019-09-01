import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http'; 
import { FormsModule } from '@angular/forms';

import { MatTableModule, MatExpansionModule, MatFormFieldModule,
  MatInputModule, MatButtonModule, MatCheckboxModule, MatOptionModule, MatSelectModule, 
  MatListModule, MatIconModule, MatToolbar, MatToolbarModule, MatSnackBarModule,
  MAT_DIALOG_DATA } from '@angular/material';
import {MatDialogModule, MatDialogRef, MatDialog} from '@angular/material/dialog';

import { environment } from './environments/environment';
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { ToastrModule } from 'ngx-toastr';

import { DataService } from './services/data.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrderDetailComponent, DialogOverviewExampleDialog } from './components/order-detail/order-detail.component';
import { MenuListComponent } from './components/menu-list/menu-list.component';
import { OrderListComponent } from './components/orders-list/orders-list.component';
import { MenuItemCreateComponent } from './components/menuItem-create/menuItem-create.component';
import { OrderCreateComponent } from './components/order-create/order-create.components';
import { PrintFormComponent } from './components/print-form/print-form.component';

@NgModule({
  declarations: [ 
    AppComponent,
    OrderDetailComponent, DialogOverviewExampleDialog,
    MenuListComponent, OrderListComponent, MenuItemCreateComponent,
    OrderCreateComponent,
    PrintFormComponent
    ],
  imports:      [ 
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    MatFormFieldModule, MatTableModule, MatIconModule, MatDialogModule,
    MatInputModule, MatOptionModule, MatSelectModule, MatCheckboxModule,
    MatListModule,
    ToastrModule.forRoot(),
    HttpClientModule
    ],
  providers: [DataService, 
    { provide: MatDialogRef, useValue: {close: (dialogResult: any) => { }}},
    { provide: MAT_DIALOG_DATA, useValue: [] }
  ],
  exports: [AppRoutingModule],
  entryComponents: [DialogOverviewExampleDialog],
  bootstrap:    [ AppComponent ]
})
export class AppModule { }


