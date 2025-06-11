// ecosystem.config.js
module.exports = {
	apps: [
		{
			env_production: {
				NODE_ENV: 'production',
				ORIGIN: 'https://dev.tomaskrivda.online',
				PORT: 3002
			}
		}
	]
};
