import {userAccountDatabase as database} from "../globals.js";

export function AuthProtect(func, authLevel : "None" | "LoggedIn" | "Admin"){
    return async function(req, res){
        if (authLevel === "None") {
            return func(req, res);
        }

        const token = req.body.token;

        if (!token) {
            return NotLoggedinResponse(res);
        }

        const tokenExists = await database.tokenExists(token);
        if (!tokenExists) {
            return NotLoggedinResponse(res);
        }

        if (authLevel === "LoggedIn") {
            return func(req, res);
        }

        if (authLevel === "Admin") {
            let isAdmin = await database.isAdmin(token);

            if (isAdmin) {
                return func(req, res);
            } else {
                return NotAutheticatedResponse(res);
            }
        }

        console.log('Unhandled authentication option: ' + authLevel);
        return res.status(500).send({ message: 'Internal server error' });
    }
}

function NotAutheticatedResponse(res){
    return res.status(401).send({
        message: 'Not Authorized'
     });
}

function NotLoggedinResponse(res){
    return res.status(401).send({
        message: 'Not logged in'
     });
}