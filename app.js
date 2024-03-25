const path = require('path');


const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


// importing for cookies and sessions
const session = require('express-session');
const MongoDbStore= require("connect-mongodb-session")(session)

// importing Routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');


const errorController = require('./controllers/error');
const User = require('./models/user');
//       

// Constantent variables
const MONGODB_URL = "******************************URL************************";


const app = express();

// defining store for sessional cookies........
mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const store= new MongoDbStore({
  uri: MONGODB_URL,
  collection: "sessions"
})

// setting folder for views, then i just pass info in controllers from next to views folder
app.set('view engine', 'ejs');
app.set('views', 'views');




// middle wheres...........
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

//midle whare for sessions
app.use(session({

  secret:"my secret",
  resave: false,
  saveUninitialized: false,
  store: store
}))

app.use((req,res,next)=>{
  if (!req.session.user) {
    return next();
    
  }
  User.findById(req.session.user._id)
    .then(user => {
      req.user=user;
      next();
    })
    .catch(err => console.log(err));
})

// Routes....
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);
mongoose
.connect(
  MONGODB_URL,
  { useNewUrlParser: true, useUnifiedTopology: true }
)
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Max',
          email: 'max@test.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(3000,()=>{
      console.log("App is running . . .");
    });
  })
  .catch(err => {
    console.log(err);
  });
