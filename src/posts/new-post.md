---
title: Golang Basic
description: Introduction to Golang programming.
date: "2025-02-22"
categoris:
  - golang
  - programming
published: true
---

<img src="/golang-cover.jpeg" alt="error"/>

## Sejarah Golang

Golang atau Go adalah bahasa pemrograman yang dikembangkan oleh Google pada tahun 2007 dan diumumkan secara publik pada tahun 2009. Bahasa ini dirancang oleh Robert Griesemer, Rob Pike, dan Ken Thompson dengan tujuan menciptakan bahasa yang efisien, mudah digunakan, dan memiliki performa tinggi. Golang memiliki sintaks yang sederhana namun kuat, serta mendukung concurrency dengan fitur goroutines.

## Instalasi Golang

Untuk menginstal Golang, kunjungi situs resminya:

[Download Golang](https://golang.org/dl/)

Setelah diinstal, pastikan Go telah terpasang dengan menjalankan perintah berikut di terminal:
<br>

```sh
go version
```

<br>
Jika berhasil, akan muncul versi Go yang terinstal.

## Program Pertama: "Hello, World!"

Mari kita mulai dengan membuat program sederhana untuk mencetak "Hello, World!" di Go.
<br>

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}
```

## Dasar-dasar Golang

### 1. Variabel dan Tipe Data

```go
package main

import "fmt"

func main() {
    var name string = "Golang"
    age := 10 // Tipe data ditentukan otomatis
    var height float32 = 5.9
    var isCoding bool = true

    fmt.Println("Name:", name)
    fmt.Println("Age:", age)
    fmt.Println("Height:", height)
    fmt.Println("Coding:", isCoding)
}
```

### 2. Konstanta

```go
package main

import "fmt"

const Pi = 3.14

func main() {
    fmt.Println("Nilai Pi adalah:", Pi)
}
```

### 3. Operator Aritmatika

```go
package main

import "fmt"

func main() {
    a, b := 10, 5
    fmt.Println("Penjumlahan:", a+b)
    fmt.Println("Pengurangan:", a-b)
    fmt.Println("Perkalian:", a*b)
    fmt.Println("Pembagian:", a/b)
    fmt.Println("Modulus:", a%b)
}
```

### 4. Percabangan

#### If Else

```go
package main

import "fmt"

func main() {
    number := 10
    if number > 5 {
        fmt.Println("Angka lebih besar dari 5")
    } else {
        fmt.Println("Angka 5 atau lebih kecil")
    }
}
```

#### Switch

```go
package main

import "fmt"

func main() {
    day := "Senin"
    switch day {
    case "Senin":
        fmt.Println("Hari kerja")
    case "Sabtu", "Minggu":
        fmt.Println("Hari libur")
    default:
        fmt.Println("Hari biasa")
    }
}
```

### 5. Perulangan (for loop)

```go
package main

import "fmt"

func main() {
    for i := 1; i <= 5; i++ {
        fmt.Println("Iterasi ke-", i)
    }
}
```

### 6. Array dan Slice

```go
package main

import "fmt"

func main() {
    var arr = [3]int{1, 2, 3} // Array dengan ukuran tetap
    fmt.Println("Array:", arr)

    slice := []int{4, 5, 6} // Slice dengan ukuran dinamis
    fmt.Println("Slice:", slice)
}
```

### 7. Map (Dictionary)

```go
package main

import "fmt"

func main() {
    myMap := map[string]int{"one": 1, "two": 2}
    fmt.Println("Map:", myMap)
}
```

### 8. Struct dan Method

```go
package main

import "fmt"

type Person struct {
    Name string
    Age  int
}

func (p Person) Greet() {
    fmt.Printf("Hello, my name is %s and I am %d years old.\n", p.Name, p.Age)
}

func main() {
    person := Person{Name: "Alice", Age: 25}
    person.Greet()
}
```

## Penutup

Golang adalah bahasa yang kuat dan mudah dipelajari, terutama untuk pengembangan aplikasi yang membutuhkan performa tinggi dan concurrent processing. Dengan memahami dasar-dasarnya, kamu siap untuk mulai membangun aplikasi dengan Golang! 🚀
