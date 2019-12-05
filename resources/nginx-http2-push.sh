#!/bin/bash
set -euf -o pipefail

cd "$(realpath "$(dirname "${0}")"/../dist)"

# styles
FILES=$(find ./css -type f -not -name '*.gz' | sed 's/^\.//g' | sort -h)
while read -r line; do
  printf 'http2_push "%s";\n' "${line}"
done <<<"${FILES}"
