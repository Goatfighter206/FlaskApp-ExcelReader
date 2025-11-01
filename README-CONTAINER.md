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

Publish from CI (what's needed)

To allow the `publish` job in `.github/workflows/ci.yml` to build and push images, add these repository secrets in Settings → Secrets → Actions:

- `DOCKER_USERNAME` — your registry username (e.g., Docker Hub username)
- `DOCKER_PASSWORD` — a registry password or access token
- `DOCKER_REGISTRY` (optional) — registry host (default: `docker.io`)

The CI `publish` job is guarded and will run only on `master` and only if the secrets are present.

How to purge an accidental secret (safe guidance — do not run blindly)

If you have an exposed secret in a past commit and you want to remove it from history, follow this safe plan:

1. Rotate/replace the exposed secret immediately (API token, password). Do not assume removal will protect the old secret.
2. Create a local backup branch for safety: `git branch backup-with-secret`.
3. Use a history-rewriting tool like `git filter-repo` or the BFG Repo-Cleaner to remove the file from all commits. Example with `git filter-repo`:

```bash
# install filter-repo (requires Python/pip)
pip install git-filter-repo

# remove a file named exactly 'access key' from history
git clone --mirror https://github.com/YourOrg/FlaskApp-ExcelReader.git
cd FlaskApp-ExcelReader.git
git filter-repo --invert-paths --paths "access key"
git push --force --all
git push --force --tags
```

4. Notify collaborators — force-pushing rewritten history requires everyone to re-clone or carefully rebase.
5. Confirm that the secret no longer appears: use GitHub's secret scanning and local `git grep` commands.

If you'd like me to perform the history rewrite for you, I can prepare and run the exact commands — but I will only proceed after you confirm and after you've rotated the exposed credentials.
