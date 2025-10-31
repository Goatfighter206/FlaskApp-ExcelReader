from flask import Flask, render_template, request, send_from_directory
from pandas import read_excel, DataFrame
from werkzeug.utils import secure_filename
from auth import require_auth
from security import scan_file
import os
import numpy as np
import logging

UPLOAD_FOLDER = "uploads"
app = Flask("excel-app")
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
# limit uploads to 4 MB
app.config["MAX_CONTENT_LENGTH"] = 4 * 1024 * 1024

# allowed extensions and mimetypes
ALLOWED_EXTENSIONS = {".xls", ".xlsx"}
ALLOWED_MIMETYPES = {
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
}


def allowed_file(filename: str, mimetype: str | None = None) -> bool:
    """Return True if filename extension and optional mimetype are allowed."""
    _, ext = os.path.splitext(filename.lower())
    if ext not in ALLOWED_EXTENSIONS:
        return False
    if mimetype:
        return mimetype in ALLOWED_MIMETYPES
    return True


# ensure upload folder exists
os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)

# configure basic logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)
# also log to a rotating file for easy debugging in container or dev
try:
    from logging.handlers import RotatingFileHandler

    fh = RotatingFileHandler("app.log", maxBytes=5 * 1024 * 1024, backupCount=3)
    fh.setLevel(logging.INFO)
    fh.setFormatter(logging.Formatter("%(asctime)s %(levelname)s %(message)s"))
    logger.addHandler(fh)
except Exception:
    logger.warning("RotatingFileHandler not available; continuing without file logs")


@app.route("/")
@require_auth
def homepage():
    return render_template("home.html")


@app.route("/output", methods=["POST"])
def output():
    if request.method == "POST":
        if request.form.get("openFile"):
            file = request.files.get("excel_file")
            if not file or not file.filename:
                return render_template("home.html", error="No file selected")
            # check both extension and reported mimetype
            if not allowed_file(file.filename, getattr(file, "mimetype", None)):
                error_msg = (
                    "Unsupported file type. " "Please upload .xls or .xlsx files."
                )
                return render_template("home.html", error=error_msg)
            fileName = secure_filename(file.filename)
            save_path = os.path.join(app.config["UPLOAD_FOLDER"], fileName)
            file.save(save_path)
            logger.info("Saved uploaded file: %s", save_path)
            # optional malware scan
            clean, msg = scan_file(save_path)
            if not clean:
                logger.warning("Malware scan failed for %s: %s", save_path, msg)
                return render_template("home.html", error="Uploaded file failed malware scan")
            try:
                db = read_excel(save_path)
            except Exception as e:
                logger.exception("Failed to read uploaded Excel file %s", save_path)
                err = f"Failed to read Excel file: {e}"
                return render_template("home.html", error=err)
            columnNames = db.columns.to_list()
            data = db.values
            return render_template(
                "output.html", columnNames=columnNames, data=data, fileName=fileName
            )

        elif request.form.get("newData"):
            fileName = secure_filename(request.form.get("fileName", ""))
            if not fileName:
                return render_template(
                    "home.html", error="No filename provided for update"
                )
            file_path = os.path.join(app.config["UPLOAD_FOLDER"], fileName)
            if not os.path.exists(file_path):
                return render_template("home.html", error="File not found")
            try:
                db = read_excel(file_path)
            except Exception as e:
                return render_template(
                    "home.html", error=f"Failed to read Excel file: {e}"
                )
            columnNames = db.columns.to_list()
            data = db.values
            # collect new row values in the same order as columns
            row_values = [request.form.get(field, "") for field in columnNames]
            try:
                # Stack the new row onto existing numpy data (handles numeric/text mix by coercion)
                data = np.vstack([data, row_values])
            except Exception:
                # if db had no rows or single row, convert accordingly
                data = (
                    np.array([row_values])
                    if data.size == 0
                    else np.vstack([data, row_values])
                )
            newdb = DataFrame(data=data, columns=columnNames)
            try:
                newdb.to_excel(file_path, sheet_name="Updated", index=False)
                logger.info("Appended new row and saved file: %s", file_path)
            except Exception as e:
                logger.exception("Failed to save Excel file %s", file_path)
                err = f"Failed to save Excel: {e}"
                return render_template(
                    "output.html",
                    columnNames=columnNames,
                    data=data,
                    fileName=fileName,
                    error=err,
                )
            return render_template(
                "output.html", columnNames=columnNames, data=data, fileName=fileName
            )


@app.route("/download/<fileName>")
def download(fileName):
    # serve safely from the uploads folder
    file_path = os.path.join(app.config["UPLOAD_FOLDER"], fileName)
    if not os.path.exists(file_path):
        logger.warning("Download requested for missing file: %s", file_path)
        return ("File not found", 404)
    logger.info("Serving download for %s", file_path)
    return send_from_directory(
        app.config["UPLOAD_FOLDER"], fileName, as_attachment=True
    )


if __name__ == "__main__":
    # run development server
    app.run(port=8080, debug=True)


@app.route("/health")
def health():
    """Simple JSON health check for uptime/liveness."""
    return {"status": "ok"}, 200
