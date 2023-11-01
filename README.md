# Stochus

## Architectural Overview

## Getting up and running

### Pre-configured users

| Username               | Password   | Roles                              | Groups                        |
| ---------------------- | ---------- | ---------------------------------- | ----------------------------- |
| `admin`                | `admin`    | Keycloak admin, not a stochus user |                               |
| `student`              | `password` | student                            |                               |
| `mathmagician-student` | `password` | student                            | `mathmagicians`               |
| `multi-group-student`  | `password` | student                            | `mathmagicians`, `studie-abc` |
| `researcher`           | `password` | researcher                         |                               |

## Making changes to Keycloak (e.g. adding new users)

Once you've made a change to keycloak, you'll have to export the realm so the changes can be shared with other
developers. You can do this by running

```shell
./scripts/export-keycloak-realm.sh
```

This will update the JSON file in `./docker/keycloak/realms`, which must then be comitted. In order to ensure that the
export worked correctly, I strongly recommend you completely re-create your keycloak container as this will force an
import of the realm on startup. In order to do this, (while the docker containers are running) execute

```shell
./scripts/reset-keycloak-containers.sh
```

Alternatively, you can recreate all docker containers using the commands below. But watch out: this will also delete
your database!

```shell
docker compose down
docker compuse up -d
```

But please be advised: this will remove all of your containers!

<a alt="Nx logo" href="https://nx.dev" target="_blank" rel="noreferrer"><img src="https://raw.githubusercontent.com/nrwl/nx/master/images/nx-logo.png" width="45"></a>

✨ **This workspace has been generated by [Nx, a Smart, fast and extensible build system.](https://nx.dev)** ✨

## Development server

Run `nx serve backend` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you
change any of the source files.

## Understand this workspace

Run `nx graph` to see a diagram of the dependencies of the projects.

## Remote caching

Run `npx nx connect-to-nx-cloud` to enable [remote caching](https://nx.app) and make CI faster.

## Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.
