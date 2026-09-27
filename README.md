# Campus Coin

**Smart Spending, Student Style**

Campus Coin is a full-stack budgeting and expense-management platform built around the way college and university students actually handle money. Instead of assuming a fixed salary or a connected bank account, the system focuses on allowances, part-time income, scholarships, gifts, food, transport, hostel or rent, academics, subscriptions, entertainment, and other everyday student expenses.

The project follows the **Campus Coin Software Requirements Specification v1.0** under the **NextGen BudgetBee** theme and **End-to-End Web Solutions** category.

---

## What Campus Coin Does

Campus Coin gives students one place to record money coming in, understand where it goes, set limits, work toward savings goals, and review their financial habits over time.

The main student workflow is straightforward:

1. Create an account and sign in.
2. Complete the student profile.
3. Record income and expenses.
4. Organize transactions by category.
5. Set budgets and savings goals.
6. Review the dashboard, reports, alerts, and saving tips.
7. Use Campus AI when extra guidance is helpful.

A separate administrator area is included for shared categories, users, announcements, saving-tip templates, and platform statistics.

---

## Core Features

### Student Accounts and Profiles

Students have their own authenticated workspace with profile information such as:

- Full name
- Email address
- Academic year
- Monthly allowance
- Monthly savings goal
- Profile image

The application uses session-based authentication and separates student access from administrator access.

> The SRS also requires password recovery/reset through email verification or a tokenized link. This flow should be included in the final functional verification before submission.

### Income and Expense Tracking

Students can create, edit, and delete transactions.

Typical income categories include:

- Allowance
- Part-time job
- Scholarship
- Gift
- Other income

Typical expense categories include:

- Food
- Transport
- Hostel / Rent
- Academics
- Subscriptions
- Entertainment
- Miscellaneous

Recurring entries are supported for items such as monthly allowances and subscriptions.

### Personal Categories

Campus Coin includes system categories and also allows students to manage their own categories.

Students can:

- Create personal income or expense categories
- Edit personal categories
- Remove personal categories
- Keep system defaults separate from their own entries

Administrators manage the default categories available across the platform.

### Dashboard

The student dashboard is designed as a quick monthly overview rather than a dense finance screen.

It includes:

- Personalized greeting
- Current balance
- Income and expense totals
- Recent transactions
- Quick actions
- Top spending category
- Budget vs. actual progress
- Saving tips
- Visual charts and summaries

### Budgets and Alerts

Students can set a monthly budget for individual expense categories.

The system shows current usage with progress indicators and can notify the student when a category is close to or has passed its limit.

### Savings Goals

Students can create savings goals using:

- Goal title
- Target amount
- Current saved amount
- Target date

Progress remains visible so the student can see how close they are to the target.

### Reports

Reporting is based on the student’s own transaction data.

Available reporting includes:

- Category-wise monthly spending
- Income vs. expense comparison
- Daily and weekly summaries
- Date-range filtering
- Category filtering
- Income-source filtering
- Monthly report export

### Saving Tips

The tips area provides practical suggestions based on spending behavior, historical activity, and budget information.

Students can:

- Review suggestions
- Pin useful tips
- Dismiss tips
- Save useful content for later

### Saved Items

Students can bookmark useful content and return to it later.

Saved content can include:

- Saving tips
- AI insights
- Administrator announcements
- Tip templates

### Notifications

In-app notifications are used for events such as:

- Budget warnings
- Budget limits being reached or exceeded
- System messages
- Administrator announcements
- Saving-tip updates

### CSV Import

Campus Coin supports importing historical transactions from CSV.

Example:

```csv
date,type,category,amount,description
2026-09-24,expense,Food,250,Lunch
2026-09-24,income,Allowance,5000,Monthly allowance
```

This is useful when transaction history already exists and entering every record manually would be impractical.

---

## Campus AI and Optional Intelligence

The SRS treats AI-based categorization and monthly insight generation as optional enhancements. Campus Coin extends that idea with a multilingual student finance assistant.

### Campus AI

Campus AI supports:

- English
- Urdu
- Roman Urdu
- Text chat
- Voice input
- Spoken responses
- Quick prompts

Students can ask about budgeting, saving, spending habits, financial planning, and general student money management.

### AI-Assisted Insights

The project can also use AI to explain financial patterns in simpler language and provide practical suggestions.

AI-generated content is advisory only. It is not certified financial advice, and students should remain able to review or override suggestions where relevant.

---

## Administrator Area

The administrator workspace provides oversight without mixing admin controls into the student experience.

Administrators can:

- View registered users
- Search and filter accounts
- Enable or disable users
- Reset passwords
- Manage default categories
- Create announcements
- Manage saving-tip templates
- View usage statistics
- Review transaction activity
- Manage their own profile

---

## Accessibility and User Experience

Campus Coin is intended to be understandable for first-time users, not only for people already familiar with finance tools.

The interface includes:

- Responsive layouts
- Light and dark themes
- Font-size controls
- Clear navigation
- Breadcrumbs
- Loading states
- Readable forms and tables
- Desktop, tablet, and mobile support

These features support the SRS requirements for accessibility, usability, compatibility, and operability.

---

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- HTML5
- CSS3
- Tailwind CSS
- Shadcn UI
- Lucide Icons
- Recharts

### Backend

- PHP
- REST-style API endpoints
- Session-based authentication

### Database

- MySQL

### AI Integration

- Google Gemini API

---

## Architecture

Campus Coin follows the three-layer structure described in the SRS.

### 1. Presentation Layer

The React frontend contains:

- Public website
- Authentication screens
- Student workspace
- Administrator workspace
- Forms
- Reports and charts
- Campus AI interface

### 2. Application / API Layer

The PHP backend handles:

- Authentication
- Profiles
- Categories
- Transactions
- Budgets
- Savings goals
- Reports
- Notifications
- Bookmarks
- Administrator operations
- AI requests

### 3. Data Layer

MySQL stores the persistent application data, including users, categories, transactions, budgets, goals, tips, insights, notifications, bookmarks, announcements, and administrative content.

```text
Browser / React UI
        |
        v
PHP API Layer
        |
        v
MySQL Database
```

External AI requests are made from the server side so API credentials do not need to be exposed in browser code.

---

## Local Installation

### Requirements

Install the following before running the project locally:

- XAMPP
- PHP 8+
- MySQL
- Node.js
- npm
- A modern browser such as Chrome or Edge

### 1. Place the Project in XAMPP

Copy the project folder into:

```text
C:\xampp\htdocs\
```

Example:

```text
C:\xampp\htdocs\campus-coin
```

### 2. Start Apache and MySQL

Open the XAMPP Control Panel and start:

- Apache
- MySQL

### 3. Import the Database

Open phpMyAdmin:

```text
http://localhost/phpmyadmin
```

Import the provided Campus Coin SQL file.

Expected local database name:

```text
campus_coin_db
```

### 4. Configure the Database Connection

For a standard local XAMPP setup, the values are commonly:

```text
Host: 127.0.0.1
Port: 3306
Database: campus_coin_db
Username: root
Password: blank
```

If the local environment is different, update the backend database configuration accordingly.

### 5. Install Frontend Dependencies

From the project directory:

```bash
npm install
```

### 6. Start Development

```bash
npm run dev
```

Open the local address shown by Vite.

### 7. Create a Production Build

```bash
npm run build
```

Vite writes the production frontend into:

```text
dist/
```

---

## Gemini Configuration

Campus AI requires a Gemini API key on the backend.

Use an environment variable where possible:

```text
GEMINI_API_KEY
```

Do not commit a real API key to GitHub or expose it in frontend JavaScript.

---

## Demo Accounts

These credentials are intended for local demonstration and testing.

### Administrator

```text
Email: admin@campuscoin.test
Password: Admin@123
```

### Student

```text
Email: student@campuscoin.test
Password: Student@123
```

Change demonstration credentials before using the project outside a controlled evaluation environment.

---

## Production / cPanel Notes

For a standard cPanel deployment:

1. Run `npm run build`.
2. Upload the contents of `dist/` to the web root used by the domain.
3. Upload the PHP API to the expected server path.
4. Create the MySQL database and database user in cPanel.
5. Import the SQL file through phpMyAdmin.
6. Replace local database credentials with the hosting credentials.
7. Confirm frontend API paths point to the live PHP endpoints.
8. Configure SPA rewrites so refreshing a React route does not return a 404.
9. Enable HTTPS.
10. Test student login, admin login, transactions, budgets, reports, profile updates, notifications, and Campus AI on the live domain.

Do not upload `node_modules`, `.git`, local secrets, or development-only credentials to the public web root.

---

## Project Boundaries

Campus Coin is a budgeting and financial-awareness application. It is not a banking platform.

The application does **not**:

- Connect to real bank accounts
- Verify bank accounts
- Process payments
- Transfer money
- Perform real banking transactions

Financial data is entered manually or imported from supported files such as CSV.

---

## SRS Alignment

The implementation is organized around the SRS requirements for:

- Student authentication and profile management
- Category management
- Income and expense logging
- Personalized dashboard
- Monthly reports
- Saving tips
- Budget goals and alerts
- Bookmarking
- Administrator controls
- Accessibility
- Security
- Performance
- Compatibility
- Responsive design

The SRS marks AI categorization, AI-generated monthly insights, forecasting, duplicate detection, and similar system-intelligence features as optional or advanced enhancements. These should not replace required functionality.

---

## Submission Checklist

The SRS requires the final project submission to include complete supporting material.

Before submission, confirm:

- [ ] All mandatory functional requirements are tested
- [ ] All non-functional requirements have been reviewed
- [ ] Password recovery/reset is verified
- [ ] Database / SQL files are included
- [ ] Installation instructions are complete
- [ ] Student and administrator credentials are documented
- [ ] Sitemap is available from the home page
- [ ] Test data and test evidence are included
- [ ] Final project documentation is complete
- [ ] Hosted URL is working
- [ ] Demonstration video covers the required features
- [ ] Repository does not expose secrets

---

## Notes for Evaluation

The project should be explainable by the team. Design choices, database structure, API flow, authentication, reports, and AI-assisted features should all be understood well enough to demonstrate and discuss during evaluation.

Any AI-assisted development tools used during the project should be acknowledged in the final project documentation as required by the SRS.

---

## Project Identity

**Project:** Campus Coin  
**Tagline:** Smart Spending, Student Style  
**Theme:** NextGen BudgetBee  
**Category:** End-to-End Web Solutions
