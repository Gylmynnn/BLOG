---
title: Membangun REST API Sederhana dengan Golang (Native / Tanpa Framework)
description: Panduan lengkap membangun REST API menggunakan package standar Go (`net/http`) tanpa framework eksternal.
date: "2026-04-04"
categoris:
  - Golang
  - RestAPI
  - Programming
published: true
---

<script>
    import Images from "../lib/components/images.svelte";
</script>

<Images src="/go-restapi-cover.webp" alt="error"></Images>

## Prasyarat

- Go versi 1.18 atau lebih baru sudah terinstal
- Pemahaman dasar bahasa Go
- Tools: `curl` atau Postman untuk testing

Cek instalasi Go:
```bash
go version
```

---

## Struktur Project

```
go-rest-api/
├── main.go
├── handler/
│   └── user_handler.go
├── model/
│   └── user.go
├── repository/
│   └── user_repository.go
├── router/
│   └── router.go
└── go.mod
```
<br/>
Struktur ini mengikuti prinsip **Separation of Concerns** — setiap file punya satu tanggung jawab yang jelas. Kalau nanti kamu ingin mengganti penyimpanan in-memory ke database PostgreSQL misalnya, kamu hanya perlu mengubah file `repository` tanpa menyentuh handler atau router sama sekali.

<br/>
<br/>

| Komponen | Tanggung Jawab |
|---|---|
| `main.go` | Titik masuk program, rakit semua komponen, nyalakan server |
| `router/` | Arahkan request HTTP ke handler yang tepat berdasarkan URL |
| `handler/` | Proses request, validasi input, buat response |
| `repository/` | Simpan, cari, ubah, dan hapus data |
| `model/` | Definisikan bentuk/struktur data |

---

## Langkah 1 — Inisialisasi Project

```bash
mkdir go-rest-api
cd go-rest-api
go mod init go-rest-api
```
<br/>

`mkdir` membuat folder baru, `cd` masuk ke dalamnya. Perintah `go mod init go-rest-api` adalah yang paling penting — ini membuat file `go.mod` yang memberitahu Go bahwa folder ini adalah sebuah *project* (disebut "module"). Isinya seperti identitas kartu nama project kamu. Tanpa ini, Go tidak tahu cara menghubungkan antar file dalam project.

---

## Langkah 2 — Buat Model

Buat file `model/user.go`:

<br/>

```go
package model

type User struct {
    ID    int    `json:"id"`
    Name  string `json:"name"`
    Email string `json:"email"`
}
```

<br/>

`struct` adalah cara Go mendefinisikan "bentuk" sebuah data, mirip seperti template formulir. Di sini kita mendefinisikan bahwa setiap User punya 3 kolom: `ID` (angka), `Name` (teks), dan `Email` (teks).

Bagian `` `json:"id"` `` disebut *struct tag*. Ini memberitahu Go cara menerjemahkan data ke format JSON. Jadi ketika kamu kirim response ke client, field `ID` akan muncul sebagai `"id"` (huruf kecil), bukan `"ID"`. Ini penting karena konvensi JSON menggunakan huruf kecil, sedangkan Go menggunakan huruf besar untuk nama field yang bisa diakses dari luar package (*exported field*).

---

## Langkah 3 — Buat Repository (Penyimpanan In-Memory)

Buat file `repository/user_repository.go`:

<br/>

```go
package repository

import (
    "errors"
    "go-rest-api/model"
    "sync"
)

type UserRepository struct {
    mu      sync.RWMutex
    users   map[int]model.User
    counter int
}

func NewUserRepository() *UserRepository {
    return &UserRepository{
        users: make(map[int]model.User),
    }
}

func (r *UserRepository) FindAll() []model.User {
    r.mu.RLock()
    defer r.mu.RUnlock()

    list := make([]model.User, 0, len(r.users))
    for _, u := range r.users {
        list = append(list, u)
    }
    return list
}

func (r *UserRepository) FindByID(id int) (model.User, error) {
    r.mu.RLock()
    defer r.mu.RUnlock()

    u, ok := r.users[id]
    if !ok {
        return model.User{}, errors.New("user not found")
    }
    return u, nil
}

func (r *UserRepository) Create(u model.User) model.User {
    r.mu.Lock()
    defer r.mu.Unlock()

    r.counter++
    u.ID = r.counter
    r.users[u.ID] = u
    return u
}

func (r *UserRepository) Update(id int, u model.User) (model.User, error) {
    r.mu.Lock()
    defer r.mu.Unlock()

    if _, ok := r.users[id]; !ok {
        return model.User{}, errors.New("user not found")
    }
    u.ID = id
    r.users[id] = u
    return u, nil
}

func (r *UserRepository) Delete(id int) error {
    r.mu.Lock()
    defer r.mu.Unlock()

    if _, ok := r.users[id]; !ok {
        return errors.New("user not found")
    }
    delete(r.users, id)
    return nil
}
```
<br/>

Repository adalah **lapisan penyimpanan data**. Analoginya seperti laci arsip — semua operasi simpan, cari, ubah, hapus data dilakukan di sini. Handler tidak boleh langsung menyentuh data mentah; semua harus lewat repository. Ini membuat kode lebih terorganisir dan mudah diubah di kemudian hari.

Mari kita bedah bagian-bagian pentingnya:

<br/>

```go
type UserRepository struct {
    mu      sync.RWMutex
    users   map[int]model.User
    counter int
}
```
<br/>

- `users` adalah *in-memory database* — data disimpan di RAM (bukan di file atau database sungguhan). Konsekuensinya, data akan hilang saat server dimatikan.
- `counter` adalah auto-increment ID, mirip seperti primary key di database. Setiap kali user baru dibuat, counter bertambah 1.
- `sync.RWMutex` adalah **kunci pengaman untuk concurrent access**. Bayangkan banyak orang mengakses API bersamaan — tanpa kunci ini, bisa terjadi *race condition* (dua request menulis data di waktu yang sama, hasilnya bisa rusak atau hilang). `RWMutex` membolehkan banyak goroutine membaca sekaligus (`RLock`), tapi hanya satu goroutine yang boleh menulis (`Lock`).

Lima fungsi di bawahnya mewakili operasi dasar database yang disebut **CRUD**: Create (buat), Read (baca — `FindAll` & `FindByID`), Update (ubah), Delete (hapus).

Perhatikan pola `defer r.mu.Unlock()` — kata kunci `defer` memastikan kunci selalu dilepas setelah fungsi selesai, bahkan jika terjadi error di tengah jalan. Ini mencegah *deadlock* (kondisi di mana semua goroutine saling menunggu kunci yang tidak pernah dilepas).

---

## Langkah 4 — Buat Handler

Buat file `handler/user_handler.go`:

<br/>

```go
package handler

import (
    "encoding/json"
    "go-rest-api/model"
    "go-rest-api/repository"
    "net/http"
    "strconv"
    "strings"
)

type UserHandler struct {
    repo *repository.UserRepository
}

func NewUserHandler(repo *repository.UserRepository) *UserHandler {
    return &UserHandler{repo: repo}
}

// Helper: tulis JSON response
func writeJSON(w http.ResponseWriter, status int, data any) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    json.NewEncoder(w).Encode(data)
}

// Helper: tulis error response
func writeError(w http.ResponseWriter, status int, message string) {
    writeJSON(w, status, map[string]string{"error": message})
}

// Helper: ambil ID dari path (misal: /users/3 → 3)
func extractID(path string) (int, error) {
    parts := strings.Split(strings.Trim(path, "/"), "/")
    if len(parts) < 2 {
        return 0, strconv.ErrSyntax
    }
    return strconv.Atoi(parts[len(parts)-1])
}

// GET /users
func (h *UserHandler) GetAll(w http.ResponseWriter, r *http.Request) {
    users := h.repo.FindAll()
    writeJSON(w, http.StatusOK, users)
}

// GET /users/{id}
func (h *UserHandler) GetByID(w http.ResponseWriter, r *http.Request) {
    id, err := extractID(r.URL.Path)
    if err != nil {
        writeError(w, http.StatusBadRequest, "invalid user id")
        return
    }

    user, err := h.repo.FindByID(id)
    if err != nil {
        writeError(w, http.StatusNotFound, err.Error())
        return
    }
    writeJSON(w, http.StatusOK, user)
}

// POST /users
func (h *UserHandler) Create(w http.ResponseWriter, r *http.Request) {
    var u model.User
    if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
        writeError(w, http.StatusBadRequest, "invalid request body")
        return
    }

    if u.Name == "" || u.Email == "" {
        writeError(w, http.StatusBadRequest, "name and email are required")
        return
    }

    created := h.repo.Create(u)
    writeJSON(w, http.StatusCreated, created)
}

// PUT /users/{id}
func (h *UserHandler) Update(w http.ResponseWriter, r *http.Request) {
    id, err := extractID(r.URL.Path)
    if err != nil {
        writeError(w, http.StatusBadRequest, "invalid user id")
        return
    }

    var u model.User
    if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
        writeError(w, http.StatusBadRequest, "invalid request body")
        return
    }

    updated, err := h.repo.Update(id, u)
    if err != nil {
        writeError(w, http.StatusNotFound, err.Error())
        return
    }
    writeJSON(w, http.StatusOK, updated)
}

// DELETE /users/{id}
func (h *UserHandler) Delete(w http.ResponseWriter, r *http.Request) {
    id, err := extractID(r.URL.Path)
    if err != nil {
        writeError(w, http.StatusBadRequest, "invalid user id")
        return
    }

    if err := h.repo.Delete(id); err != nil {
        writeError(w, http.StatusNotFound, err.Error())
        return
    }
    writeJSON(w, http.StatusOK, map[string]string{"message": "user deleted"})
}
```
<br/>

Handler adalah **penerima request HTTP**. Ketika ada request masuk, handler yang memutuskan: apakah data valid? Apa yang harus dilakukan? Apa yang harus dikembalikan ke client? Analoginya seperti kasir di restoran — menerima pesanan (request), meneruskan ke dapur (repository), lalu membawa makanan kembali ke meja (response).

Mari kita bedah tiga fungsi helper-nya:

<br/>

```go
func writeJSON(w http.ResponseWriter, status int, data any) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    json.NewEncoder(w).Encode(data)
}
```

<br/>

Fungsi ini mengirim response dalam format JSON. `w.Header().Set("Content-Type", "application/json")` memberitahu client bahwa isi response adalah JSON, bukan HTML atau teks biasa. `w.WriteHeader(status)` mengirim HTTP status code (misalnya `200 OK` atau `404 Not Found`). Fungsi ini dibuat agar tidak perlu menulis ulang kode yang sama di setiap handler.

<br/>

```go
func writeError(w http.ResponseWriter, status int, message string) {
    writeJSON(w, status, map[string]string{"error": message})
}
```

<br/>

Shortcut khusus untuk mengirim response error. Misalnya memanggil `writeError(w, 404, "user not found")` akan menghasilkan response `{"error": "user not found"}` dengan status `404`.

<br/>

```go
func extractID(path string) (int, error) {
    parts := strings.Split(strings.Trim(path, "/"), "/")
    if len(parts) < 2 {
        return 0, strconv.ErrSyntax
    }
    return strconv.Atoi(parts[len(parts)-1])
}
```
<br/>

Mengambil angka ID dari URL. Misalnya dari `/users/3`, fungsi ini memotong string berdasarkan tanda `/` menjadi slice `["users", "3"]`, lalu mengambil elemen terakhir `"3"` dan mengubahnya menjadi angka integer `3`.

<br/>

---

## Langkah 5 — Buat Router

Buat file `router/router.go`:

<br/>

```go
package router

import (
    "go-rest-api/handler"
    "net/http"
    "strings"
)

func NewRouter(userHandler *handler.UserHandler) http.Handler {
    mux := http.NewServeMux()

    // Route: /users dan /users/{id}
    mux.HandleFunc("/users", func(w http.ResponseWriter, r *http.Request) {
        switch r.Method {
        case http.MethodGet:
            userHandler.GetAll(w, r)
        case http.MethodPost:
            userHandler.Create(w, r)
        default:
            http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
        }
    })

    mux.HandleFunc("/users/", func(w http.ResponseWriter, r *http.Request) {
        // Pastikan ada ID setelah /users/
        parts := strings.Split(strings.Trim(r.URL.Path, "/"), "/")
        if len(parts) < 2 || parts[1] == "" {
            http.NotFound(w, r)
            return
        }

        switch r.Method {
        case http.MethodGet:
            userHandler.GetByID(w, r)
        case http.MethodPut:
            userHandler.Update(w, r)
        case http.MethodDelete:
            userHandler.Delete(w, r)
        default:
            http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
        }
    })

    return mux
}
```
<br/>

Router adalah **peta jalan** untuk request HTTP. Ketika ada request masuk ke server, router yang memutuskan handler mana yang akan dipanggil berdasarkan URL dan HTTP method-nya.

`http.NewServeMux()` adalah *multiplexer* bawaan Go — ini yang mencocokkan URL request dengan handler yang tepat. Kita mendaftarkan dua pola URL:

- `/users` — menangani request tanpa ID (GET semua user, POST buat user baru)
- `/users/` — menangani request dengan ID di belakangnya (GET, PUT, DELETE by ID). Tanda `/` di akhir penting karena di Go, pola yang diakhiri `/` akan mencocokkan semua URL yang diawali dengan pola tersebut.

Satu URL bisa menangani banyak *method* HTTP. Router memeriksa `r.Method` untuk menentukan tindakan yang tepat. `GET /users` artinya "ambil semua user", tapi `POST /users` artinya "buat user baru" — URL sama, tindakan berbeda. Ini adalah konvensi standar REST API.

<br/>

---

## Langkah 6 — Buat Main Entry Point

Buat file `main.go`:

<br/>

```go
package main

import (
    "fmt"
    "go-rest-api/handler"
    "go-rest-api/repository"
    "go-rest-api/router"
    "log"
    "net/http"
)

func main() {
    // Inisialisasi dependency
    userRepo    := repository.NewUserRepository()
    userHandler := handler.NewUserHandler(userRepo)
    mux         := router.NewRouter(userHandler)

    port := ":8080"
    fmt.Printf("Server berjalan di http://localhost%s\n", port)

    if err := http.ListenAndServe(port, mux); err != nil {
        log.Fatalf("Gagal menjalankan server: %v", err)
    }
}
```
<br/>

`main.go` adalah **titik masuk program** — kode yang pertama kali dijalankan Go. Di sini semua bagian dirakit menjadi satu, seperti memasang semua komponen mesin sebelum menyalakannya.

<br/>

```go
userRepo    := repository.NewUserRepository()  // buat "database" in-memory
userHandler := handler.NewUserHandler(userRepo) // buat handler, kasih akses ke database
mux         := router.NewRouter(userHandler)    // buat router, kasih akses ke handler
```
<br/>

Pola ini disebut **dependency injection** — setiap komponen "disuntik" dengan komponen yang dibutuhkannya. Handler butuh repository untuk mengakses data, maka repository dikirim ke handler saat pembuatan. Keuntungannya: kode lebih mudah diuji karena kita bisa mengganti implementasi tanpa mengubah logika handler.

<br/>

```go
http.ListenAndServe(":8080", mux)
```
<br/>

Perintah ini artinya: "dengarkan koneksi di port 8080, dan gunakan `mux` untuk memproses semua request yang masuk." Port 8080 adalah konvensi umum untuk server development (port 80 adalah HTTP standar, tapi butuh hak akses administrator).

<br/>

---

## Langkah 7 — Jalankan Server

```bash
go run main.go
```

<br/>

`go run` mengompilasi dan langsung menjalankan program dalam satu perintah — cocok untuk development. Untuk produksi, gunakan `go build` terlebih dahulu untuk menghasilkan file executable, lalu jalankan file tersebut.

Output:
```
Server berjalan di http://localhost:8080
```

---

## Langkah 8 — Testing dengan curl

Setelah server berjalan, buka terminal baru dan coba endpoint berikut. Ini adalah alur lengkap yang menggambarkan siklus hidup data dari create hingga delete.

### Buat User (POST)
```bash
curl -X POST http://localhost:8080/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Budi Santoso", "email": "budi@email.com"}'
```
<br/>

Flag `-X POST` menentukan HTTP method. Flag `-H` menambahkan header request. Flag `-d` mengirim data di body request. Server akan membalas dengan user yang baru dibuat, lengkap dengan ID yang di-generate otomatis.

<br/>

**Response:**
```json
{"id": 1, "name": "Budi Santoso", "email": "budi@email.com"}
```

---
### Ambil Semua User (GET)
```bash
curl http://localhost:8080/users
```

<br/>
Request GET paling sederhana — tanpa flag tambahan karena GET adalah method default curl. Response berupa array JSON, bahkan jika hanya ada satu user.

<br/>
<br/>

**Response:**
```json
[{"id": 1, "name": "Budi Santoso", "email": "budi@email.com"}]
```

---

### Ambil User Berdasarkan ID (GET)
```bash
curl http://localhost:8080/users/1
```

Angka `1` di akhir URL adalah ID user. Kalau ID tidak ditemukan, server akan membalas dengan `404 Not Found` dan pesan error.

---

### Update User (PUT)
```bash
curl -X PUT http://localhost:8080/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Budi Updated", "email": "budi.new@email.com"}'
```

PUT menggantikan seluruh data user dengan data baru yang dikirim. Perhatikan bahwa kita harus mengirim semua field (name dan email), bukan hanya field yang berubah.

---

### Hapus User (DELETE)
```bash
curl -X DELETE http://localhost:8080/users/1
```

<br/>

**Response:**
```json
{"message": "user deleted"}
```

---

## Ringkasan Endpoint

| Method   | Endpoint      | Deskripsi             |
|----------|---------------|-----------------------|
| `GET`    | `/users`      | Ambil semua user      |
| `GET`    | `/users/{id}` | Ambil user by ID      |
| `POST`   | `/users`      | Buat user baru        |
| `PUT`    | `/users/{id}` | Update user by ID     |
| `DELETE` | `/users/{id}` | Hapus user by ID      |

---

## Catatan Penting

- **Thread-safe**: Repository menggunakan `sync.RWMutex` agar aman untuk concurrent request.
- **In-memory**: Data hilang saat server direstart. Untuk produksi, gunakan database seperti PostgreSQL atau MySQL.
- **Tidak ada framework**: Hanya menggunakan `net/http`, `encoding/json`, dan package standar Go lainnya.
- **Modular**: Struktur folder dipisah per tanggung jawab (model, repository, handler, router) agar mudah dikembangkan.

---

## Langkah Selanjutnya (Opsional)

- Tambahkan koneksi database dengan `database/sql` + driver `pgx` (PostgreSQL)
- Tambahkan middleware untuk logging dan autentikasi JWT
- Tambahkan validasi input yang lebih ketat
- Buat Dockerfile untuk containerisasi
- Tulis unit test menggunakan package `testing`
