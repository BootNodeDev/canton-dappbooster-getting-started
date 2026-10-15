# Canton dApp

A React and Vite app on the Canton dApp kit:

- `@bootnodedev/canton-connect` for the wallet session and its hooks
- `@bootnodedev/canton-dappbooster` for the headless components
- `@bootnodedev/canton-theme` for the default style sheet, which `src/index.css` imports once

## Run the app

If the installer skipped the install, run `pnpm install` first. Then start the dev server:

```bash
pnpm dev
```

With npm, the command is `npm run dev`. The app serves on http://localhost:3012.

`.env` sets `VITE_MOCK_WALLET=true`, so the wallet picker offers a mock wallet, and you can connect
before a real one is reachable.

## Connect a real wallet

Set `VITE_WALLET_GATEWAY_URL` to a [Wallet Gateway](https://github.com/canton-network/wallet) and it
appears in the picker. The picker also lists any CIP-0103 browser wallet it finds in the page. Unset
`VITE_MOCK_WALLET` when you no longer need the mock.

## Learn more

- The [documentation](https://docs.dappbooster.cc/) covers the stack and the local network.
- The [components documentation](https://components.dappbooster.cc/) is the reference for the kit's
  hooks and components.

## Contract

`daml/` holds the app's Daml model, and `dpm` from the Daml SDK 3.5 builds it. `daml/daml.yaml`
pins a tested patch release, and any installed 3.5 release builds the model.

```bash
pnpm build-dar                                           # fetch the Splice DARs it depends on, then build
pnpm deploy-dar -- daml/.daml/dist/<name>-<version>.dar  # upload it to CANTON_JSON_API_URL
```

When `daml/daml.yaml` lists Splice DARs, `build-dar` fetches the ones your network's Splice release
ships. With the local network it reads that release from the LocalNet's config. Without one, set
`SPLICE_TAG` in `.env` to the release your network runs.

`deploy-dar` sends the `CANTON_BACKEND_TOKEN` from `.env`. If the project has a `bootstrap` script,
run it after `deploy-dar`. It creates what the model needs on the ledger first.

## Local network

This project also carries a local Canton stack:

- `@bootnodedev/canton-barebones` runs a Splice LocalNet in Docker, with its config in
  `.canton-localnet/`
- `@canton-network/wallet-gateway-remote` is [Wallet Gateway](https://github.com/canton-network/wallet),
  which the dApp connects to on http://localhost:3030, with its config in `wallet-gateway.config.json`

It needs Docker running and pnpm, plus `dpm` when the app has a contract.

```bash
pnpm stack up      # LocalNet, the contract if there is one, Wallet Gateway, dev server
pnpm stack down    # stop everything and keep the ledger
pnpm stack         # interactive menu
```

Then pick Wallet Gateway in the dApp's picker and log in with the client secret `unsafe`. Create a
party in the gateway with `wallet-kernel` as the signing provider.

On its first run, `pnpm stack up` mints `CANTON_BACKEND_TOKEN` into `.env`. When the project has a
contract, it then builds and deploys it, and runs the `bootstrap` script if there is one. To
wipe the ledger, run `canton-barebones reset` inside `.canton-localnet/`. You then have to create
the gateway's parties again.

Each step is also a script of its own: `pnpm mint-token` and `pnpm wallet-gateway`.
