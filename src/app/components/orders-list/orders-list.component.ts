import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import copy from 'copy-to-clipboard';
import { Order } from '../../models/order';
import { menuItem } from '../../models/menuItem';
import { PrintRow } from '../../models/printRows';
import { DataService } from '../../services/data.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Component({
  selector: 'orders-list',
  templateUrl: './orders-list.component.html',
  styleUrls: ['./orders-list.component.css']
})
export class OrderListComponent implements OnInit {
  orders: Order[] = [];
  printRows: PrintRow[] = [];
  displayedColumns: string[] = [];
  columnsToDisplay: string[] = [];
  header: string;
  strLine4: string;
  strLine5: string;
  maxLength: number;
  maxLengthFoodName: number;

  constructor(private dataService: DataService, private router : Router,private firestore: AngularFirestore, private toastr:ToastrService) { }

  ngOnInit(): void {
    this.displayedColumns = ['TableNo','OrderDate','sumOrder','discountOrder','isDone','Actions'];
    this.columnsToDisplay = this.displayedColumns.slice();
    this.dataService.getOrders().subscribe(actionArray => {
      this.orders = actionArray.map(item => {
        return {
          id: item.payload.doc.id,
          ...item.payload.doc.data()
        } as Order;
      })
    });
    //console.log(this.orders);
  }

  onCreateOrder() {
    this.router.navigateByUrl('order-create');
  }

  editOrder(id: string) {
    let navigationExtras: NavigationExtras = {
      queryParams: { 'orderid': id }
    };
    this.router.navigate(['/order-detail'], navigationExtras);
  }

  createPrintForm(id: string) {
    this.makeHeader2(id);
    
  }

  makeHeader(id: string) {
    //Чек # 192264  стол # VIP005       Гостей 4
    //05.07.19      открыт 20:30    печать 00:05
    
    let p1 = this.dataService.getOrder(id).get().toPromise().then(
            doc => {//console.log("document data:", doc.data())
              this.strLine4 = 'Чек '+doc.data().check+'Стол # '+doc.data().TableNo + 'Гостей ' +doc.data().guests+'\n';
              this.strLine5 =  doc.data().OrderDate+'открыт '+doc.data().OrderDate+'печать '+doc.data().printTime+'\n';
              console.log(this.strLine4, this.strLine5)
            }
    )

    let p2 = this.dataService.getParams().get().toPromise().then(
            doc => {//console.log("params data:", doc.data())
              this.header  =  doc.data().headerStr1+'\n';
              this.header +=  doc.data().headerStr2+'\n';
              this.header +=  doc.data().headerStr3+'\n';
              this.header +=  this.strLine4;
              this.header +=  this.strLine5;
              this.header +=  doc.data().headerStr6+'\n';
              this.header +=  doc.data().headerStr7+'\n';
              this.header +=  doc.data().tableHeader1+'\n';
              this.header +=  doc.data().lineStr+'\n';
            }
    )

    let promise = Promise.all([p1, p2])
    promise.then(
      res => {console.log(this.header);
    });
  }

  makeHeader2(id: string) {
    this.dataService.getParams().get().toPromise().then(
      param => {//console.log("params data:", doc.data())
        this.maxLength = param.data().maxLength;
        this.maxLengthFoodName = param.data().maxLengthFoodName;
        this.header  =  param.data().headerStr1+'\n';
        this.header +=  param.data().headerStr2+'\n';
        this.header +=  param.data().headerStr3+'\n';
        this.dataService.getOrder(id).get().toPromise().then(
          order => {//console.log("document data:", doc1.data())
            //4-th check's line
            let check: string = order.data().check.toString();
            let TableNo: string = order.data().TableNo;
            let guests: string = order.data().guests.toString();
            this.strLine4 = param.data().headerStr4+this.addSpace(check, 8, 'af')+'Стол # '+this.addSpace(TableNo, 12, 'af') + 'Гостей '+this.addSpace(guests, 2, 'pr')+'\n';
            //5-th check's line
            let orderDate: string
            let str: string = order.data().OrderDate;
            orderDate = str.slice(0, 5)+'.'+str.slice(8, 10);
            let orderTime: string = order.data().OrderDate;
            orderTime = orderTime.slice(12);
            this.strLine5 = orderDate +'      Открыт '+orderTime+'    Печать '+order.data().printTime+'\n';
            //console.log(this.strLine4, this.strLine5)
            this.header +=  this.strLine4;
            this.header +=  this.strLine5;
            this.header +=  param.data().headerStr6+'\n';
            this.header +=  param.data().headerStr7+'\n';
            this.header +=  param.data().tableHeader1+'\n';
            this.header +=  param.data().lineStr+'\n';
            //console.log(this.header)
            //copy(this.header);
            this.printRows = [];
            let arrOrderDetails: menuItem[] = [];
            this.dataService.getSubCollection(id).subscribe(actionArray => {
              arrOrderDetails = actionArray.map(item => {
                  return {
                    id: item.payload.doc.id,
                    ...item.payload.doc.data()
                  } as menuItem;
                });
                let i: number = 0;
                arrOrderDetails.forEach(
                  item => {


                    if (item.name.length > this.maxLengthFoodName) { // if name of food needed to split
                      let partNameToOut: string = '';
                      let arrToSplit: string[] = item.name.split(' ');
                      arrToSplit.forEach(
                        element => {
                          if ((partNameToOut+element+' ').length < this.maxLengthFoodName) {
                            partNameToOut += element+' ';
                          } else {
                            this.header += partNameToOut+'\n';
                            partNameToOut = '';
                          }
                        }
                      )
                    } else { // if name of food not to split
                      let Sqty: number = item.qty * 1.0; //default value;
                      let space_qty: string = '   ';
                      let space_sum: string = '       ';
                      if (item.qty >= 10 && item.qty <= 99) {space_qty = '  '}
                      if (item.qty > 99) {space_qty = ' '};
                      let qty = Sqty.toFixed(2);
                      let sSum: number = (item.qty * item.price);
                      let sum = sSum.toFixed(2);
                      if (sSum >= 10 && item.qty <= 99) {space_sum = '      '}
                      if (sSum >= 100) {space_sum = '     '}
                      this.header += this.addSpace(item.name, this.maxLengthFoodName, 'af')+
                      space_qty+qty+space_sum+sum+'\n'
                    }

                  }
                )
                //console.log(arrOrderDetails)
                copy(this.header) 
                //console.log(this.printRows)
              });

          
          }
        )

      
      }
    )
  }

  addSpace(txt: string, needLenght: number, key: string) {
    if ((txt.length) < needLenght) {
      //console.log(txt + ' '.repeat(needLenght - (txt.length)))
      if (key == 'af') {
        return  txt + ' '.repeat(needLenght - (txt.length));
      } else {
        return  ' '.repeat(needLenght - (txt.length)) + txt;
      }
      
    }
    return txt;
  }

  delteOrder(id: string) {

  }

  getDocName(id: string) {
    console.log(this.firestore.collection('orders').doc(id).ref.id )
  }

  isInt(n: number) {
    return n % 1 === 0;
  }
}