const path = require("path");

module.exports = {
	trailingSlash: true,
	reactStrictMode: false,
	experimental: {
		esmExternals: false,
		jsconfigPaths: true // enables it for both jsconfig.json and tsconfig.json
	},
	webpack: (config, {isServer}) => {
		if (isServer) {
			return {
				...config,
				entry() {
					return config.entry().then((entry) => ({
						...entry,
						// adding custom entry points
						publisher: path.resolve(process.cwd(), "src/workers/publisher.ts"),
						// run: path.resolve(process.cwd(), "src/run.js"),
					}));
				}
			};
		} else {
			config.resolve.alias = {
				...config.resolve.alias,
				apexcharts: path.resolve(__dirname, "./node_modules/apexcharts-clevision")
			};
			return config;
		}
	}
};
