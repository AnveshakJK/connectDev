1.) create a folder
2.) npm init , there in folder package.json intialize not in file.
3.) create a file app.js
4.) install express for creating server , after this see node modules and package-lock-json , package.json in dependencies are added.
5.)then in app.js import express by require then use app for creating instance of it to use.
6.) there listen port add for server responding on what port
7.) creating a request handler 
8.) handle different request using /test , /hello request 
9.) there is annoying to used just node app.js as there file sava and rerun it because as this it not refresh again auto . so to do it use nodemon 


*) there we write nodemon app.js or node app.js command again . so instead of doing this will also do add these in package.json in scripts as 
 "dev":"nodemon app.js", "start":"node app.js" then to run use npm run dev/start


*) between no request route and add route which will run in creating server in node
--> there Which Route Will Run?
The first app.use() is catch-all middleware (no path specified), which means it matches all incoming requests, regardless of the URL.
Express goes top to bottom in the order of .use() or .get() or .post() calls.
If a middleware matches the path, it runs.
If it sends a response (res.send(), res.json(), res.end()), the cycle stops — Express doesn't continue to the next route.
If you want Express to move to the next matching middleware, you need to call next() — but your middleware doesn't do that.
This matches ALL paths (/, /test, /hello, etc.)
It sends a response immediately.
No next() is called, so Express says, "I'm done," and doesn't look at /test or /hello.




