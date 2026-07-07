import logging
import os
from functools import lru_cache
from typing import Any

from dotenv import load_dotenv


logger = logging.getLogger(__name__)


def _load_environment() -> None:
    load_dotenv()


@lru_cache(maxsize=1)
def get_supabase_client() -> Any | None:
    _load_environment()

    supabase_url = os.getenv("SUPABASE_URL")
    service_role_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

    if not supabase_url or not service_role_key:
        logger.warning("Supabase client not configured: missing SUPABASE_URL or service role key")
        return None

    try:
        from supabase import create_client

        return create_client(supabase_url, service_role_key)
    except ImportError:
        logger.warning("Supabase package is not installed; database queries will return empty results")
        return None
    except Exception as error:
        logger.error("Failed to create Supabase client: %s", error)
        return None
