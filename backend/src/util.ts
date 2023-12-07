export let isDev = process.env.NODE_ENV == "development";
export let isProd = process.env.NODE_ENV == "production";

export function isUndefined(item){
    return typeof(item) == "undefined";
}

export function anyUndefined(...items){
    for(let i = 0; i < items.length; i++){
        if(isUndefined(items[i])){
            return true;
        }
    }
    return false;
}