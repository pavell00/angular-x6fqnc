export class Order {
  id?: string;
  TableNo?: string = '1';
  OrderDate?: String;
  isDone?: boolean = false;
  OrderText?: string = '';
  sumOrder?: number = 0;
  discountOrder?: number = 0;
  check?: string = '';
  guests?: number = 1;
  printTime: string = '0:00';
}