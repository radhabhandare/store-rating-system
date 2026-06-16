# 🏪 Store Rating System

[![Version](https://img.shields.io/badge/version-2.0.0-blue)](https://github.com/radhabhandare/store-rating-system)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)](https://mysql.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

A full-stack store rating platform where users can rate stores, admins manage users, and store owners track their store performance.

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Database Setup](#-database-setup)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 👑 System Administrator
- **Dashboard** - Real-time statistics with charts (Rating Distribution, Top Stores, Trends)
- **User Management** - Add, view, filter, and sort users by Name, Email, Address, Role
- **Store Management** - Add and manage stores with categories
- **Analytics** - Rating distribution, top stores, activity feed
- **Export Data** - Export users and stores data to CSV

### 👤 Normal User
- **Authentication** - Register, login, change password
- **Store Discovery** - Search, filter by category, and sort stores
- **Rating System** - Submit and update ratings (1-5 stars)
- **Reviews** - Write reviews with ratings
- **Store Details** - View complete store information with all reviews
- **Grid/List View** - Toggle between grid and list view modes

### 🏢 Store Owner
- **Dashboard** - View store performance
- **Analytics** - Average rating and user feedback
- **User Insights** - See who rated your store with their ratings

### ✅ Form Validations
| Field | Validation |
|-------|-----------|
| Name | 20-60 characters |
| Password | 8-16 chars, 1 uppercase, 1 special character |
| Email | Standard email format |
| Address | Max 400 characters |

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | React 18, React Router 6, Axios, Recharts |
| **Backend** | Node.js, Express.js, JWT, Bcrypt |
| **Database** | MySQL 8.0 |
| **Styling** | CSS3, Flexbox, Grid, Animations |
| **Charts** | Recharts for data visualization |
| **Security** | Helmet, CORS, Rate Limiting |

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/radhabhandare/store-rating-system.git
cd store-rating-system

# Backend setup
cd backend
npm install
npm start

# Frontend setup (new terminal)
cd frontend
npm install
npm start
