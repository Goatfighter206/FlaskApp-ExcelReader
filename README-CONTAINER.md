Container quickstart

This repository contains a small Flask app that reads and appends rows to Excel files.

Quick local demo (prod image using gunicorn)

1. Build the production image:

```bash
docker build -t excel-reader:prod -f Dockerfile.prod .
```

2. Run the container (bind to host port 8081):

```bash
docker run --rm -p 8081:8080 --name excel-reader-prod excel-reader:prod
```

3. Health check:

```bash
curl http://127.0.0.1:8081/health
# should return: {"status":"ok"}
```

4. Upload a sample Excel file (server will save to /app/uploads inside the container):

```bash
curl -X POST -F "openFile=1" -F "excel_file=@tests/sample.xlsx" http://127.0.0.1:8081/output
```

5. Download the uploaded file:

```bash
curl -o /tmp/sample_download.xlsx http://127.0.0.1:8081/download/sample.xlsx
```

Using docker-compose (recommended for local dev)

```bash
# build and start via docker-compose
docker-compose up --build -d
# stop
docker-compose down
```

Notes

- The repo includes `requirements.docker.txt` (minimal runtime dependencies) used by `Dockerfile.prod` and CI to speed up builds.
- CI will build the `Dockerfile.prod` image. To publish images from CI you must add registry credentials to the repository secrets.
- If you accidentally committed secrets (files like `access key`), rotate those credentials immediately and remove the file from the repository. If you need help removing secrets from history, I can guide or perform that with confirmation.
