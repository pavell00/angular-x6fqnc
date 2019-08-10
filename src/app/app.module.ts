import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http'; 
import { FormsModule } from '@angular/forms';

import { MatTableModule, MatExpansionModule, MatFormFieldModule,
  MatInputModule, MatButtonModule, MatCheckboxModule, MatOptionModule, MatSelectModule, 
  MatListModule, MatIconModule, MatToolbar, MatToolbarModule, MatSnackBarModule
   } from '@angular/material';

import { environment } from './environments/environment';
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { ToastrModule } from 'ngx-toastr';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { MenuListComponent } from './components/menu-list/menu-list.component';
import { OrderListComponent } from './components/orders-list/orders-list.component';
import { MenuItemCreateComponent } from './components/menuItem-create/menuItem-create.component';
import { HelloComponent } from './hello.component';

@NgModule({
  declarations: [ 
    AppComponent,
    OrderDetailComponent,
    MenuListComponent, OrderListComponent, MenuItemCreateComponent
    ],
  imports:      [ 
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    MatFormFieldModule, MatTableModule, MatIconModule,
    MatInputModule, MatOptionModule, MatSelectModule, MatCheckboxModule,
    ToastrModule.forRoot(),
    HttpClientModule
    ],
  exports: [AppRoutingModule],   
  bootstrap:    [ AppComponent ]
})
export class AppModule { }


