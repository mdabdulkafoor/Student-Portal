# Apex University Student Portal

A full-stack academic management portal for students, faculty, and administrators. The application includes role-based dashboards, academic records, assignments, attendance, fees, communications, library services, placements, certificates, and institutional reports.

## Features

### Student portal
- Academic overview, profile, timetable, and announcements
- Attendance records and examination results
- Assignment submission and study materials
- Fee payment information and fee history
- Library renewals, hostel and transport services
- Certificate requests, placement applications, and feedback
- Student complaints and faculty communication

### Faculty portal
- Student and course overview
- Attendance entry
- Assignment creation and submission grading
- Internal marks management
- Study material and announcement publishing

### Admin portal
- Student and faculty management
- Department and course management
- Complaint tracking and reports
- Institutional statistics and academic reports

## Technology stack

- React 19
- Vite 6
- Tailwind CSS
- React Router
- Express 5
- JSON file-based data storage
- JWT authentication
- Multer file uploads
- jsPDF and Recharts

## Requirements

- Node.js 18 or newer
- npm

## Installation

From the project directory:

```bash
npm install
```

## Running the application

Start both the API server and Vite development server:

```bash
npm run dev
```

The application will be available at:

- Frontend: `http://localhost:3000`
- API: `http://localhost:5000`
- API health check: `http://localhost:5000/api/health`

To run only the backend:

```bash
npm run start:server
```

To run only the frontend:

```bash
npm run dev:client
```

## Demo accounts

| Role | Username / ID | Password |
| --- | --- | --- |
| Student | `2022CS1042` or `alex.morgan@apexuniv.edu` | `student123` |
| Faculty | `FAC-CS-101` or `sarah.jenkins@apexuniv.edu` | `faculty123` |
| Admin | `admin` or `admin@apexuniv.edu` | `admin123` |

The application automatically starts a demo student session when no saved login session exists.

## Environment variables

The backend supports the following optional environment variables:

```env
PORT=5000
JWT_SECRET=replace-with-a-secure-secret
```

`JWT_SECRET` has a development fallback and should be replaced in production.

## Production build

Create the frontend build:

```bash
npm run build
```

The Express server will serve `dist` automatically when the build directory exists:

```bash
npm start
```

Then open `http://localhost:5000`.

## Data storage and uploads

- Application data is stored in `server/data/database.json`.
- The database file is initialized automatically from `server/seedData.js`.
- Uploaded files are saved in `server/uploads/` and served at `/uploads`.
- Uploaded file data should be backed up separately when deploying to a persistent environment.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Run frontend and backend in development mode |
| `npm run dev:client` | Run the Vite frontend only |
| `npm run start:server` | Run the Express API only |
| `npm run build` | Build the frontend for production |
| `npm run preview` | Preview the production frontend build |
| `npm start` | Start the Express server |
