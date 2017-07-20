var express=require('express');
var  expressValidator = require('express-validator');
var bodyParser=require('body-parser');
var path=require('path');
var mongojs = require('mongojs');
var db = mongojs('customerapp', ['users'])
var app=express();
 
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
//views engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(function(req,res,next){
	res.locals.errors=null;
	next();

});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
// app.use(bodyParser.bodyParser({ extended: true }));

//static Path
 app.use(express.static(path.join(__dirname,'public')));


app.get('/',function(req,res){
	// res.send('test home pageasdf');
	db.users.find(function(err,docs){
		// console.log(docs);
		res.render('index',{
			title:'Customer List',
			customers:docs,
		});
	});
	
});

app.post('/customer/save',function(req,res){

	req.checkBody('name','Enter name is required').notEmpty();
	req.checkBody('email','Enter email is required').notEmpty();

	var errors=req.validationErrors();
	// var errors=req.getValidationResult();
	if(errors){
	console.log('error');
	db.users.find(function(err,docs){
		// console.log(docs);
		res.render('index',{
			title:'Customer List',
			customers:docs,
			errors:errors,
		});
	});
	}else{


		var customer={
			name:req.body.name,
			email:req.body.email,
		};
		db.users.insert(customer ,function(err,result){
			if(err){
				console.log('Error');
			}else{
				res.redirect('/');
			}

		});
	}		// console.log(customer);
	
});


app.listen(3000,function(){
	console.log('testsadfsdaf sdaf');
});
