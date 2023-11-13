import database from "../globals.js";

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
    await myDatabase.destroyToken(token);
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
    const {token, email, newPassword} = req.body.specificToken;

    if (!specificToken || !email || !newPassword) {
        return res.status(400).json({ error: 'token, email and newPassword required.' });
    }
    let user = database.getTokensUser(token);
    if(user == null){
        return res.status(401).json({ error: 'Invalid token, could not find valid token associated with username.' });
    }
    await database.changePassword(newPassword);
    await database.purgeAllTokens(user.ID);
    res.status(200).json({message: "Password succesfully changed."});
}