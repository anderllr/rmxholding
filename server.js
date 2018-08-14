const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const env = require('dotenv').config();

const routes = require('./server/config/routes');

const app = express();

const PORT = process.env.PORT || 3001;

app.use(
    bodyParser.json(),
    cors({
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization', 'Accept-Enconding'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
    })
);

app.use(bodyParser.urlencoded({
    extended: true
}))

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    // Return the main index.html, so react-router render the route in the client
    app.get('/', (req, res) => {
        res.sendFile(path.resolve('client/build', 'index.html'));
    });
}

routes(app);

app.listen(PORT, () => {
    console.log(`Server is running at: http://localhost:${PORT}/`);
});
