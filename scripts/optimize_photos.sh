#!/usr/bin/env bash
set -euo pipefail

# Resizes & re-encodes the source photos into images/full (1600px) and images/thumb (480px).
# Output filenames are zero-padded sequential (01.jpg ... 32.jpg) preserving the
# user-intended order: the 8 cover photos (a-h), then natural-numeric house photos,
# then neighborhood reference photos (Copperfield Park, Domain).

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$ROOT/Zillow Photos Post on FB"
FULL="$ROOT/images/full"
THUMB="$ROOT/images/thumb"

mkdir -p "$FULL" "$THUMB"

photos=(
  "9694372_01_acoverphoto.jpg"
  "9694372_01_bcoverphoto.jpg"
  "9694372_01_ccoverphoto.jpg"
  "9694372_01_dcoverphoto.jpg"
  "9694372_01_ecoverphoto.jpg"
  "9694372_01_fcoverphoto.jpg"
  "9694372_01_gcoverphoto.jpg"
  "9694372_01_hcoverphoto.jpg"
  "9694372_7_0.jpg"
  "9694372_9_0.jpg"
  "9694372_10_0.jpg"
  "9694372_12_0.jpg"
  "9694372_14_0.jpg"
  "9694372_15_0a.jpg"
  "9694372_16_0.jpeg"
  "9694372_17_0a.jpg"
  "9694372_18_0.jpg"
  "9694372_19_0a.jpg"
  "9694372_20_0.jpg"
  "9694372_22_0a.jpg"
  "9694372_23_0.jpg"
  "9694372_23_1.jpg"
  "9694372_24_0.jpg"
  "9694372_25_0.jpg"
  "9694372_26_0.jpeg"
  "9694372_27_0.jpeg"
  "9694372_28_0.jpeg"
  "9694372_29_0a.jpeg"
  "9694372_30.jpeg"
  "9694372_31.jpeg"
  "copperfield park.jpeg"
  "domain.jpeg"
)

i=1
for name in "${photos[@]}"; do
  n=$(printf "%02d" "$i")
  src="$SRC/$name"
  if [[ ! -f "$src" ]]; then
    echo "MISSING: $src" >&2
    exit 1
  fi
  echo "[$n] $name"
  sips -Z 1600 -s format jpeg -s formatOptions 78 "$src" --out "$FULL/$n.jpg" >/dev/null
  sips -Z 480  -s format jpeg -s formatOptions 70 "$src" --out "$THUMB/$n.jpg" >/dev/null
  i=$((i+1))
done

echo
echo "Done. Generated $((i-1)) photos in $FULL and $THUMB"
du -sh "$FULL" "$THUMB"
