import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ProductsService } from './services/products/products.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  activeTab: number = 1; 
  isEditing: boolean = false;
  productForm!: FormGroup;
  products: any[] = []; 
  categories: string[] = ['Electronics', 'Books', 'Clothing', 'Home & Kitchen', 'Sports']; // Predefined product categories
  title: any; 

  constructor(private fb: FormBuilder, private productsService: ProductsService) {}

  ngOnInit(): void {
    // Initialize the form with validation rules
    this.productForm = this.fb.group({
      id: [''], 
      name: ['', Validators.required], 
      price: [0, Validators.required], 
      category: ['', Validators.required], 
      sku: ['', Validators.required], 
      description: ['', Validators.required], 
      stock: [0, [Validators.required, this.validateStockNotNegative]], 
      addedDate: [null, [Validators.required, this.validateDateNotFuture]], 
    });

    // Load existing products from the backend
    this.loadProducts();
  }

  // Custom Validator: Ensures the stock value is not negative
  validateStockNotNegative(control: AbstractControl): ValidationErrors | null {
    const stock = control.value;
    if (stock < 0) {
      return { negativeStock: 'Stock cannot be negative' }; // Return an error if stock is negative
    }
    return null; // Valid stock
  }

  // Custom Validator: Ensures the added date is not in the future
  validateDateNotFuture(control: AbstractControl): ValidationErrors | null {
    const addedDate = control.value;
    if (addedDate && typeof addedDate === 'object') {
      const today = new Date();
      const selectedDate = new Date(
        addedDate.year,
        addedDate.month - 1, // Month is 0-indexed
        addedDate.day
      );
      if (selectedDate > today) {
        return { futureDate: 'Date cannot be in the future' }; // Return an error if the date is in the future
      }
    }
    return null; // Valid date
  }

  // Fetches all products from the backend and stores them in the `products` array
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

  // Handles form submission for creating or updating a product
  save(): void {
    if (this.productForm.invalid) {
      return; // Stop execution if the form is invalid
    }

    const formValue = this.productForm.value;

    // Convert the date from the form to a string format (yyyy-mm-dd) for backend
    if (formValue.addedDate && typeof formValue.addedDate === 'object') {
      const { year, month, day } = formValue.addedDate;
      formValue.addedDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    }

    if (this.isEditing) {
      // If editing, update the existing product
      this.productsService.updateProduct(formValue.id, formValue).subscribe(
        (resp) => {
          this.productForm.reset(); // Clear the form
          this.isEditing = false; // Exit edit mode
          // Update the product in the products list
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
      // If creating, save a new product
      this.productsService.saveProduct(formValue).subscribe(
        (resp) => {
          this.productForm.reset(); // Clear the form
          this.products.push(resp); // Add the new product to the list
          this.activeTab = 2; // Switch to Store Products tab
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  // Fills the form with data of the product to be edited and switches to edit mode
  edit(product: any): void {
    // Convert the backend date format (yyyy-mm-dd) to the format required by the form
    const [year, month, day] = product.addedDate.split('-').map((part: string) => parseInt(part, 10));
    const addedDate = { year, month, day };

    // Set the form values
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

    this.isEditing = true; // Enable edit mode
    this.activeTab = 1; // Switch to the Create/Edit Product tab
  }

  // Cancels the editing process and clears the form
  cancelEdit(): void {
    this.isEditing = false; // Exit edit mode
    this.productForm.reset(); // Clear the form
  }

  // Deletes a product after user confirmation
  delete(product: any): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productsService.deleteProduct(product.id).subscribe(
        () => {
          // Remove the deleted product from the products list
          this.products = this.products.filter((p) => p.id !== product.id);
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }
}
