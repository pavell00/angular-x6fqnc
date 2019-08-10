import { Component, OnInit, Inject } from '@angular/core';
import { Order } from '../../models/order';
import { menuItem } from '../../models/menuItem';
import { DataService } from '../../services/data.service';
import { AngularFirestore } from '@angular/fire/firestore';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

export interface DialogData {
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
  selectedMenu : menuItem[] = [];
  displayedColumns = ['add','name', 'price', 'qty', 'discount'];

  animal: any;
  name: string;

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

  openDialog(item: menuItem): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: {name: item.name, price: item.price, qty: item.qty, discount: item.discount}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
      console.log(this.animal);
    });
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'edit-dialog.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}