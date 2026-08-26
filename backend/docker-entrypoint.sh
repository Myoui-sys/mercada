#!/bin/sh
set -e

DB_PATH="${DATABASE_PATH:-./data/amazon-simulator.sqlite}"

if [ ! -f "$DB_PATH" ]; then
  echo "[entrypoint] Banco não encontrado em $DB_PATH — rodando seed inicial..."
  node dist/database/seeds/run-seed.js
else
  echo "[entrypoint] Banco já existe em $DB_PATH — pulando seed."
fi

exec node dist/main.js
