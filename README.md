# 💼 DevSpace
A **production-ready REST API** for developers to showcase their projects, manage their profile, and upload avatars.  
Built with **Node.js**, **Express.js**, and **MongoDB**, and fully documented with **Swagger UI**.


![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Swagger](https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)
[![Deployed](https://img.shields.io/badge/Deployed-Live-green?style=for-the-badge)](https://devspace-jhys.onrender.com/api-docs)

---


## 🚀 Live Demo
🔗 [DevSpace API](https://devspace-jhys.onrender.com)  
📘 [API Docs (Swagger UI)](https://devspace-jhys.onrender.com/api-docs)

> ⚠️ **Note:** Hosted on Render’s free tier — it may take a few seconds to spin up ⏳. Please be patient 😄

---


## ✨ Features

- ✅ JWT Authentication & Role-based Authorization
- 👤 User Profile & Avatar Upload (via Multer & Cloudinary)
- 📁 Project CRUD (with visibility control: public/private)
- 🔎 Search, Filter, Sort and Pagination
- 🛡️ Security: CORS, Helmet, Joi (Validation), Sanitize-html (Input Sanitization)
- 📉 Rate Limiting (express-rate-limit)
- 📜 Swagger UI API Documentation
- ☁️ Deployed on Render

---

## 🧑‍💻 User Features

- Register/Login/Logout
- View & update personal information
- Upload or change avatar
- Create, update, or delete own projects
- View public projects from all users
- Fetch personal projects (both public and private)

---


## 🛠️ Admin Features

- View all users
- View all projects (public and private)

[//]: # (- Future: Soft-delete & Restore capabilities)

---


## 🧰 Tech Stack

[//]: # (- **Backend**: `Node.js`, `Express.js`)

[//]: # (- **Database**: `MongoDB`)

| Tech               | Description                          |
|--------------------|--------------------------------------|
| Node.js            | JavaScript runtime                   |
| Express.js         | Web framework                        |
| MongoDB            | NoSQL database                       |
| Mongoose           | ODM for MongoDB                      |
| Cloudinary         | Cloud image hosting                  |
| Multer             | Middleware for handling file uploads |
| Swagger UI         | API documentation                    |
| Render (free tier) | Deployment                           |

---


## 🛡️ Security Middleware

- `helmet` – sets secure HTTP headers  
- `cors` – handles cross-origin requests  
- `express-rate-limit` – limits repeated requests  
- `sanitize-html` – sanitizes user input  

---

## 🔐 Authentication

- Token is sent via `Authorization: Bearer <token>` header
- Protected routes require a valid JWT
- Role-based access for `admin` and `user`

---

## 🖼️ Image Uploads

- **Avatar upload**: `/api/v1/me/change-avatar`
- Avatar is stored in Cloudinary and embedded in user model
- Default avatar assigned on registration
- Re-uploads delete the previous image to save space

---

## 🔍 Search , Pagination & Sort

- Search by keyword across selected fields : **`title`**, **`description`**,  **`tech`**
- Pagination with `page` and `limit` query params
- Sort by `updated date`
- Works on:
  - All public projects
  - User's own projects
  - Admin project/user views

---

## 🧪 Testing the API

You can test the API with:

- [Postman](https://www.postman.com/) or
- [API Docs on Swagger UI](https://devspace-jhys.onrender.com/api-docs)

To test:

- Register a new user
- Log in and grab the token
- Use the token in `Authorization: Bearer <token>` for protected routes

---

## 🧩 API Endpoints
| Access                        | Method | URL                       | Description                                                   |
|-------------------------------|--------|---------------------------|---------------------------------------------------------------|
| Public                        | GET    | `api/v1/projects`         | Get all public projects (with search + pagination)            |
| Public                        | GET    | `api/v1/projects/:id`     | Get a single public project                                   |
| Public                        | POST   | `api/v1/auth/register`    | Register a user                                               |
| Public                        | POST   | `api/v1/auth/login`       | Login user                                                    |
| Authenticated                 | POST   | `api/v1/projects`         | Create a new project                                          |
| Authenticated                 | GET    | `api/v1/me`               | View own profile                                              |
| Authenticated                 | GET    | `api/v1/me/projects`      | Get all own projects (public + private + search + pagination) |
| Authenticated                 | POST   | `api/v1/me/change-avatar` | Upload/change avatar                                          |
| Authenticated                 | PATCH  | `api/v1/projects/:id`     | Update own project                                            |
| Authenticated                 | DELETE | `api/v1/projects/:id`     | Delete own project                                            | 
| Authenticated & Authorization | GET    | `api/v1/admin/users`      | Get all users                                                 |
| Authenticated & Authorization | GET    | `api/v1/admin/projects`   | Get all projects (public + private + search + pagination)     |
---

[//]: # (## 🧹 Future Enhancements)

[//]: # ()
[//]: # (- [ ] Soft delete for projects and user accounts)

[//]: # (- [ ] Admin restore deleted records)

[//]: # (- [ ] Refresh tokens for longer sessions)

[//]: # (- [ ] Email verification & password reset)

[//]: # (- [ ] A Frontend for visual )

[//]: # (---)

## 👤 Author

**Ernest Gbaboh** – [Github](https://github.com/gbabohernest)

[//]: # (## 📬 Connect)

[//]: # ([//]: # &#40;Twitter / X: @myhander)

---

## 🙏 Acknowledgements

*Feedback is welcome. This project was built to reinforce backend fundamentals and simulate real-world API development, testing, security and deployment.
Special thanks to all those who tested, reviewed, or gave feedback.*