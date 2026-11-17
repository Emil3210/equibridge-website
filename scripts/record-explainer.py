"""
Record the How It Works explainer into a 1920x1080 MP4 (silent video track).

Usage (with the site running locally, e.g. `npm run build && npm start`):
    python3 scripts/record-explainer.py http://localhost:3000 out/explainer_video.mp4 [fps] [path]
    (path defaults to /explainer; use /process-explainer for The EquiBridge Process video)

It opens /explainer?record=1, steps the animation clock frame by frame with
window.__ebSeek(seconds), screenshots each frame and pipes the frames into ffmpeg.
Audio (voiceover + music) is mixed in afterwards with ffmpeg.
"""
import subprocess
import sys

from playwright.sync_api import sync_playwright

base, out = sys.argv[1], sys.argv[2]
fps = int(sys.argv[3]) if len(sys.argv) > 3 else 30
path = sys.argv[4] if len(sys.argv) > 4 else "/explainer"
# Optional 5th arg: viewport as WxH, e.g. 1080x1920 for the vertical cut.
vw, vh = (int(v) for v in (sys.argv[5] if len(sys.argv) > 5 else "1920x1080").split("x"))

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": vw, "height": vh}, device_scale_factor=1)
    page.goto(f"{base}{path}{'&' if '?' in path else '?'}record=1", wait_until="networkidle")
    page.wait_for_function("typeof window.__ebSeek === 'function'")
    page.evaluate("document.fonts.ready")
    duration = page.evaluate("window.__ebDuration")
    frames = int(round(duration * fps)) + 1

    ff = subprocess.Popen(
        ["ffmpeg", "-v", "error", "-y", "-f", "image2pipe", "-framerate", str(fps), "-c:v", "png", "-i", "-",
         "-c:v", "libx264", "-preset", "veryfast", "-crf", "18", "-pix_fmt", "yuv420p", "-movflags", "+faststart", out],
        stdin=subprocess.PIPE,
    )
    for i in range(frames):
        page.evaluate(f"window.__ebSeek({i / fps})")
        page.evaluate("() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))")
        ff.stdin.write(page.screenshot(type="png"))
        if i % (fps * 10) == 0:
            print(f"{i / fps:.0f}s / {duration}s", flush=True)
    ff.stdin.close()
    ff.wait()
    browser.close()
