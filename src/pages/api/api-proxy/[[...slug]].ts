import { IncomingMessage } from 'http';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { NextApiRequest, NextApiResponse } from 'next';

let apiUrl: string;

switch (process.env.API_PROXY_ENV) {
	// pick API endpoint depending on the API_PROXY_ENV, assign to apiUrl
	case 'production':
		apiUrl = 'https://dsec-backend.herokuapp.com/';
		break;
	case 'staging':
		apiUrl = 'https://dsec-backend-staging.herokuapp.com/';
		break;
	default:
		apiUrl = 'http://localhost:8080';
}

const proxy = createProxyMiddleware({
	target: apiUrl,
	changeOrigin: true,
	logLevel: 'debug',
	cookieDomainRewrite: 'localhost',
	pathRewrite: {
		'^/api/api-proxy': '',
	},
	onProxyRes: (proxyRes: IncomingMessage) => {
		// You can manipulate the cookie here

		if (!proxyRes.headers['set-cookie']) {
			return;
		}

		// For example you can remove secure and SameSite security flags so browser can save the cookie in dev env
		const adaptCookiesForLocalhost = proxyRes.headers['set-cookie'].map((cookie) =>
			cookie.replace(/; secure/gi, '').replace(/; SameSite=None/gi, '')
		);

		proxyRes.headers['set-cookie'] = adaptCookiesForLocalhost;
	},
	onError: (err: Error) => console.error(err),
	onProxyReq: (proxyReq) => {
		proxyReq.removeHeader('origin');
	},
});

export default function handler(req: NextApiRequest, res: NextApiResponse<unknown>) {
	// Don't allow requests to hit the proxy when not in development mode
	// NextJS doesn't allow conditional API routes
	if (process.env.NODE_ENV !== 'development') {
		return res.status(404).json({ message: 'Not found' });
	}

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	return proxy(req, res);
}

export const config = {
	api: {
		bodyParser: false, // enable POST requests
		externalResolver: true, // hide warning message
	},
};
