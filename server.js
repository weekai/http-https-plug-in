let express = require('express');
let bodyParser = require('body-parser');


let getHP= require('./http_https_proxy');
let app = express();


app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('*', (req, res, next) => {
    //允许的域名（ * 所有域） 
    res.header('Access-Control-Allow-Origin', '*');

    //服务器支持的头信息
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    //允许的方法 
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Content-Type', 'application/json;charset=utf-8');
    next();
});

app.get('/', (req, res) => {
    let url = req.query.url;
    getHP(url).then(data=>{
        res.send(data);
    });
});



app.listen(3000, err => {
    if (!err) {
        console.log('server is running on port 3000');
    }
})