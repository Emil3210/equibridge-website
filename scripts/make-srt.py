"""Build an SRT subtitle file from CAPTIONS / DURATION in components/Explainer.tsx.

python3 scripts/make-srt.py components/Explainer.tsx out/EquiBridge_Explainer_v3.srt
"""
import re
import sys

src = open(sys.argv[1], encoding="utf-8").read()
duration = float(re.search(r"export const DURATION = ([\d.]+)", src).group(1))
block = src[src.index("export const CAPTIONS = ["):]
block = block[: block.index("];")]
caps = [(float(a), txt) for a, txt in re.findall(r'\{ at: ([\d.]+), text: "(.*?)" \}', block)]


def ts(sec):
    ms = int(round(sec * 1000))
    h, ms = divmod(ms, 3_600_000)
    m, ms = divmod(ms, 60_000)
    s, ms = divmod(ms, 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"


lines = []
for i, (start, text) in enumerate(caps):
    end = caps[i + 1][0] - 0.1 if i + 1 < len(caps) else duration
    lines += [str(i + 1), f"{ts(start)} --> {ts(end)}", text, ""]
open(sys.argv[2], "w", encoding="utf-8").write("\n".join(lines))
print(f"{len(caps)} cues, {duration}s")
