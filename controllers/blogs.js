const blogsRouter = require('express').Router()
const Blog = require ('../models/blog')
const BUser = require ('../models/user')
const jwt = require('jsonwebtoken')


blogsRouter.get('/api/blogs', (request, response) => {
  Blog.find({}).then((blogs) => {
      response.json(blogs);
  });
});

blogsRouter.get('/api/blogs/:id', async (request, response) =>{
  const blog = await Blog.findById(request.params.id)
  if (blog) {
      response.json(blog);
  }else {
      response.status(404).end();
  }
})

blogsRouter.post('/api/blogs', async (request, response) => {
  const body = request.body;
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  response.json(savedBlog);
});


blogsRouter.delete('/:id', async (request, response) => {
	const user = request.user

	if(!user){
		return response.status(401).json({ error: 'not correct token' })  
	}
	const blog = await Blog.findById(request.params.id)
	if(blog.user.toString() === request.user.id){
		await Blog.findByIdAndRemove(request.params.id)
	    response.status(201).end()
	}else{
		return response.status(401).json({ error: 'not valid token to delete' })
	}
  })

blogsRouter.put('/:id', async (request, response) =>{
  const body = request.body
  const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
  }
  await Blog.findByIdAndUpdate(request.params.id, blog, {new: true} )
  response.json(blog)
})

module.exports = blogsRouter