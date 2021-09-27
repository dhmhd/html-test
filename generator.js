const fs = require("fs")

let tagsList = ["a", "b", "c", "d", "e", "f"];
let fileName = "test.html";
let tagChildsMax = 10;
let tagsMax = 1e6;
let tagsCount = 0;

function rnd(n) {
    return Math.floor(Math.random() * n);
}

function create(/*spaces*/) {
    return {
        "tag": tagsList[rnd(tagsList.length)],
        "pick": false,
        //"spaces": spaces
    };
}

function generateHTML() {
    let stack = [create(/*""*/)];
    while (stack.length > 0) {
        let top = stack[stack.length - 1];
        if (!top.pick) {
            top.pick = true;
            fs.appendFileSync(fileName, /*top.spaces + */"<" + top.tag + ">\n");
            let childsCount = rnd(tagChildsMax);
            tagsCount += childsCount;
            if (tagsCount * 2 > tagsMax) {
                childsCount = 0;
            }
            for (let i = 0; i < childsCount; ++i) {
                stack.push(create(/*top.spaces + " "*/));
            }
        }
        else {
            stack.pop();
            fs.appendFileSync(fileName, /*top.spaces + */"</" + top.tag + ">\n");
        }
    }
}

fs.writeFileSync(fileName, "");
generateHTML();