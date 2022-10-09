import {Event} from "./event";
import {TwitchAuth} from "./twitch-auth";
import {Jwt} from "./jwt";

export abstract class Function {

	protected constructor(public config: any) {
	}

	/**
	 * Function implementation. Callback's resolve method will be wrapped with a 200 OK
	 * json for lambda.
	 *
	 */
	public abstract handle(event: Event): Promise<any>;

	private logEvent(event: Event): void {
		const short: any = {};

		const ip = event.requestContext.identity.sourceIp;

		if (event.queryStringParameters) {
			short.queryStringParameters = event.queryStringParameters;
		}

		if (event.body) {
			short.body = event.body;
		}

		if (event.headers && event.headers.Authorization) {
			short.authorization = event.headers.Authorization;
		}

		console.log("Handling request: " + ip + " " + event.httpMethod + " " + event.path + " " + JSON.stringify(short));
	}

	/**
	 * Handle request from lambda gateway
	 *
	 */
	public run(event: Event, context: any, callback: any): void {

		this.logEvent(event);

		this.handle(event).then((body: any) => {

			if ("statusCode" in body && "headers" in body) {
				// FIXME, this is not a json
				callback(null, body);
				return;
			}

			const response = {
				statusCode: 200,
				headers: {
					"Access-Control-Allow-Origin": "*",
					'Access-Control-Allow-Credentials': true,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body)
			};

			console.log("Returning html success with body: " + JSON.stringify(response));
			callback(null, response);
		}).catch((err: any) => {
			console.log("Returning html failure with error: " + JSON.stringify(err));
			callback(err, null);
		});
	}

	protected hasBodyParameter(event: Event, key: string): boolean {
		const body = JSON.parse(event.body);
		return (key in body);
	}

	protected getBodyParameter(event: Event, key: string): any {
		const body = JSON.parse(event.body);
		if (!(key in body)) {
			throw new Error("Missing parameter " + key);
		}

		return body[key];
	}

	protected getHeader(headers: any, header: string): string {
		for (const key in headers) {
			if (key.toLowerCase() === header.toLowerCase()) {
				return headers[key];
			}
		}

		return null;
	}

	protected getAuthorizationToken(headers: any): string {
		if (headers == null) {
			return null;
		}

		const value = this.getHeader(headers, "Authorization");
		if (value) {
			if (value.startsWith("Bearer ")) {
				return value.substring("Bearer ".length);
			}
		}

		return null;
	}

	protected getRemoteAddress(event: any): string {
		if (event.requestContext) {
			if (event.requestContext.identity && event.requestContext.identity.sourceIp) {
				return event.requestContext.identity.sourceIp;
			}
		}

		return '0.0.0.0';
	}

	public getToken(event: Event): TwitchAuth {
		const jwt = new Jwt(this.config.twitch.extensionSecret);

		const token = this.getAuthorizationToken(event.headers);
		if (token === null) {
			throw new Error("No token in request");
		}

		if (!jwt.verify(token)) {
			throw new Error("JWT validation failed for " + token);
		}

		const token_object: TwitchAuth = jwt.decode(token);
		if (token_object === null) {
			throw new Error("Failed to parse json from " + token);
		}

		return token_object;
	}
}
