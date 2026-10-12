# Blueprint Trades Journal

Store for the Blueprint Trades trading journal, styled with the channel's Field Notes kit (drafting paper, graphite, red pencil). Two editions share one interior: the printed Bull & Bear cover and the Field Notes cover.

## Develop
```
pnpm install
pnpm exec vite dev
```

## Build
`pnpm exec vite build` writes a single-file site to `dist/`. The 3D journal viewer ships at `/3d.html`.

## Design
- Tokens and component rules: [docs/design-system](docs/design-system/README.md).
- Art generators: `art/bt.py` (covers, Plan / Reality pages, hero, spread) and `art/bulk.py` (bulk-create CSV and social posts). They read the channel kit and fonts from the project's shared folder.

## Publish
See [DEPLOY.md](DEPLOY.md). A temporary GitHub Pages site runs from the `gh-pages` branch; the custom domain is not set yet.

Checkout runs in Stripe test mode: no card details are collected and nothing is charged.
