#!/bin/bash
# Automated Git Sync Script (Bash version)
# Runs git add, commit, and push every 4 minutes until 7:30 PM

END_TIME="19:30:00"
COMMIT_COUNTER=0
BASE_MESSAGE="hffhfh"

echo "🚀 Starting automated git sync..."
echo "⏰ Will run until: $END_TIME"
echo "📝 Commit interval: 4 minutes"
echo "Press Ctrl+C to stop manually"
echo ""

while true; do
    CURRENT_TIME=$(date +%H:%M:%S)
    CURRENT_EPOCH=$(date +%s)
    END_EPOCH=$(date -d "$END_TIME" +%s 2>/dev/null || date -j -f %H:%M:%S "$END_TIME" +%s)

    if [ $CURRENT_EPOCH -ge $END_EPOCH ]; then
        echo "🏁 Reached 7:30 PM. Stopping."
        break
    fi

    COMMIT_COUNTER=$((COMMIT_COUNTER + 1))

    # Build commit message with incremental characters
    EXTRA_CHARS=$(printf 'x%.0s' $(seq 1 $COMMIT_COUNTER))
    COMMIT_MESSAGE="${BASE_MESSAGE}${EXTRA_CHARS}"

    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "⏱️  [$CURRENT_TIME] Sync #$COMMIT_COUNTER"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Git add
    echo ""
    echo "📦 Adding files..."
    git add .

    # Check if there are changes to commit
    if [ -n "$(git status --porcelain)" ]; then
        echo "✅ Files staged"

        # Git commit
        echo "📝 Committing: $COMMIT_MESSAGE"
        git commit -m "$COMMIT_MESSAGE"
        echo "✅ Commit successful"

        # Git push
        echo "🚀 Pushing to origin main..."
        git push origin main
        echo "✅ Push successful"
    else
        echo "ℹ️  No changes to commit"
    fi

    # Calculate next run time
    NEXT_RUN=$(date -d "+4 minutes" +%H:%M:%S 2>/dev/null || date -v +4M +%H:%M:%S)
    NEXT_EPOCH=$(date -d "$NEXT_RUN" +%s 2>/dev/null || date -j -f %H:%M:%S "$NEXT_RUN" +%s)

    if [ $NEXT_EPOCH -ge $END_EPOCH ]; then
        echo ""
        echo "🏁 Next run would be after 7:30 PM. Stopping."
        break
    fi

    echo ""
    echo "⏳ Next sync at: $NEXT_RUN"
    echo "💤 Waiting 4 minutes..."

    # Sleep for 4 minutes (240 seconds)
    sleep 240
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 Automated git sync completed!"
echo "📊 Total syncs: $COMMIT_COUNTER"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
