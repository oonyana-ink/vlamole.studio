FROM python:3.8.3

RUN mkdir -p /themeify
ADD ./requirements.txt /themeify/requirements.txt

ENV PATH "/themeify/bin:${PATH}"

# RUN curl -s https://shopify.github.io/themekit/scripts/install.py | python2
RUN curl -s https://shopify.dev/themekit.py | python
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash -
RUN apt-get update && apt-get install -y inotify-tools nodejs git-crypt rsync
RUN pip install --upgrade pip
RUN pip install -r /themeify/requirements.txt

ENV PYTHONPATH "/themeify:${PYTHONPATH}"
