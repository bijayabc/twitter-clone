# 🐦 Twitter Clone – Frontend

This is the frontend for the Twitter Clone app, built with **Next.js** and **Tailwind CSS**. It connects to the backend via **GraphQL**, displays tweets, handles authentication, follows, and more.

## 🧰 Tech Stack

- **Next.js** (App Router)
- **React**
- **Tailwind CSS**
- **GraphQL** with **Apollo Client**
- **TypeScript**
- **AWS S3** for image uploads

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/twitter-clone-frontend.git
cd twitter-clone-frontend
```

### 2. Install dependencies

```bash
npm install
# or
yarn
```

### 3. Environment variables

Set up resources.

Create a .env file.
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/graphql
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_unsigned_upload_preset
```

### 4. Run the server

```bash
npm run dev
# or
yarn dev
```

The app will be running at: http://localhost:3000

