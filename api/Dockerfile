FROM python:3.10

ARG ENV

ENV PYTHONUNBUFFERED 1
ENV PYTHONPATH $PYTHONPATH:/api:/api/app
ENV DJANGO_SETTINGS_MODULE app.settings.${ENV}

WORKDIR /api/

ADD requirements/ requirements/

RUN pip install -r requirements/${ENV}.txt

ADD app/ app/