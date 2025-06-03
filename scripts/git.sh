#!/bin/bash

# Navigate to repo root
cd "$(dirname "$0")/.." || exit 1

git fetch origin

# Arrays to hold results
success_branches=()
failed_branches=()

for branch in $(git branch -r | grep -v 'master' | grep -v 'HEAD' | sed 's/origin\///'); do
  echo "🔄 Syncing branch: $branch"
  
  git checkout "$branch" >/dev/null 2>&1
  if git merge origin/master -m "Sync with master" >/dev/null 2>&1; then
    git push origin "$branch" >/dev/null 2>&1
    success_branches+=("$branch")
    echo "✅ Successfully synced $branch"
  else
    failed_branches+=("$branch")
    echo "❌ Failed to sync $branch"
  fi
done

git checkout master >/dev/null 2>&1
git branch | grep -v "master" | xargs git branch -D

# Show summary
echo ""
echo "📋 Sync Summary:"
echo "-----------------------------"

for b in "${success_branches[@]}"; do
  echo "✅ $b"
done

for b in "${failed_branches[@]}"; do
  echo "❌ $b"
done
