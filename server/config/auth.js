const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql');
const bcrypt = require('bcrypt-nodejs');

const dbconfig = require('./database');

const con = mysql.createConnection(dbconfig.connection);

con.connect();

module.exports = function (passport) {
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        con.query('SELECT * FROM users WHERE id = ?', [id], function (err, rows) {
            done(err, rows[0]);
        });
    });

    passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
        con.query("SELECT * FROM users WHERE email = ?", [email], function (err, rows) {
            if (err) { return done(err) };
            if (!rows.length) { return done(null, false, 'Usuário ou Senha Inválidos!'); }

            // if the user is found but the password is wrong
            if (!bcrypt.compareSync(password, rows[0].password))
                return done(null, false, 'Usuário ou Senha Inválidos!');

            // all is well, return successful user
            return done(null, rows[0]);
        });
    }));
}

