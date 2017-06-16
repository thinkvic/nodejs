

// THIS IS THE ONE BEING USED, NO RESTFUL.
// JUST CALLED DIRECTLY USING A FUNC WITH PARAMS step, time, db
// DB is used because the dyno will restart every 24 hours. all the state will lose, including .json.
// using mongo DB as a service so that the num is available 24/7.

//mailbyinterval < mail (get the start value) < smartsend (find the correct elem out of json)< sendmail(html)


// function vic(db) {

    // return mailbyinterval;

    function mailbyinterval(step, time, db) {
        // var si = setInterval(function () {
        //     mail(step, db);
        // }, time * 1000);  //without closure

        var si = setInterval( mail, time * 60000);


        /*****************CLOSURE  *******************/
        // SO THAT you don't need to pass step and db as params for mail

        function mail() {

            // var start = require('./start.json').start;
            // var start = jsonfile.readFileSync('routes/start.json').start;


            db.collection("starts").findOne({}, function (err, doc) {
                console.log(err);
                console.log(doc);
                var start = doc.start;
                console.log("mail start", start);

                console.log("INSIDE MAIL");

                var i = start - 1;

                // DON'T REASSIGN STEP!!!
                // var step=step;

                console.log("before smartsend step, i", step, i);
                smartsend();


                /*******************
                 SMARTSEND is a CLOSURE because it's called within., so it can access i, which is private to outer func.

                 NO step, i paras needed for smartsend() !!!
                 ********************/

                function smartsend() {
                    if (i >= output.length) {
                        clearInterval(si);
                    } else {

                        console.log("SAMRT SEND");


                        // 1 build main contents
                        var j;  // loop counter for the step length
                        var content = "";

                        for (j = 0; j < step; j++) {
                            var index = i + j + 1;
                            content = content + "<p>" + index + "&nbsp;&bull;&nbsp;&nbsp;" + output[i + j] + "</p>"
                        }

                        // 2 build body html
                        // html = '<b>Hello world ?</b>'+ output[i] + output[i+1];
                        var html = `   <b>Hello world ?</b> </br>
                        <div  style="background-color:#666666; color:#EEEEEE; 
                                 font-family: Segoe UI; font-weight: 300; font-size: 20px; 
                                 border: 1px solid #666666;
                                 border-radius: 5px; 
                                 padding: 10px; ">
                            ${content}
                        </div>`;

                        /**************** *******
                         * 3 send
                         * *********************/

                        // as a closure, it can access the sendmail var from parent even after parent is executed.
                        sendmail(html);

                        // 4 find the next round of start value and save it to db.

                        console.log("typeof", typeof start, typeof step);
                        start = start + step;

                        var json = {"start": start};
                        console.log("new start to write", json);

                        db.collection("starts").replaceOne({}, json, function (err, doc) {
                            if (err) {
                                handleError(res, err.message, "Failed to create new contact.");
                            } else {
                                console.log("replaced doc", doc.ops);
                            }
                        });

                        // jsonfile.writeFile('routes/start.json', json, function (err) {
                        //     if (err) {
                        //         console.error(err);
                        //     } else {
                        //         console.log("saved", json);
                        //     }
                        // })


                    }
                } // end smartsend

            })


        }


    }  // mailbyinterval

// }  // vic


////ALL THE VARS...
// var express = require('express');
// // import express from "express";
// var router = express.Router();

var nodemailer = require('nodemailer');
// var jsonfile = require('jsonfile');

console.log("this is mail3.js");

/****CAN BE OUT OR IN*******/
var output = require('./all.json');
// console.log(output);

var smtpconfig = {
    service: 'Gmail',
    auth: {
        user: 'xxx', // Your email id
        pass: 'xxx' // Your password
    }
};
console.log("smtpconfig", smtpconfig.service);


var transporter = nodemailer.createTransport(smtpconfig);


var mailOptions = {
    from: 'xxx', // sender address
    to: 'xxx', // list of receivers
    subject: 'Re: Daily Nuggets', // Subject line
    //text: text //, // plaintext body
    html: '<b>Hello world ?</b>' // You can choose to send an HTML body instead
};
console.log("mailOptions", mailOptions.subject);


var sendmail = (h)=> {
    // var sendmail = (h, res)=> {

    mailOptions.html = h;

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
            // res.json({yo: 'error'});
        } else {
            console.log('Message sent: ' + info.response);
            // res.json({yo: info.response});
        }
    });
}


/****END CAN BE OUT OR IN*******/

// var step=3;
// var time=5;

// mailbyinterval(3,2);


module.exports = mailbyinterval;
// module.exports = vic;


