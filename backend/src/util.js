export let isDev = process.env.NODE_ENV == "development";
export let isProd = process.env.NODE_ENV == "production";

export function GenerateRandomToken(){
    return crypto.randomBytes(16).toString('base64');
}