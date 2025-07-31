# Identity-Reconciliation Service

A scalable backend service built with Node.js, TypeScript, and Prisma to perform real-time identity reconciliation for customer data. This service acts as a central hub to create a unified "single source of truth" for user profiles, enabling accurate customer activity tracking, such as order history.

---

## 🔗 Live API

**Base URL:** [`https://identity-reconciliation-production-ce2a.up.railway.app`](https://identity-reconciliation-production-ce2a.up.railway.app)  
*Note: This link may be inactive soon due to Railway's free-tier expiration. It's best to clone the repo and test locally for a reliable evaluation.*  
**Base URL (for local testing):** `http://localhost:3000`

---

## 🧠 The Problem

Modern applications often collect fragmented user data. A single customer might use a phone number for one order and an email address for another. This service solves that problem by intelligently identifying and linking these disparate contacts, ensuring all user activity, including orders, can be tracked under a single, unified identity.

---

## 📄 Data Model

The data model is the heart of this service, defined in `prisma/schema.prisma`. It consists of two main models: `Contact` and `Order`.

### Contact Model

This model stores individual contact entries and manages their relationships.

```ts
model Contact {
  id             Int      @id @default(autoincrement())
  phoneNumber    String?
  email          String?
  linkedId       Int?
  linkPrecedence LinkPrecedence // "PRIMARY" or "SECONDARY"
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  deletedAt      DateTime?
}
```

### Order Model

This model stores order information and links it to a unified contact identity.

```ts
model Order {
  id          Int      @id @default(autoincrement())
  productName String
  orderValue  Float
  contactId   Int
  contact     Contact  @relation(fields: [contactId], references: [id])
  createdAt   DateTime @default(now())
}
```

---

## 🔌 API Endpoints

### POST `/identify`

This is the core endpoint that performs the reconciliation logic.

**Request Format:**
```json
{
  "email": "user@example.com",
  "phoneNumber": "1234567890"
}
```
✅ You must provide at least one field: `email` or `phoneNumber`.

**Sample Response:**
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

---

### POST `/order`

This endpoint identifies the correct primary contact and then creates an order linked to it.

**Request Format:**
```json
{
  "email": "george@bluth.com",
  "phoneNumber": "987654",
  "productName": "Banana Stand",
  "orderValue": 250000
}
```

**Sample Response:**
```json
{
  "message": "Order created successfully"
}
```

---

## ⚙️ Tech Stack

- **Node.js** – backend runtime  
- **TypeScript** – for type-safe coding  
- **Express.js** – REST API framework  
- **Prisma** – ORM for database access  
- **PostgreSQL / MySQL** – data storage  
- **Railway** – deployment and hosting platform  

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
# Example for PostgreSQL
DATABASE_URL="postgresql://user:password@host:port/database_name"
```

### Step 4: Apply Database Migrations
```bash
npx prisma migrate dev
```

### Step 5: Start the Server

**For Local Development**
```bash
npm run dev
```

**For Production**
```bash
npm run build
npm start
```

---

## ✅ Core Features

- **Intelligent Contact Linking:** Detects and links contacts based on a shared email or phone number.
- **Primary/Secondary Management:** Automatically assigns `PRIMARY` or `SECONDARY` precedence to contacts. The oldest record in a group is always the primary.
- **Dynamic Merging:** If a new piece of information links two previously separate `PRIMARY` contacts, the service intelligently merges them.
- **Unified Customer View:** `/identify` endpoint returns a consolidated profile showing all linked identities.
- **Order Association:** `/order` correctly associates orders with the primary contact.
- **Clean Architecture:** Modular structure separating routes, controllers, and services.

---

## 📁 Directory Structure

```
src/
├── controllers/       # HTTP route handlers
├── services/          # Identity reconciliation logic
├── routes/            # Express routes
├── prisma/            # DB schema and client
└── index.ts           # App entry point
```

---

## 🧪 API Test and Result for Verification

### Test 1: Create New Primary Contact

**Description:** A new email and phone number are sent. The API should create a new primary contact.

```json
Request:
{
  "email": "test.user@example.com",
  "phoneNumber": "1122334455"
}

Response:
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["test.user@example.com"],
    "phoneNumbers": ["1122334455"],
    "secondaryContactIds": []
  }
}
```

---

### Test 2: Create Secondary Contact

**Description:** An existing email is sent with a new phone number. The API should link this new information by creating a secondary contact.

```json
Request:
{
  "email": "test.user@example.com",
  "phoneNumber": "9988776655"
}

Response:
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["test.user@example.com"],
    "phoneNumbers": ["1122334455", "9988776655"],
    "secondaryContactIds": [2]
  }
}
```

---

### Test 3: Merge Two Primary Contacts

#### Step A: Create Second Primary
```json
Request:
{
  "email": "another.person@example.com",
  "phoneNumber": "5556667777"
}

Response:
{
  "contact": {
    "primaryContactId": 3,
    "emails": ["another.person@example.com"],
    "phoneNumbers": ["5556667777"],
    "secondaryContactIds": []
  }
}
```

#### Step B: Link the Two Primaries
```json
Request:
{
  "email": "test.user@example.com",
  "phoneNumber": "5556667777"
}

Response:
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["test.user@example.com", "another.person@example.com"],
    "phoneNumbers": ["1122334455", "9988776655", "5556667777"],
    "secondaryContactIds": [2, 3]
  }
}
```

---

### Test 4: Create Order and Verify Linkage

#### Step A: Create Order
```json
Request:
{
  "email": "test.user@example.com",
  "productName": "Premium Subscription",
  "orderValue": 99.99
}

Response:
{
  "message": "Order created successfully"
}
```

#### Step B: Backend Linkage Logic

The backend identifies the primary contact ID from `/identify` as `1` and creates a record in the `Order` table with `contactId: 1`.

```sql
SELECT * FROM "Order" WHERE "productName" = 'Premium Subscription';
```

Expected Result:
```json
{
  "id": 1,
  "productName": "Premium Subscription",
  "orderValue": 99.99,
  "contactId": 1
}
```

---

## 👨‍💻 Author

**Jay Arya**  
📧 Email: [jayarya.work@gmail.com](mailto:jayarya.work@gmail.com)  
💻 GitHub: [@Jay-736-Github](https://github.com/Jay-736-Github)