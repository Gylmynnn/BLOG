---
title: Labaho 2
description: Labaho phase 2
date: "2026-06-05"
categoris:
  - programming
published: true
visibility: private
password: "hihihi"
---

<script>
    import Images from "../lib/components/images.svelte";
</script>

<Images src="https://picsum.photos/1920/1080" alt="error"></Images>

<br/>


# DRAFT FEATURE - PENJELASAN LENGKAP LOGIC

## 📋 Overview

Dokumen ini menjelaskan secara detail tentang:
- Bagaimana field menjadi optional saat DRAFT
- Flow loading data draft
- Kapan dan bagaimana check draft sebelum tambah data baru
- Validasi field di setiap tahap

---

## 1. STATUS DRAFT = FIELD OPTIONAL ✅

### Konsep Utama

```
STATUS: DRAFT       → Semua fields OPTIONAL (partial data diperbolehkan)
STATUS: PUBLISHED   → Semua fields REQUIRED (complete data wajib)
```

### Alasan

Draft adalah **"work-in-progress"**. User bisa:
- Input nama produk saja, belum ada harga ✅
- Input harga saja, belum ada deskripsi ✅
- Input beberapa field saja ✅
- Keluar aplikasi kapan saja ✅
- Lanjutkan nanti ✅

---

## 2. VALIDASI FIELD - TIGA TAHAP

### Tahap 1: CREATE DRAFT (publish=false)

**Tidak ada validasi mandatory**

```json
POST /product/package
{
  "publish": false,
  "name": "Optional - bisa kosong",
  "price": "Optional - bisa kosong",
  "description": "Optional",
  "categoryId": "Optional",
  "typeId": "Optional",
  "facilities": "Optional",
  "terms": "Optional",
  "productPackage": "Optional"
}
```

**Response:**
```json
{
  "success": true,
  "code": "CREATED",
  "message": "Product saved as draft",
  "data": {
    "id": "uuid-123",
    "status": "DRAFT",
    "activeStatus": 0,
    "draftSavedAt": "2024-06-04T12:30:00Z",
    "publishedAt": null
  }
}
```

---

### Tahap 2: UPDATE DRAFT (PATCH)

**Tetap tidak ada validasi mandatory** - hanya update field yang dikirim

```json
PATCH /product/package/{productId}
{
  "publish": false,
  "name": "Updated Name",
  "description": "Updated Description"
}
```

**Behavior:**
- Hanya update fields yang dikirim
- `draftSavedAt` di-update ke waktu sekarang
- Status tetap DRAFT
- Validasi: TIDAK ADA

**Response:**
```json
{
  "success": true,
  "code": "OK",
  "message": "Product updated successfully",
  "data": {
    "id": "uuid-123",
    "status": "DRAFT",
    "draftSavedAt": "2024-06-04T12:35:00Z"
  }
}
```

---

### Tahap 3: PUBLISH DRAFT (endpoint khusus)

**Validasi LENGKAP dan WAJIB**

```
PATCH /product/package/{productId}/publish
```

**Semua field berikut WAJIB ada:**

| Field | Validasi |
|-------|----------|
| `name` | Tidak boleh kosong |
| `price` | Harus > 0 |
| `priceType` | Harus dipilih |
| `categoryId` | Harus ada (valid UUID) |
| `typeId` | Harus ada (valid UUID) |
| `startDate` | Required (ada di productPackage) |
| `endDate` | Required (ada di productPackage) |
| `url` | Required (ada di productPackage) |
| `productImage` | Minimal 1 gambar |

**Jika Validation PASS:**
```json
{
  "success": true,
  "code": "OK",
  "message": "Product published successfully",
  "data": {
    "id": "uuid-123",
    "status": "PUBLISHED",
    "activeStatus": 1,
    "draftSavedAt": null,
    "publishedAt": "2024-06-04T12:40:00Z"
  }
}
```

**Jika Validation FAIL:**
```json
{
  "success": false,
  "code": "BAD_REQUEST",
  "message": "Cannot publish product - missing or invalid required fields",
  "data": {
    "missingFields": ["price", "startDate", "url"],
    "details": {
      "price": "Price must be greater than 0",
      "startDate": "Start date is required",
      "url": "Package URL is required"
    }
  }
}
```

---

## 3. LOADING DATA DRAFT - FLOW LENGKAP

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│ USER: Ingin tambah produk baru                                       │
└─────────────────────────────────────────────────────────────────────┘
                                    ↓
                    ┌───────────────────────────────┐
                    │ Frontend: Check existing draft?│
                    │ GET /product/package/business/ │
                    │ {businessId}?page=1&limit=100  │
                    └───────────────────────────────┘
                                    ↓
            ┌───────────────────────────────────────────────┐
            │ Response: [                                    │
            │   { status: "DRAFT", id: "uuid-1", ... },    │
            │   { status: "PUBLISHED", id: "uuid-2", ... } │
            │ ]                                              │
            └───────────────────────────────────────────────┘
                                    ↓
            ┌───────────────────────────────────────────────┐
            │ Filter: const drafts = data.filter(p =>       │
            │         p.status === 'DRAFT')                 │
            └───────────────────────────────────────────────┘
                                    ↓
                    ┌──────────────────────────────┐
              YES   │ Ada draft yang unsaved?       │ NO
              ↓     └──────────────────────────────┘ ↓
    ┌───────────────┐                    ┌────────────────────┐
    │ Show Dialog:  │                    │ New Product Form   │
    │ "Ada draft    │                    │ (Kosong)           │
    │  lama, mau:   │                    │                    │
    │ 1. Lanjutkan" │                    └────────────────────┘
    │ 2. Buat Baru" │                             ↓
    └───────────────┘                    ┌────────────────────┐
           ↓                              │ User input data    │
         YES    ↓ NO                      │ (bisa partial)     │
         ↓      │                         │                    │
    Load Draft  Buat Baru                 │ Klik "Save Draft"  │
    Data        Form Kosong               └────────────────────┘
         ↓      ↓
         └──────┴────────────────────────────────┐
                                                 ↓
                    ┌────────────────────────────────────┐
                    │ POST /product/package              │
                    │ Body: {                            │
                    │   publish: false,                  │
                    │   name: "...",                     │
                    │   price: "...",                    │
                    │   ... (partial or complete)        │
                    │ }                                  │
                    └────────────────────────────────────┘
                                    ↓
                    ┌────────────────────────────────────┐
                    │ Backend:                           │
                    │ - Insert ke DB                     │
                    │ - status = 'DRAFT'                 │
                    │ - activeStatus = 0                 │
                    │ - draftSavedAt = now()             │
                    │ - NO validation                    │
                    └────────────────────────────────────┘
                                    ↓
                    ┌────────────────────────────────────┐
                    │ Response: {                        │
                    │   id: "uuid-123",                  │
                    │   status: "DRAFT",                 │
                    │   draftSavedAt: "..."              │
                    │ }                                  │
                    └────────────────────────────────────┘
                                    ↓
                    ┌────────────────────────────────────┐
                    │ Email: "Draft saved successfully"  │
                    │ CTA: "View Draft" atau "Edit"      │
                    └────────────────────────────────────┘
                                    ↓
                    ┌────────────────────────────────────┐
                    │ USER: Keluar aplikasi              │
                    │ (data tersimpan di server)         │
                    └────────────────────────────────────┘
                                    ↓
        ┌───────────────────────────────────────────────────────────┐
        │ KEMUDIAN: User login kembali                              │
        └───────────────────────────────────────────────────────────┘
                                    ↓
                    ┌────────────────────────────────────┐
                    │ Frontend: Buka "My Drafts"         │
                    │ GET /product/package/business/     │
                    │ {businessId}?status=DRAFT          │
                    └────────────────────────────────────┘
                                    ↓
                    ┌────────────────────────────────────┐
                    │ Response: [                        │
                    │   {                                │
                    │     id: "uuid-123",                │
                    │     name: "Product Name",          │
                    │     status: "DRAFT",               │
                    │     draftSavedAt: "..."            │
                    │   }                                │
                    │ ]                                  │
                    └────────────────────────────────────┘
                                    ↓
                    ┌────────────────────────────────────┐
                    │ Display: Daftar draft products     │
                    │ User klik salah satu               │
                    └────────────────────────────────────┘
                                    ↓
                    ┌────────────────────────────────────┐
                    │ GET /product/package/{productId}   │
                    │ Fetch detail draft product         │
                    └────────────────────────────────────┘
                                    ↓
                    ┌────────────────────────────────────┐
                    │ Frontend: Populate form dengan     │
                    │ data yang ada di draft             │
                    │ (field yang kosong = empty)        │
                    └────────────────────────────────────┘
                                    ↓
                    ┌────────────────────────────────────┐
                    │ User update fields yang belum      │
                    │ lengkap                            │
                    │                                    │
                    │ Klik "Save Draft" lagi             │
                    └────────────────────────────────────┘
                                    ↓
                    ┌────────────────────────────────────┐
                    │ PATCH /product/package/{productId} │
                    │ Body: {                            │
                    │   publish: false,                  │
                    │   fieldYangUpdated: "..."          │
                    │ }                                  │
                    └────────────────────────────────────┘
                                    ↓
                    ┌────────────────────────────────────┐
                    │ Backend:                           │
                    │ - Merge data lama + data baru      │
                    │ - draftSavedAt = now()             │
                    │ - status tetap DRAFT               │
                    │ - NO validation                    │
                    └────────────────────────────────────┘
                                    ↓
                    ┌────────────────────────────────────┐
                    │ Apakah semua field sudah lengkap?  │
                    └────────────────────────────────────┘
                           ↓
             ┌─────────────────────────────────┐
        YES  │ Klik "Publish Now"              │ NO
        ↓    └─────────────────────────────────┘ ↓
             ↓                         Lanjutkan edit
    ┌────────────────────────────┐    nanti
    │ PATCH /product/package/    │
    │ {productId}/publish        │
    └────────────────────────────┘
             ↓
    ┌────────────────────────────┐
    │ Backend: FULL VALIDATION   │
    │ (semua field wajib lengkap)│
    └────────────────────────────┘
             ↓
    ┌────────────┬──────────────┐
    │ PASS ✅    │ FAIL ❌      │
    └────────────┴──────────────┘
       ↓                ↓
    PUBLISHED      Validation Error
    Email: OK      Email: "Missing fields"
                   Show user fields apa yang kurang
```

---

## 4. CHECK DRAFT SEBELUM CREATE - IMPLEMENTATION

### Scenario: User Ingin Tambah Produk Baru

#### Step 1: Frontend Check Draft
```typescript
// ProductService (Frontend)
async checkAndHandleDraft(businessId: string) {
  // Get all products (DRAFT + PUBLISHED)
  const response = await this.http.get(
    `/product/package/business/${businessId}`
  );
  
  // Filter hanya DRAFT
  const draftProducts = response.data.filter(
    p => p.status === 'DRAFT'
  );
  
  if (draftProducts.length > 0) {
    // Ada draft lama
    return {
      hasDraft: true,
      drafts: draftProducts
    };
  }
  
  return { hasDraft: false, drafts: [] };
}
```

#### Step 2: Show Dialog ke User
```typescript
// ProductComponent (Frontend)
async onAddNewProduct() {
  const draftCheck = await this.productService.checkAndHandleDraft(
    this.businessId
  );
  
  if (draftCheck.hasDraft) {
    // Show dialog
    const result = await this.dialog.open(DraftDialogComponent, {
      data: { drafts: draftCheck.drafts }
    });
    
    if (result.action === 'CONTINUE') {
      // Load draft ke form
      const draft = result.selectedDraft;
      this.loadDraftToForm(draft.id);
    } else if (result.action === 'NEW') {
      // Buat produk baru (form kosong)
      this.createNewProduct();
    }
  } else {
    // Langsung ke form kosong
    this.createNewProduct();
  }
}
```

#### Step 3: Load Draft ke Form
```typescript
// ProductComponent (Frontend)
async loadDraftToForm(productId: string) {
  const product = await this.productService.getProductDetail(productId);
  
  // Populate form dengan data draft
  this.form.patchValue({
    name: product.name || '',
    price: product.price || '',
    description: product.description || '',
    categoryId: product.categoryId || '',
    typeId: product.typeId || '',
    // ... field lainnya
  });
  
  // Store product ID untuk update nanti
  this.currentProductId = product.id;
  
  // Show info: "Editing draft from {draftSavedAt}"
  this.showInfo(`Editing draft saved at ${product.draftSavedAt}`);
}
```

#### Step 4: Save as Draft atau Publish
```typescript
// ProductComponent (Frontend)

// Option A: Save as Draft (partial data OK)
async saveDraft() {
  const formData = this.form.getRawValue();
  
  if (this.currentProductId) {
    // Update existing draft
    await this.productService.updateProduct(
      this.currentProductId,
      {
        ...formData,
        publish: false
      }
    );
  } else {
    // Create new draft
    await this.productService.createProduct({
      ...formData,
      publish: false
    });
  }
  
  this.showSuccess('Draft saved');
}

// Option B: Publish (full validation)
async publishProduct() {
  if (!this.currentProductId) {
    this.showError('No draft to publish');
    return;
  }
  
  try {
    await this.productService.publishProduct(
      this.currentProductId
    );
    this.showSuccess('Product published!');
    this.router.navigate(['/products']);
  } catch (error) {
    // Show validation errors
    this.showValidationErrors(error.data.details);
  }
}
```

---

## 5. BACKEND IMPLEMENTATION

### Service Methods

#### `create(userId, dto, files)`
```typescript
async create(userId: string, dto: CreateProductDto, files?: any[]) {
  // Check authorization
  if (!this.canCreateProduct(userId, dto.mitraBusinessId)) {
    throw new ForbiddenException('Not authorized');
  }
  
  // Determine status based on publish flag
  const status = dto.publish ? 'PUBLISHED' : 'DRAFT';
  const activeStatus = dto.publish ? 1 : 0;
  const now = new Date();
  
  // Create product
  const product = await this.prisma.product.create({
    data: {
      name: dto.name || 'Unnamed Draft',
      price: dto.price || 0,
      priceType: dto.priceType,
      categoryId: dto.categoryId,
      typeId: dto.typeId,
      mitraBusinessId: dto.mitraBusinessId,
      description: dto.description,
      discountType: dto.discountType || 0,
      discount: dto.discount || 0,
      code: dto.code,
      url: dto.url,
      status, // 'DRAFT' atau 'PUBLISHED'
      activeStatus,
      draftSavedAt: status === 'DRAFT' ? now : null,
      publishedAt: status === 'PUBLISHED' ? now : null,
      userId,
      // ... field lainnya
    }
  });
  
  // Handle files, facilities, terms
  if (files?.length > 0) {
    await this.handleProductImages(product.id, files);
  }
  
  if (dto.facilities?.length > 0) {
    await this.handleProductFacilities(product.id, dto.facilities);
  }
  
  if (dto.terms?.length > 0) {
    await this.handleProductTerms(product.id, dto.terms);
  }
  
  // Send email notification
  if (status === 'DRAFT') {
    await this.emailService.sendDraftSavedEmail(
      userId,
      product
    );
  } else if (status === 'PUBLISHED') {
    await this.emailService.sendProductPublishedEmail(
      userId,
      product
    );
  }
  
  return product;
}
```

#### `update(productId, userId, dto, files)`
```typescript
async update(
  productId: string,
  userId: string,
  dto: UpdateProductDto,
  files?: any[]
) {
  // Get existing product
  const product = await this.prisma.product.findUnique({
    where: { id: productId }
  });
  
  if (!product) {
    throw new NotFoundException('Product not found');
  }
  
  // Check authorization
  if (!this.canUpdateProduct(userId, product.mitraBusinessId)) {
    throw new ForbiddenException('Not authorized');
  }
  
  // Prepare update data
  const updateData: any = {
    name: dto.name ?? product.name,
    price: dto.price ?? product.price,
    priceType: dto.priceType ?? product.priceType,
    categoryId: dto.categoryId ?? product.categoryId,
    typeId: dto.typeId ?? product.typeId,
    description: dto.description ?? product.description,
    // ... field lainnya
  };
  
  // PENTING: Jaga status tetap, tapi update timestamp untuk DRAFT
  if (product.status === 'DRAFT') {
    updateData.draftSavedAt = new Date(); // Update waktu draft
  }
  
  // Update product
  const updatedProduct = await this.prisma.product.update({
    where: { id: productId },
    data: updateData
  });
  
  // Handle files if provided
  if (files?.length > 0) {
    await this.handleProductImages(productId, files);
  }
  
  // Handle facilities if provided
  if (dto.facilities?.length > 0) {
    await this.handleProductFacilities(productId, dto.facilities);
  }
  
  return updatedProduct;
}
```

#### `publish(productId, userId)`
```typescript
async publish(productId: string, userId: string) {
  // Get product
  const product = await this.prisma.product.findUnique({
    where: { id: productId },
    include: {
      productPackage: true,
      productImage: true
    }
  });
  
  if (!product) {
    throw new NotFoundException('Product not found');
  }
  
  // Check authorization
  if (!this.canPublish(userId, product.userId, product.mitraBusinessId)) {
    throw new ForbiddenException('Not authorized to publish');
  }
  
  // FULL VALIDATION
  const validation = this.validateProductComplete(product);
  
  if (!validation.isValid) {
    // Send failure email
    await this.emailService.sendPublishFailedEmail(
      userId,
      product,
      validation.errors
    );
    
    throw new BadRequestException({
      message: 'Cannot publish product - missing or invalid required fields',
      missingFields: Object.keys(validation.errors),
      details: validation.errors
    });
  }
  
  // Publish
  const publishedProduct = await this.prisma.product.update({
    where: { id: productId },
    data: {
      status: 'PUBLISHED',
      activeStatus: 1,
      publishedAt: new Date(),
      draftSavedAt: null
    }
  });
  
  // Send success email
  await this.emailService.sendProductPublishedEmail(
    userId,
    publishedProduct
  );
  
  return publishedProduct;
}
```

#### `validateProductComplete(product)`
```typescript
private validateProductComplete(product: any) {
  const errors: Record<string, string> = {};
  
  if (!product.name?.trim()) {
    errors.name = 'Product name is required';
  }
  
  if (!product.price || product.price <= 0) {
    errors.price = 'Price must be greater than 0';
  }
  
  if (!product.priceType) {
    errors.priceType = 'Price type is required';
  }
  
  if (!product.categoryId) {
    errors.categoryId = 'Category is required';
  }
  
  if (!product.typeId) {
    errors.typeId = 'Type is required';
  }
  
  // Check ProductPackage
  if (!product.productPackage || product.productPackage.length === 0) {
    errors.productPackage = 'Product package is required';
  } else {
    const pkg = product.productPackage[0];
    if (!pkg.startDate) errors.startDate = 'Start date is required';
    if (!pkg.endDate) errors.endDate = 'End date is required';
    if (!pkg.url?.trim()) errors.url = 'Package URL is required';
  }
  
  // Check Image
  if (!product.productImage || product.productImage.length === 0) {
    errors.productImage = 'At least 1 image is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
```

#### `findAll` (Public - hanya PUBLISHED)
```typescript
async findAll(
  page: number = 1,
  limit: number = 10,
  search?: string,
  categoryId?: string
) {
  const skip = (page - 1) * limit;
  
  // PENTING: Filter hanya PUBLISHED
  const where: any = {
    status: 'PUBLISHED',
    activeStatus: 1,
    deleteStatus: 0
  };
  
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } }
    ];
  }
  
  if (categoryId) {
    where.categoryId = categoryId;
  }
  
  const [data, total] = await Promise.all([
    this.prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: {
        productImage: { take: 1 },
        category: true,
        type: true
      }
    }),
    this.prisma.product.count({ where })
  ]);
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}
```

#### `findAllByMitraBusiness` (Admin View - DRAFT + PUBLISHED)
```typescript
async findAllByMitraBusiness(
  businessId: string,
  userId: string,
  page: number = 1,
  limit: number = 10
) {
  // Check user permission
  const isAdmin = await this.isUserAdmin(userId);
  const isMitraOfBusiness = await this.isMitraOfBusiness(
    userId,
    businessId
  );
  
  if (!isAdmin && !isMitraOfBusiness) {
    throw new ForbiddenException(
      'Not authorized to view this business products'
    );
  }
  
  const skip = (page - 1) * limit;
  
  // PENTING: TIDAK filter status - ambil BOTH DRAFT dan PUBLISHED
  const where: any = {
    mitraBusinessId: businessId,
    deleteStatus: 0
  };
  
  const [data, total] = await Promise.all([
    this.prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: {
        productImage: { take: 1 },
        category: true,
        type: true
      },
      orderBy: {
        draftSavedAt: 'desc' // DRAFT muncul paling atas
      }
    }),
    this.prisma.product.count({ where })
  ]);
  
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}
```

---

## 6. DATABASE LEVEL

### Tabel Structure
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Field yang sudah ada
  name VARCHAR(255) NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  priceType VARCHAR(50),
  categoryId UUID NOT NULL,
  typeId UUID NOT NULL,
  mitraBusinessId UUID NOT NULL,
  description TEXT,
  code VARCHAR(50),
  url VARCHAR(255),
  discountType INT DEFAULT 0,
  discount DECIMAL(10,2) DEFAULT 0,
  userId UUID NOT NULL,
  activeStatus INT DEFAULT 0,
  deleteStatus INT DEFAULT 0,
  
  -- Field baru untuk DRAFT
  status VARCHAR(20) NOT NULL DEFAULT 'PUBLISHED',
  draftSavedAt TIMESTAMP NULL,
  publishedAt TIMESTAMP NULL,
  
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_category FOREIGN KEY (categoryId) REFERENCES categories(id),
  CONSTRAINT fk_type FOREIGN KEY (typeId) REFERENCES types(id),
  CONSTRAINT fk_business FOREIGN KEY (mitraBusinessId) REFERENCES mitra_business(id),
  CONSTRAINT fk_user FOREIGN KEY (userId) REFERENCES users(id)
);

-- Index untuk query lebih cepat
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_status_active ON products(status, activeStatus, deleteStatus);
CREATE INDEX idx_products_business ON products(mitraBusinessId, status);
CREATE INDEX idx_products_draft_saved_at ON products(draftSavedAt DESC);
```

### Migration
```sql
-- Migration: add_draft_status_to_products

ALTER TABLE products
ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'PUBLISHED';

ALTER TABLE products
ADD COLUMN draftSavedAt TIMESTAMP NULL;

ALTER TABLE products
ADD COLUMN publishedAt TIMESTAMP NULL;

-- Set publishedAt untuk existing products yang active
UPDATE products
SET publishedAt = createdAt
WHERE activeStatus = 1 AND status = 'PUBLISHED';

-- Create indexes
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_status_active ON products(status, activeStatus, deleteStatus);
CREATE INDEX idx_products_business ON products(mitraBusinessId, status);
CREATE INDEX idx_products_draft_saved_at ON products(draftSavedAt DESC);
```

---

## 7. EMAIL NOTIFICATIONS

### Email 1: Draft Saved
```
Subject: Draft Product Saved - Labaho

Template:
┌─────────────────────────────────────────────┐
│ Draft Saved Successfully                    │
│                                             │
│ Hi {userName},                              │
│                                             │
│ Your product "{productName}" has been       │
│ saved as a draft.                           │
│                                             │
│ You can continue editing it anytime and     │
│ publish when all fields are complete.       │
│                                             │
│ Last saved: {draftSavedAt}                  │
│                                             │
│ [View Draft] [Edit Product]                 │
│                                             │
│ Thanks,                                     │
│ Labaho Team                                 │
└─────────────────────────────────────────────┘
```

### Email 2: Product Published
```
Subject: Product Published Successfully - Labaho

Template:
┌─────────────────────────────────────────────┐
│ Product Published Successfully              │
│                                             │
│ Hi {userName},                              │
│                                             │
│ Your product "{productName}" has been       │
│ published and is now live!                  │
│                                             │
│ Customers can now see and book your product.│
│                                             │
│ Published at: {publishedAt}                 │
│                                             │
│ [View Product] [View Dashboard]             │
│                                             │
│ Thanks,                                     │
│ Labaho Team                                 │
└─────────────────────────────────────────────┘
```

### Email 3: Publish Failed (Validation Error)
```
Subject: Could Not Publish Product - Missing Fields - Labaho

Template:
┌──────────────────────────────────────────────┐
│ Cannot Publish Product                       │
│                                              │
│ Hi {userName},                               │
│                                              │
│ Your product "{productName}" has missing     │
│ or invalid fields that need to be completed  │
│ before publishing.                           │
│                                              │
│ Missing Fields:                              │
│ • Product name                               │
│ • Price (must be > 0)                        │
│ • Start date                                 │
│ • At least 1 image                           │
│                                              │
│ [Edit Product]                               │
│                                              │
│ Complete these fields and try again.         │
│                                              │
│ Thanks,                                      │
│ Labaho Team                                  │
└──────────────────────────────────────────────┘
```

---

## 8. QUICK REFERENCE - VALIDATION RULES

### Saat CREATE/UPDATE DRAFT
```
✅ Semua field OPTIONAL
✅ Partial data ALLOWED
✅ User bisa keluar kapan saja
✅ Data tersimpan di server
⛔ TIDAK ada validasi mandatory
⛔ TIDAK mengubah activeStatus
```

### Saat PUBLISH
```
✅ Semua field WAJIB ada
✅ Full validation dilakukan
✅ Status → PUBLISHED, activeStatus → 1
✅ publishedAt di-set ke sekarang
✅ Email notification dikirim
⛔ Jika validation fail: error response + email
```

### Saat GET Products
```
PUBLIC (/product/package):
  ✅ Hanya PUBLISHED products
  ✅ DRAFT tidak tampil

ADMIN (/product/package/business/{id}):
  ✅ DRAFT dan PUBLISHED keduanya
  ✅ Filter by businessId
  ✅ DRAFT muncul paling atas (orderBy draftSavedAt DESC)
```

---

## 9. TESTING CHECKLIST

### Unit Tests
- [ ] Create with publish=false → status='DRAFT'
- [ ] Create with publish=true → status='PUBLISHED'
- [ ] Update DRAFT → draftSavedAt updated
- [ ] Update PUBLISHED → timestamps unchanged
- [ ] Publish complete draft → success, status='PUBLISHED'
- [ ] Publish incomplete draft → validation error with details
- [ ] Publish unauthorized user → forbidden error
- [ ] GET /product/package → hanya PUBLISHED
- [ ] GET /product/package/business → DRAFT + PUBLISHED
- [ ] Email notifications terkirim

### Manual Testing Scenarios
```
Scenario 1: Create & Save Draft
1. Open form, input name saja
2. Click "Save Draft"
3. Check: status=DRAFT, activeStatus=0, draftSavedAt set
4. Check: email terkirim "Draft saved"
5. ✅ Keluar & login kembali
6. Check: draft masih ada di "My Drafts"

Scenario 2: Update Draft
1. Buka draft dari Scenario 1
2. Add more fields (description, price)
3. Click "Save Draft"
4. Check: draftSavedAt updated
5. ✅ Data baru tersimpan

Scenario 3: Publish Complete Draft
1. Buka draft yang sudah lengkap semua fields
2. Click "Publish"
3. Check: status=PUBLISHED, activeStatus=1, publishedAt set
4. Check: email terkirim "Product published"
5. ✅ Product muncul di public list

Scenario 4: Publish Incomplete Draft
1. Buka draft yang belum lengkap (missing startDate, no image)
2. Click "Publish"
3. Check: error response dengan missing fields list
4. Check: email terkirim "Publish failed - missing fields"
5. ✅ Status tetap DRAFT

Scenario 5: Public View
1. Get /product/package
2. Check: hanya PUBLISHED products muncul
3. ✅ DRAFT products tidak muncul

Scenario 6: Admin View
1. Get /product/package/business/{id}
2. Check: DRAFT dan PUBLISHED keduanya muncul
3. Check: DRAFT muncul di atas (newer first)
4. ✅ Bisa lihat dan manage semua products
```

---

## Summary

| Aspek | DRAFT | PUBLISHED |
|-------|-------|-----------|
| **Field Validation** | ❌ Tidak ada | ✅ Lengkap |
| **Partial Data** | ✅ Boleh | ❌ Tidak boleh |
| **activeStatus** | 0 | 1 |
| **Visible Public** | ❌ Tidak | ✅ Ya |
| **Edit Kapan Saja** | ✅ Ya | ✅ Ya (tapi tidak update status) |
| **Timestamp** | draftSavedAt | publishedAt |
| **Public List Filter** | ❌ Excluded | ✅ Included |
| **Admin View** | ✅ Visible | ✅ Visible |

---

**Dokumen ini memberikan penjelasan lengkap tentang Draft Feature logic. Silakan refer ke dokumentasi ini saat implementing atau troubleshooting!**
