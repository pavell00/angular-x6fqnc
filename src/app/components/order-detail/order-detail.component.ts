import { Component, OnInit, Inject } from '@angular/core';
import { Order } from '../../models/order';
import { menuItem } from '../../models/menuItem';
import { DataService } from '../../services/data.service';
import { AngularFirestore } from '@angular/fire/firestore';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

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

  orderDate: string;
  orderNo: string;
  newData: any;

  constructor(private dataService: DataService,
    private firestore: AngularFirestore, public dialog: MatDialog) { }

  ngOnInit() {
    this.dataService.getMenuList().subscribe(actionArray => {
      this.menulist = actionArray.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as menuItem;
      })
    });
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
    //console.log(filterValue)
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