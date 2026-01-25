#!/bin/bash
set -euo pipefail

echo "Starting deployment process..."
if npm run build; then
  echo "Build successful."
  echo "Deploying to production server..."
  # Simulate deployment delay
  sleep 2
  echo "Deployment complete! Application is live."
else
  echo "Build failed. Deployment aborted." >&2
  exit 1
fi
