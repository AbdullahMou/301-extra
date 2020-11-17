'use strict';
require('dotenv').config();
const
    express = require('express'),
    cors = require('cors'),
    superagent = require('superagent'),
    pg = require('pg'),
    PORT = process.env.PORT,
    DATABASE_URL = process.env.DATABASE_URL,
    app = express(),
    methodoverride = require('method-override'),
    client = new pg.Client(DATABASE_URL);

//.............................................................
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(methodoverride('_method'));
//.............................................................

app.get('/home', handleHome);
app.post('/fav', handleFav);
app.get('/fav', handleFav1);
app.get('/facts/:id', handleDetails);
app.put('/details/:id', handleUpdate);
app.delete('/details/:id', handledelet);


//.............................................................

function handleHome(req, res) {
    let url = `https://cat-fact.herokuapp.com/facts`;
    superagent.get(url).then(data => {
        // console.log('data is .... ', data.body.all);
        let array = data.body.all.map(ele => {
            //console.log('this is name object', ele.user);
            return new Fact(ele)
        })
        res.render('home', { result: array });
    })
}

function Fact(ele) {
    this.type = ele.type;
    this.text = ele.text;
}
//.............................................................
function handleFav(req, res) {
    let sql = 'insert into fact (type,text)values($1,$2);';
    let val = [req.body.type, req.body.text];
    client.query(sql, val).then(data => console.log(data));
    res.redirect('/fav');

}
//.............................................................

function handleFav1(req, res) {
    let sql = 'select * from fact;';
    client.query(sql).then(data => res.render('fav-fact', { result: data.rows }))
        //.............................................................
}

function handleDetails(req, res) {
    let sql = 'select * from fact where id=$1;';
    let val = [req.params.id];
    client.query(sql, val).then(data => res.render('details', { result: data.rows }))
}
//.............................................................

function handleUpdate(req, res) {
    let sql = 'update fact set type =$1,text=$2 where id=$3;';
    let val = [req.body.type, req.body.text, req.params.id];
    client.query(sql, val).then(() => res.redirect(`/facts/${req.params.id}`));
}
//.............................................................
function handledelet(req, res) {
    let sql = 'delete from fact where id=$1;';
    let val = [req.params.id];
    client.query(sql, val).then(() => res.redirect('/fav'));
}
//.............................................................
client.connect().then(() => {
    app.listen(PORT, () => {
        console.log('listeningto ... ', PORT);
    })
}).catch(err => console.log('error in connecting...', err))