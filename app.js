//jshint esversion:6

const express = require("express");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require(`mongoose`);

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set(`view engine`, `ejs`);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(`public`));

//let posts = [];

//---- Database Setup ----//
mongoose.connect(`mongodb://localhost:27017/blogDB`, { useNewUrlParser: true });

const postSchema = new mongoose.Schema({
  title: String,
  postBody: String,
});

const Post = mongoose.model(`Post`, postSchema);
//------------------------//

app.get("/", function (req, res) {
  //--Finds all posts in database and renders posts on home page
  Post.find({}, function (err, posts) {
    if (err) {
      console.log(err);
    } else {
      res.render("home", {
        startingContent: homeStartingContent,
        posts: posts
      });
    }
  });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

//---- Compose Form Post Route ----//
app.post("/compose", function (req, res) {
  //--reads title and post entries upon sumbit
  const postEntry = {
    title: req.body.postTitle,
    content: req.body.postBody
  };
  //--creates new database object with submitted entries
  const newPost = new Post({
    title: postEntry.title,
    postBody: postEntry.content,
  });
  
  newPost.save(function (err) {
    if (!err) {
      res.redirect("/");
    } else {
      res.render(`compose`);
      }
    });

  //posts.push(post);
});

app.get("/posts/:postID", function(req, res){
  //--when Read More is clicked, stores the clicked post's id
  const titleID = req.params.postID;
  
  //console.log(`this is titleID: ${titleID}`);

  Post.findById(titleID, function (err, foundPost) {
    //console.log(`this is foundPost id: ${foundPost.id}`);
    if (!err) {
      //--renders the custom post route with the id of the clicked post in the url
      res.render(`posts`, {
        title: foundPost.title,
        postBody: foundPost.postBody
      }); 
    }
  });

  // posts.forEach(function(post){
  //   const storedTitle = _.lowerCase(post.title);

  //   if (storedTitle === requestedTitle) {
  //     res.render("post", {
  //       title: post.title,
  //       postBody: post.content
  //     });
  //   }
  // });

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
