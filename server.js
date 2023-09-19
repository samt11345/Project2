const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sequelize = require('./config/connection');
const routes = require('./controllers');
const helpers = require('./utils/helpers');

const app = express();
const PORT = process.env.PORT || 3033;

// Create an instance of Handlebars with custom helpers
const hbs = exphbs.create({ helpers });

const sess = {
  secret: process.env.SESSION_SECRET,
  cookie: { maxAge: 1000 * 60 * 60 },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize,
  }),
};

app.use(session(sess));

// Set up the view engine to use Handlebars
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use(routes);

// Database synchronization
sequelize
  .sync({ force: false })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is now listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
  });
