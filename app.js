const express = require('express');
const app = express();

const path = require('path');

const exphbs = require('express-handlebars');

const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const methodOveride = require('method-override');

const upload = require('express-fileupload');

const session = require('express-session');

const flash = require('connect-flash');

const passport = require('passport');

const {mongoDbUrl} = require('./config/database');

mongoose.Promise = global.Promise;
//---------------DATA BASE----------

mongoose.connect(mongoDbUrl,{useMongoClient: true}).then(db =>{
  console.log('Mongo Connected...');
}).catch(error=>console.log(error));


//-------------helpers---------------
const {select, generateTime} = require('./helpers/handlebars-helpers');
//---------------------------

app.use(express.static(path.join(__dirname,'public')));
//---------------- set view engine..............
app.engine('handlebars', exphbs({defaultLayout: 'home', helpers: {select: select, generateTime: generateTime }}));
app.set('view engine', 'handlebars');
//----------------------------------------------
//------------upload Middleware-----------------
app.use(upload());



//---------------------------------------------
//---------- bodyParser ---------------------
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
//---------------------------------------
//-------------methodOveride--------------
app.use(methodOveride('_method'));
//-----------------------------------------

//-------------sessions-------------------
app.use(session({
  secret: 'osamaalaa123',
  resave: true,
  saveUninitialized: true
}));
app.use(flash());

app.use((req , res , next)=>{
  res.locals.user = req.user || null;
  res.locals.error = req.flash('error');
  res.locals.success_message = req.flash('success_message');
  res.locals.error_message =  req.flash('error_message');

  next();
});


//-----------------------

app.use(passport.initialize());
app.use(passport.session());

//-----------------------------------------
//load el routes ........
const home = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
// use this routes ..........
app.use('/',home);
app.use('/admin',admin);
app.use('/admin/posts',posts);
//------------------------------
app.listen(4500,()=>{
  console.log('Listen On Port 4500');
});
