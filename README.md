# Identity-Reconciliation

# Identity Reconciliation Service

## Overview

This is a backend service built for Bitespeed to tackle the challenge of **customer identity reconciliation**. The goal is to associate different contact details (email or phone number) that may belong to the same customer, even when used across separate transactions. It's built using **Node.js**, **TypeScript**, **Express**, **Prisma ORM**, and a **MySQL** database. The app is hosted on **Railway**.

### 🔗 Live API

**Base URL:** [`https://identity-reconciliation-production-ce2a.up.railway.app`](https://identity-reconciliation-production-ce2a.up.railway.app)

---

## 🧠 The Problem

FluxKart collects either a phone number or email from users when they place orders. Sometimes, the same user uses different emails or phone numbers. This service helps Bitespeed identify and link such contacts, so all user activity can be tracked under a single identity.

---

## 📄 Data Model

```ts
{
  id: number;
  phoneNumber: string | null;
  email: string | null;
  linkedId: number | null;            // If secondary, refers to the primary contact
  linkPrecedence: "primary" | "secondary";
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
```

---

## 🔌 API Endpoint

### `POST /identify`

#### Request Format

```json
{
  "email": "user@example.com",          // optional
  "phoneNumber": "1234567890"           // optional
}
```

> ✅ You must provide at least one field: `email` or `phoneNumber`.

#### Sample Response

```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["user@example.com", "alias@example.com"],
    "phoneNumbers": ["1234567890"],
    "secondaryContactIds": [2, 3]
  }
}
```

This returns a consolidated view of the contact's identity. The oldest record becomes the `primaryContactId`, and the rest are linked as secondary.

---

## ⚙️ Tech Stack

* **Node.js** – backend runtime
* **TypeScript** – for type-safe coding
* **Express.js** – REST API framework
* **Prisma** – ORM for database access
* **MySQL** – data storage
* **Railway** – deployment and hosting platform

---

## 🚀 Getting Started

### Step 1: Clone the Repository

```bash
git clone https://github.com/Jay-736-Github/Identity-Reconciliation.git
cd Identity-Reconciliation
```

### Step 2: Install Project Dependencies

```bash
npm install
```

### Step 3: Set Environment Variables

Create a `.env` file in the root directory:

```
DATABASE_URL=mysql://<user>:<password>@<host>:<port>/<database>
```

### Step 4: Apply Database Migrations

```bash
npx prisma migrate dev --name init
```

### Step 5: Start the Server

#### For Local Development

```bash
npm run dev
```

#### For Production

```bash
npm run build
npm start
```

---

## ✅ Core Features

* Detects and merges contacts based on shared emails or phone numbers
* Automatically manages `primary` and `secondary` linkage
* Updates relationships if older records are discovered
* Compatible with JSON API clients like Postman or Curl
* Clean and modular architecture

---

## 📁 Directory Structure (This is just for reference and can be modified according to the requirements)

```
src/
├── controllers/       # HTTP route handlers
├── services/          # Identity reconciliation logic
├── routes/            # Express routes
├── prisma/            # DB schema and client
├── index.ts           # App entry point
```

---

## 👨‍💻 Author

**Jay Arya**

* 📧 Email: `jayarya.work@gmail.com`
* 💻 GitHub: [@Jay-736-Github](https://github.com/Jay-736-Github)
