#!/usr/bin/env python3
"""
Build the public, encrypted vault.json from the private plaintext files in content/.

Each content/<slug>.json holds one lab member's birthday page in the clear, plus the
passcode that unlocks it. This script encrypts each one under a key derived from that
person's passcode (PBKDF2-SHA256 -> AES-256-GCM) and writes only the ciphertext to
vault.json, which is the ONLY file that gets committed and published.

Because the published repo is public, the plaintext in content/ must never be
committed -- .gitignore enforces that, and this script refuses to run if it isn't.

Usage:
    python3 tools/build.py              # build vault.json
    python3 tools/build.py --check      # validate content/, change nothing
    python3 tools/build.py --new NAME   # scaffold a new content file
"""

from __future__ import annotations

import argparse
import base64
import json
import os
import re
import secrets
import sys
import unicodedata
from pathlib import Path

try:
    from cryptography.hazmat.primitives.ciphers.aead import AESGCM
except ImportError:
    sys.exit("Missing dependency: cryptography\n  Install with:  uv pip install cryptography")

from hashlib import pbkdf2_hmac

ROOT = Path(__file__).resolve().parent.parent
CONTENT_DIR = ROOT / "content"
ACTS_DIR = ROOT / "acts"
VAULT = ROOT / "vault.json"

KDF_ITERS = 310_000
SALT_BYTES = 16
KEY_BYTES = 32
NONCE_BYTES = 12

# Words that make a passcode a bad idea on a page people share screenshots of.
MIN_PASSCODE_LEN = 6


def normalize(s: str) -> str:
    """Passcode normalization. MUST stay identical to normalize() in index.html."""
    s = unicodedata.normalize("NFKC", s)
    return re.sub(r"\s+", " ", s.strip()).lower()


def b64(raw: bytes) -> str:
    return base64.b64encode(raw).decode("ascii")


def derive(passcode: str, salt: bytes) -> bytes:
    return pbkdf2_hmac("sha256", normalize(passcode).encode("utf-8"), salt, KDF_ITERS, KEY_BYTES)


# --------------------------------------------------------------------------- validation

REQUIRED = ("name", "passcode", "act")


def available_acts() -> set[str]:
    return {p.stem for p in ACTS_DIR.glob("*.js")}


def load_content() -> list[tuple[Path, dict]]:
    if not CONTENT_DIR.is_dir():
        sys.exit(f"No content directory at {CONTENT_DIR}")
    files = sorted(p for p in CONTENT_DIR.glob("*.json") if not p.name.startswith("_"))
    if not files:
        sys.exit(
            f"No content files in {CONTENT_DIR}.\n"
            "  Create one with:  python3 tools/build.py --new 'Their Name'"
        )
    out = []
    for path in files:
        try:
            out.append((path, json.loads(path.read_text(encoding="utf-8"))))
        except json.JSONDecodeError as exc:
            sys.exit(f"{path.name} is not valid JSON: {exc}")
    return out


def validate(entries: list[tuple[Path, dict]]) -> list[str]:
    problems: list[str] = []
    acts = available_acts()
    seen: dict[str, str] = {}

    for path, data in entries:
        tag = path.name
        for field in REQUIRED:
            if not str(data.get(field, "")).strip():
                problems.append(f"{tag}: missing required field '{field}'")

        act = str(data.get("act", "")).strip()
        if act and not re.fullmatch(r"[a-z0-9][a-z0-9-]{0,31}", act):
            problems.append(f"{tag}: act '{act}' must be lowercase letters, digits, hyphens")
        elif act and act not in acts:
            problems.append(
                f"{tag}: act '{act}' has no acts/{act}.js (available: {', '.join(sorted(acts)) or 'none'})"
            )

        code = str(data.get("passcode", ""))
        norm = normalize(code)
        if norm:
            if len(norm) < MIN_PASSCODE_LEN:
                problems.append(f"{tag}: passcode is under {MIN_PASSCODE_LEN} characters")
            # Two people sharing a passcode means one of them opens the other's page.
            if norm in seen:
                problems.append(f"{tag}: passcode collides with {seen[norm]}")
            else:
                seen[norm] = tag
            # The passcode must not be guessable from the thing it protects.
            if norm == normalize(str(data.get("name", ""))):
                problems.append(f"{tag}: passcode is just the recipient's name")

        media = data.get("media")
        if media is not None:
            if not isinstance(media, dict) or "type" not in media:
                problems.append(f"{tag}: 'media' must be an object with a 'type'")
            elif media["type"] == "youtube" and not media.get("id"):
                problems.append(f"{tag}: youtube media needs an 'id'")

        if data.get("message") is not None and not isinstance(data["message"], list):
            problems.append(f"{tag}: 'message' must be a list of paragraph strings")

    return problems


# --------------------------------------------------------------------------- safety

def gitignore_protects_content() -> bool:
    gi = ROOT / ".gitignore"
    if not gi.exists():
        return False
    lines = [ln.strip() for ln in gi.read_text(encoding="utf-8").splitlines()]
    return any(
        ln in {"content/", "/content/", "content", "content/*", "content/*.json"}
        for ln in lines
        if ln and not ln.startswith("#")
    )


def tracked_plaintext() -> list[str]:
    """Any content file git is already tracking would be published on push."""
    import subprocess

    try:
        res = subprocess.run(
            ["git", "ls-files", "content"], cwd=ROOT,
            capture_output=True, text=True, check=True,
        )
    except (OSError, subprocess.CalledProcessError):
        return []
    return [
        ln for ln in res.stdout.splitlines()
        if ln.strip() and not Path(ln).name.startswith("_")
    ]


# --------------------------------------------------------------------------- commands

def cmd_new(name: str) -> None:
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-") or "member"
    path = CONTENT_DIR / f"{slug}.json"
    if path.exists():
        sys.exit(f"{path.name} already exists -- edit it instead.")
    CONTENT_DIR.mkdir(exist_ok=True)
    suggested = "-".join(secrets.choice(WORDS) for _ in range(3))
    template = {
        "name": name,
        "passcode": suggested,
        "act": "form-rr87",
        "headline": f"HAPPY BIRTHDAY {name.upper()}!",
        "subline": "Your gift: you just got rickrolled. We're never gonna give you up.",
        "message": [
            "Write a line or two here. Each string is its own paragraph.",
        ],
        "media": {"type": "youtube", "id": "dQw4w9WgXcQ"},
        "footer": "Filed under Form RR-87 \u00b7 Claim approved \u00b7 No refunds, only vibes",
    }
    path.write_text(json.dumps(template, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Created {path.relative_to(ROOT)}")
    print(f"  Suggested passcode: {suggested}")
    print(f"  Acts available:     {', '.join(sorted(available_acts())) or 'none'}")
    print("  Edit it, then run:  python3 tools/build.py")


WORDS = [
    "cake", "balloon", "candle", "sprinkle", "confetti", "frosting", "streamer",
    "ribbon", "party", "glitter", "banner", "gift", "sparkler", "cupcake",
    "pinata", "noisemaker", "fondant", "buttercream", "tinsel", "party-hat",
]


def cmd_build(check_only: bool) -> None:
    entries = load_content()
    problems = validate(entries)

    leaked = tracked_plaintext()
    if leaked:
        problems.append(
            "git is TRACKING plaintext content files -- these would be published:\n    "
            + "\n    ".join(leaked)
            + "\n  Fix with:  git rm --cached " + " ".join(leaked)
        )
    if not gitignore_protects_content():
        problems.append(".gitignore does not contain a 'content/' line -- plaintext could be committed")

    if problems:
        print("Build blocked:\n", file=sys.stderr)
        for p in problems:
            print(f"  - {p}", file=sys.stderr)
        sys.exit(1)

    if check_only:
        print(f"OK: {len(entries)} content file(s) valid, plaintext is git-ignored.")
        for path, data in entries:
            print(f"  - {data['name']:<18} act={data['act']:<14} ({path.name})")
        return

    salt = secrets.token_bytes(SALT_BYTES)
    out_entries = []
    for _, data in entries:
        payload = {k: v for k, v in data.items() if k != "passcode"}
        key = derive(str(data["passcode"]), salt)
        nonce = secrets.token_bytes(NONCE_BYTES)
        ct = AESGCM(key).encrypt(
            nonce, json.dumps(payload, ensure_ascii=False).encode("utf-8"), None
        )
        out_entries.append({"iv": b64(nonce), "ct": b64(ct)})

    # Shuffle so file order leaks nothing about who is in the vault.
    secrets.SystemRandom().shuffle(out_entries)

    vault = {
        "v": 1,
        "kdf": {"alg": "PBKDF2-SHA256", "hash": "SHA-256", "iters": KDF_ITERS, "salt": b64(salt)},
        "cipher": "AES-256-GCM",
        "entries": out_entries,
    }
    VAULT.write_text(json.dumps(vault, indent=2) + "\n", encoding="utf-8")

    print(f"Wrote {VAULT.relative_to(ROOT)} -- {len(out_entries)} encrypted entr(ies), "
          f"{VAULT.stat().st_size:,} bytes")
    print("\nHand out:")
    for _, data in entries:
        print(f"  {data['name']:<18} passcode: {data['passcode']}")
    print("\nCommit and push vault.json to publish. content/ stays local.")


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--check", action="store_true", help="validate content without writing vault.json")
    ap.add_argument("--new", metavar="NAME", help="scaffold a new content file for NAME")
    args = ap.parse_args()

    os.chdir(ROOT)
    if args.new:
        cmd_new(args.new)
    else:
        cmd_build(args.check)


if __name__ == "__main__":
    main()
