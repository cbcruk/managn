#!/bin/bash
cd "$(dirname "$0")/../admin"
source venv/bin/activate
python manage.py runserver
