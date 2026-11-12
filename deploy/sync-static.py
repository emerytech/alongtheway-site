#!/usr/bin/env python3
"""Fetch checked static output only; never run downloaded repository code."""
import io
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import subprocess
import tarfile

BASE = Path('/var/www/alongtheway-site')
STATE = Path('/var/lib/alongtheway-site')
RAW = 'https://raw.githubusercontent.com/emerytech/alongtheway-site/site-dist/deployment.json'
ARCHIVE = 'https://codeload.github.com/emerytech/alongtheway-site/tar.gz/refs/heads/site-dist'
ALLOWED = {'.html','.css','.xml','.txt','.png','.webp','.jpg','.jpeg','.ico','.json','.svg','.webmanifest'}

def download(url, limit):
    result = subprocess.run(['curl','--fail','--silent','--show-error','--location','--max-time','60','--max-filesize',str(limit),url], check=True, capture_output=True)
    if len(result.stdout) > limit:
        raise ValueError('Download exceeds limit')
    return result.stdout

def revision(data):
    value = json.loads(data)['revision']
    if not re.fullmatch('[0-9a-f]{40}',value):
        raise ValueError('Invalid source revision')
    return value

def switch(target):
    temporary = BASE/'current.next'
    temporary.unlink(missing_ok=True)
    temporary.symlink_to(target)
    os.replace(temporary, BASE/'current')

def main():
    wanted = revision(download(RAW,4096))
    current = BASE/'current'
    if (current/'deployment.json').is_file() and revision((current/'deployment.json').read_bytes()) == wanted:
        print('Already deployed '+wanted)
        return
    stage = BASE/'releases'/('staging-'+wanted)
    if stage.exists():
        shutil.rmtree(stage)
    stage.mkdir(parents=True)
    try:
        data = download(ARCHIVE,30*1024*1024)
        with tarfile.open(fileobj=io.BytesIO(data),mode='r:gz') as archive:
            members = archive.getmembers()
            if sum(m.size for m in members) > 100*1024*1024 or len(members)>5000:
                raise ValueError('Archive exceeds limits')
            for item in members:
                path = PurePosixPath(item.name)
                if path.is_absolute() or '..' in path.parts or len(path.parts)<1:
                    raise ValueError('Unsafe archive path')
                relative = PurePosixPath(*path.parts[1:])
                if item.isdir():
                    continue
                if not item.isfile() or not relative.parts or any(p.startswith('.') for p in relative.parts) or relative.suffix not in ALLOWED:
                    raise ValueError('Only ordinary static files may be deployed: '+item.name)
                destination = stage/str(relative)
                destination.parent.mkdir(parents=True,exist_ok=True)
                with archive.extractfile(item) as source, destination.open('wb') as output:
                    shutil.copyfileobj(source,output)
                destination.chmod(0o644)
        if not (stage/'index.html').is_file() or revision((stage/'deployment.json').read_bytes()) != wanted:
            raise ValueError('Incomplete or superseded artifact; retry next cycle')
        release = BASE/'releases'/wanted
        if release.exists():
            shutil.rmtree(stage)
        else:
            stage.rename(release)
        previous = current.resolve() if current.is_symlink() else None
        switch(release)
        try:
            subprocess.run(['curl','--fail','--silent','--show-error','--max-time','10','-H','Host: www.alongtheway.cc','http://127.0.0.1:8080/'], check=True, stdout=subprocess.DEVNULL)
        except Exception:
            if previous:
                switch(previous)
            raise
        (STATE/'last-revision').write_text(wanted+'\n')
        print('Deployed '+wanted)
    finally:
        if stage.exists():
            shutil.rmtree(stage)

if __name__ == '__main__':
    main()
