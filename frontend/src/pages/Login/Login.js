import { backendIP } from "../../config"

export default function LoginPage(){
    return <form method="POST" action= {backendIP + "/login"} target="_blank">
        Username
        <input type="text" name="username"/>
        Password
        <input type="password" name="password"/>
        <input type="submit"/>
    </form>;
}