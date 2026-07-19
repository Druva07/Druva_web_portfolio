# Engineering Project Index

A minimalistic, editorial-style portfolio designed for GitHub Pages.

## Requirements
- Python 3.x (standard library only)

## How to add a new project
1. Create a new folder in `projects/` (e.g., `projects/my-new-project/`).
2. Add a `meta.json` inside this folder. Use the following schema:
   ```json
   {
     "slug": "my-new-project",
     "index": 4,
     "category": "Robotics",
     "title": "Project Title",
     "org": "Organization",
     "type": "Project Type",
     "tech": "Tech1 · Tech2",
     "date": "2026",
     "summary": "One-paragraph description.",
     "highlights": ["Highlight one.", "Highlight two."],
     "topics": ["topic1", "topic2"],
     "links": {"repo": "https://github.com/...", "demo": "https://..."}
   }
   ```
3. Add any media files into subfolders like `projects/my-new-project/images/`, `projects/my-new-project/video/`, and `projects/my-new-project/docs/`. Note that the build script currently does not auto-detect files in those subfolders; if you want to display media in the future, you can extend the frontend JavaScript to render them based on what you add to your `meta.json`.
4. Run the manifest builder:
   ```bash
   python scripts/build_manifest.py
   ```
5. Preview locally:
   ```bash
   python -m http.server
   ```
   Then visit `http://localhost:8000` in your browser.

## Deployment
Pushing to the `main` branch will automatically trigger a GitHub Action. This action will:
1. Run `build_manifest.py` to regenerate `projects.json`.
2. Commit `projects.json` back to the repository if there are changes. This ensures the repo remains a complete source of truth, meaning anyone cloning it doesn't *have* to run the build script to view the site locally.
3. Deploy the static files to GitHub Pages.
