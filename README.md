# run-santa-run
RLI Christmas Party 2024

THIS IS NOT MEANT FOR PRODUCTIVE USE, ONLY LOCAL DEMONSTRATION.

## Install
A working redis installation is required.
Needs no database, creates a local sqlite file.
```
pip install -r requirements.txt
python manage.py migrate
```

## Run
`python manage.py runserver`
Take note of IP and port in console output, is localhost:8000 by default.
If you want to use a different port (e.g., 3000), call `python manage.py runserver 0:3000` and set the new port in server/settings.py (required to generate correct QR code).
Go to localhost:8000/lobby (or where appropriate).
Clients can connect to localhost:8000 (QR code contains local IP and port).
Main game is at localhost:8000/run.

## Code Structure
server: all Django-specific stuff, like url routes and settings.
santa: main game logic, like backend with Socket connectors (views.py) and frontend (templates, 3rd party QR code library in static).
