var jwt = require('jsonwebtoken')
var fs = require('fs')

// var privateKey = fs.readFileSync('./private-key.pem')
// var token = jwt.sign({data: "Data can ma hoa"}, privateKey, {algorithm: 'RS256'});
var token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiRGF0YSBjYW4gbWEgaG9hIiwiaWF0IjoxNjk2ODU4MDYwfQ.WVAR8a-zy0Hyx2Yqq_ANPIqVFy0zJjW0V33p6YmNtin1dyIiHnJ12UFb09YMj_7fGQHh0xZvtAJxqR8LnZKatORklwRorAMWt4exBdlRm3MecIRdRlxuzuk1XPQADmjRqHvwOHixw_eCt8_GFP-YuYLWz5NJLH5KX-skCpgii0DGyn3kYMoxMlMmRYhzp2Gkm3aSxSLtdAarfapeVCImpIO_7DyVxHfEDtXDGQhmkIq91fSTmgwa3P2lz2u2pqaZZwNNpq1xHwEhzx1KM1DUZ55Qflj6ERVHTXZNzqLelaTQ_JC3Z4heQacjGA_yJ75jTKW6gbTxS8berGed_qRIbg'
var publicKey = fs.readFileSync('./public-key.crt')
jwt.verify(token, publicKey, function(err, data){
    console.log(err);
    console.log(data);
})
// console.log(token);