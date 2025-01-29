<h1>Set-up Professional Backend in NodeJs,Express JS,MongoDB,Mongoose</h1>

[Design Database Model](https://www.eraser.io/)

[Online Vs Code Editor](https://stackblitz.com/)

[Cloudinary File upload](https://cloudinary.com/)

[Versal Cloud](https://vercel.com/)

[Set-up GitHub Repository ](https://github.com/) 

[Step-by-step Windows GitHub SSH example](https://www.theserverside.com/blog/Coffee-Talk-Java-News-Stories-and-Opinions/GitHub-SSH-Windows-Example)

[gitignore generator](https://mrkandreev.name/snippets/gitignore-generator/#Node)

[HTTP response status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

[Mongoose Middleware](https://mongoosejs.com/docs/middleware.html)

[JWT Tokens](https://github.com/auth0/node-jsonwebtoken#readme)

<h3>Package Install</h3>
<b>Nodemon</b>
<p>nodemon is a tool that helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected</p>
<i>Development Dependency</i>
[ npm install --save-dev nodemon ]

<i>Global Dependency</i>
[ npm install -g nodemon ]

add package.json to 
"scripts": { "dev":"nodemon src/index.js" }

<b>Prettier</b>
<p>Prettier is a code formatter that helps you write clean and consistent code</p>


<i>Development Dependency</i>[ npm install --save-dev prettier ]

[Documentation](https://prettier.io/docs/en/)

<b>dotenv</b>
<p>dotenv is a package that loads environment variables from a .env file into process.env</p>

[ npm i dotenv ]

<b>Mongoose</b>
<p>Mongoose is a MongoDB object modeling tool designed to work in an asynchronous environment. Mongoose supports Node.js </p>

[ npm i mongoose ]

<b>Express</b>
<p>Fast, unopinionated, minimalist web framework for Node.js.</p>

[ npm i express ]

 <b>cookie-parser</b>

 <p>Parse Cookie header and populate req.cookies with an object keyed by the cookie names. Optionally you may enable signed cookie support by passing a secret string, which assigns req.secret so it may be used by other middleware.</p>

 [ npm i cookie-parser ]

 <b>cors</b>

 <p>CORS is a node.js package for providing a Connect/Express middleware that can be used to enable CORS with various options
 </p>

 [ npm i cors ]

<b>bcrypt</b>

<p>A library to help you hash passwords.</p>

[ npm i bcrypt ]

<b>jsonwebtoken</b>

<p>This was developed against draft-ietf-oauth-json-web-token-08. It makes use of node-jws</p>

[  npm i jsonwebtoken ]

 <b>mongoose-aggregate-paginate-v2</b>

 <p>mongoose-aggregate-paginate-v2 is a plugin for Mongoose that adds pagination to</p>

 <p>Manage Relationship Database</p>

 [  npm i mongoose-aggregate-paginate-v2 ]

 <b>Cloudinary</b>
 <p>Develop, manage and deliver engaging visual experiences at global scale through AI-driven automation.</p>

 [ npm i cloudinary ]

 <b>multer</b>

 <p>
 Multer is a middleware function that handles multipart/form-data, which is used for uploading files. </p>

[ npm i multer ]

 <h3>Error Handling</h3>

<b>asyncHandler</b>
<p>Simple middleware for handling exceptions inside of async express routes and passing them to your express error handlers.
</p>