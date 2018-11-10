import { Injectable } from '@angular/core';
import { Http, Request, RequestMethod } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Product } from './product.model';
import { Cart } from './cart.model';
import { Order } from './order.model';
import 'rxjs/add/operator/map';

const PROTOCOL = 'http';
const PORT = 3500;

@Injectable()
export class RestDataSource {
  baseUrl: string;
  constructor(private http: Http) {
    this.baseUrl = `${PROTOCOL}://${location.hostname}:${PORT}/`;
  }

  getProducts(): Observable<Product[]> {
    return this.sendRequestProducts(RequestMethod.Get, 'products');
  }

  private sendRequestProducts(verb: RequestMethod, url: string): Observable<Product[]> {
    return this.http.request(new Request({
      method: verb,
      url: this.baseUrl + url,
    })).map(response => response.json());
  }

  saveOrder(order: Order): Observable<Order> {
    return this.sendRequestOrder(RequestMethod.Post, 'orders', order);
  }

  private sendRequestOrder(verb: RequestMethod, url: string, body: Order): Observable<Order> {
    return this.http.request(new Request({
      method: verb,
      url: this.baseUrl + url,
      body: body
    })).map(response => response.json());
  }
}
