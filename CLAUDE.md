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

### Content System
Uses Astro's content collections with custom loaders that dynamically fetch from the database:
- Books collection loads released books with author relationships
- Authors collection loads authors with their associated books
- Book cover images stored in `src/content/books/assets/` as `.webp` files

### API Routes
RESTful API endpoints in `src/pages/api/`:
- `/api/books` - CRUD operations for books
- `/api/authors` - Author management
- `/api/book_authors` - Author-book relationships
- `/api/upload-cover` - Image upload and WebP conversion (uses imagemin)
- `/api/imagemin` - Batch image processing (legacy, processes all files)

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
- Image uploads automatically convert to WebP format and save as `{book_id}.webp`

### Known Issues
- Content collections with DB references can fail validation if data relationships are incomplete
- Workaround: Use `/books/add` and `/authors/add` UI instead of direct DB manipulation
- See `CONTENT_COLLECTION_REDESIGN.md` for detailed analysis and solution options