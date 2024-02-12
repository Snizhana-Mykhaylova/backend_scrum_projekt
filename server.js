const express = require('express');
const userRoutes = require('./src/routes')

const app = express();
const port = process.env.PORT || 8000;

app.use(express.json());


app.get('/',(req,res) => {
    res.send("Hello world!");
});



app.use('/api/user/',userRoutes);

app.listen(port, () => console.log(`app listenig on port ${port}`));