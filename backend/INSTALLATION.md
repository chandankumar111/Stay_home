# PG/Flat Booking Website - Installation and Deployment Guide

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- MongoDB (local or cloud instance)
- Razorpay account for payment integration
- Mapbox account for map integration

## Installation Steps

1. **Clone the repository**

```bash
git clone <repository-url>
cd <repository-folder>
```

2. **Install dependencies**

```bash
npm install
```

3. **Create `.env` file**

Create a `.env` file in the root directory with the following content:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/pgflatbooking
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
MAPBOX_ACCESS_TOKEN=your_mapbox_access_token
```

Replace the values with your actual credentials.

4. **Start MongoDB**

- For local MongoDB, run:

```bash
mongod
```

- Or use a cloud MongoDB URI in `MONGO_URI`.

5. **Run the development server**

```bash
npm run dev
```

The server will start on `http://localhost:5000`.

## Deployment

1. **Choose a hosting platform**

- Recommended: Heroku, DigitalOcean, AWS, or any Node.js compatible hosting.

2. **Set environment variables**

- Configure the environment variables on your hosting platform as per `.env`.

3. **Deploy the code**

- Push your code to the hosting platform repository or upload files.

4. **Start the server**

- Use `npm start` or your hosting platform's start command.

## Marketing and Advertising Tips

- Use social media platforms (Facebook, Instagram, Twitter) to promote your website.
- Use Google Ads to target local users searching for PG/flat rentals.
- Collaborate with local real estate agents and PG owners.
- Optimize your website for SEO to rank higher in search results.
- Encourage users to share and review your platform.

## Testing with Dummy Data

- Use Postman or similar tools to test API endpoints.
- Use the frontend forms to register users, add properties, and make bookings.
- Verify payment integration with Razorpay test mode.

## Support

For any issues, contact the developer or open an issue in the repository.

---

This guide covers the complete setup and deployment of the PG/Flat Booking website.
