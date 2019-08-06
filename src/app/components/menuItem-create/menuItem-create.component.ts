import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { menuItem } from '../../models/menuItem';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';

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

    constructor(private dataService: DataService,
    private firestore: AngularFirestore,
    private toastr: ToastrService) { }

    ngOnInit(): void {
        //this.dataService.items.subscribe(res => this.list = res)
        this.resetForm();
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

    resetForm(form?: NgForm) {
      if (form != null)
        form.resetForm();
        this.dataService.formData = {
        id: null,
        name: '',
        price: 10,
        qty: 1,
        discount: 0,
      }
    }

    onSubmit(form: NgForm) {
      let data = Object.assign({}, form.value);
      console.log(form.value);
      delete data.id;
      if (form.value.id == null)
        this.firestore.collection('menulist').add(data);
      else
        this.firestore.doc('menulist/' + form.value.id).update(data);

      this.resetForm(form);
      this.toastr.success('Submitted successfully', 'EMP. Register');
    }

}