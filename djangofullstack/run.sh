#!/bin/bash

# RUN FRONT END
npm run dev &

# RUN BACK END
cd leadmanager
pipenv run python manage.py runserver
