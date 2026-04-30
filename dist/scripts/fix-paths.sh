#!/bin/bash
# Post-build: Force absolute paths in dist/index.html
if [ -f "dist/index.html" ]; then
  # Replace ./assets/ with /assets/
  sed -i 's|src="./assets/|src="/assets/|g' dist/index.html
  sed -i 's|href="./assets/|href="/assets/|g' dist/index.html
  echo "✅ Asset paths fixed to absolute in dist/index.html"
fi
