FROM python:3.11

# Add django as user and group
RUN addgroup --system django \
    && adduser --system --ingroup django django
    
# Set environment variables
# turns off an automatic check for pip updates each time
ENV PIP_DISABLE_PIP_VERSION_CHECK 1
# means Python will not try to write .pyc files
ENV PYTHONDONTWRITEBYTECODE 1



WORKDIR /app
# Install dependencies
# Since ebustoolbox and mapengine are installed as well, copy whole directory first
COPY . /app

# Install poetry separated from system interpreter
RUN pip install -r requirements.txt

#startup_command=poetry run python -c 'print(\"Started\")' && poetry run python manage.py makemigrations && poetry run python manage.py migrate && poetry run python manage.py runserver 0.0.0.0:8000
CMD python3 manage.py runserver
