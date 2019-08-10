import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/order';
import { menuItem } from '../../models/menuItem';
import { DataService } from '../../services/data.service';
import { AngularFirestore } from '@angular/fire/firestore';
import {SelectionModel} from '@angular/cdk/collections';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  //dataSource = new MatTableDataSource<menuItem>(ELEMENT_DATA);
  selectedMenuItem = new SelectionModel<menuItem>(true, []);
  dataSource = new MatTableDataSource<menuItem>();
  menulist : menuItem[] = [];
  displayedColumns = ['select','name', 'price', 'qty', 'discount'];

  constructor(private dataService: DataService,
    private firestore: AngularFirestore,) {
      //this.dataSource.data = this.menulist;
    }

  ngOnInit() {
    this.dataService.getMenuList().subscribe(actionArray => {
      this.menulist = actionArray.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as menuItem;
        this.dataSource.data = this.menulist;
      })
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selectedMenuItem.selected.length;
    const numRows = this.menulist.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
        this.selectedMenuItem.clear() :
        this.dataSource.data.forEach(row => this.selectedMenuItem.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: menuItem): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selectedMenuItem.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

}