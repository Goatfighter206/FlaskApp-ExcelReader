# Excel Reader
-------------
A web application developed using Flask to read from and write to excel files.

## App demo
![](https://github.com/pradeepkumar-27/FlaskApp-ExcelReader/blob/master/ExcelReaderDemo.gif)

## Prerequisites
---------------
    pip install numpy
    pip install pandas
    pip install flask
    
## Usage
--------
You can run the app using the following command or using a WSGI server.

    python FlaskApp-ExcelReader/app.py


## Quick start (run & test)

Install dependencies (preferably inside a virtualenv):

```bash
python -m pip install -r requirements.txt
```

Run the development server:

```bash
python app.py
```

Open http://127.0.0.1:8080 in your browser and upload an `.xls` or `.xlsx` file.

Run tests:

```bash
pytest
```

CI: A GitHub Actions workflow is included at `.github/workflows/ci.yml` which runs the test suite on push/PR.

Authentication & Security
-------------------------
To enable HTTP Basic Auth for the UI, set these environment variables before running the app:

```bash
export AUTH_ENABLED=true
export AUTH_USER=admin
export AUTH_PASS=strongpassword
```

Malware scanning is available as a stub that calls `clamscan` when enabled:

```bash
export CLAMAV_ENABLED=true
```

Note: `CLAMAV_ENABLED` requires `clamscan` to be installed in the environment or container. The current implementation will skip scanning unless enabled.

To build the Docker image with ClamAV installed (so scans can run inside the container), build with the build-arg:

```bash
docker build --build-arg INSTALL_CLAMAV=true -t excel-reader .
```

Then run the container with CLAMAV_ENABLED=true in the environment if you want uploads scanned.

Docker
------
You can build and run the app in Docker:

```bash
# build the image
docker build -t excel-reader .

# run container (maps port 8080)
docker run --rm -p 8080:8080 -v $(pwd)/uploads:/app/uploads excel-reader
```

The app will be available at http://127.0.0.1:8080.
