export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {start:"_app/immutable/entry/start.BZ0kDk2C.js",app:"_app/immutable/entry/app.B_DbXyTj.js",imports:["_app/immutable/entry/start.BZ0kDk2C.js","_app/immutable/chunks/CXnXlaW0.js","_app/immutable/chunks/X3cm3iuQ.js","_app/immutable/chunks/u0al_n1k.js","_app/immutable/entry/app.B_DbXyTj.js","_app/immutable/chunks/X3cm3iuQ.js","_app/immutable/chunks/CStnfIlp.js","_app/immutable/chunks/Cq2e60h3.js","_app/immutable/chunks/BMdiElij.js","_app/immutable/chunks/sHUU7htf.js","_app/immutable/chunks/BC7-pRYh.js","_app/immutable/chunks/AHqh6sfL.js","_app/immutable/chunks/u0al_n1k.js","_app/immutable/chunks/EGnxJXBC.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js')),
			__memo(() => import('./nodes/4.js')),
			__memo(() => import('./nodes/5.js')),
			__memo(() => import('./nodes/6.js')),
			__memo(() => import('./nodes/7.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/assets",
				pattern: /^\/assets\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			},
			{
				id: "/assets/[assetId]",
				pattern: /^\/assets\/([^/]+?)\/?$/,
				params: [{"name":"assetId","optional":false,"rest":false,"chained":false}],
				page: { layouts: [0,], errors: [1,], leaf: 4 },
				endpoint: null
			},
			{
				id: "/dashboard",
				pattern: /^\/dashboard\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 5 },
				endpoint: null
			},
			{
				id: "/login",
				pattern: /^\/login\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 6 },
				endpoint: null
			},
			{
				id: "/register",
				pattern: /^\/register\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 7 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
