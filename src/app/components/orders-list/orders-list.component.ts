import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';

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

  constructor(private dataService: DataService, private router : Router,private firestore: AngularFirestore, private toastr:ToastrService) { }

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

  getMarker(id: string) {
    let cityRef = this.firestore.collection('orders').doc('EL6gKdzdTzuIozrdFwr4');
    let getDoc = cityRef.get().toPromise()
    .then(doc => {
      if (!doc.exists) {
        console.log('No such document!');
      } else {
        console.log('Document data:', doc.data());
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
    });
  }

  getMarker2(id: string) {
    let cityRef = this.firestore.collection('orders');
    let q = cityRef.get().toPromise().then(
      result => result.query.where('id', '==', id).get().then(
        q => {
          //console.log(q.docs.map(m => m.id));
          let docId = q.docs.map(m => m.id);
          let navigationExtras: NavigationExtras = {
            queryParams: { 'orderid': docId[0] }
          };
          //this.router.navigateByUrl('order-detail', navigationExtras);
          this.router.navigate(['/order-detail'], navigationExtras);
          /*
          cityRef.doc(docId[0]).collection("lines").get().toPromise().then(
              snapshot => {
                const v = snapshot.docs.map(
                  w => { 
                    console.log(w.data())
                  }
                )
              }
            )
          */
        }
      )
    )
  }
}