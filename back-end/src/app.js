const express = require('express');
const cors = require('cors');
const connect = require('./config/db');
const cookieParser = require('cookie-parser');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

connect();


app.use('/api/auth', require('./routes/auth'))
//app.use('/api', require('./routes/user')); 



const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
