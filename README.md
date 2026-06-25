# World Cup 2026 Consolidator

A static, single-page application built with React and Vite that provides a clean, consolidated view of World Cup group standings and match schedules. Data is sourced live from ESPN APIs with a smart client-side caching layer to prevent API abuse.



## Features
- **Consolidated View:** All 48 teams displayed in a single, sortable table.
- **Dynamic Columns:** View chronological group and knockout stage matches side by side.
- **Smart Caching:** LocalStorage caching that dynamically adjusts its TTL (5 mins during active matches, 60 mins otherwise).
- **Fully Portable:** The build output is completely path and hostname agnostic. You can drop the generated files into any sub-directory on any server.

## Requirements
- Docker (for zero-dependency local development) OR Node.js 18+

## Local Development (via Docker)
To run the live development server natively via Docker:
```bash
docker-compose up
```
The site will be available at [http://localhost:5173](http://localhost:5173).

## Building for Production
To generate the static assets (HTML/JS/CSS) into the `/worldcup` directory, run:
```bash
./build.sh
```

## Deployment
Because this project builds into purely static assets with relative paths, you can host the `worldcup` folder on any static provider (AWS S3, GitHub Pages, Vercel, Netlify, etc.).

## Development Collaboration
This project is the result of a pair-programming collaboration between human creator **conflabermits** and generative AI assistant **Antigravity**. 
* **conflabermits (Human)**: Designed the core concept, planned the feature milestones, and provided strategic direction, styling feedback, and testing.
* **Antigravity (AI)**: Served as the technical co-pilot. Handled the React implementation, dynamic layout rendering, ESPN API integration, client-side caching logic, and Vite/Docker build environment setup.
