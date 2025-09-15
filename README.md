IndoreExplorer
A web application to explore Indore — tourism, food, events, culture, and more. Built using a MERN-like stack (React/Vite frontend, backend API with Node/Express), including MongoDB for data storage.
🚀 Features
Public-facing pages for Places, Food, Events, Gallery, History, Contact
Admin Panel to manage content dynamically (CRUD, image uploads, search & filters)
Authentication (admin login) using JWT
Search, pagination, and filtering for large datasets
Real-time News & Weather integration
Dark / Light mode toggle
Sample data seeded for initial setup
🛠 Tech Stack
Frontend: React / Vite / Tailwind CSS
Backend: Node.js / Express
Database: MongoDB
Authentication: JWT
Styling & UI: Tailwind CSS, responsive layout
APIs: Weather API, News API, etc.
📁 Project Structure

IndoreExplorer-1/
├── server/             # Express backend API, routes, storage logic
├── client/             # Frontend UI (React / Vite)
├── shared/             # Schemas, shared data types
├── seed-data.js        # Script to load sample data
├── tailwind.config.ts
├── vite.config.ts
├── package.json
└── .gitignore, etc.

⚙ Setup & Installation
1.Clone the repo: git clone https://github.com/mehrap673/IndoreExplorer-1.git
2.cd IndoreExplorer-1
3.Install dependencies: npm install
4.Setup environment variables (.env or via secret manager)
5.Seed sample data (if available): node seed-data.js
6.Start backend & frontend: npm run dev
7.Access app at localhost


🌐 Environment Variables
MONGO_URI: Database connection string
JWT_SECRET: Secret for JWT authentication
OPENWEATHER_API_KEY: API key for weather data
NEWS_API_KEY: API key for news feed
NODE_ENV: Development or production mode
PORT: Port for backend server if nonstandard
