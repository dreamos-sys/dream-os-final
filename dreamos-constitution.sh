#!/bin/bash
echo -e "\033[0;32m🕌 Dream OS Constitution v1.0.0 \033[0m"
dreamos-push() {
    git add -A
    git commit -m "$1"
    git push origin gh-pages --force
}
