import os
import json
import sys
from pathlib import Path

def main():
    # Ensure we look for the projects folder relative to the execution root (which should be repo root)
    projects_dir = Path('projects')
    if not projects_dir.exists():
        print(f"Error: Directory {projects_dir} does not exist.")
        sys.exit(1)

    manifest = []
    
    # Required fields in meta.json
    required_fields = ['slug', 'index', 'title', 'category']

    for entry in projects_dir.iterdir():
        if entry.is_dir():
            meta_file = entry / 'meta.json'
            if meta_file.exists():
                try:
                    with open(meta_file, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                        
                    # Validate
                    missing = [field for field in required_fields if field not in data]
                    if missing:
                        print(f"Error in {meta_file}: Missing required fields: {missing}")
                        sys.exit(1)
                        
                    manifest.append(data)
                except json.JSONDecodeError as e:
                    print(f"Error parsing JSON in {meta_file}: {e}")
                    sys.exit(1)
                except Exception as e:
                    print(f"Unexpected error processing {meta_file}: {e}")
                    sys.exit(1)

    # Sort manifest by index so they render in deterministic order
    manifest.sort(key=lambda x: x.get('index', 999))

    out_file = Path('projects.json')
    try:
        with open(out_file, 'w', encoding='utf-8') as f:
            json.dump(manifest, f, indent=2)
        print(f"Successfully wrote {len(manifest)} projects to {out_file}")
    except Exception as e:
        print(f"Error writing to {out_file}: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
