export declare class Jwt {
    private secret;
    constructor(secret: string);
    verify(token: string): boolean;
    decode(token: string): any;
    sign(message: object, options?: any): string;
}
