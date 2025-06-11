// ecosystem.config.js
module.exports = {
	apps: [
		{
			name: 'portfolio-app',
			script: './build/index.js',
			env: {
				NODE_ENV: 'production',
				ORIGIN: 'https://dev.tomaskrivda.online',
				PORT: 3002
			}
		}
	]
};
