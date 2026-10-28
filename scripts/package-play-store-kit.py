"""Validate and package the prepared store material, excluding installers and secrets."""
from pathlib import Path
from PIL import Image
import hashlib
import json
import shutil
import sys
import zipfile

date = sys.argv[1] if len(sys.argv) > 1 else '2026-10-28'
root = Path('releases/google-play')
kit = root / f'store-kit-{date}'
assets = kit / 'assets'
source = Path('docs/google-play')
checks = []
expected = {'icon-512.png': (512, 512), 'feature-1024x500.png': (1024, 500)}
expected.update({name: (1080, 1920) for name in (
    '01-match3.png', '02-repair-ship.png', '03-elysium.png',
    '04-night-garden.png', '05-age-choice.png')})
for name, size in expected.items():
    file = assets / name
    with Image.open(file) as image:
        assert image.size == size, (name, image.size)
        image.verify()
    if name == 'icon-512.png':
        assert file.stat().st_size <= 1024 * 1024
        assert Image.open(file).mode == 'RGBA'
    if name == 'feature-1024x500.png':
        assert Image.open(file).mode == 'RGB'
    checks.append({'file': 'assets/' + name, 'dimensions': size, 'bytes': file.stat().st_size})

data = json.loads((source / 'store-listings.json').read_text(encoding='utf-8-sig'))
for locale, listing in data['listings'].items():
    folder = kit / 'listings' / locale
    folder.mkdir(parents=True, exist_ok=True)
    lengths = {}
    for field, limit in [('title', 30), ('short', 80), ('full', 4000)]:
        value = listing[field]
        assert value and len(value) <= limit, (locale, field, len(value))
        (folder / f'{field}.txt').write_text(value + '\n', encoding='utf-8')
        lengths[field] = len(value)
    checks.append({'locale': locale, 'characters': lengths})

documents = [
    'store-listings.json', 'tester-brief-en.md', 'closed-test-coordinator.md',
    'iarc-preparation.md', 'data-safety-2026-10-28.md', 'auth-metadata-audit.sql',
    'account-deletion.md', 'android-audience-2026-10-28.md',
    'release-notes-en.txt', 'release-readiness-2026-10-28.md',
]
(kit / 'docs').mkdir(exist_ok=True)
for name in documents:
    shutil.copyfile(source / name, kit / 'docs' / name)
shutil.copyfile(source / 'release-readiness-2026-10-28.md', kit / 'README.md')
(kit / 'validation.json').write_text(json.dumps({
    'date': date, 'status': 'prepared-not-submitted',
    'capture': 'Actual Android-mode UI in isolated Edge; not a physical device capture.',
    'checks': checks,
}, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')

# Explicit allowlist: never recurse into signing configuration or other releases.
files = [kit / 'README.md', kit / 'validation.json']
files += [assets / name for name in expected]
files += [kit / 'docs' / name for name in documents]
files += sorted((kit / 'listings').glob('*/*.txt'))
hashes = {str(p.relative_to(kit)).replace('\\', '/'): hashlib.sha256(p.read_bytes()).hexdigest() for p in files}
manifest = kit / 'sha256.json'
manifest.write_text(json.dumps(hashes, indent=2) + '\n', encoding='utf-8')
files.append(manifest)
archive = root / f'beyond-the-signal-play-kit-{date}.zip'
with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as output:
    for file in files:
        output.write(file, str(file.relative_to(kit)))
with zipfile.ZipFile(archive) as output:
    assert output.testzip() is None
    assert len(output.namelist()) == len(files)
print(f'Validated {len(expected)} images, {len(data["listings"])} listings; ZIP CRC passed.')
print(f'{archive.resolve()} ({archive.stat().st_size} bytes)')
