const mysql = require('mysql');
const dbconfig = require('./database');

const con = mysql.createConnection(dbconfig.connection);

con.connect();

const execQuery = (sql, res) => {
    con.query(sql,
        function (err, results, fields) {
            if (err) throw err;

            if (results.length > 0) {
                res.json(results);
            } else {
                res.json([]);
            }
        });
}

module.exports = (app, passport) => {
    app.get('/api/personbyname', isAuth, (req, res) => {

        const name = req.query.name;
        if (!name) {
            res.json({
                error: 'Missing required parameters',
            });
            return;
        }

        let query = `SELECT id_pessoa, nome_pessoa, email, gestor, corretor from pessoas`;

        if (name !== "*") {
            query += ` WHERE nome_pessoa REGEXP '^${name}'`
        }

        execQuery(query, res);


    });

    app.get('/api/personbyemail', isAuth, (req, res) => {

        const email = req.query.email;

        if (!email) {
            res.json({
                error: 'Missing required parameters',
            });
            return;
        }

        let query = `SELECT * FROM pessoas WHERE 1=2`;
        if (email !== '') {
            query = `SELECT * from pessoas WHERE email = '${email}'`
        }

        execQuery(query, res);

    });

    app.get('/api/moedas', isAuth, (req, res) => {

        let query = `SELECT * FROM moedas`;

        execQuery(query, res);

    });

    app.get('/api/aportebyinvestor', isAuth, (req, res) => {

        const id_investidor = req.query.id_investidor;

        if (!id_investidor) {
            res.json({
                error: 'Missing required parameters',
            });
            return;
        }

        let query = `SELECT * FROM aportes WHERE 1=1`;
        if (id_investidor !== 0) {
            query = `SELECT * from aportes WHERE id_investidor = '${id_investidor}'`
        }

        execQuery(query, res);

    });


    //*************** ROTAS DE INCLUSÃO ********/
    app.post('/api/pessoas', isAuth, async (req, res) => {
        //console.log('Entrou na API');
        if (!req.body) {
            res.json({
                error: 'Missing required parameters',
            });
            return;
        }
        //console.log('Body: ', req.body);

        const { id_pessoa, cpf, nome_pessoa, pai_pessoa, mae_pessoa, dt_nasc, est_civil, profissao,
            email, endereco, numero, complemento, cep, bairro, cidade, estado,
            tel_celular, tel_outro, banco, agencia, tp_conta, conta, rg, org_emissor,
            dt_emissao, nacionalidade, passaporte, dt_emis_pass, gestor, corretor,
            dt_venc_pass } = req.body;

        let query = '';

        if (id_pessoa > 0) {
            query = `UPDATE pessoas SET cpf='${cpf}', nome_pessoa='${nome_pessoa}', pai_pessoa='${pai_pessoa}',
                    mae_pessoa='${mae_pessoa}', dt_nasc='${dt_nasc}', est_civil='${est_civil}', profissao='${profissao}',
                    email='${email}', endereco='${endereco}', numero='${numero}', complemento='${complemento}', 
                    cep='${cep}', bairro='${bairro}', cidade='${cidade}', estado='${estado}',
                    tel_celular='${tel_celular}', tel_outro='${tel_outro}', banco='${banco}', agencia='${agencia}', 
                    tp_conta='${tp_conta}', conta='${conta}', rg='${rg}', org_emissor='${org_emissor}',
                    dt_emissao='${dt_emissao}', nacionalidade='${nacionalidade}', passaporte='${passaporte}', 
                    dt_emis_pass='${dt_emis_pass}', gestor='${gestor}', corretor='${corretor}', dt_venc_pass='${dt_venc_pass}' 
                     WHERE id_pessoa=${id_pessoa}`;
        } else {
            query = `INSERT INTO pessoas (cpf, nome_pessoa, pai_pessoa, mae_pessoa, dt_nasc, est_civil, 
                   profissao, email, endereco, numero, complemento, cep, bairro, cidade, estado, 
                   tel_celular, tel_outro, banco, agencia, tp_conta, conta, rg, org_emissor, dt_emissao, 
                   nacionalidade, passaporte, dt_emis_pass, gestor, corretor, dt_venc_pass)
                    VALUES ('${cpf}', '${nome_pessoa}', '${pai_pessoa}', '${mae_pessoa}', '${dt_nasc}', '${est_civil}', 
                            '${profissao}', '${email}', '${endereco}', '${numero}', '${complemento}', '${cep}', '${bairro}', 
                            '${cidade}', '${estado}', '${tel_celular}', '${tel_outro}', '${banco}', '${agencia}', '${tp_conta}', 
                            '${conta}', '${rg}', '${org_emissor}', '${dt_emissao}', '${nacionalidade}', '${passaporte}', 
                            '${dt_emis_pass}', '${gestor}', '${corretor}', '${dt_venc_pass}' )`;
        }

        con.query(query, function (error, results, fields) {
            if (error) {
                errorMessage = error.sqlMessage ? error.sqlMessage : error.message;
                res.statusMessage = errorMessage
                res.status(400).end();
            } else {
                if (id_pessoa > 0) {
                    res.json({ id_pessoa: id_pessoa });
                } else {
                    //para o caso de inserção e considerando o cpf e e-mail como obrigatórios
                    query = `SELECT id_pessoa FROM pessoas WHERE cpf='${cpf}' AND email='${email}'`;
                    execQuery(query, res);
                }
            }
        })
    })

    app.post('/api/aportes', isAuth, async (req, res) => {

        if (!req.body) {
            res.json({
                error: 'Missing required parameters',
            });
            return;
        }

        const { id_aporte, id_investidor, id_gestor, id_corretor, dt_aporte, vl_deposito,
            vl_retorno, id_moeda } = req.body;

        let query = '';

        if (id_aporte > 0) {
            query = `UPDATE aportes SET id_investidor=${id_investidor}, id_gestor=${id_gestor}, 
                     id_corretor=${id_corretor}, dt_aporte='${dt_aporte}', vl_deposito=${vl_deposito},
                     vl_retorno=${vl_retorno}, id_moeda=${id_moeda}
                     WHERE id_aporte=${id_aporte}`;
        } else {
            query = `INSERT INTO aportes (id_investidor, id_gestor, id_corretor, dt_aporte, vl_deposito,
                     vl_retorno, id_moeda)
                     VALUES (${id_investidor}, ${id_gestor}, ${id_corretor}, '${dt_aporte}', ${vl_deposito}, 
                             ${vl_retorno}, ${id_moeda} )`;
        }

        con.query(query, function (error, results, fields) {
            if (error) {
                errorMessage = error.sqlMessage ? error.sqlMessage : error.message;
                res.statusMessage = errorMessage
                res.status(400).end();
            } else {
                if (id_aporte > 0) {
                    res.json({ id_aporte });
                } else {
                    //para o caso de inserção e considerando o cpf e e-mail como obrigatórios
                    query = `SELECT MAX(id_aporte) id_aporte FROM aportes`;
                    execQuery(query, res);
                }
            }
        })
    })

    //*************** ROTAS DE EXCLUSÃO *************//
    app.delete('/api/aportes/:id', isAuth, async (req, res) => {
        if (!req.params.id) {
            res.json({
                error: 'Missing required parameters',
            });
            return;
        }
        const id_aporte = parseInt(req.params.id);
        let query = '';

        if (id_aporte !== 0) {
            query = `DELETE FROM aportes WHERE id_aporte=${id_aporte}`;
            con.query(query, function (error, results, fields) {
                if (error) {
                    errorMessage = error.sqlMessage ? error.sqlMessage : error.message;
                    res.statusMessage = errorMessage
                    res.status(400).end();
                } else {
                    res.json(results);
                }
            })
        }
    })

    /*********************************************
    *  ROTAS DE LOGIN/SIGNUP E LOGOUT
    * ********************************************/
    app.post('/api/login', passport.authenticate('local'), (req, res) => {
        res.json(req.user);
    });

    app.post('/api/signup', (req, res) => {
        //TODO: Regra para verificar se e-mail existe e se os dados vieram e salvar no banco de dados
        //res.json(req.user);
    });

    app.get('/logout', function (req, res) {
        req.logout();
        res.json('Logout Successful');
    })
}

function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.statusMessage = 'Você não está logado!';
    res.status(401).end();
}