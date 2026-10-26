import url from "url";

// all below required dependencies need to be listed
// as dependencies in the package.json (not devDeps!)
import Generator from "yeoman-generator";
import yosay from "yosay";
import chalk from "chalk";
import { glob } from "glob";
import packageJson from "package-json";
import semver from "semver";
import upath from "upath";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

export default class extends Generator {
	static displayName = "Create a new UI5 library";

	constructor(args, opts) {
		super(args, opts, {
			// disable the Yeoman 5 package-manager logic (auto install)!
			customInstallTask: "disabled"
		});

		// declare the arguments and options of the generator, so they can be shown by --help
		this.argument("libNamespace", {
			// "libNamespace" is used here to avoid a conflict with the "namespace" property, which is natively in this.options, where these arguments also end up
			type: String,
			required: false,
			description: "The namespace for the library, e.g. com.myorg.mylib"
		});

		this.argument("framework", {
			type: String,
			required: false,
			description: "The framework to use, i.e. OpenUI5 or SAPUI5"
		});

		this.argument("frameworkVersion", {
			type: String,
			required: false,
			description: "The framework version to use, e.g. 1.136.0"
		});

		this.argument("flat", {
			type: Boolean,
			required: false,
			description: "Whether to omit the namespace in the src and test folder"
		});

		this.argument("author", {
			type: String,
			required: false,
			description: "The author of the library, e.g. John Doe"
		});

		this.argument("newdir", {
			type: Boolean,
			required: false,
			description: "Whether a new directory should be created for the library"
		});

		this.argument("initrepo", {
			type: Boolean,
			required: false,
			description: "Whether to initialize a local git repository for the library"
		});
	}

	prompting() {
		// Have Yeoman greet the user.
		if (!this.options.embedded) {
			this.log(yosay(`Welcome to the ${chalk.red("generator-ui5-library")} generator!`));
		}

		const fwkInfo = {
			OpenUI5: {
				minVersion: "1.60.0",
				cdnDomain: "sdk.openui5.org",
				npmPackage: "@openui5/sap.ui.core"
			},
			SAPUI5: {
				minVersion: "1.77.0",
				cdnDomain: "ui5.sap.com",
				npmPackage: "@sapui5/distribution-metadata"
			}
		};

		// validate any arguments given via CLI
		if (!/^[a-z0-9][a-z0-9_.]*$/g.test(this.options.libNamespace)) {
			this.log(chalk.red("The provided namespace is not valid! Please use lowercase alpha numeric characters, underscores and dots only."));
			delete this.options.libNamespace;
		}

		if (this.options.framework && !["OpenUI5", "SAPUI5"].includes(this.options.framework)) {
			this.log(chalk.red("The provided framework is not valid! Please use either OpenUI5 or SAPUI5."));
			delete this.options.framework;
		}

		if (this.options.frameworkVersion && !semver.valid(this.options.frameworkVersion)) {
			this.log(chalk.red("The provided framework version is not valid! Please use a valid semantic version, e.g. 1.136.0."));
			delete this.options.frameworkVersion;
		} else if (this.options.frameworkVersion && this.options.framework && semver.lt(this.options.frameworkVersion, fwkInfo[this.options.framework].minVersion)) {
			this.log(
				chalk.red(`The provided framework version ${this.options.frameworkVersion} is not valid! The minimum version for ${this.options.framework} is ${fwkInfo[this.options.framework].minVersion}.`)
			);
			delete this.options.frameworkVersion;
		}

		if (this.options.flat !== undefined) {
			// it's coming as string because it is an argument, not an option, so we can differentiate between "undefined" and "false" value
			if (this.options.flat === "false") {
				this.options.flat = false;
			} else if (this.options.flat === "true") {
				this.options.flat = true;
			}
		}

		if (this.options.newdir !== undefined) {
			// it's coming as string because it is an argument, not an option, so we can differentiate between "undefined" and "false" value
			if (this.options.newdir === "false") {
				this.options.newdir = false;
			} else if (this.options.newdir === "true") {
				this.options.newdir = true;
			}
		}

		if (this.options.initrepo !== undefined) {
			// same as above
			if (this.options.initrepo === "false") {
				this.options.initrepo = false;
			} else if (this.options.initrepo === "true") {
				this.options.initrepo = true;
			}
		}

		// prepare the needed prompts
		const prompts = [];
		if (!this.options.libNamespace) {
			// only prompt the user when not provided already
			prompts.push({
				type: "input",
				name: "namespace",
				message: "Enter your library id (namespace)?",
				validate: (s) => {
					if (/^[a-z0-9][a-z0-9_.]*$/g.test(s)) {
						return true;
					}

					return "Please use lowercase alpha numeric characters, underscores and dots only for the namespace.";
				},
				default: "com.myorg.mylib"
			});
		}

		if (!this.options.framework) {
			prompts.push({
				type: "list",
				name: "framework",
				message: "Which framework do you want to use?",
				choices: ["OpenUI5", "SAPUI5"],
				default: "OpenUI5"
			});
		}

		if (!this.options.frameworkVersion) {
			prompts.push({
				when: (response) => {
					this._minFwkVersion = fwkInfo[response.framework || this.options.framework].minVersion;
					return true;
				},
				type: "input", // HINT: we could also use the version info from OpenUI5/SAPUI5 to provide a selection!
				name: "frameworkVersion",
				message: "Which framework version do you want to use?",
				default: async (answers) => {
					const npmPackage = fwkInfo[answers.framework || this.options.framework].npmPackage;
					try {
						return (
							await packageJson(npmPackage, {
								version: "*" // use highest version, not latest!
							})
						).version;
					} catch (ex) {
						this.log(chalk.red(`Failed to lookup latest version for ${npmPackage}! Fallback to min version...`));
						return fwkInfo[answers.framework || this.options.framework].minVersion;
					}
				},
				validate: (v) => {
					return (v && semver.valid(v) && semver.gte(v, this._minFwkVersion)) || chalk.red(`Framework requires the min version ${this._minFwkVersion} due to the availability of the NPM packages!`);
				}
			});
		}

		if (this.options.flat === undefined) {
			prompts.push({
				type: "confirm",
				name: "flat",
				message: "Would you like to omit the namespace in the src and test folder?",
				default: true
			});
		}

		if (!this.options.author) {
			prompts.push({
				type: "input",
				name: "author",
				message: "Who is the author of the library?",
				default: this.user.git.name()
			});
		}

		if (this.options.newdir === undefined) {
			prompts.push({
				type: "confirm",
				name: "newdir",
				message: "Would you like to create a new directory for the library?",
				default: true
			});
		}

		if (this.options.initrepo === undefined) {
			prompts.push({
				type: "confirm",
				name: "initrepo",
				message: "Would you like to initialize a local git repository for the library?",
				default: true
			});
		}

		return this.prompt(prompts).then((props) => {
			// merge pre-filled arguments with prompt answers
			Object.values(this._arguments)
				.map((v) => v.name)
				.forEach((key) => {
					props[key] = props[key] !== undefined ? props[key] : this.options[key];
				});
			props.namespace = props.namespace || props.libNamespace; // use "namespace" from here ("libNamespace" was used in the CLI to prevent a conflict with native this.options content)

			// use the namespace and the library name as new subdirectory
			if (props.newdir) {
				this.destinationRoot(this.destinationPath(`${props.namespace}`));
			}
			delete props.newdir;

			// apply the properties
			this.config.set(props);

			// libId + libURI + libBasePath
			this.config.set("libId", `${props.namespace}`);
			this.config.set("libURI", `${props.namespace.split(".").join("/")}`);
			this.config.set(
				"libBasePath",
				`${props.namespace
					.split(".")
					// eslint-disable-next-line no-unused-vars
					.map((_) => "..")
					.join("/")}`
			);

			// CDN domain
			this.config.set("cdnDomain", fwkInfo[props.framework].cdnDomain);

			// default theme
			if (semver.gte(props.frameworkVersion, "1.108.0")) {
				this.config.set("defaultTheme", "sap_horizon");
				this.config.set("availableThemes", {
					sap_horizon: ["sap_horizon", "sap_horizon_dark", "sap_horizon_hcw", "sap_horizon_hcb"],
					sap_fiori_3: ["sap_fiori_3", "sap_fiori_3_dark", "sap_fiori_3_hcw", "sap_fiori_3_hcb"]
				});
			} else {
				this.config.set("defaultTheme", "sap_fiori_3");
				this.config.set("availableThemes", {
					sap_fiori_3: ["sap_fiori_3", "sap_fiori_3_dark", "sap_fiori_3_hcw", "sap_fiori_3_hcb"],
					sap_belize: ["sap_belize", "sap_belize_plus", "sap_belize_hcw", "sap_belize_hcb"]
				});
			}

			// version parameters
			this.config.set("gte2_0_0", semver.gte(props.frameworkVersion, "2.0.0"));
		});
	}

	writing() {
		const oConfig = this.config.getAll();
		const libPath = oConfig.flat ? "" : oConfig.libURI;

		// write library
		this.sourceRoot(upath.join(__dirname, "templates"));
		glob
			.sync("**", {
				cwd: this.sourceRoot(),
				nodir: true
			})
			.forEach((file) => {
				const sOrigin = this.templatePath(file);
				const sTarget = this.destinationPath(
					file
						.replace(/^_/, "")
						.replace("_library_", libPath)
						.replace(/[\\/]_/, "/")
				);
				this.fs.copyTpl(sOrigin, sTarget, oConfig);
			});

		// write the available themes
		this.sourceRoot(upath.join(__dirname, "templates-theme"));
		const themes = [];
		Object.values(oConfig.availableThemes).forEach((v) => themes.push(...v));
		themes.forEach((theme) => {
			glob
				.sync("**", {
					cwd: this.sourceRoot(),
					nodir: true
				})
				.forEach((file) => {
					const sOrigin = this.templatePath(file);
					const sTarget = this.destinationPath(file.replace("_library_", libPath).replace("_theme_", theme));
					this.fs.copyTpl(sOrigin, sTarget, Object.assign({ themeName: theme }, oConfig));
				});
		});
	}

	install() {
		this.config.set("setupCompleted", true);
		this.spawnCommandSync("npm", ["install"], {
			cwd: this.destinationPath()
		});
	}

	end() {
		if (this.config.get("initrepo")) {
			this.spawnCommandSync("git", ["init", "--quiet"], {
				cwd: this.destinationPath()
			});
			this.spawnCommandSync("git", ["add", "."], {
				cwd: this.destinationPath()
			});
			this.spawnCommandSync("git", ["commit", "--quiet", "--allow-empty", "-m", "Initial commit"], {
				cwd: this.destinationPath()
			});
		}
	}
}
