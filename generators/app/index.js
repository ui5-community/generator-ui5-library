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

		const prompts = [
			{
				type: "input",
				name: "namespace",
				message: "What is the namespace of your library?",
				validate: (s) => {
					if (/^[a-zA-Z0-9][a-zA-Z0-9_.]*$/g.test(s)) {
						return true;
					}

					return "Please use alpha numeric characters and dots only for the namespace.";
				},
				default: "com.myorg.mylib"
			},
			{
				type: "list",
				name: "framework",
				message: "Which framework do you want to use?",
				choices: Object.keys(fwkInfo),
				default: Object.keys(fwkInfo)[0]
			},
			{
				when: (response) => {
					this._minFwkVersion = fwkInfo[response.framework].minVersion;
					return true;
				},
				type: "input", // HINT: we could also use the version info from OpenUI5/SAPUI5 to provide a selection!
				name: "frameworkVersion",
				message: "Which framework version do you want to use?",
				default: async (answers) => {
					const minVersion = fwkInfo[answers.framework].minVersion;
					const npmPackage = fwkInfo[answers.framework].npmPackage;
					try {
						return (
							await packageJson(npmPackage, {
								version: "*" // use highest version, not latest!
							})
						).version;
					} catch (ex) {
						chalk.red("Failed to lookup latest version for ${npmPackage}! Fallback to min version...");
						return minVersion[answers.framework];
					}
				},
				validate: (v) => {
					return (v && semver.valid(v) && semver.gte(v, this._minFwkVersion)) || chalk.red(`Framework requires the min version ${this._minFwkVersion} due to the availability of the NPM packages!`);
				}
			},
			{
				type: "input",
				name: "author",
				message: "Who is the author of the application?",
				default: this.user.git.name()
			},
			{
				type: "confirm",
				name: "newdir",
				message: "Would you like to create a new directory for the application?",
				default: true
			},
			{
				type: "confirm",
				name: "initrepo",
				message: "Would you like to initialize a local github repository for the application?",
				default: true
			}
		];

		return this.prompt(prompts).then((props) => {
			// use the namespace and the application name as new subdirectory
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
		});
	}

	writing() {
		const oConfig = this.config.getAll();
		const libPath = oConfig.libURI;

		// write library
		this.sourceRoot(upath.join(__dirname, "templates"));
		glob
			.sync("**", {
				cwd: this.sourceRoot(),
				nodir: true
			})
			.forEach((file) => {
				const sOrigin = this.templatePath(file);
				const sTarget = this.destinationPath(file.replace(/^_/, "").replace("_library_", libPath).replace(/\/_/, "/"));
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
					const sTarget = this.destinationPath(file.replace("_library_", oConfig.libURI).replace("_theme_", theme));
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
