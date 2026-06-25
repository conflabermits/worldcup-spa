#!/bin/bash
echo "Building static assets using Docker..."
docker run --rm -v $(pwd):/app -w /app node:22-alpine npm run build
echo "Build complete. Assets are in the /worldcup folder."
