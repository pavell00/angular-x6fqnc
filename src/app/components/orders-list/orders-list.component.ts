import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Order } from '../../models/order';
import { DataService } from '../../services/data.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  
  displayedColumns: string[] = [];
  columnsToDisplay: string[] = [];

  constructor(private dataService: DataService, private router : Router,private firestore: AngularFirestore,
    private toastr:ToastrService) { }

  ngOnInit(): void {
    //this.onStart();
    this.displayedColumns = ['TableNo','OrderDate', 'isDone', 'Actions'];
    this.columnsToDisplay = this.displayedColumns.slice();
    this.dataService.getOrders().subscribe(actionArray => {
      this.orders = actionArray.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Order;
      })
    });
    //console.log(this.orders);
  }

  /*
  onStart() {
    this.displayedColumns = ['TableNo','OrderDate', 'isDone'];
    this.columnsToDisplay = this.displayedColumns.slice();
    this.dataService.getOrders() //getPhrases()
    .subscribe(
      data => { this.orders = data }
      //data => { this.phrasesFiltered  = data }
    )
  }*/

  onCreateOrder() {
    this.router.navigateByUrl('order-detail');
  }
  onViewOrder(item: Order) {
    this.firestore.collection("orders").doc("EL6gKdzdTzuIozrdFwr4").collection("lines").get().toPromise().then(
      snapshot => {
        const v = snapshot.docs.map(
          w => console.log(w.data())
        )
        
      }
    )
    //console.log(item)
  }

}