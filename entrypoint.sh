#!/bin/sh
set -e

# Disable NextJs telemetry
npx next telemetry disable

# Starting the NextJs server...
npx next start -p 8080

