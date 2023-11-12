import database from "../globals.js";

function register (req, res){
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    // Check if the email is already registered
    database.userExists(email)
        .then((exists) => {
            if (exists) {
                return res.status(409).json({ error: 'Email is already registered.' });
            }

            // If the email is not registered, proceed with user registration
            return database.registerUser(email, password);
        })
        .then(() => {
            res.status(200).json({ message: 'User registered successfully.' });
        })
        .catch((error) => {
            console.error('Error registering user:', error);
            res.status(500).json({ error: 'Internal server error.' });
        });
};

function login (req, res){

}

function logout(red, res){

}

