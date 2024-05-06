FROM python:3.11.2

#Environment to prevent buffer
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /code

COPY . .

RUN pip install -r requirements.txt

# EXPOSE 8000

