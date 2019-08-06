import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//import { OrderListComponent } from './components/orders-list/orders-list.component';
//import { OrderDetailComponent } from './order-detail/order-detail.component';
//import { MenuItemCreateComponent } from './menuItem-create/menuItem-create.component';
//import { MenuListComponent } from './menu-list/menu-list.component';

const routes: Routes = [
//  { path: 'order-list', component: OrderListComponent},
//  { path: 'order-detail', component: OrderDetailComponent},
//  { path: 'menu-list', component: MenuListComponent},
//  { path: 'menuItem-create', component: MenuItemCreateComponent},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }