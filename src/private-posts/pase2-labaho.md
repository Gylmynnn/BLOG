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


# API Draft Feature

## Base Path

```
/product/{type}

`type` = `package` | `vehicle` | `trip` | `property` | `boat`
```

---
<br/>

## Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/product/{type}` | MITRA, ADMIN | Buat baru (draft/publish) |
| `PATCH` | `/product/{type}/:id` | MITRA, ADMIN | Update produk |
| `PATCH` | `/product/{type}/:id/publish` | MITRA, ADMIN | Publikasi draft |
| `GET` | `/product/{type}` | — | List public (published only) |
| `GET` | `/product/{type}/business/:id` | MITRA, ADMIN | List mitra (draft + published) |
| `GET` | `/product/{type}/:id` | — | Detail produk |
| `DELETE` | `/product/{type}/:id` | MITRA, ADMIN | Hapus (soft delete) |

---

<br/>

## Create — Full Body Request Example

### Vehicle (`multipart/form-data`)

```
Example :
POST /product/vehicle
```

| Key | Value | Keterangan |
|-----|-------|------------|
| `categoryId` | `550e8400-e29b-41d4-a716-446655440000` | UUID kategori |
| `typeId` | `550e8400-e29b-41d4-a716-446655440001` | UUID tipe |
| `mitraBusinessId` | `550e8400-e29b-41d4-a716-446655440002` | UUID bisnis |
| `code` | `VHC-001` | Kode produk |
| `name` | `Toyota Avanza 2024` | Nama produk |
| `price` | `350000` | Harga |
| `priceType` | `PER_DAY` | `PER_DAY` / `PER_HOUR` / `PER_PERSON` |
| `discountType` | `0` | Tipe diskon |
| `discount` | `0` | Nilai diskon *(opsional)* |
| `description` | `Mobil nyaman untuk keluarga` | Deskripsi *(opsional)* |
| `activeStatus` | `1` | Status aktif |
| `engineCapacity` | `1500` | Kapasitas mesin |
| `transmissionType` | `MANUAL` | `MANUAL` / `AUTOMATIC` |
| `brandId` | `550e8400-e29b-41d4-a716-446655440003` | UUID merk |
| `fuelType` | `GASOLINE` | `GASOLINE` / `DIESEL` / `ELECTRIC` |
| `bodyType` | `MPV` | Tipe bodi |
| `releaseYear` | `2024` | Tahun rilis |
| `color` | `Putih` | Warna |
| `qty` | `3` | Jumlah stok |
| `facilities` | `["id1","id2"]` | JSON array UUID |
| `documentIds` | `["id1","id2"]` | JSON array UUID |
| `terms` | `[{"title":"S1","description":"D1"}]` | JSON array object |
| `supportRefund` | `1` | Dukung refund *(opsional)* |
| `refundTerms` | `Refund max 24 jam` | Ketentuan refund *(opsional)* |
| `publish` | `false` / `true` | **`false` = draft, `true` = publish** |
| `images` | *(file)* | Upload file (bisa multiple) |

---

<br/>

**Untuk type lain** — field menyesuaikan per tipe:
- `trip` → `day`, `startDate`, `title`
- `property` → `size`, `bedType`, `rooms`
- `boat` → `capacity`, `boatType`
- `package` → `url`, `startDate`, `endDate`
Semua tetap wajib kirim `publish` sebagai penentu status draft/publish.

---

<br/>

## Key Rules

| Kondisi | Status | Perilaku |
|---------|--------|----------|
| `publish: false` *(default)* | `DRAFT` | Hanya terlihat di dashboard mitra |
| `publish: true` | `PUBLISHED` | Langsung tampil di publik |
| Update draft | `DRAFT` | `draftSavedAt` otomatis diperbarui |
| Saat publish | `PUBLISHED` | Backend validasi mandatory fields sesuai tipe produk |
