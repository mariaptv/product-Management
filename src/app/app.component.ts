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
  title: any;

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
      addedDate: [null, Validators.required], // Use `null` for initial state
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
    const formValue = this.productForm.value;

    // Format date for backend as a string (yyyy-mm-dd)
    if (formValue.addedDate && typeof formValue.addedDate === 'object') {
      const { year, month, day } = formValue.addedDate;
      formValue.addedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    if (this.isEditing) {
      // Update existing product
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
    // Convert the backend date format (yyyy-mm-dd) to the format required by ngbDatepicker
    const [year, month, day] = product.addedDate.split('-').map((part: string) => parseInt(part, 10));
    const addedDate = { year, month, day };

    this.productForm.setValue({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      sku: product.sku,
      description: product.description,
      stock: product.stock,
      addedDate: addedDate, // Use the formatted date
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
