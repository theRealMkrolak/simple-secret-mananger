import json
import sys
from pathlib import Path

# Add backend directory to sys.path map so imports work
backend_dir = Path(__file__).parent.parent if Path(__file__).parent.name == "scripts" else Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from main import app  # noqa: E402


def export_openapi(output_path: str) -> None:
    schema = app.openapi()
    with open(output_path, "w") as f:
        json.dump(schema, f, indent=2)
    print(f"OpenAPI schema successfully exported to {output_path}")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        output_file = sys.argv[1]
    else:
        output_file = "openapi.json"
    export_openapi(output_file)
