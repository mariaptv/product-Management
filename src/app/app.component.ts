import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from './services/products/products.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Product';
  productForm!: FormGroup;
  products: any[] = [];
  categories: string[] = ['Electronics', 'Books', 'Clothing', 'Home & Kitchen', 'Sports'];
  activeTab: number = 1; // Default to the first tab

  constructor(public fb: FormBuilder, public productsService: ProductsService) {}

  ngOnInit(): void {
    this.productForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      price: [0, Validators.required],
      category: ['', Validators.required],
      sku: ['', Validators.required],
      description: ['', Validators.required],
      stock: [0, Validators.required],
      addedDate: ['', Validators.required],
    });

    this.loadProducts();
  }

  loadProducts(): void {
    this.productsService.getAllProducts().subscribe(
      (resp) => {
        this.products = resp;
        console.log(resp);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  save(): void {
    const formValue = this.productForm.value;

    // Convert the date to a string if it's an object
    if (formValue.addedDate && typeof formValue.addedDate === 'object') {
      const { year, month, day } = formValue.addedDate;
      formValue.addedDate = `${year}-${month.toString().padStart(2, '0')}-${day
        .toString()
        .padStart(2, '0')}`;
    }

    if (formValue.id) {
      // Update existing product
      this.productsService.updateProduct(formValue.id, formValue).subscribe(
        (resp) => {
          this.productForm.reset();
          this.products = this.products.map((product: any) =>
            product.id === resp.id ? resp : product
          );
          // Switch to Store Products tab
          this.activeTab = 2;
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      // Create new product
      this.productsService.saveProduct(formValue).subscribe(
        (resp) => {
          this.productForm.reset();
          this.products.push(resp);
          // Switch to Store Products tab
          this.activeTab = 2;
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  delete(product: any): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productsService.deleteProduct(product.id).subscribe(
        () => {
          this.products = this.products.filter((p: any) => p.id !== product.id);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  edit(product: any): void {
    // Convert the date string to an object for the date picker
    const dateParts = product.addedDate.split('-').map((part: string) => parseInt(part, 10));
    const addedDate = {
      year: dateParts[0],
      month: dateParts[1],
      day: dateParts[2],
    };

    this.productForm.setValue({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      sku: product.sku,
      description: product.description,
      stock: product.stock,
      addedDate: addedDate,
    });

    // Switch to Create Product tab when editing
    this.activeTab = 1;
  }
}
