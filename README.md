# Multi-Step User Profile Update Form

A full-stack Next.js application for updating user profiles with a multi-step form, real-time validation, dynamic fields, and MongoDB integration.

## Features

- **Multi-Step Form**: Four steps—Personal Info, Professional Details, Preferences, and Summary.
- **Frontend & Backend Validation**: All fields are validated both client-side and server-side, with no third-party validation libraries.
- **Dynamic Fields**:
  - "Other" in Gender shows a custom input box.
  - "Company Details" section appears only if Profession is "Entrepreneur".
- **File Upload**:
  - Profile picture upload (JPG/PNG, ≤2MB) with live preview.
- **Password Update**:
  - Current Password required for password change.
  - New Password must be 8+ chars, include 1 special character, and 1 number.
  - Password strength meter with real-time feedback.
- **Username Availability**: Checks username uniqueness via API as you type.
- **Conditional Logic**:
  - Address fields reset if Country changes.
  - State and City dropdowns update dynamically based on selections.
  - Date of Birth cannot be set to a future date.
- **Summary Page**: Review all information before final submission.
- **MongoDB Integration**: All data is saved to MongoDB on final submit.

## Form Steps & Fields

| Step | Fields                                                                                  |
| ---- | --------------------------------------------------------------------------------------- |
| 1    | Profile Photo, Username, Current Password, New Password                                 |
| 2    | Profession, Company Name (if Entrepreneur), Address Line 1                              |
| 3    | Country, State, City, Subscription Plan (Radio), Newsletter (Checkbox, default checked) |
| 4    | Summary (Review all info before submit)                                                 |

## Validation Rules

| Field             | Type         | Validation                               |
| ----------------- | ------------ | ---------------------------------------- |
| Profile Photo     | File Upload  | Required, JPG/PNG, ≤2MB                  |
| Username          | Text         | Unique, 4-20 chars, no spaces            |
| Current Password  | Password     | Required if changing password            |
| New Password      | Password     | 8+ chars, 1 special char, 1 number       |
| Profession        | Dropdown     | ["Student", "Developer", "Entrepreneur"] |
| Company Name      | Text         | Required if Profession=Entrepreneur      |
| Address Line 1    | Text         | Required                                 |
| Country           | Dropdown     | Fetched from DB via API                  |
| State             | Dropdown     | Must match selected country              |
| City              | Dropdown     | Must match selected state                |
| Subscription Plan | Radio Button | ["Basic", "Pro", "Enterprise"]           |
| Newsletter        | Checkbox     | Default checked                          |

## Getting Started

### Prerequisites

- [pnpm](https://pnpm.io/) or npm/yarn
- MongoDB instance (local or cloud)

### Installation

1. **Clone the repository:**

   ```sh
   git clone <your-repo-url>
   cd profile-form
   ```

2. **Install dependencies:**

   ```sh
   pnpm install
   # or
   npm install
   ```

3. **Configure environment variables:**

   - Copy `.env.example` to `.env` and set your MongoDB connection string.

4. **Run the development server:**

   ```sh
   pnpm dev
   # or
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Project Structure

- `app/` — Next.js app directory (pages, API routes, layout)
- `components/` — React components (form steps, UI elements)
- `lib/` — Database connection and utilities
- `hooks/` — Custom React hooks
- `public/` — Static assets (including uploaded profile photos)
- `styles/` — Global and component styles

## API Endpoints

- `/api/location` — Fetch countries, states, and cities for dropdowns
- `/api/validation` — Username availability check

## Notes

- No third-party validation libraries are used.
- All validation logic is implemented in the frontend and backend for security.
- File uploads are stored in `public/uploads/`.
- Passwords are hashed before saving to the database.

## License

MIT

---

**Made with Next.js, React, and MongoDB**
