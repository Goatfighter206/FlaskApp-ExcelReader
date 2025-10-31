FROM python:3.12-slim

# create app directory
WORKDIR /app

# install dependencies
COPY requirements.txt /app/requirements.txt
RUN python -m pip install --upgrade pip \
    && pip install --no-cache-dir -r /app/requirements.txt

# option to enable ClamAV scanning in container image
ARG INSTALL_CLAMAV=false
RUN if [ "$INSTALL_CLAMAV" = "true" ]; then \
            apt-get update && apt-get install -y --no-install-recommends clamav clamav-daemon clamav-freshclam && rm -rf /var/lib/apt/lists/* ;\
        fi

# copy application
COPY . /app

# ensure uploads directory exists and is writable
RUN mkdir -p /app/uploads && chown -R 1000:1000 /app/uploads || true

EXPOSE 8080

# run as non-root user where possible
USER 1000

CMD ["python", "app.py"]
