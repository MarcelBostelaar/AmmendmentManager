USE ammendmentmanagerdb;

-- Users Table
CREATE TABLE Users (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Email VARCHAR(50) UNIQUE,
    Password VARCHAR(255),
    ResetToken VARCHAR(255),
    ResetTokenExpiryDate TIMESTAMP,
    Role INT
);

-- Branches Table
CREATE TABLE Branches (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    ParentBranchID INT,
    Title VARCHAR(255),
    PrimaryDocument VARCHAR(255),
    PrimaryExplanatoryDoc VARCHAR(255),
    FOREIGN KEY (ParentBranchID) REFERENCES Branches(ID)
);

-- Permissions Table
CREATE TABLE Permissions (
    PermissionID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    BranchID INT,
    IsOwner BOOLEAN,
    FOREIGN KEY (UserID) REFERENCES Users(ID),
    FOREIGN KEY (BranchID) REFERENCES Branches(ID)
);

-- Commits Table
CREATE TABLE Commits (
    Hash VARCHAR(255) PRIMARY KEY,
    Branch INT,
    IsPublished BOOLEAN,
    AcceptationStatus INT,
    FOREIGN KEY (Branch) REFERENCES Branches(ID)
);

-- Tokens Table
CREATE TABLE LoginTokens (
    TokenValue VARCHAR(255) PRIMARY KEY,
    UserID INT,
    ExpiryDate TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(ID)
);

/*Repeating cleanup of old tokens, runs every day*/
CREATE EVENT AutoDeleteOldTokens
ON SCHEDULE AT CURRENT_TIMESTAMP + INTERVAL 1 DAY 
ON COMPLETION PRESERVE
DO 
DELETE LOW_PRIORITY FROM Tokens WHERE ExpiryDate < CURRENT_TIMESTAMP();

/*Inserts user admin with password admin with role admin*/
INSERT INTO Users (Email, Password, Role) VALUES ('admin', '$2y$10$igcybWOFjVd6L4D1L08oI.3gqOf5bmyG.Pw06WSu/ZzdxW8ivNvrG', 1);

