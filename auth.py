from functools import wraps
from typing import Callable
import os
from flask import request, Response

# AUTH_ENABLED controls whether auth is enforced. Default: False for dev/tests.
AUTH_ENABLED = os.getenv("AUTH_ENABLED", "false").lower() == "true"
AUTH_USER = os.getenv("AUTH_USER", "admin")
AUTH_PASS = os.getenv("AUTH_PASS", "password")


def check_auth(username: str, password: str) -> bool:
    return username == AUTH_USER and password == AUTH_PASS


def authenticate() -> Response:
    return Response(
        "Authentication required", 401, {"WWW-Authenticate": 'Basic realm="Login Required"'}
    )


def require_auth(func: Callable) -> Callable:
    @wraps(func)
    def wrapper(*args, **kwargs):
        if not AUTH_ENABLED:
            return func(*args, **kwargs)
        auth = request.authorization
        if not auth or not check_auth(auth.username, auth.password):
            return authenticate()
        return func(*args, **kwargs)

    return wrapper
