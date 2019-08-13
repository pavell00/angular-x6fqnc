import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Order } from '../models/order';
import { menuItem } from '../models/menuItem';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { distinct, flatMap, map, take, max} from 'rxjs/operators';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public formData: menuItem;
  
  obsArray: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
  items: Observable<Order[]> = this.obsArray.asObservable();

  constructor(private http: HttpClient, private firestore: AngularFirestore) { }

  getMenuList() {
    return this.firestore.collection('menulist').snapshotChanges();
  }

  getOrders() {
    //return this.http.get<Order[]>(this.dataUrl);
    return this.firestore.collection('orders').snapshotChanges();
  }

  getSubCollection(id: string) {
    return this.firestore.collection('orders').doc(id).collection("lines").snapshotChanges();
  }
  
  getMaxIdFromItems() {
    return this.items.pipe(
      map(v => v),
      flatMap(a => a),
      max(this.comparer), // Phrase object whit max ID
      map(a => a.id), // return Max(Id)
    )
    
  }

  comparer(x: Order, y: Order) {
    if( x.id > y.id ) {
      return 1;
    } else if( x.id < y.id ) {
      return -1;
    } else return 0;
  }

  addPhrase(phrase: Order) {
    this.items.pipe(take(1)).subscribe(val => {
      //const newArr = [...val, phrase];
      //this.obsArray.next(newArr);
      val.push(phrase);
      //console.log(val);
      this.obsArray.next(val);
    })
  }

  deletePhrase(id) {
    let emps = JSON.parse(localStorage.getItem('employees'));
    for(let i = 0; i <emps.length; i++) {
      if(emps[i].id == id) {
        emps.splice(i, 1);
      }
    }
    localStorage.setItem('employees', JSON.stringify(emps));
  }

  updatePhrase(oldEmp, newEmp){  let emps = JSON.parse(localStorage.getItem('employees'));
    for(let i = 0; i <emps.length; i++) {
      if(emps[i].id == oldEmp.id) {
        emps[i] = newEmp;
      }
    }
    localStorage.setItem('employees', JSON.stringify(emps));
  }

}