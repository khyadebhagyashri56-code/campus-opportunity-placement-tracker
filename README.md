# Campus Opportunity & Placement Tracker

A web-based platform designed to help students manage placement preparation, explore job opportunities, track applications, and organize their career journey in one place.

## About the Project

The Campus Opportunity & Placement Tracker is a student-focused web application built to simplify the placement preparation process. It provides a centralized dashboard where students can explore opportunities, save jobs, manage applications, maintain their profiles, and access resume and interview practice tools.

## Features

- **Student Authentication** — Sign up and log in to the platform.
- **Placement Dashboard** — Access placement-related information in one place.
- **Job Opportunities** — Browse available opportunities and view their details.
- **Saved Opportunities** — Save opportunities for future reference.
- **Application Tracking** — Manage and track job applications.
- **Student Profile** — Maintain personal and academic information.
- **Resume Studio** — Work on resume preparation.
- **Interview Practice** — Access interview practice features and review interview history.
- **Reminders** — Organize important placement-related tasks and reminders.

## Tech Stack

- **Frontend:** Next.js, React.js, JavaScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** JWT

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- PostgreSQL

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/khyadebhagyashri56-code/campus-opportunity-placement-tracker.git
   ```

2. Navigate to the project directory:

   ```bash
   cd Campus-Tracker
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the project root and configure your local PostgreSQL database connection and required environment variables.

   **Important:** Never commit `.env` files, database passwords, or authentication secrets to GitHub.

5. Generate the Prisma Client:

   ```bash
   npx prisma generate
   ```

6. Apply the database migrations:

   ```bash
   npx prisma migrate deploy
   ```

7. Start the development server:

   ```bash
   npm run dev
   ```

8. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```text
Campus-Tracker/
├── components/
│   └── layout/
├── lib/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── public/
└── src/
    └── app/
        ├── api/
        ├── applications/
        ├── dashboard/
        ├── interviews/
        ├── login/
        ├── opportunities/
        ├── profile/
        ├── reminders/
        ├── resume-studio/
        ├── saved/
        └── signup/
```

## Learning Objectives

This project provides practical experience with full-stack web development, REST-style API routes, database integration, authentication, and building a student-focused application.

## Author

**Bhagyashri Khyade**

GitHub: [khyadebhagyashri56-code](https://github.com/khyadebhagyashri56-code)
