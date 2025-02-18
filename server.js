const express = require('express');
const app = express();

// const userRoute = require('./routes/userController');
// app.use('/user',userRoute);

// Start the server
app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});



