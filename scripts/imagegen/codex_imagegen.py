#!/usr/bin/env python3
from __future__ import annotations
"""
Shared headless image generation through Codex CLI's built-in `image_gen` tool (GPT image model).

    from codex_imagegen import generate_image
    ok, info = generate_image(prompt, out_png, refs=[Path("ref.png")], workdir=Path(".work/x"))

Gotchas baked in: `-i <FILE>...` is variadic so it goes first and the prompt after `--`; stdin must be
/dev/null (codex blocks waiting for EOF on a non-TTY stdin); the whole process group is killed on timeout.
"""
import glob, json, os, shutil, signal, subprocess, time
from pathlib import Path

CODEX_HOME = Path(os.environ.get("CODEX_HOME", Path.home() / ".codex"))


def generate_image(prompt: str, out: Path, refs=(), workdir: Path | None = None,
                   timeout: int = 600, attempts: int = 2) -> tuple[bool, str]:
    out = Path(out); out.parent.mkdir(parents=True, exist_ok=True)
    work = Path(workdir) if workdir else out.parent / ".work" / out.stem
    work.mkdir(parents=True, exist_ok=True)
    task = ("Generate exactly ONE image with the built-in image_gen tool from the spec below. "
            f"Then copy the generated PNG to `{out}` (overwrite if it exists) and reply with only that absolute path.\n\n" + prompt)
    cmd = ["/Applications/Codex.app/Contents/Resources/codex", "exec"]
    for r in refs:
        cmd += ["-i", str(Path(r).resolve())]
    cmd += ["--skip-git-repo-check", "--ephemeral", "-C", str(work), "--json", "--", task]

    last_err = ""
    log = work / "events.jsonl"
    for attempt in range(1, attempts + 1):
        t0 = time.time()
        if out.exists():
            out.unlink()
        thread_id, timed_out = None, False
        with open(log, "a") as lf:
            lf.write(json.dumps({"type": "_attempt", "n": attempt, "at": time.strftime("%H:%M:%S")}) + "\n")
            proc = subprocess.Popen(cmd, stdin=subprocess.DEVNULL, stdout=subprocess.PIPE, stderr=subprocess.STDOUT,
                                    text=True, start_new_session=True)
            try:
                while proc.poll() is None:
                    if time.time() - t0 > timeout:
                        timed_out = True; os.killpg(proc.pid, signal.SIGKILL); break
                    line = proc.stdout.readline()
                    if not line:
                        time.sleep(0.2); continue
                    lf.write(line); lf.flush()
                    try:
                        ev = json.loads(line)
                    except json.JSONDecodeError:
                        continue
                    if ev.get("type") == "thread.started":
                        thread_id = ev.get("thread_id")
                    if ev.get("type") == "error":
                        last_err = ev.get("message", "error event")
                if not timed_out:
                    for line in proc.stdout:
                        lf.write(line)
            finally:
                try:
                    os.killpg(proc.pid, signal.SIGKILL)
                except ProcessLookupError:
                    pass
        if timed_out:
            last_err = f"timeout after {timeout}s"
        if not out.exists() and thread_id:
            cands = sorted(glob.glob(str(CODEX_HOME / "generated_images" / thread_id / "*.png")), key=os.path.getmtime)
            if cands:
                shutil.copyfile(cands[-1], out)
        if out.exists() and out.stat().st_size > 10_000:
            return True, f"{time.time() - t0:.0f}s (attempt {attempt})"
        last_err = last_err or "no output file"
    return False, last_err
