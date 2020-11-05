const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
require('dotenv/config')

AWS.config.update({
  region: process.env.REGION,
  endpoint: process.env.ENDPOINT,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const docClient = new AWS.DynamoDB.DocumentClient();

router.get('/getAll', async (req, res) => {
    var params = {
        TableName: "LinhKien_Phat",
        ProjectionExpression: "STT, TenLinhKien, DonViTinh, Gia, ChiTiet"
    };

    docClient.scan(params, onScan);

    function onScan(err, data) {
        if (err) {
          res.render('error', {error: err})
        } else {
          res.render('index', {listLinhKien: data.Items});
        }
    }
});

router.post('/add', async(req,res) => {
  var params = {
      TableName: "LinhKien_Phat",
      Item:{
          "STT": req.body.stt,
          "TenLinhKien": req.body.tenlinhkien,
          "DonViTinh": req.body.donvitinh,
          "Gia": req.body.gia,
          "ChiTiet": req.body.chitiet
      }
  };
  
  docClient.put(params, function(err, data) {
      if (err) {
          res.json({message: err})
      } else {
          res.json("Add new success user " + params.Item.name);
      }
  });
})

module.exports = router;
