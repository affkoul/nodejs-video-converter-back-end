const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");

// ------------------------------------------------------------------------------------
// requiered when running locally
// you need to have ffmpeg installed locally on your machine, in order to convert
// using fluent-ffmpeg alone will not convert the files
// fluent-ffmpeg only allows node to connect to ffmpeg on your machine and run commands
// To use in production, you need to install an ffmpeg buildpack in the production server 

// ffmpeg.setFfmpegPath("C:/ffmpeg/bin/ffmpeg.exe");
// ffmpeg.setFfprobePath("C:/ffmpeg/bin");
// ffmpeg.setFlvtoolPath("C:/ffmpegflvtool");
// you can remove these sets once ready for production
// ------------------------------------------------------------------------------------
console.log("ffmpeg:");
// if installed correctly, local or production; the app will console an ffmpeg object.
console.log(ffmpeg);

module.exports = {
  convertVideo: function (req, res) {
    console.log(req.body);
    console.log(req.files.file);
    const file = req.files.file;
    const to = req.body.data;
    let fileName = `output.${to}`;
    file.mv("./tmp/" + file.name, (err) => {  // moving the uploaded file to ./tmp folder.
      if (err) console.log(err);
      console.log("File Uploaded successfully");
    });

    ffmpeg("./tmp/" + file.name) // pointing ffmpeg to uploaded file in. /tmp folder.
      .withOutputFormat(to)     // telling ffmpeg what format we want to convert to.
      .on("error", function (err) {  
        console.log("an error happened: " + err.message);
        fs.unlink("./tmp/" + file.name, function (err) { // if error, uploaded file is deleted.
          if (err) throw err;
          console.log("3. Original File deleted");
        });
      })
      .saveToFile(fileName) // saving converted file by giving it a file name defined in the fileName variable earlier.
      .on("end", function (stdout, stderr) {
        console.log("Finished");
        console.log(res);
        res.download(fileName, function (err) { // sending converted file back to client side on success.
          if (err) throw err;

          fs.unlink(fileName, function (err) { // delete converted file on success.
            if (err) throw err;
            console.log("1. Coverted File deleted");
          });
        });
        fs.unlink("./tmp/" + file.name, function (err) { // delete original file as well on success.
          if (err) throw err;
          console.log("2. Original File deleted");
        });
      });
  },
};
