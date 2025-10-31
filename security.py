import os
import subprocess
from typing import Tuple

# This is a lightweight stub for integrating a virus scan.
# In production you should install and run ClamAV or a scanning service.


def scan_file(path: str) -> Tuple[bool, str]:
    """Scan file at `path`. Returns (clean, message).

    Currently a stub that returns clean. If `CLAMAV_ENABLED=true` env var is set
    and `clamscan` is available in PATH, it will invoke clamscan.
    """
    clam_enabled = os.getenv("CLAMAV_ENABLED", "false").lower() == "true"
    if not clam_enabled:
        return True, "scan skipped"
    try:
        # run clamscan --no-summary <path>
        res = subprocess.run(["clamscan", "--no-summary", path], capture_output=True, text=True)
        if res.returncode == 0:
            return True, "clean"
        return False, res.stdout + res.stderr
    except FileNotFoundError:
        return False, "clamscan not found"
    except Exception as e:
        return False, str(e)
