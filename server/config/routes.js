const mysql = require('mysql');
const env = require('dotenv').config();


const host = process.env.DB_HOST
const user = process.env.DB_USER
const pwd = process.env.DB_PASSWORD
const dbname = process.env.DB_NAME

const pool = mysql.createPool({
    host: host,
    user: user,
    password: pwd,
    port: "3306",
    database: dbname
});

const execQuery = (sql, res) => {
    pool.query(sql,
        function (err, rows, fields) {
            if (err) throw err;

            if (rows.length > 0) {
                res.json(rows);
            } else {
                res.json([]);
            }
        });
}

const execCommand = (sql) => {
    pool.query(sql,
        function (err, result) {
            if (err) throw err;

            return result.affectedRows > 0
        });
}



module.exports = (app) => {
    app.get('/api/personbyname', (req, res) => {

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

    app.get('/api/personbyemail', (req, res) => {

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

    app.get('/api/moedas', (req, res) => {

        let query = `SELECT * FROM moedas`;

        execQuery(query, res);

    });

    app.get('/api/aportebyinvestor', (req, res) => {

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
    app.post('/api/pessoas', async (req, res) => {

        if (!req.body) {
            res.json({
                error: 'Missing required parameters',
            });
            return;
        }

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

        await execCommand(query);

        if (id_pessoa > 0) {
            res.json([{ id_pessoa }]);
        } else {
            //para o caso de inserção e considerando o cpf e e-mail como obrigatórios
            query = `SELECT id_pessoa FROM pessoas WHERE cpf='${cpf}' AND email='${email}'`;
            await execQuery(query, res);
        }

    })

    app.post('/api/aportes', async (req, res) => {

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
        const ok = await execCommand(query);

        if (ok) {
            if (id_aporte > 0) {
                res.json([{ id_pessoa }]);
            } else {
                //para o caso de inserção e considerando o cpf e e-mail como obrigatórios
                query = `SELECT MAX(id_aporte) id_aporte FROM aportes`;
                await execQuery(query, res);
            }
        }
    })

    //*************** ROTAS DE EXCLUSÃO *************//
    app.delete('/api/aportes/:id', async (req, res) => {
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
            const ok = await execCommand(query);
            if (ok) {
                res.json({ return: 'sucessfull' });
            }
        }
    })
}