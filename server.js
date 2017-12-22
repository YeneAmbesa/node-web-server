const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

//This code allows Heroku to set the port or defualt to 8080 is running locally
//This is necessary for Heroku to operate correctly
const port = process.env.PORT || 8080;
var app = express();

//This lets handlebars know we want to add support for partials
hbs.registerPartials(__dirname + '/views/partials');
//Tells Express the view engine we want to use
app.set('view engine', 'hbs');

//This code creates some middleware that allows us to log every request made, creating a time stamp, http method and path
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;

  console.log(log);
  //This prints the log to a file and starts a new line after each request
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log.')
    }
  });
  next();
});

//In this code we don't call 'next' because we want our app to stop in maintenance mode
//The order is important because middleware will get executed in the order app.use is called
//We we do not need to run in maintenance mode, simply comment out these three lines of code
// app.use((req, res, next) => {
//   res.render('maintenance.hbs')
// });

//lets you add middleware
app.use(express.static(__dirname + '/public'));

//This handlebar helper lets us register a function to be reused throughout the code
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

app.get('/', (req, res) => {
  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMessage: 'Welcome to the home page!',
    //currentYear: new Date().getFullYear()
  })
});

app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About Page',
    //currentYear: new Date().getFullYear()
  })
});

// app.get('/bad', (req, res) => {
//   res.send({
//     errorMessage: 'Something went wrong'
//   });
// });

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
