FROM python:3.7.3

RUN pip install \
  flask==1.0.2 \
  flask-cors==3.0.7 \
  uwsgi==2.0.18

WORKDIR /app
COPY app/ .
CMD uwsgi --py-autoreload 1 --http :80 --wsgi-file app.py