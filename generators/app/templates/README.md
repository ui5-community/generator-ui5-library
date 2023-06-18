# UI5 Library <%= namespace %>

Insert the purpose of this project and some interesting info here...

## Description

This app demonstrates a setup for developing UI5 libraries.

## Requirements

Either [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) for dependency management.

## Preparation

Use `npm` (or `yarn`) to install the dependencies:

```sh
npm install
```

(To use yarn, just do `yarn` instead.)

## Run the Library

Execute the following command to run the library locally for development in watch mode (the browser reloads the app automatically when there are changes in the source code):

```sh
npm start
```

As shown in the terminal after executing this command, the app is then running on http://localhost:8080/. A browser window with the URL pointing to your controls' test page should automatically open.

(When using yarn, do `yarn start` instead.)

## Build the Library

### Unoptimized (but quick)

Execute the following command to build the project and get an app that can be deployed:

```sh
npm run build
```

The result is placed into the `dist` folder. To start the generated package, just run

```sh
npm run start:dist
```

Note that HTML page still loads the UI5 framework from the relative URL `resources/...`, which does not physically exist, but is only provided dynamically by the UI5 tooling. So for an actual deployment you should change this URL to either [the CDN](https://sdk.openui5.org/#/topic/2d3eb2f322ea4a82983c1c62a33ec4ae) or your local deployment of UI5.

(When using yarn, do `yarn build` and `yarn start:dist` instead.)

## Check the Code

To lint the code, do:

```sh
npm run lint
```

(Again, when using yarn, do `yarn lint` instead.)

## License

This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](LICENSE) file.

---

###### This template is provided to you by Geert-Jan Klaps and contributors :wink:
