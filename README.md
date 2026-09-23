# Stockroom Product Admin Dashboard

A responsive product administration dashboard built with Next.js, React, Tailwind CSS, and Axios on top of the DummyJSON API.

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000` and sign in with:

- Username: `emilys`
- Password: `emilyspass`

Useful checks:

```bash
npm run lint
npm run build
```

## Completed

- Login with protected product routes, token injection, session expiry handling, and logout.
- Responsive product table/cards with image, category, price, rating, stock, pagination, page size, loading, empty, error, and retry states.
- Debounced search, category filtering, sorting, and URL state for search, category, sort, order, page, and page size.
- Product details with image gallery and reviews.
- Validated add/edit forms, confirmation dialogs, and delete actions.
- Stale product requests are cancelled so older search results cannot replace newer ones.
- Invalid page values are normalized after the API response reports the available total.

## Implementation Notes

DummyJSON does not provide a combined search-and-category endpoint. To keep the API behavior predictable, choosing a category clears the search value; search and category are therefore mutually exclusive in the UI and URL.

DummyJSON add, update, and delete endpoints simulate mutations without permanently changing the server dataset. New products and edited products are stored in `localStorage` under `pad_local_products`, and local overrides are merged into the dashboard. This makes changes visible in the app after navigation and refresh on the same browser.

Axios is configured once in `lib/axios.js`. Its request interceptor adds the stored bearer token, while its response interceptor normalizes errors and redirects expired sessions to login.

## AI Note

I used AI mainly for suggestions, debugging, and identifying edge cases. I understood and reviewed the code myself, made the final changes, and validated everything with the project requirements and build checks.