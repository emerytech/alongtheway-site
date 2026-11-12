#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
if [ -n "$(git status --porcelain)" ]; then
  echo "Commit the reviewed website before deployment." >&2
  exit 1
fi
npm run build
npm run check:site
revision="$(git rev-parse --short HEAD)"
release="$(date -u +%Y%m%dT%H%M%SZ)-${revision}"
COPYFILE_DISABLE=1 tar --no-xattrs -C dist -cf - . | ssh root@zeus "pct exec 120 -- bash -c '
set -euo pipefail
base=/var/www/alongtheway-site
mkdir -p \"\$base/releases/$release\"
tar -xf - -C \"\$base/releases/$release\"
chmod -R a+rX \"\$base/releases/$release\"
ln -s \"\$base/releases/$release\" \"\$base/current.next\"
mv -Tf \"\$base/current.next\" \"\$base/current\"
curl -fsS -H \"Host: www.alongtheway.cc\" http://127.0.0.1:8080/ >/dev/null
echo \"Website release $release active\"
'"
