import { Component, OnInit } from '@angular/core';
import { menuItem } from '../models/menuItem';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.css']
})
export class MenuListComponent implements OnInit {
  menulist : menuItem[] = [];
  displayedColumns = ['id','name', 'price', 'qty', 'discount', 'Actions'];
  
  constructor(private dataService: DataService, private router : Router) { }

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

  createMenuItem() {
    //menuItem-create
    this.router.navigateByUrl('menuItem-create');
  }
}