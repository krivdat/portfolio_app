// ecosystem.config.js
module.exports = {
	apps: [
		{
			name: 'portfolio-app',
			script: './build/index.js',
			time: true,
			env: {
				NODE_ENV: 'production',
				ORIGIN: 'https://portfolio.krivda.it',
				PORT: 3002
			}
		}
	]
};
