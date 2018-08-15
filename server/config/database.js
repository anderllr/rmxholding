const env = require('dotenv').config();

const host = process.env.DB_HOST
const user = process.env.DB_USER
const pwd = process.env.DB_PASSWORD
const dbname = process.env.DB_NAME

module.exports = {
    'connection': {
        'host': host,
        'user': user,
        'password': pwd,
        'port': "3306",
        'database': dbname
    },

}