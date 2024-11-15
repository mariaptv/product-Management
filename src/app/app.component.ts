import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductsService } from './services/products/products.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  activeTab: number = 1; // Default to the Create Product tab
  isEditing: boolean = false; // Tracks whether we are editing a product
  productForm!: FormGroup;
  products: any[] = [];
  categories: string[] = ['Electronics', 'Books', 'Clothing', 'Home & Kitchen', 'Sports'];

  constructor(private fb: FormBuilder, private productsService: ProductsService) {}

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
      },
      (error) => {
        console.error(error);
      }
    );
  }

  save(): void {
    if (this.isEditing) {
      // Update existing product
      const formValue = this.productForm.value;
      this.productsService.updateProduct(formValue.id, formValue).subscribe(
        (resp) => {
          this.productForm.reset();
          this.isEditing = false;
          this.products = this.products.map((product) =>
            product.id === resp.id ? resp : product
          );
          this.activeTab = 2; // Switch to Store Products tab
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      // Create new product
      const formValue = this.productForm.value;
      this.productsService.saveProduct(formValue).subscribe(
        (resp) => {
          this.productForm.reset();
          this.products.push(resp);
          this.activeTab = 2; // Switch to Store Products tab
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  edit(product: any): void {
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

    this.isEditing = true; // Switch to edit mode
    this.activeTab = 1; // Switch to the Create/Edit Product tab
  }

  cancelEdit(): void {
    this.isEditing = false; // Exit edit mode
    this.productForm.reset();
  }

  delete(product: any): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productsService.deleteProduct(product.id).subscribe(
        () => {
          this.products = this.products.filter((p) => p.id !== product.id);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }
}
