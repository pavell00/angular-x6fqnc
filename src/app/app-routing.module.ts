import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderListComponent } from './components/orders-list/orders-list.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { MenuItemCreateComponent } from './components/menuItem-create/menuItem-create.component';
import { MenuListComponent } from './components/menu-list/menu-list.component';
import { OrderCreateComponent } from './components/order-create/order-create.components';

const routes: Routes = [
  { path: 'order-create', component: OrderCreateComponent},  
  { path: 'order-list', component: OrderListComponent},
  { path: 'order-detail', component: OrderDetailComponent},
  { path: 'menu-list', component: MenuListComponent},
  { path: 'menuItem-create', component: MenuItemCreateComponent},
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }