const readLine = require("readline");


const askToRestart = (callback) => {
  const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question("Restart Process ? y/n:  ", function(answer) {
    rl.close();
    callback(answer);
});
}

const printIntro = () => {
    console.log(`
       _.--""""''-.
    .-'            '.               J
  .'                 '.             0
 /            .        )            H
|                   _  (            N
|          .       / \\  \\           S
\\         .     .  \\_/  |           O
 \\    .--' .  '         /           N
  \\  /  .'____ _       /,           T
   '/   (\\    ')\\       |           E
   ||\\\\__||    |;-.-.-,-,|
   \\___//|   \\--'-'-'-'|
    '---' \\             |
           '---------.__)   
    `    
    );

    console.log("##### cs_j0hnston4 the extractor is starting #####")
}

exports.printIntro = printIntro;
exports.askToRestart = askToRestart;
