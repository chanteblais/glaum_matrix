# The Glåüm Matrix

This project is divided into 3 parts:

|Project|Description|
|---|---|
|editor|The image editor, built with [NextJS](https://nextjs.org) and based on [Materio Template](https://demos.themeselection.com/materio-mui-react-nextjs-admin-template/documentation/guide).|
|publisher|A simple NodeJS app that publishes images from the editor to devices|
|simulator|A simulator device that consumes data from the publisher using EventSource|

## Editor

Built with [NextJS](https://nextjs.org) and based on [Materio Template](https://github.com/themeselection/materio-mui-react-nextjs-admin-template-free/tree/main/typescript-version), the Editor is a React Application that alows users to draw images and gifs to be displayed by the Glåum Matrix

The editor saves images users draw to a folder so that the publisher can read and push them to devices.

### Install dependencies
```shell
yarn
```

### Dev
```shell
yarn dev
```

### Build
```shell
yarn build
```

### Run
```shell
yarn start
```

## Publisher

A simple NodeJS app that publishes images from the editor to devices.

There are two main devices supported:

### Raspberry Pi
If the publisher is running in a Rpi board, it will draw to the Glåüm Matrix via `rpi-ws281x`

### Event Emitter
An http event emitter that clients can listen to image data

### Install dependencies
```shell
yarn
```

### Dev
```shell
yarn dev
```

### Run
```shell

```

## Simulator

A simulator device that consumes data from the Publisher using EventSource and display in a similar fashion as the Glåum Matrix.
Can be used during development or as a monitor of what's being displayed in the matrix (for instance, for security reasons).

### Install dependencies
```shell
yarn
```

### Dev/Run
```shell
yarn start
```
