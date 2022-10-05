const jsonwebtoken = require("jsonwebtoken");

export class Jwt {
	public constructor(private secret: string) {
	}

	public verify(token: string): boolean {
		try {
			jsonwebtoken.verify(token, Buffer.from(this.secret, 'base64'));
			return true;
		} catch (e) {
			return false;
		}
	}

	public decode(token: string): any {

		const args = token.split(".");
		if (args.length === 3) {
			const json = Buffer.from(args[1], 'base64').toString();
			return JSON.parse(json);
		}

		return null;
	}

	public sign(message: object, options?: any): string {
		return jsonwebtoken.sign(message, Buffer.from(this.secret, 'base64'), options);
	}
}
