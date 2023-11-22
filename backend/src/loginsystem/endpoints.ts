import {userAccountDatabase as database} from "../globals.js";
import { sendPasswordForgottenMail } from "./utils.js";

/**
 * Handles user registration. Expects the fields email and password in the POST
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * 
 * @returns {Object} - The response object containing the registration status or error.
 */
export async function register(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    const exists = await database.userExists(email);

    if (exists) {
        return res.status(409).json({ error: 'Email is already registered.' });
    }

    // If the email is not registered, proceed with user registration
    await database.registerUser(email, password);

    res.status(200).json({ message: 'User registered successfully.' });
    
}

/**
 * Handles user registration. Expects the fields email, password, and stayLoggedIn in the POST
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * 
 * @returns {Object} - The response object containing the login status or error.
 */
export async function login(req, res) {
    const { email, password, stayLoggedIn } = req.body;

    if (!email || !password || !stayLoggedIn) {
        return res.status(400).json({ error: 'email, password and stayLoggedIn are required.' });
    }

    const token = await database.authenticateUser(email, password);
    let tokenOptions = {};
    if(!stayLoggedIn){
        //Ensures cookies is deleted from browser when browser closes.
        tokenOptions = { expires: 0}
    }
    if (token != null) {
        res.cookie('token', token, tokenOptions);
        res.status(200).json({ message: 'Login successful.' });
    } else {
        res.status(401).json({ error: 'Invalid email or password.' });
    }
}

/**
 * Handles user registration. Expects the field token in the POST
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * 
 * @returns {Object} - The response object containing the logout status or error.
 */
export async function logout(req, res) {
    const token = req.body.token;

    if (!token) {
        return res.status(400).json({ error: 'Not logged in.' });
    }

    req.session.destroy();
    await database.destroyToken(token);
    res.status(200).json({ message: 'Logout successful.' });
}

/**
 * Handles user registration. Expects the field specificToken in the POST
 *
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 * 
 * @returns {Object} - The response object containing the token logout status or error.
 */
export async function logoutSpecificToken(req, res) {
    const specificToken = req.body.specificToken;

    if (!specificToken) {
        return res.status(400).json({ error: 'No token sent.' });
    }

    await database.destroyToken(specificToken);
    res.status(200).json({ message: 'Token destroyed successfully.' });
}

export async function changePassword(req, res){
    const {email, oldPassword, newPassword} = req.body.specificToken;

    if (!oldPassword || !email || !newPassword) {
        return res.status(400).json({ error: 'email, oldPassword and newPassword required.' });
    }
    if(!database.verifyPassword(email, oldPassword)){
        return res.status(401).json({ error: 'Invalid username or password.' });
    }
    let user = await database.getUserByEmail(email);
    await Promise.all([database.changePassword(email, newPassword), database.purgeAllTokens(user.ID)]);
    res.status(200).json({message: "Password succesfully changed."});
}

export async function changePasswordForgotten(req, res){
    const {email, newPassword, resetToken} = req.body.specificToken;

    if (!resetToken || !email || !newPassword) {
        return res.status(400).json({ error: 'email, resetToken and newPassword required.' });
    }
    if(!await database.verifyResetToken(email, resetToken)){
        return res.status(401).json({ error: 'Invalid reset token' });
    }
    await Promise.all([
        database.changePassword(email, newPassword),
        database.purgeResetToken(email)
    ]);
    return res.status(200).json({ message: 'Password succesfully changed' });
}

async function forgotPasswordProcedure(email){
    let token = await database.makeNewForgottenToken(email);
    await sendPasswordForgottenMail(email, "Wachtwoord resetten", "Ga naar <a href=''>unfinished link</a>")//TODO get a better system for mail text
}

export async function forgotPassword(req, res){
    const {email} = req.body.specificToken;
    if (!email) {
        return res.status(400).json({ error: 'email required.' });
    }
    await forgotPasswordProcedure(email);
    return res.status(200).json({ message: 'Email send' });
}

async function checkAndCreateAccount(mail){
    if(await database.userExists(mail)){
        throw new Error("User " + mail + " already exists");
    }
    let password = Array.from(Array(20), () => Math.floor(Math.random() * 36).toString(36)).join('');
    await database.registerUser(mail, password);
    await forgotPasswordProcedure(mail);
    return;
}

export async function massCreateAccounts(req, res){
    const jsonList = req.body.data;
    if (!jsonList || !Array.isArray(jsonList)) {
        return res.status(400).json({ error: 'Invalid JSON list format' });
    }
    let results = await Promise.allSettled(jsonList.map(checkAndCreateAccount));
    let rejected = results.filter(x => x.status == "rejected");
    if(rejected.length > 0){
        // @ts-ignore : reason exists if it is rejected 
        let joinedReasons = rejected.map(x => ((x.reason)).join(", "));
        return res.status(200).json({ message: 'Following errors found: ' + joinedReasons});
    }
    return res.status(200).json({message: 'Ok'});
}