# Micro frontend Typing game

Micro frontend typing game application than can be consume by other micro frontends.

## Features

- Create game
- Join game
- Share game links
- See other players typing in keyboard form
- See other players word progression percentage
- Words per minute scoreboard

## Tech Stack

### Frontend

- Reactjs (craco)
- Typescript
- Tailwind css
- useSyncExternalStore (react 18)

### Backend

- Express
- Typescript
- Mongodb
- Socket io

### Devops

- Docker
- Docker compose
- Github Actions

## Installation

Use the env.example file to know which variable is needed from firebase.

```bash
cp .env.example .env
```

```bash
yarn i && yarn dev
```

App runs by default at http://localhost:3030

## Helpers

Install lazydocker on your system. This tool can help visualise container logs.

## License

[MIT](https://choosealicense.com/licenses/mit/)
