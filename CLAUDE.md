# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production  
- `pnpm preview` - Preview production build
- `pnpm test` - Run tests with Vitest

## Architecture Overview

This is an Astro application for managing Korean-Japanese book translations, featuring a book catalog with author relationships.

### Technology Stack
- **Frontend**: Astro + React (with experimental React Compiler)
- **Database**: SQLite with Drizzle ORM + libSQL client
- **Styling**: Tailwind CSS
- **Testing**: Vitest with jsdom environment
- **Deployment**: Vercel adapter

### Database Schema
The application uses three main tables:
- `books` - Book information (Korean/Japanese titles, status, links)
- `authors` - Author information (Korean/Japanese names)  
- `book_authors` - Many-to-many relationship between books and authors

### Data Architecture
**Pure Database Architecture** (Updated 2025-09-03):
- Removed Astro Content Collections due to validation issues with DB references
- Implemented direct database queries via `src/lib/data.ts`
- All data access goes through typed helper functions with JSDoc documentation
- Book cover images stored in `public/books/` as `.webp` files for production compatibility

### API Routes
RESTful API endpoints in `src/pages/api/`:
- `/api/books` - CRUD operations for books
- `/api/authors` - Author management
- `/api/book_authors` - Author-book relationships
- `/api/imagemin` - Batch image processing (processes files in `public/books/`)

### Component Structure
- Form components in `src/components/` with separate action handlers
- Layout components with comprehensive test coverage
- React components use `react-twc` for styled components
- Search functionality powered by Fuse.js

### Database Configuration
- Uses both Astro:db configuration (`db/config.ts`) and Drizzle schema (`db/schema.ts`)
- Local SQLite database (`managn.db`) with libSQL client
- Zod schemas auto-generated from Drizzle tables for validation

### Admin UI (Development Only)
- `/books/add` - Add new books with image upload support
- `/authors/add` - Add new authors
- Admin links appear in header during development mode
- Image uploads automatically convert to WebP format and save to `public/books/{book_id}.webp`

### Data Access Layer (`src/lib/data.ts`)
Key functions for database operations:
- `getReleasedBooks()` - Retrieves all published books with author relationships
- `getReleasedBooksByAuthor(authorId)` - Gets books by specific author
- `getAuthorsWithBooks()` - Gets authors who have published books
- `getAuthorById(authorId)` - Retrieves single author data
- `getRandomBooks(count)` - Returns random selection of books for homepage
- Helper functions: `createCoverUrl()`, `parseAuthorData()`, `parseBookData()`, `transformBookRow()`

### Migration Notes
**Content Collections → Pure DB Architecture** (Completed 2025-09-03):
- Resolved validation issues with Content Collection reference failures
- All pages now use direct database queries instead of `getCollection()`
- Image assets moved from `src/content/books/assets/` to `public/books/` using `git mv`
- Updated TypeScript types and improved error handling with proper type guards
- Build successfully prerenders 263 author pages and 19 book pages

### Development Notes
- Use `pnpm build` to verify all static routes prerender correctly
- Database queries use Drizzle ORM with proper type safety and `inArray()` for complex filters
- Image paths now use `/books/{id}.webp` format for production compatibility

### Documentation
- `docs/content-collection-redesign.md` - Complete analysis and solution of Content Collections migration