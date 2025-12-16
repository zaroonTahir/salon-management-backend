# Salon Management Backend

Simple Express.js backend for Salon Management System.

---

## 🚀 Tech Stack
- Node.js
- Express.js
- dotenv
- cors
- nodemon

---

## 📁 Project Structure

salon-backend/
├── src/
│ └── index.js
├── .gitignore
├── README.md
├── package.json


---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository
```bash
git clone <repo-url>
cd salon-backend

npm install

PORT=4000

npm run dev

# Testing
http://localhost:4000
http://localhost:4000/health

## ✅ Acceptance Checklist
✔ Server runs locally  
✔ `.env` used but not committed  
✔ README has run steps  
✔ Feature branch exists  
✔ PR created  

## API Endpoints

### Products API

#### Get All Products
```http
GET /api/products
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "name": "Haircut",
      "price": 25,
      "category": "service"
    }
  ]
}
```

#### Create a Product
```http
POST /api/products
Content-Type: application/json

{
  "name": "Manicure",
  "price": 30,
  "category": "service"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 4,
    "name": "Manicure",
    "price": 30,
    "category": "service"
  }
}
```

#### Get Single Product
```http
GET /api/products/:id
```

**Example:** `GET /api/products/1`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Haircut",
    "price": 25,
    "category": "service"
  }
}
```

## Database: Firestore

This project uses **Google Cloud Firestore** as the database. Firestore is a NoSQL cloud database that stores data in collections and documents, allowing for flexible, scalable data storage with real-time synchronization.

### Setup Firestore

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database (test mode for development)
3. Download service account key and save as `serviceAccountKey.json`
4. **Never commit the service account key to GitHub**

### API Examples

#### Create a Product
```http
POST /api/products
Content-Type: application/json

{
  "name": "Haircut",
  "price": 25,
  "category": "service",
  "description": "Professional haircut service"
}
```

#### Get All Products
```http
GET /api/products
```

#### Get Single Product
```http
GET /api/products/{productId}
```

Example: `GET /api/products/abc123xyz`