import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from './services/products/products.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Corrected property name and array syntax
})
export class AppComponent implements OnInit {
  title = "Product"
  productForm!: FormGroup; 
  products: any[] = [];

  constructor(
    public fb: FormBuilder,
    public productsService: ProductsService
  ) { }

  ngOnInit(): void {
    this.productForm = this.fb.group({
      id : [''],
      name: ['', Validators.required],
      price: [0, Validators.required],
      category: ['', Validators.required],
      sku: ['', Validators.required],
      description: ['', Validators.required],
      stock: [0, Validators.required],
      addedDate: ['', Validators.required]
    }); // Removed extra semicolon

    this.productsService.getAllProducts().subscribe(
      resp => {
        this.products = resp;
        console.log(resp);
      },
      error => { console.error(error) } // Fixed arrow function syntax
    );
  }

  save(): void {
    if (this.productForm.value.id) {
      // Update existing product
      this.productsService.updateProduct(this.productForm.value.id, this.productForm.value).subscribe(
        (resp) => {
          this.productForm.reset();
          this.products = this.products.map((product: any) =>
            product.id === resp.id ? resp : product
          );
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      // Create new product
      this.productsService.saveProduct(this.productForm.value).subscribe(
        (resp) => {
          this.productForm.reset();
          this.products.push(resp);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  delete(product: any): void {
    this.productsService.deleteProduct(product.id).subscribe(
      (resp) => {
        this.products = this.products.filter((p: any) => p.id !== product.id);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  edit(product: any): void {
    this.productForm.setValue({
      id: product.id, // Include the id field
      name: product.name,
      price: product.price,
      category: product.category,
      sku: product.sku,
      description: product.description,
      stock: product.stock,
      addedDate: product.addedDate,
    });
  }
}

