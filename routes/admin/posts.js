
const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const { isEmpty } = require('../../helpers/upload-helper');

const {userAuthenticated} = require('../../helpers/authentication');



router.all('/*',userAuthenticated ,(req , res , next)=>{
  req.app.locals.layout = 'admin';
  next();
});

router.get('/',(req , res)=>{
  Post.find().then(posts=>{
    res.render('admin/posts' , {posts: posts});

  });

});

router.get('/create',(req , res)=>{

  res.render('admin/posts/create');

});

router.post('/create',(req , res)=>{

  let errors = [];
  if (!req.body.title){
    errors.push({message: 'Add Title Ya3m El7ag..'});
  }
  if (errors.length > 0){
    res.render('admin/posts/create', {
      errors: errors

    })
  }else{

  let filename = 'Osama.jpg';

  if(!isEmpty(req.files)){
    let file = req.files.file;
    filename = Date.now() + '-' + file.name;
    let dirUploads = './public/uploads/';
    file.mv(dirUploads + filename , (err)=>{
      if(err) throw err;

    });

  }


  // console.log(req.files);

  let allowComments = true ;


  if (req.body.allowComments){

    allowComments = true;
  } else{
    allowComments = false;
  }

  const newPost =  new Post({
    title: req.body.title,
    status: req.body.status,
    allowComments: req.body.allowComments,
    body: req.body.body,
    file: filename

  });
  newPost.save().then(savedPost =>{
    req.flash('success_message' , ` Apst Ya3m .. Post ${savedPost.title} was created successfully`);

    console.log(savedPost);
    res.redirect('/admin/posts');
  }).catch(error =>{
    console.log('could not save post');
  });
}


 // console.log(req.body.allowComments);

});
router.get('/edit/:id',(req , res)=>{
  Post.findOne({_id: req.params.id}).then(post=>{
    res.render('admin/posts/edit', {post: post});
  });



});

router.put('/edit/:id', (req,res)=>{


  Post.findOne({_id: req.params.id}).then(post=>{

    if (req.body.allowComments){

      allowComments = true;
    } else{
      allowComments = false;
    }
    post.title = req.body.title;
    post.status = req.body.status;
    post.allowComments = allowComments;
    post.body = req.body.body;
    // post.file= req.body.file;

    if(!isEmpty(req.files)){
      let file = req.files.file;
      filename = Date.now() + '-' + file.name;
      post.file = filename  ;
      let dirUploads = './public/uploads/';
      file.mv(dirUploads + filename , (err)=>{
        if(err) throw err;

      });

    }

    post.save().then(updatedPost =>{
      // res.render('admin/posts/edit', {post: post});
      req.flash('success_message','Apst Ya3m ... Post was successfully updated');

      res.redirect('/admin/posts');

    });

  });
  // res.send('IT WORKS...');
});

router.delete('/:id', (req,res)=>{

  Post.remove({_id: req.params.id}).then(result =>{
    req.flash('success_message','Apst Ya3m ... Post was successfully deleted');
    res.redirect('/admin/posts');
  });



});

module.exports = router;
