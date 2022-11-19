export interface Event {
    httpMethod?: string;
    body?: string;
    path?: string;
    queryStringParameters?: any;
    pathParameters?: any;
    headers?: any;
    requestContext?: {
        identity: {
            sourceIp: string;
        };
    };
}
