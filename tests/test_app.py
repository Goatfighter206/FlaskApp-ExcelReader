import importlib.util
import os
import sys
import pandas as pd

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)
_app_path = os.path.join(ROOT, 'app.py')
spec = importlib.util.spec_from_file_location('app', _app_path)
app_mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(app_mod)
app = app_mod.app

UPLOAD = os.path.join(ROOT, 'uploads')
os.makedirs(UPLOAD, exist_ok=True)


def create_test_excel(path):
    df = pd.DataFrame({"A": [1, 3], "B": [2, 4]})
    df.to_excel(path, index=False)


def test_homepage():
    c = app.test_client()
    r = c.get("/")
    assert r.status_code == 200


def test_upload_and_append(tmp_path):
    file_path = os.path.join(UPLOAD, "test.xlsx")
    create_test_excel(file_path)
    c = app.test_client()

    # upload the file via multipart/form-data
    with open(file_path, "rb") as f:
        data = {"openFile": "1", "excel_file": (f, "test.xlsx")}
        r = c.post("/output", data=data, content_type="multipart/form-data")
        assert r.status_code == 200

    # append a new row via form submission
    data2 = {"newData": "1", "fileName": "test.xlsx", "A": "9", "B": "10"}
    r2 = c.post("/output", data=data2)
    assert r2.status_code == 200

    # confirm the Excel file now has at least 3 rows
    df = pd.read_excel(file_path)
    assert df.shape[0] >= 3


def test_download_file():
    c = app.test_client()
    # ensure file exists
    file_path = os.path.join(UPLOAD, "test.xlsx")
    assert os.path.exists(file_path)
    r = c.get("/download/test.xlsx")
    assert r.status_code == 200
    # Content-Disposition header should indicate attachment
    assert "attachment" in r.headers.get("Content-Disposition", "")
