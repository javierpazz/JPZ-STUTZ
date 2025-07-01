@echo off
cd /d C:\JPZ-STUTZ\backend
docker compose down -v
docker compose up -d
