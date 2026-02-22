# How Basic Details are Saved and Connected to the Backend

## Overview
The basic details of the borrower are collected through a reactive form component and saved to a backend API using Angular's HttpClient. Here's a detailed explanation of the entire process:

## 1. Form Creation and Data Collection

### Component Structure
- **Child Component**: [`BasicDetailsOfTheBorrower01Component`](src/app/components/child/basic-details-of-the-borrower-01/basic-details-of-the-borrower-01.component.ts:11)
- **Parent Component**: [`NpaFormComponent`](src/app/components/parent/npa-form/npa-form.component.ts:15)

### Form Initialization
The child component creates a reactive form using Angular's `FormBuilder`:

```typescript
// src/app/components/child/basic-details-of-the-borrower-01/basic-details-of-the-borrower-01.component.ts
ngOnInit(): void {
  this.form = this.fb.group({
    divisionName: ['', Validators.required],
    regionalOffice: [''],
    accountName: [''],
    npaClassificationDate: ['', Validators.required],
    businessActivity: [''],
    // ... other fields
    boardMembers: this.fb.array([])
  });
  this.addMember(); // Add one board member by default
}
```

### Form Fields
The form includes:
- Mandatory fields: `divisionName`, `npaClassificationDate`
- Optional fields: `regionalOffice`, `accountName`, `businessActivity`, etc.
- Dynamic fields: `boardMembers` (FormArray)

## 2. Form Submission Process

### Parent Component Handles Submission
When the user clicks "Submit", the parent component's `onSubmit()` method is triggered:

```typescript
// src/app/components/parent/npa-form/npa-form.component.ts
onSubmit(): void {
  if (this.borrowerDetails && this.borrowerDetails.form) {
    this.borrowerDetails.form.markAllAsTouched();
    
    if (this.borrowerDetails.form.valid) {
      this.isSubmitting = true;
      const formData = this.borrowerDetails.form.value;
      
      // Prepare payload
      const payload = {
        basicDetails: {
          divisionName: formData.divisionName,
          accountName: formData.accountName,
          npaDate: formData.npaClassificationDate,
          businessActivity: formData.businessActivity,
          registeredAddress: formData.registeredAddress,
          factoryRunningCondition: formData.factoryRunningCondition,
          factoryLeasedOut: formData.factoryLeasedOut,
          boardMembers: formData.boardMembers || []
        }
      };
      
      // Authentication and API call...
    }
  }
}
```

## 3. Authentication and Authorization

### Token Management
The [`AuthService`](src/app/services/auth.service.ts:14) manages authentication:

```typescript
// src/app/services/auth.service.ts
getToken(): string | null {
  return this.token;
}

isLoggedIn(): boolean {
  return !!this.token;
}
```

### API Call Headers
The request includes authentication token in the headers:

```typescript
const token = this.authService.getToken();
const headers = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};
```

## 4. Backend Communication

### API Endpoint
The data is sent to the backend API:

```typescript
this.http.post<any>('http://localhost:8080/api/npa', payload, { headers })
  .subscribe({
    next: (response) => {
      // Handle success
      console.log('NPA created successfully');
      console.log('Response:', response);
    },
    error: (error) => {
      // Handle error
      console.error('API Error:', error);
    }
  });
```

### Backend URL
- **Local Development**: `http://localhost:8080/api/npa`

## 5. Response Handling

### Success Response
The backend should return the created NPA record with an ID:

```typescript
// Response example
{
  "id": 123,
  "basicDetails": {
    "divisionName": "Example Division",
    "npaDate": "2024-01-01",
    // ... other fields
  },
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### Error Handling
Comprehensive error handling is implemented:

```typescript
error: (error) => {
  let errorMessage = 'Failed to create NPA. Please try again.';
  
  if (error.error && typeof error.error === 'string') {
    errorMessage = error.error;
  } else if (error.error && error.error.message) {
    errorMessage = error.error.message;
  }
  
  this.errorMessage = errorMessage;
}
```

## 6. Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  User Interface (HTML Form)                                 │
├─────────────────────────────────────────────────────────────┤
│  Input fields for basic details                             │
│  Board members dynamic fields                                │
│  Submit button                                               │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  Child Component                                             │
│  BasicDetailsOfTheBorrower01Component                       │
├─────────────────────────────────────────────────────────────┤
│  • Form creation with FormBuilder                           │
│  • Form validation logic                                    │
│  • Dynamic board members management                         │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  Parent Component                                           │
│  NpaFormComponent                                           │
├─────────────────────────────────────────────────────────────┤
│  • Submission handler (onSubmit)                            │
│  • Payload preparation                                      │
│  • Authentication token retrieval                           │
│  • API call using HttpClient                                │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  HTTP POST Request                                          │
├─────────────────────────────────────────────────────────────┤
│  URL: http://localhost:8080/api/npa                         │
│  Headers:                                                   │
│  - Content-Type: application/json                           │
│  - Authorization: Bearer <token>                            │
│                                                             │
│  Body:                                                      │
│  {                                                          │
│    "basicDetails": {                                        │
│      "divisionName": "Example Division",                    │
│      "npaDate": "2024-01-01",                              │
│      "accountName": "Example Account",                      │
│      "boardMembers": []                                     │
│    }                                                       │
│  }                                                          │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  Backend API (Spring Boot)                                  │
├─────────────────────────────────────────────────────────────┤
│  • Authentication middleware                                │
│  • Request validation                                       │
│  • Database persistence                                     │
│  • Response generation                                      │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│  Database (PostgreSQL)                                      │
├─────────────────────────────────────────────────────────────┤
│  Table: npas                                                │
│  Columns: id, division_name, npa_date, account_name, etc.  │
└─────────────────────────────────────────────────────────────┘
```

## Key Points

1. **Reactive Forms**: Uses Angular's reactive forms approach for better control over form state and validation.
2. **Component Communication**: Parent-child component communication via `ViewChild`.
3. **Authentication**: Token-based authentication with JWT.
4. **Error Handling**: Comprehensive error handling with user-friendly messages.
5. **Backend**: Spring Boot REST API with PostgreSQL database.
6. **Security**: CORS configuration needed if backend is on a different port/domain.

This architecture ensures a clean separation of concerns and a robust connection between the frontend form and the backend API.
