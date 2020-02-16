const bodyParser = require('body-parser'),
	expressSanitizer = require('express-sanitizer'),
	methodOverride = require("method-override"),
	mongoose = require('mongoose'),
	express = require('express'),
	app = express();




mongoose.connect('mongodb://localhost/blogApp', { useUnifiedTopology: true, useNewUrlParser: true });
app.set('view engine', 'ejs');
app.use(express.static("public"));
app.use(expressSanitizer());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
var connection = mongoose.connection;




var articleSchema = new mongoose.Schema({

	title: String,
	description: String,
	body: String,
	img: String,
	created: { type: Date, default: Date("<YYYY-mm-ddTHH:MM:ss>") }

});

var Article = mongoose.model('article', articleSchema);




app.get("/", function (req, res) {

	res.redirect("/posts");


});



app.get("/posts", function (req, res) {



	Article.find({}, (err, articles) => {

		if (err) {

			console.log("Error!");
		} else {


			res.render("posts", { articles: articles });

		}


	});
});

app.post("/posts", function (req, res) {



	Article.create({

		title: `${req.sanitize(req.body.title)}`,
		description: `${req.sanitize(req.body.description)}`,
		body: `${req.sanitize(req.body.body)}`,
		img: `${req.sanitize(req.body.image)}`


	}, function (err, article) {

		if (err) {

			console.log("Something went wrong");
			res.redirect("/posts");

		} else {

			res.redirect("/posts");

		}


	});
});



app.put("/posts/:id", function (req, res) {



	Article.findByIdAndUpdate(req.params.id, req.body.blog, function (err, updatedArticle) {

		if (err) {

			console.log("Something went wrong with the update of the data");
			res.redirect("/posts");

		} else {

			res.redirect(`/posts/${req.params.id}`);
		}



	});



});

app.delete("/posts/:id", function (req, res) {

	Article.findByIdAndRemove(req.params.id, function (err) {

		if (err) {

			console.log("Error with the deletion of the the post");
		} else {

			res.redirect("/posts");
		}

	})



})



app.get("/posts/new", function (req, res) {


	res.render("create");



});


app.get("/posts/:id/edit", function (req, res) {



	var articleId = req.params.id;

	Article.findById(articleId, function (err, article) {

		if (err) {

			console.log("Error something went wrong");
		} else {

			res.render("edit", { article: article });
		}





	});
});



app.get("/posts/:id", function (req, res) {

	Article.findById(req.params.id, function (err, article) {

		if (err) {

			console.log("Error something went wrong");
		} else {

			res.render("view", { article: article });
		}


	})







});












app.listen(3000, () => console.log("I am listening..."));

