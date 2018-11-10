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
  auth_token: string;

  constructor(private http: Http) {
    this.baseUrl = `${PROTOCOL}://${location.hostname}:${PORT}/`;
  }

  authenticate(user: string, pass: string): Observable<boolean> {
    return this.http.request(new Request({
      method: RequestMethod.Post,
      url: this.baseUrl + 'login',
      body: { name: user, password: pass }
    })).map(response => {
      const r = response.json();
      this.auth_token = r.success ? r.token : null;
      return r.success;
    });
  }

  getProducts(): Observable<Product[]> {
    return this.sendRequestProducts(RequestMethod.Get, 'products');
  }

  private sendRequestProducts(verb: RequestMethod, url: string, auth: boolean = false): Observable<Product[]> {
    const request = new Request({
      method: verb,
      url: this.baseUrl + url
    });

    if (auth && this.auth_token != null) {
      request.headers.set('Authorization', 'Bearer<${this.auth_token}>');
    }

    return this.http.request(request).map(response => response.json());
  }

  saveOrder(order: Order): Observable<Order> {
    return this.sendRequestOrder(RequestMethod.Post, 'orders', order);
  }

  private sendRequestOrder(verb: RequestMethod, url: string, body: Order, auth: boolean = false): Observable<Order> {
    const request = new Request({
      method: verb,
      url: this.baseUrl + url,
      body: body
    });

    if (auth && this.auth_token != null) {
      request.headers.set('Authorization', 'Bearer<${this.auth_token}>');
    }

    return this.http.request(request).map(response => response.json());
  }
}
