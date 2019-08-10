import { Component, OnInit } from '@angular/core';
import { Order } from '../../models/order';
import { menuItem2 } from '../../models/menuItem2';
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
  menulist : menuItem2[] = [];
  selectedMenu : menuItem2[] = [];
  displayedColumns = ['add','name', 'price', 'qty', 'discount'];

  constructor(private dataService: DataService,
    private firestore: AngularFirestore) { }

  ngOnInit() {
    this.dataService.getMenuList().subscribe(actionArray => {
      this.menulist = actionArray.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as menuItem2;
      })
    });
  }

 
  onAdd(item: menuItem2) {
    this.selectedMenu.push(item);
  }

  onDelete() {
    
  }

}