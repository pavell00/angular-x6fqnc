import { Component, OnInit, Inject } from '@angular/core';
import { Order } from '../../models/order';
import { menuItem } from '../../models/menuItem';
import { DataService } from '../../services/data.service';
import { AngularFirestore } from '@angular/fire/firestore';

import { ActivatedRoute, NavigationEnd }     from '@angular/router';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Subscription, Observable, Subject }   from 'rxjs';
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
export class OrderDetailComponent implements OnInit {
  menulist : menuItem[] = [];
  filteredMenulist : menuItem[] = [];
  selectedMenu : menuItem[] = [];
  displayedColumns = ['add','name', 'price', 'qty', 'discount'];
  subscription: Subscription;
  orderDate: string = new Date().toLocaleString();
  orderNo: string;
  orderId: string;
  newData: any;
  testAr: any;

  constructor(private dataService: DataService, private route: ActivatedRoute,
    private firestore: AngularFirestore, public dialog: MatDialog) {

  }
  
  getOrderItems() {
    if (this.orderId) {
      this.selectedMenu = null;
      let cityRef = this.firestore.collection('orders');
      this.testAr = cityRef.doc(this.orderId).collection("lines").get().toPromise().then(
        snapshot => {
          const v = snapshot.docs.map(obj => {
            //console.log(obj.data())
            return obj.data()
            //var o = new menuItem();
            /*o.id = "1";
            o.name = obj.data().name;
            o.price = obj.data().price;
            o.qty = obj.data().qty;
            o.discount = obj.data().discount;*/
            /*o.id = "1";
            o.name = "test";
            o.price = 20;
            o.qty = 1;
            o.discount = 0;
            //console.log(o);*/
            //this.testAr = (o);
            //this.selectedMenu.push(o);
            //console.log(obj.data().name)
            //map(m => console.log(m))
             
          })
          v.forEach(
            w => {
              //console.log(w);
            }
          )
        }
      )
    }
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
 
  getOrderItems2() {
      if (this.orderId) {
      this.dataService.getSubCollections(this.orderId).subscribe(actionArray => {
        this.testAr = actionArray.map(item => {
          return {
            id: item.payload.doc.id,
            ...item.payload.doc.data()
          } as menuItem;
        })
      });
    }
  }

  onAdd(item: menuItem) {
    this.selectedMenu.push(item);
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