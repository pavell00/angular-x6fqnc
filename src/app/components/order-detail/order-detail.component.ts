import { Component, OnInit, Inject, AfterContentInit } from '@angular/core';
import { Order } from '../../models/order';
import { menuItem } from '../../models/menuItem';
import { DataService } from '../../services/data.service';
import { AngularFirestore } from '@angular/fire/firestore';

import { ActivatedRoute, NavigationEnd }     from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

export interface DialogData {
  id: string;
  name: string;
  price: number;
  qty: number;
  discount: number;
}

@Component({
  selector: 'order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit, AfterContentInit {
  menulist : menuItem[] = [];
  filteredMenulist : menuItem[] = [];
  selectedMenu : menuItem[] = [];
  displayedColumns = ['add','name', 'price', 'qty', 'discount'];
  subscription: Subscription;

  orderDate: string = new Date().toLocaleString();
  orderNo: string;
  orderId: string;
  orderSum: number;
  orderDiscount: number;
  orderIsDone: boolean;

  newData: any;
  testData: any

  constructor(private dataService: DataService, private route: ActivatedRoute,
    private firestore: AngularFirestore, public dialog: MatDialog) {

  }
  
  ngOnInit() {
    this.dataService.getMenuList().subscribe(actionArray => {
      this.menulist = actionArray.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as menuItem;
      })
    });
    // Capture the order ID if available
    this.route.queryParams.subscribe(params => {
      this.orderId = params["orderid"];
    });

  }
 
  onSave() {
    console.log(this.orderId)
    if (this.orderId) {
      this.firestore.collection("orders").doc(this.orderId).set({
        id: this.orderId,
        OrderDate: this.orderDate, 
        TableNo: this.orderNo,
        sumOrder: this.orderSum,
        discountOrder: this.orderDiscount,
        isDone: true,
        OrderText: 'test check string'
    })
    } else {
      
      let newDocRef = this.firestore.collection('orders').doc();
      console.log('newCityRef id:', newDocRef.ref.id);
      let docId =  newDocRef.ref.id
      this.firestore.collection("orders").doc(docId).set({
      //this.firestore.collection("orders").add({
        id: docId,
        OrderDate: this.orderDate, 
        TableNo: this.orderNo,
        sumOrder: this.orderSum,
        discountOrder: this.orderDiscount,
        isDone: true,
        OrderText: 'test check string'
      })
    }
  }

  ngAfterContentInit() { if (this.orderId) {this.getOrderItems2(); this.fillOrderData();}  }

  getOrderItems2() {
      if (this.orderId) {
      this.dataService.getSubCollection(this.orderId).subscribe(actionArray => {
        this.selectedMenu = actionArray.map(item => {
          return {
            id: item.payload.doc.id,
            ...item.payload.doc.data()
          } as menuItem;
        });
      });
    }
  }

  fillOrderData() {
    if (this.orderId) {
        //let docRef = this.firestore.collection('orders').doc(this.orderId);
        this.dataService.getOrder(this.orderId).get().toPromise().then(
          doc => {//console.log("Document data:", doc.data())
            //this.orderId = this.orderId;
            this.orderNo = doc.data().TableNo;
            this.orderDate = doc.data().OrderDate;
            this.orderIsDone = doc.data().isDone;
            this.orderSum = doc.data().sumOrder;
            this.orderDiscount = doc.data().discountOrder;
          }
        )
      }
  }

  onAdd(item: menuItem) {
    this.selectedMenu.push(item);
    //console.log(this.selectedMenu)
  }

  onDelete(id: string) {
    //console.log(id)
    for(let i = 0; i < this.selectedMenu.length; i++) {
      if(this.selectedMenu[i].id == id) {
        this.selectedMenu.splice(i, 1);
      }
    }
  }

  applyFilter(filterValue: string) {
    //this.orderId.pipe(map(m => console.log(m)))
    this.filteredMenulist = this.menulist.filter(v => v.name.toLowerCase().startsWith(filterValue.trim().toLowerCase()));
  }

  openDialog(item: menuItem): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: {id: item.id, name: item.name, price: item.price, qty: item.qty, discount: item.discount}
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      if (result) {
        this.newData = result;
        //console.log(this.newData);
        for(let i = 0; i < this.selectedMenu.length; i++) {
          if(this.selectedMenu[i].id == this.newData.id) {
            this.selectedMenu[i].price = this.newData.price;
            this.selectedMenu[i].qty = this.newData.qty;
            this.selectedMenu[i].discount = this.newData.discount;
          }
        }
      }
    });
  }

}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './edit-dialog.html',
  styleUrls: ['./edit-dialog.css']
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}