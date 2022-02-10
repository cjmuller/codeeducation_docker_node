const express = require('express')
const app = express()
const port = 3000

const config = {
    host: 'db',
    user: 'root',
    password: 'root',
    database:'nodedb'
};
const mysql = require('mysql')

const arrNomes = ['Jonas', 'Cristiano', 'Alexandre', 'Marcos', 'Lorenzo', 'Alice', 'Joseane', 'Maria', 'João', 'Luiza']

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

app.get('/', (req,res) => {
    const connection = mysql.createConnection(config)
    
    const sql = `INSERT INTO people(name) values('${arrNomes[getRandomInt(0, 10)]}')`
    connection.query(sql)

    const sql2 = `select name from people`

    let str = '';

    connection.query(sql2, function (error, results, fields) {
        if (error) throw error;

        for(let i = 0; i < results.length;i++){
            str = str + results[i].name + '<br>';
        }
        
        res.send('<h1>Full Cycle Rocks!</h1><br><h2>Lista de Nomes do Banco de dados:</h2><br>' + str);
      });

    connection.end() 

})

app.listen(port, ()=> {
    // verifica se a tabela base existe
    const connection = mysql.createConnection(config);
    connection.query(`SHOW TABLES LIKE 'people';`, function (error, results, fields) {
        if (error) throw error;
        if (results.length == 0) { // table não existe
            console.log('Criando tabela da app');
            connection.query(`create table people (id int not null auto_increment, name varchar(255) not null, primary key(id))`);
        }
        connection.end()
    });
    console.log('Rodando na porta ' + port);
})