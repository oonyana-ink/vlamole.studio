#!/bin/bash

COMMAND="$1"
shift
case "$COMMAND" in

        dj)
            django-admin $@
            ;;

        serve_dev)
            django-admin collectstatic --clear --noinput
            django-admin runserver 0.0.0.0:8000
            ;;

        serve)
            django-admin migrate --noinput
            daphne -b 0.0.0.0 -p 8000 --ws-protocol "graphql-ws" --proxy-headers app.asgi:application
            ;;

        ack_healthcheck)
            nohup daphne -b 0.0.0.0 -p 8000 app.healthcheck:healthcheck &
            ;;

        worker)
            $0 ack_healthcheck
            if [ "$ENV" == "development" ]
            then
                watchmedo auto-restart --recursive -d app/ -p '*.py;*.sh' -- \
                    celery -A app.celery_worker worker -l warning -E -Q $@
            else
                celery -A app.celery_worker worker -l warning -E -Q $@
            fi
            ;;

        beat)
            $0 ack_healthcheck
            celery -A app.celery_app beat -l error
            ;;

        *)
            echo "Unrecognized command: $COMMAND"
            exit 1

esac