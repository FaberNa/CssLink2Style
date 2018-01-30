'use strict';

// gulp-util is used to created well-formed plugin errors
var gutil = require('gulp-util');
// map-stream is used to create a stream that runs an async function
var map = require('map-stream');

var jsdom = require("jsdom");
 const { JSDOM } = jsdom;


// require for read css file
var read=require("read-file");
var myMap= new Map();

function readAll(filePaths){
    //do Operations on single File
    console.log("1- "+ filePaths);
    var options={includeNodeLocations:true};
    //TODO search  all link element with rel="stylesheet" and  type="text/css"
    var reader = JSDOM.fromFile(String(filePaths), options).then(dom => {
        //console.log(dom.serialize());
        const document =dom.window.document;
        var window=document.defaultView;
        var $ = require('jquery')(window);
        //extract all link with href *.css and rel equal to stylesheet
        var links = $('link[href*=".css"][rel="stylesheet"]');


        $('link[href*=".css"][rel="stylesheet"]').each(function( index ) {
            console.log( index + ":" + $(this).attr('href') );

            var tag = $(this)[0].outerHTML;
            console.log("replace this "+tag+" with this content "+"H:/Data/Node/CssLink2Style/test/"+$(this).attr('href'));
            var content = read.sync("H:/Data/Node/CssLink2Style/test/"+$(this).attr('href'),{encoding: 'utf8',normalize:'true'});
            //console.log(content);
            myMap.set(tag,"<style>"+content+"</style>");

            /*read("H:/Data/Node/CssLink2Style/test/"+$(this).attr('href'),{encoding: 'utf8',normalize:'true'},function(err,buffer){
                console.log("<style>"+buffer.toString()+"</style>")
            });*/
        });



    }).catch(error=>
    {
        console.log(error);
    });
    return reader;

}


var cssLink2Style = function() {

    return map(function(file,cb) {

        var currentTask = readAll([file.path]);

        currentTask.then(()=>{
            console.log(myMap.size+"  file "+file.path);

            for (var [key, value] of myMap) {
                //console.log(key + " = " + value);
                console.log(key+" "+file.isStream()+" buffer "+file.isBuffer());
                var chunks = String(file.contents).split(key);
                var result;
                result = chunks.join(value);
                file.contents = new Buffer(result);
            }
            //console.dir(file.contents);
            return cb(null,file);
        });



    });

};

module.exports = cssLink2Style;