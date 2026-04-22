#!/usr/bin/env bash
# One-shot GCP project + service account bootstrap for Google Search Console access.
#
# What this does (0 browser clicks after prerequisites):
#   1. Creates GCP project yakuten-seo (idempotent — reuses if exists)
#   2. Enables Search Console API
#   3. Creates service account gsc-reader
#   4. Creates a JSON key and writes it to .gsc-credentials.json
#   5. Prints the service account email + direct Search Console user-add URL
#
# Prerequisites (one-time, on YOUR machine, with YOUR Google account):
#   - gcloud CLI installed:  https://cloud.google.com/sdk/docs/install
#   - gcloud auth login            # opens your browser, you log into your own Google account
#   - You must have a billing-enabled account attached to the project
#     (Search Console API is free-tier eligible; no charges expected)
#
# What's still manual (Google has no API for this):
#   - Pasting the service account email into Search Console > Settings > Users
#     (The script prints a direct URL at the end.)
#
# Usage:
#   bash scripts/seo/setup-gcp.sh
# or
#   PROJECT_ID=my-custom-id bash scripts/seo/setup-gcp.sh

set -euo pipefail

PROJECT_ID="${PROJECT_ID:-yakuten-seo-$(date +%Y%m%d)}"
SA_NAME="${SA_NAME:-gsc-reader}"
KEY_PATH="${KEY_PATH:-.gsc-credentials.json}"
SA_DISPLAY="HRT Yakuten — GSC reader"

echo "=============================================="
echo " GCP bootstrap for GSC automation"
echo "=============================================="
echo " Project:       $PROJECT_ID"
echo " SA:            $SA_NAME"
echo " Key path:      $KEY_PATH"
echo "----------------------------------------------"

# 0. Sanity checks
if ! command -v gcloud >/dev/null 2>&1; then
  echo "ERROR: gcloud CLI not installed."
  echo "Install:  https://cloud.google.com/sdk/docs/install"
  exit 1
fi

if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q '@'; then
  echo "ERROR: not logged in. Run:  gcloud auth login"
  exit 1
fi
ACTIVE_ACCOUNT=$(gcloud auth list --filter=status:ACTIVE --format="value(account)" | head -1)
echo "Active account: $ACTIVE_ACCOUNT"

# 1. Create or reuse project
if gcloud projects describe "$PROJECT_ID" >/dev/null 2>&1; then
  echo "✓ Project $PROJECT_ID already exists — reusing"
else
  echo "→ Creating project $PROJECT_ID …"
  gcloud projects create "$PROJECT_ID" --name="HRT Yakuten SEO"
fi
gcloud config set project "$PROJECT_ID" >/dev/null

# 2. Enable Search Console API
echo "→ Enabling Search Console API …"
gcloud services enable searchconsole.googleapis.com --project="$PROJECT_ID" || {
  cat <<ERR
Failed to enable APIs. Most common cause: project has no billing account.
Fix: attach any billing account (Google Cloud free tier is fine):
  https://console.cloud.google.com/billing/linkedaccount?project=$PROJECT_ID
Then re-run this script.
ERR
  exit 1
}

# 3. Create service account
SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
if gcloud iam service-accounts describe "$SA_EMAIL" --project="$PROJECT_ID" >/dev/null 2>&1; then
  echo "✓ Service account $SA_EMAIL already exists"
else
  echo "→ Creating service account $SA_NAME …"
  gcloud iam service-accounts create "$SA_NAME" \
    --display-name="$SA_DISPLAY" \
    --project="$PROJECT_ID"
fi

# 4. Create and download JSON key
if [[ -f "$KEY_PATH" ]]; then
  echo "⚠  $KEY_PATH already exists."
  read -p "   Overwrite with new key? [y/N] " reply
  if [[ "${reply,,}" != "y" ]]; then
    echo "   Keeping existing key. Skipping key creation."
  else
    mv "$KEY_PATH" "${KEY_PATH}.bak.$(date +%s)"
    gcloud iam service-accounts keys create "$KEY_PATH" \
      --iam-account="$SA_EMAIL" \
      --project="$PROJECT_ID"
    echo "✓ Wrote $KEY_PATH (previous key backed up)"
  fi
else
  echo "→ Creating JSON key → $KEY_PATH (up to 3 retries for IAM propagation)"
  for attempt in 1 2 3; do
    if gcloud iam service-accounts keys create "$KEY_PATH" \
         --iam-account="$SA_EMAIL" \
         --project="$PROJECT_ID" 2>/dev/null; then
      break
    fi
    echo "   attempt $attempt failed (IAM not yet propagated); waiting 10s…"
    sleep 10
  done
  if [[ ! -f "$KEY_PATH" ]]; then
    echo "ERROR: key creation failed after 3 attempts."
    exit 1
  fi
fi

chmod 600 "$KEY_PATH" 2>/dev/null || true

# 5. Print what's left
cat <<EOF

==============================================
 GCP side complete.
==============================================

Service account email (COPY THIS):
    $SA_EMAIL

One remaining manual step (30 seconds):

  1) Open Search Console Users page:
     https://search.google.com/search-console/users?resource_id=sc-domain:hrtyaku.com

  2) Click "Add user"
  3) Paste the email above
  4) Permission: "Full" (or "Restricted" works too, read-only is enough)
  5) Save

NOTE: If you haven't verified the domain hrtyaku.com in Search Console yet,
do that first via:
     https://search.google.com/search-console/welcome

After adding the user, run:
     npm run seo:gsc

You should see something like:
     → GSC query  site=sc-domain:hrtyaku.com  ...
     ✓ 186 queries → docs/data/gsc-YYYY-MM-DD.csv

If you get "User does not have sufficient permissions for site":
  • Double-check the email pasted exactly matches $SA_EMAIL
  • Check you added it to the correct property (sc-domain:hrtyaku.com)
  • Wait 1-2 minutes for Google's permission cache to propagate

EOF
