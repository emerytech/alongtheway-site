# Automatic Zeus deployment

Push reviewed changes to `main`. GitHub-hosted Actions installs the locked dependencies,
builds the website and runs its checks. Only successful static output is committed to
`site-dist`, together with `deployment.json` identifying the source commit and run.
The workflow can also be dispatched manually. Pull requests do not deploy.

Inside CT 120, `alongtheway-site-sync.timer` checks for updates every 30 seconds.
Its root-owned Python script downloads public output with verified HTTPS, checks the
revision, paths, file types and size limits, then atomically changes the website’s
`current` symlink. A local health-check failure restores the previous symlink. Failed
builds, invalid archives and failed downloads leave the existing site active.

The `atw-site` account has access only to website storage and its sync state. The
systemd sandbox denies access to the API checkout/settings, app storage/backups, home
directories and tunnel credentials. Downloaded repository code is never executed.
There is no GitHub deployment secret, SSH key, public deployment endpoint or self-hosted
Actions runner. Nginx and the existing API remain independent services.

In the container:

```sh
systemctl status alongtheway-site-sync.timer
systemctl status alongtheway-site-sync.service
journalctl -u alongtheway-site-sync.service --no-pager -n 30
systemctl start alongtheway-site-sync.service
```

Compare the source commit with `https://www.alongtheway.cc/deployment.json`.
The service is oneshot and normally shows inactive after successful completion;
the timer should remain active. The timer serializes deployments: it never runs a
second service instance while one is executing.

Releases live under `/var/www/alongtheway-site/releases`. For an intentional rollback,
stop the sync timer first, atomically point `current` to a retained release, and verify
the site. Start the timer again when normal deployment should resume. Retained releases
are not automatically pruned; review disk usage periodically.

Changes to the deployed sync script or systemd units require owner-controlled SSH
installation. Pushing source cannot change those privileged files on the container.
`deploy-zeus.sh` remains an owner-run manual fallback, rather than the automatic path.
