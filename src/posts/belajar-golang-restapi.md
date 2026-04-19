---
title: Membangun REST API Sederhana dengan Golang (Native / Tanpa Framework)
description: Panduan lengkap membangun REST API menggunakan package standar Go (`net/http`) tanpa framework eksternal.
date: "2025-03-04"
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

---

## Langkah 1 — Inisialisasi Project

```bash
mkdir go-rest-api
cd go-rest-api
go mod init go-rest-api
```

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

---

## Langkah 7 — Jalankan Server

```bash
go run main.go
```

<br/>

Output:
```
Server berjalan di http://localhost:8080
```

---

## Langkah 8 — Testing dengan curl

### Buat User (POST)
```bash
curl -X POST http://localhost:8080/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Budi Santoso", "email": "budi@email.com"}'
```

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

**Response:**
```json
[{"id": 1, "name": "Budi Santoso", "email": "budi@email.com"}]
```

---

### Ambil User Berdasarkan ID (GET)
```bash
curl http://localhost:8080/users/1
```

---

### Update User (PUT)
```bash
curl -X PUT http://localhost:8080/users/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Budi Updated", "email": "budi.new@email.com"}'
```

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
