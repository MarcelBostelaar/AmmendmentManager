export function DummyAuth(req, res){
    const { username } = req.body;
    res.cookie(`Username`, username);
    res.status(200).send("Logged in as " + username);
}

export function GetUser(req){
    if(IsAuthenticated()){
        return req.cookies["Username"];
    }
    throw Error("Not authenticated and not checked in code.")
}

export function IsAuthenticated(){
    return req.cookies["Username"] !== undefined;
}

export function AuthProtect(func, req, res){
    if(IsAuthenticated()){
        func(req, res);
    }
    else{
        NotAutheticatedResponse(req, res);
    }
}

function NotAutheticatedResponse(req, res){
    return res.status(401 ).send({
        message: 'Not Authorized'
     });
}