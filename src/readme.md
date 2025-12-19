# 🩸 Blood Donation Application

A full-stack **Blood Donation Management Platform** built with the **MERN stack** to connect blood donors, recipients, volunteers, and admins in a seamless, secure, and user-friendly way.

🔗 **Client Repo:** https://github.com/tayeeb-office/ph-mil11-mod68-frontend.git
🔗 **Server Repo:** https://github.com/tayeeb-office/ph-mil11-mod68-backend.git

---

## 📌 Project Purpose

The Blood Donation Application aims to simplify and digitalize the blood donation process by:

- Connecting blood donors with recipients
- Managing donation requests efficiently
- Providing role-based dashboards for **Admin**, **Donor**, and **Volunteer**
- Ensuring secure authentication and smooth user experience

This project was developed as part of **B12-A11 Category-01** to demonstrate real-world MERN stack skills, clean UI/UX, and scalable backend architecture.

---

## 🚀 Key Features

### 🔐 Authentication & Security
- Email & password based authentication
- JWT-based private route & API protection
- Firebase authentication with secured environment variables
- MongoDB credentials secured using environment variables

---

### 👥 User Roles & Permissions

#### 🩸 Donor
- Register & manage profile
- Create, edit, delete donation requests
- View own donation history
- Change donation status (inprogress → done/canceled)
- Search donors by blood group & location

#### 🤝 Volunteer
- View all blood donation requests
- Filter donation requests
- Update **only donation status**

#### 🌐 Admin
- Full system access
- Manage users (block/unblock)
- Change user roles (donor → volunteer → admin)
- Manage all donation requests
- View total users, funds & requests
- Monitor funding data

---

### 📊 Dashboard Features
- Fully responsive **sidebar-based dashboard**
- Role-specific dashboards
- Editable profile page (email non-editable)
- Pagination & filtering on tables
- Charts & statistics for admins & volunteers

---

### 🏠 Public Pages
- Home page with banner & call-to-action
- Blood donation requests (pending only)
- Donor search by blood group, district & upazila
- Contact form & footer with useful links

---

### 💰 Funding (Challenge Task)
- Stripe payment integration
- Users can donate funds
- Funding history table
- Total funds shown on Admin & Volunteer dashboards

---

## 🧪 Optional Enhancements
- Framer Motion / AOS animations
- Responsive design for mobile, tablet & desktop
- Clean UI with proper spacing, alignment & contrast
- Unique design (not copied from any module project)

---

## 🛠️ Technologies Used

### Frontend
- React.js
- React Router DOM
- Tailwind CSS
- Firebase Authentication
- Axios
- Framer Motion
- React Hook Form
- SweetAlert2

### Backend
- Node.js
- Express.js
- MongoDB
- JWT
- Stripe
- CORS
- dotenv

---

