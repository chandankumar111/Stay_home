# PG/Flat Booking Website

## Description
This is the backend for a PG, Flat, and Room booking website with admin, owner, and user roles. It uses Node.js, Express, MongoDB, JWT authentication, and EJS for templating.

## Installation

1. Clone the repository
2. Run `npm install` to install dependencies
3. Create a `.env` file in the root with the following variables:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/pgflatbooking
   JWT_SECRET=your_jwt_secret_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
   ```
4. Start MongoDB server locally or use a cloud MongoDB URI
5. Run `npm run dev` to start the development server with nodemon

## Usage

- API endpoints for authentication are available at `/api/auth`
- Frontend views will be served using EJS templates

## Next Steps

- Implement owner and admin routes
- Implement booking, payment, and chat features
- Add frontend pages and client-side logic
- Add security and error handling middleware

## Author

Your Name
