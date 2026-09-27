# Campus Coin — Project Roadmap

> **Theme:** NextGen BudgetBee  
> **Category:** End-to-End Web Solutions  
> **Reference:** Campus Coin Software Requirements Specification, Version 1.0

This roadmap keeps the project work aligned with the SRS while separating the required scope from optional enhancements. It is intentionally practical: core student finance features come first, followed by reporting, administration, accessibility, AI-assisted features, and final delivery work.

---

## 1. Project Foundation

**Goal:** Set up a stable full-stack base before building feature pages.

- [x] Create the React + TypeScript + Vite frontend
- [x] Set up shared layouts, navigation, theme styles, and reusable components
- [x] Connect the frontend to the PHP API layer
- [x] Set up the MySQL database
- [x] Define student and administrator access
- [x] Add responsive behavior for desktop, tablet, and mobile

**SRS coverage:** three-tier architecture, compatibility, usability, and responsive interface requirements.

---

## 2. Authentication and Student Profile

**Goal:** Give each student a secure, personal workspace.

- [x] Student registration and login
- [x] Separate administrator login
- [x] Session-based authentication
- [x] Student profile with name, academic year, monthly allowance, and savings goal
- [x] Profile image support
- [ ] Verify password recovery/reset flow before final submission

The SRS specifically requires password recovery through email verification or a tokenized reset link, so this should be confirmed during the final functional check.

---

## 3. Categories and Transactions

**Goal:** Make daily money tracking quick and understandable.

- [x] Default income and expense categories
- [x] Personal category creation
- [x] Edit and delete personal categories
- [x] Add income transactions
- [x] Add expense transactions
- [x] Edit and delete transactions
- [x] Support recurring entries
- [x] Keep transaction history available for reporting

**Student-focused categories include:** allowance, part-time job, scholarship, gifts, food, transport, hostel/rent, academics, subscriptions, entertainment, and miscellaneous expenses.

---

## 4. Student Dashboard

**Goal:** Show the student’s current financial position at a glance.

- [x] Personalized greeting
- [x] Current month balance
- [x] Income and expense totals
- [x] Recent transactions
- [x] Quick actions
- [x] Top spending category
- [x] Budget vs. actual progress
- [x] Saving tips and highlights
- [x] Charts and visual summaries

---

## 5. Budgets, Savings Goals, and Alerts

**Goal:** Help students move from tracking money to planning it.

- [x] Monthly budgets by expense category
- [x] Budget progress indicators
- [x] Near-limit and exceeded-budget alerts
- [x] In-app notifications
- [x] Personal savings goals
- [x] Goal progress tracking

---

## 6. Reports and Financial Review

**Goal:** Turn transaction data into useful monthly insight.

- [x] Category-wise monthly spending report
- [x] Income vs. expense comparison
- [x] Daily and weekly summaries
- [x] Date-range filters
- [x] Category filters
- [x] Income-source filters
- [x] Monthly report export

Before submission, exported reports should be tested in the final hosted environment as well as locally.

---

## 7. Saving Tips, Insights, and Saved Items

**Goal:** Give students useful guidance without making the experience feel complicated.

- [x] Personalized saving tips
- [x] Tip ranking based on usefulness or saving impact
- [x] Pin and dismiss actions
- [x] Bookmarks / saved items
- [x] Saved tips and insights history
- [x] Administrator announcements

### Optional AI enhancements from the SRS

- [x] AI-assisted monthly financial insights
- [x] Campus AI finance assistant
- [x] English, Urdu, and Roman Urdu chat support
- [x] Voice input and spoken responses
- [ ] Review AI expense-category suggestion flow against the optional SRS requirement
- [ ] Review whether transaction-learning / correction history is required for the final build

AI output remains advisory and should never be presented as certified financial advice.

---

## 8. CSV Import

**Goal:** Make it easier to bring existing transaction data into Campus Coin.

- [x] CSV transaction import
- [x] Support the expected transaction fields
- [ ] Final test with valid and invalid sample files
- [ ] Confirm clear error messages for unsupported data

CSV import is listed as optional in the SRS, but it is included in the current project scope.

---

## 9. Administrator Workspace

**Goal:** Provide practical control over shared system data.

- [x] View registered users
- [x] Search and filter users
- [x] Enable or disable accounts
- [x] Reset user passwords
- [x] Manage default categories
- [x] Create announcements
- [x] Manage saving-tip templates
- [x] View usage statistics
- [x] Review transaction activity
- [x] Administrator profile and settings

---

## 10. Accessibility and User Experience

**Goal:** Keep the application usable for first-time users across devices.

- [x] Light mode
- [x] Dark mode
- [x] Font-size controls
- [x] Clear navigation
- [x] Breadcrumbs
- [x] Loading states
- [x] Responsive layouts
- [x] Desktop, tablet, and mobile support
- [ ] Final keyboard and readability review
- [ ] Final cross-browser check

These checks support the SRS non-functional requirements for accessibility, user-friendliness, performance, operability, and compatibility.

---

## 11. Security and Reliability Review

**Goal:** Complete the project with the same care given to the visible UI.

- [x] Session-protected student routes
- [x] Separate student and administrator access
- [x] Password hashing and verification
- [x] Server-side database access
- [x] Keep AI/API secrets out of the frontend
- [ ] Recheck production database credentials
- [ ] Recheck file permissions and upload limits
- [ ] Confirm HTTPS on the hosted version
- [ ] Test logout, expired sessions, and protected routes

Campus Coin does not connect to real bank accounts, process payments, transfer funds, or verify bank accounts. Financial data is entered manually or imported through supported files.

---

## 12. Final Delivery

**Goal:** Prepare a clean submission that is easy to evaluate.

- [x] Project source code
- [x] Database / SQL files
- [x] README with installation instructions
- [x] User credentials section
- [x] Sitemap included in the website
- [ ] Final SRS requirement audit
- [ ] Complete test cases and test evidence
- [ ] Final project documentation
- [ ] Hosted working website
- [ ] GitHub repository review
- [ ] Demonstration video with voice-over
- [ ] Final ZIP submission

### Final check before submission

The SRS states that all functional and non-functional requirements are expected unless they are explicitly marked optional. Any optional feature should be presented as an enhancement rather than as a replacement for a required feature.

---

## Current Priority

1. Verify password recovery/reset.
2. Run a complete student and admin workflow test.
3. Test reports, CSV import, notifications, and Campus AI on the hosted version.
4. Complete final documentation and test evidence.
5. Record the project demonstration video.
6. Submit the hosted URL, repository, database files, credentials, and documentation together.
