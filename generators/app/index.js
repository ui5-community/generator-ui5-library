"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");
const path = require("path");
const glob = require("glob");

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the ${chalk.red("generator-ui5-library")} generator!`)
    );

    const prompts = [
      {
        type: "input",
        name: "libraryname",
        message: "How do you want to name this library?",
        validate: s => {
          if (/^\d*[a-zA-Z][a-zA-Z0-9]*$/g.test(s)) {
            return true;
          }

          return "Please use alpha numeric characters only for the library name.";
        },
        default: "myUI5Library"
      }, {
        type: "input",
        name: "namespace",
        message: "Which namespace do you want to use?",
        validate: s => {
          if (/^[a-zA-Z0-9_\.]*$/g.test(s)) {
            return true;
          }
          return "Please use alpha numeric characters and dots only for the namespace.";
        },
        default: "com.myorg"
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      //this.props = props;

      this.config.set(props);
      this.config.set("namespaceURI", props.namespace.split(".").join("/"))
      this.config.set("librarynamespace", `${props.namespace}.${props.libraryname}`);
      this.config.set("librarynamespaceURI", this.config.get("librarynamespace").split(".").join("/"));

    });
  }

  writing() {
    const oConfig = this.config.getAll();

    this.sourceRoot(path.join(__dirname, "templates"));
    glob.sync("**", {
      cwd: this.sourceRoot(),
      nodir: true
    }).forEach((file) => {
      const sOrigin = this.templatePath(file);
      let sTarget = this.destinationPath(file.replace(/^_/, "").replace("baselibrary", oConfig.librarynamespaceURI).replace(/\/_/, "/"));

      this.fs.copyTpl(sOrigin, sTarget, oConfig);
    });


/*     this.fs.copy(
      this.templatePath('dummyfile.txt'),
      this.destinationPath('dummyfile.txt')
    ); */
  }

  install() {
    this.config.set("setupCompleted", true);
    this.installDependencies({
      bower: false,
      npm: true
    });
  }

  end() {
    /*
    this.spawnCommandSync("git", ["init", "--quiet"], {
      cwd: this.destinationPath()
    });
    this.spawnCommandSync("git", ["add", "."], {
      cwd: this.destinationPath()
    });
    this.spawnCommandSync("git", ["commit", "--quiet", "--allow-empty", "-m", "Initialize repository with generator-ui5-library"], {
      cwd: this.destinationPath()
    });
    */
  }

};
