# 💼 InvestTrack

**InvestTrack** is a full-stack web application to manage financial assets. Users can add, edit, delete, and import assets via CSV, view live price updates, and analyze their portfolio with interactive charts.

---

## 🚀 Features

- ✅ User authentication (JWT)
- 📥 CSV import for bulk asset entry
- ➕ Add, edit, and delete assets
- 📊 Pie and bar charts with Recharts
- 💱 Multi-currency support (BRL, USD, EUR)
- 🔗 Real-time price fetching via external APIs (Brapi, Twelve Data)

---

## 🧑‍💻 Tech Stack

**Frontend**:
- React + Vite
- Tailwind CSS
- Recharts

**Backend**:
- Node.js + Express
- PostgreSQL + Sequelize ORM
- JWT for authentication

**APIs**:
- [Brapi.dev](https://brapi.dev/) for Brazilian stocks
- [Twelve Data](https://twelvedata.com/) for international assets

---

## 📁 Project Structure

InvestTrack/
│
├── frontend/    # Frontend React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── package.json
│   └── ...
│
├── backend/     # Backend Node.js + Express
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   ├── app.js / server.js
│   └── ...
│
├── README.md
└── ...

👤 Author
Made with ❤️ by Cleiton Cordova