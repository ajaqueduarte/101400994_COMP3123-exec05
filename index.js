const express = require('express');
const app = express();
const router = express.Router();


/*
- Create new html file name home.html 
- add <h1> tag with message "Welcome to ExpressJs Tutorial"
- Return home.html page to client
*/
const path = require('path');


// http://localhost:8081/home
app.get('/home', (req, res) => {
  const filePath = path.join(__dirname, 'home.html');
  res.sendFile(filePath);
});
/*
- Return all details from user.json file to client as JSON format
*/
const fs = require('fs');

//http://localhost:8081/users
app.get('/users', (req, res) => {
  fs.readFile('user.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading user data');
      return;
    }

    // Parse the JSON data from the file
    const userData = JSON.parse(data);

    // Send the JSON data as a response
    res.json(userData);
  });
});


//http://localhost:8081/profile
app.get('/profile', (req,res) => {
  res.send('This is profile router');
});

/*
- Modify /login router to accept username and password as query string parameter
- Read data from user.json file
- If username and  passsword is valid then send resonse as below 
    {
        status: true,
        message: "User Is valid"
    }
- If username is invalid then send response as below 
    {
        status: false,
        message: "User Name is invalid"
    }
- If passsword is invalid then send response as below 
    {
        status: false,
        message: "Password is invalid"
    }
*/
// Define a function to check if a user is valid
function isValidUser(username, password) {
  // Read the user data from user.json
  const userData = JSON.parse(fs.readFileSync('user.json', 'utf8'));

  // Check if the provided username and password match the data in user.json
  if (userData.username === username && userData.password === password) {
    return true;
  }

  // Check if the username is invalid
  if (userData.username !== username) {
    return 'User Name is invalid';
  }

  // Check if the password is invalid
  if (userData.password !== password) {
    return 'Password is invalid';
  }

  // If none of the conditions match, the user is considered invalid
  return false;
}

//http://localhost:8081/login
// Define the /login route
app.get('/login', (req, res) => {
  const { username, password } = req.query;

  // Call the isValidUser function to check the validity of the user
  const validation = isValidUser(username, password);

  // Create a response object based on the validation result
  let response;
  if (validation === true) {
    response = {
      status: true,
      message: 'User Is valid',
    };
  } else {
    response = {
      status: false,
      message: validation,
    };
  }

  // Send the response as JSON
  res.json(response);
});


/*
- Modify /logout route to accept username as parameter and display message
    in HTML format like <b>${username} successfully logout.<b>
*/
// Define the /logout route with a username parameter
app.get('/logout/:username', (req, res) => {
  const { username } = req.params;
  
  // Create an HTML message with the username
  const htmlMessage = `<b>${username} successfully logged out.</b>`;

  // Send the HTML message as the response
  res.send(htmlMessage);
});

// Use the router for the /logout route
app.use('/logout', router);

// Start the server on port 8081
const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log(`Web Server is listening at port ${port}`);
});