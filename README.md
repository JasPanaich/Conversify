# Conversify

A full-stack real-time messaging application with custom JWT authentication, live presence indicators, image sharing, and a clean, responsive UI. Built with the MERN stack and Socket.io.

<img width="1470" height="836" alt="Screenshot 2026-10-22 at 5 04 45 PM" src="https://github.com/user-attachments/assets/0e1cd37e-fafc-4c6c-80d1-e8990bfefed2" />


## Features

**Messaging**
- Real-time one-to-one messaging powered by Socket.io
- Live online/offline presence indicators
- Image sharing with uploads stored on Cloudinary
- Optional notification and typing sounds, with a user-controlled toggle

**Authentication and Security**
- Custom JWT-based authentication with no third-party auth provider
- API rate limiting and bot protection with Arcjet

**User Experience**
- Welcome email sent on signup via Resend
- Responsive interface built with React, Tailwind CSS and DaisyUI
- Lightweight client-side state management with Zustand

**Architecture and Deployment**
- REST API built with Node.js and Express
- MongoDB for data persistence
- Configured for deployment on free-tier hosting (Sevalla)

## Tech Stack

| Layer      | Technologies                                  |
| ---------- | --------------------------------------------- |
| Frontend   | React, Tailwind CSS, DaisyUI, Zustand         |
| Backend    | Node.js, Express, Socket.io                   |
| Database   | MongoDB                                       |
| Auth       | JSON Web Tokens (custom implementation)       |
| Services   | Resend (email), Cloudinary (images), Arcjet (rate limiting) |
| Deployment | Sevalla (currently inactive)                  |

## Technology Overview

This section explains what each technology does and how it is used in the application.

### Frontend

**React**
A JavaScript library for building user interfaces from reusable components. In this project, React renders the chat interface, including the login and signup pages, the contact list, the conversation view and the message input. Components re-render automatically when state changes, which is what makes incoming messages and presence updates appear instantly without a page refresh.

**Tailwind CSS**
A utility-first CSS framework. Instead of writing separate stylesheets, styles are applied directly in the markup using small, composable classes (for example spacing, colors and flex layout). This keeps styling consistent and makes the layout responsive across mobile and desktop screens.

**DaisyUI**
A component library built on top of Tailwind CSS. It provides ready-made, themeable UI elements such as buttons, inputs, avatars, chat bubbles and toggles. DaisyUI handles the visual polish of common components so that Tailwind classes are only needed for custom layout and fine-tuning.

**Zustand**
A small state management library for React. It holds shared application state in global stores, such as the authenticated user, the list of contacts, the active conversation, messages, online users and the sound-toggle preference. Compared with heavier solutions, Zustand requires very little boilerplate and lets any component read or update state directly.

### Backend

**Node.js**
A JavaScript runtime that runs on the server. It allows the entire application, frontend and backend, to be written in a single language, and its event-driven, non-blocking model suits applications that maintain many simultaneous connections, such as a chat server.

**Express**
A minimal web framework for Node.js. Express defines the REST API: routes for authentication, user data and messages are mapped to controller functions, and middleware runs before them to handle tasks such as parsing requests, verifying the user's token and applying rate limits.

**Socket.io**
A library that enables real-time, bidirectional communication between the browser and the server over WebSockets, with automatic fallbacks and reconnection handling. In this project it delivers messages to the recipient the moment they are sent, broadcasts which users are online or offline, and powers live events such as typing indicators. While the REST API handles standard requests, Socket.io handles anything that must update instantly.

### Database

**MongoDB**
A document-oriented NoSQL database that stores data as flexible, JSON-like documents. It persists user accounts, profile information and message history, so conversations remain available after users disconnect or log out. Its flexible schema makes it easy to evolve the data model as features are added.

### Authentication

**JSON Web Tokens (JWT)**
A compact, signed token format used to prove a user's identity. When a user logs in or signs up, the server issues a token signed with `JWT_SECRET`. The client sends this token with subsequent requests, and the server verifies the signature to confirm who is making the request without looking up a session each time. Authentication in this project is implemented in-house rather than through a third-party provider, giving full control over the signup, login and session flow.

### Third-Party Services

**Resend**
An email delivery API for developers. It sends the welcome email that new users receive after signing up. The sender address and name are configured through the `EMAIL_FROM` and `EMAIL_FROM_NAME` environment variables.

**Cloudinary**
A cloud-based media storage and delivery service. When users upload images, such as profile pictures or images shared in chat, the files are sent to Cloudinary rather than stored on the application server. Cloudinary returns a hosted URL, which is saved in MongoDB and used to display the image in the interface.

**Arcjet**
A security service that provides rate limiting and bot protection. It is applied at the API level to restrict how many requests a client can make in a given period, which helps protect endpoints such as login and signup from abuse, brute-force attempts and excessive traffic.

### Tooling and Hosting

**Vite**
A fast frontend build tool and development server. It serves the React app during development with instant hot reloading (at `http://localhost:5173`) and produces an optimized production bundle when building.

**Sevalla**
A cloud hosting platform with a free tier, used to deploy the application. The deployment is currently inactive; see the [Deployment](#deployment) section for details.

## Project Structure

```
.
├── backend/
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── emails/        # Email templates (welcome email)
│   │   ├── lib/           # Service setup and utilities (DB, Cloudinary, Resend, Arcjet, Socket.io)
│   │   ├── middleware/    # Express middleware (auth, rate limiting)
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API route definitions
│   │   └── server.js      # Server entry point
│   ├── .env               # Environment variables (not committed)
│   └── package.json
├── frontend/
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── lib/           # Helpers (e.g. API client)
│   │   ├── pages/         # Page components
│   │   ├── store/         # Zustand stores
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── eslint.config.js
│   ├── postcss.config.js
│   └── package.json
└── package.json           # Root build/start scripts for deployment
```

## Prerequisites

- [Node.js](https://nodejs.org/) v20 or later
- A [MongoDB](https://www.mongodb.com/) database (local or Atlas)
- Accounts and API keys for:
  - [Resend](https://resend.com/)
  - [Cloudinary](https://cloudinary.com/)
  - [Arcjet](https://arcjet.com/)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/JasPanaich/Conversely.git
cd Conversely
```

### 2. Configure environment variables

Create a `.env` file inside the `/backend` directory:

```env
PORT=3000
MONGO_URI=your_mongo_uri_here

NODE_ENV=development

JWT_SECRET=your_jwt_secret

RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=your_email_from_address
EMAIL_FROM_NAME=your_email_from_name

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development
```

| Variable | Description |
| -------- | ----------- |
| `PORT` | Port the backend server listens on |
| `MONGO_URI` | MongoDB connection string |
| `NODE_ENV` | `development` or `production` |
| `JWT_SECRET` | Secret used to sign JWTs (use a long, random string) |
| `RESEND_API_KEY` | Resend API key for sending emails |
| `EMAIL_FROM` | Sender email address for outgoing emails |
| `EMAIL_FROM_NAME` | Sender display name for outgoing emails |
| `CLIENT_URL` | Frontend URL (used for CORS and email links) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `ARCJET_KEY` | Arcjet site key for rate limiting |
| `ARCJET_ENV` | Arcjet environment (`development` or `production`) |

> Note: Never commit your `.env` file. Make sure it's listed in `.gitignore`.

### 3. Run the backend

```bash
cd backend
npm install
npm run dev
```

The API will be available at `http://localhost:3000`.

### 4. Run the frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Deployment

> **Status:** The live deployment is currently inactive. The steps below describe how the app is configured to be deployed and can be used to bring it back online or host it elsewhere.

The project was deployed on [Sevalla](https://sevalla.com/). The root `package.json` provides two scripts for production:

| Script | What it does |
| ------ | ------------ |
| `npm run build` | Installs backend and frontend dependencies, then builds the frontend |
| `npm start` | Starts the backend server |

**Steps:**

1. Push your code to GitHub.
2. Create a new application on your hosting platform and connect the repository.
3. Set the build command to `npm run build` and the start command to `npm start`.
4. Add all backend environment variables from the section above, setting `NODE_ENV=production` and updating `CLIENT_URL` to your deployed app's URL.



