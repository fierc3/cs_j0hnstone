const { DemoFile } = require("demofile");
var fs = require("fs")
var assert = require("assert");
const { printIntro, initExitHandlers, askToRestart } = require("./helper");

/*****Variables*****/
const outputPath = './output/output.json'
const inputDir = './input'
var RECORD = false;
var count = 0;


/*****Helper Methods*****/
function createGuid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-4" + S4().substr(0, 3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();
}


const removeExistingOutput = () => {
    console.log("Deleting old output...")
    fs.unlinkSync(outputPath)
    console.log("Removed file at " + outputPath)
}


function parseDemoFile(path) {
    fs.readFile(path, (err, buffer) => {
        assert.ifError(err);

        const demoFile = new DemoFile();

        demoFile.on("end", e => {
            if (e.error) {
                console.error("Error during parsing:", e.error);
                //process.exitCode = 1; //disabled atm we won't to continue on to the next file
            }
            console.log("Finished.");
            console.log("Deleting parsed file");
            fs.unlinkSync(path)
            console.log("On to the next haul");
            parseDemosInInput();
        });


        demoFile.gameEvents.on("round_freeze_end", e => {
            if (RECORD) return;
            RECORD = true;//Set flag to start recording
        });


        demoFile.gameEvents.on("player_death", e => {
            if (!RECORD) return; //Continue when first death of round
            count++;
            var guid = createGuid();
            demoFile.players.forEach(element => {
                //Feature Select
                let teamCode = element.teamNumber
                if (teamCode !== 2) return;
                let index = element.index;
                let hasC4 = element.hasC4
                if (element.isDormant) {
                    //console.log('> dormant');
                }
                else {
                    var result = { "roundCount": count, "roundGuid": guid, "position": element.position, "hasC4": hasC4, "index": index }
                    fs.appendFileSync(outputPath, JSON.stringify(result) + ",", 'utf-8')
                }
            });
            RECORD = false;  //Set flag to stop recording
        });

        // Start parsing the buffer now that we've added our event listeners
        demoFile.parse(buffer);
    });
}

const parseDemosInInput = () => {
    var files = fs.readdirSync(inputDir);
    if(files.length > 0){
        let path = inputDir + '/' +files[0]
        console.log("Parsing File: " + path);
        parseDemoFile(path)
    }else{
        //Alternative: nothing found, lets wait and check again in 10seconds
        //console.log("Input dir is empty, will try again in 10seconds")
        //setTimeout( () => parseDemosInInput(), 10000);

        console.log("Processed and removed all files in input dir!!!")
        askToRestart((answer) => {
            console.log(answer)
            if(answer ==="y"){
                console.log("____Restarting Process____")
                parseDemosInInput();
            }
        })
    }
}


//RUN
printIntro();
if (fs.existsSync(outputPath)) {
    removeExistingOutput();
}
console.log("Initing Output file")
fs.writeFile(outputPath, "", () => { });
fs.appendFileSync(outputPath, "[", 'utf-8')
console.log("Parsing process has started....")
parseDemosInInput();
fs.appendFileSync(outputPath, "]", 'utf-8')

