# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start the development server with hot module replacement (HMR)
- `npm run build` - Build the application for production
- `npm run lint` - Run ESLint to check for code issues
- `npm run preview` - Preview the production build locally

## Development Guidelines

### Important Notes
- Do not modify the DaisyUI and TailwindCSS configuration - this has been finalized
- Focus on implementing and enhancing functionality features only

## Architecture

### Overview
This is a React frontend application built with Vite for an expense tracking and splitting system. The application allows users to manage expenses, view summaries, and calculate how to split expenses among people.

### API Integration
- API communication is centralized in `src/api.js`, which defines functions for CRUD operations and data retrieval
- The backend API is expected to run on `http://localhost:3000`
- All API functions are async/await based and return promises

### Routing
- Uses React Router v7 for navigation
- Main routes defined in `App.jsx`:
  - `/expenses` - List of expenses (default route)
  - `/add` - Add new expense
  - `/edit/:id` - Edit existing expense
  - `/summary` - View monthly expense summaries
  - `/split` - Calculate expense splits between people

### Components Structure
- **Pages**: Main views of the application
  - `Expenses.jsx` - Lists all expenses with filtering capabilities
  - `AddExpense.jsx` - Form page for adding/editing expenses
  - `Summary.jsx` - Shows monthly expense summaries
  - `SplitSummary.jsx` - Shows balance calculations between people

- **Components**: Reusable UI elements
  - `ExpenseForm.jsx` - Form component for expense creation/editing

### Data Model
Expenses have the following structure:
- `description`: String - Description of the expense
- `amount`: Number - Amount of the expense
- `tags`: Array of Strings - Categories for the expense
- `date`: String - Date of the expense
- `type`: String - Either "expense" or "income"
- `paidBy`: String - Person who paid the expense
- `splitTo`: Array of Strings - People to split the expense with

### UI Framework
- Uses Tailwind CSS with DaisyUI components for styling