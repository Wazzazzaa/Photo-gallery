//Backend (c) Tomi Eränne
const express =   require("express");
const multer  =   require('multer');
const app         =   express();

//DB connection
const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'webproj',
  port     : 3304
});
global.db=connection;
connection.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to database');
});
//Storage data
const storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'uploads');
  },
  filename: function (req, file, callback) {
    callback(null,Date.now()+"-" +file.originalname);
  }
});

const upload = multer({ storage : storage}).single('userPhoto');

app.get('/',function(req,res){
  res.sendFile(__dirname + "/index.html");
});
//Send and get data from DB
app.post('/photo',function(req,res){
  upload(req,res,function(err) {
    if(err) {
      return res.end("Error uploading file.");
    }else {
      console.log('file received');
      let sql = "INSERT INTO `users_image`(`image`) VALUES ('" +
          req.file.filename + "')";

      connection.query( `SELECT * FROM users_image`, (error, results) => {
        if (error) {
          return console.error(error.message);
        }
        let loop=req.params;
        let arrayl=results.length;
        for(let i=0;i<arrayl;i++){
        loop = "<a><img src=\"" + results[i].image  + "\" width=\"100%\" ><a> " + loop;
        }
        res.send('<html><head><title>Photo gallery</title><link rel="stylesheet" type="text/css" href="css/style.css"></head><body><div class="column">'+ loop +'</div></body></html>');
      });
      let query = db.query(sql, function(err, result) {
        console.log(req.file.filename);
      });
    }
  });
});
app.use(express.static('uploads'));
app.use('/css',express.static(__dirname + '/css'));

app.listen(3000,function(){
  console.log("Working on port 3000");
});