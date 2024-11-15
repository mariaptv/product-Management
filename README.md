# ProductManagement

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.12.
![image](https://github.com/user-attachments/assets/a171a955-2ca3-4696-bbc6-ffbce21964c1)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

# Product Management Frontend

This is the frontend repository for the Product Management System. The application allows users to create, update, view, and delete products. It is built using Angular and connects to a backend API to perform CRUD operations.

## Features

- **Product Management**:
  - Add new products with details like name, price, category, SKU, description, stock, and added date.
  - Edit existing products.
  - Delete products.
  - View a list of all products.

- **Validation**:
  - Ensure product stock is not negative.
  - Ensure added date is not in the future.
  - Validate required fields.

- **Responsive UI**:
  - Tab-based navigation between "Create/Edit Product" and "Store Products".
  - Dynamic validation feedback.

## Technology Stack

- **Frontend Framework**: Angular
- **CSS Framework**: Bootstrap (via ng-bootstrap)
- **HTTP Client**: Angular HttpClient
- **Reactive Forms**: Angular Reactive Forms Module

## Prerequisites

- Node.js and npm installed
- Angular CLI installed (`npm install -g @angular/cli`)

## How It Works

### Components

#### AppComponent
- Provides the UI for managing products.
- Uses reactive forms for product creation and editing.
- Displays a table of products with options to edit or delete.

#### ProductsService
- Handles HTTP communication with the backend API.
- Includes methods for:
  - Fetching all products.
  - Saving a new product.
  - Updating an existing product.
  - Deleting a product.

### Validation

#### Custom Validators
- `validateStockNotNegative`: Ensures the stock quantity is not negative.
- `validateDateNotFuture`: Ensures the added date is not in the future.

#### Dynamic Error Messages
- Displays validation errors directly below input fields.

### API Endpoints

The frontend interacts with the backend using the following endpoints:

- **`GET /products/`**: Fetch all products.
- **`POST /products/`**: Save a new product.
- **`PUT /products/{id}`**: Update an existing product.
- **`DELETE /products/delete/{id}`**: Delete a product by ID.
