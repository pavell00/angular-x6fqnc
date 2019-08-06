import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { menuItem } from '../../models/menuItem';

@Component({
    selector: 'menuItem-create',
    templateUrl: './menuItem-create.component.html',
    styleUrls: ['./menuItem-create.component.css']
})
export class MenuItemCreateComponent implements OnInit {
    id: string;
    name: string;
    price: number = 10;
    qty: number = 1;
    discount: number = 0;

    constructor(private dataService: DataService) { }

    ngOnInit(): void {
        //this.dataService.items.subscribe(res => this.list = res)
        this.getMaxId();
    }

    addPhrase () {
        let newPhrase = new menuItem();
        newPhrase.id = '1';

    }

    getMaxId() {
        //this.dataService.getMaxIdFromItems().subscribe(
        //    data => (this.id = data + 1)
        //)
    }
}