import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute }     from '@angular/router';
import { menuItem } from '../../models/menuItem';

@Component({
  selector: 'print-form',
  templateUrl: './print-form.component.html',
  styleUrls: ['./print-form.component.css']
})
export class PrintFormComponent implements OnInit {
  selectedMenu: menuItem[] = [];;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.selectedMenu = params["selectedMenu"];
    });
  }

  getMenu() {
    console.log(this.selectedMenu)
  }

}
