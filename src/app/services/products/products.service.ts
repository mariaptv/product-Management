import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private API_SERVER = "http://localhost:8080/products/"; // Base URL for the API server

  constructor(
    private httpClient: HttpClient 
  ) {}

  // Fetch all products from the backend
  public getAllProducts(): Observable<any> {
    return this.httpClient.get(this.API_SERVER); 
  }

  // Save a new product to the backend
  public saveProduct(product: any): Observable<any> {
    return this.httpClient.post(this.API_SERVER, product); 
  }

  // Delete a product by ID
  public deleteProduct(id: any): Observable<any> {
    return this.httpClient.delete(this.API_SERVER + "delete/" + id); 
  }

  // Update an existing product by ID
  public updateProduct(id: any, product: any): Observable<any> {
    return this.httpClient.put(this.API_SERVER + id, product); 
  }
}