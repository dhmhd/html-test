const fs = require("fs")

let lines = fs.readFileSync("test.html").toString().split("\n");


let maxMemory = 0;
process.nextTick(() => {
    let memUsage = process.memoryUsage();
    if (memUsage.rss > maxMemory) {
        maxMemory = memUsage.rss;
    }
});

process.on("exit", () => {
    console.log("Max memory: " + (((maxMemory / 1024 / 1024) * 100 | 0) / 100) + " MB");
});


function isOpen(t) {
    return t.indexOf("/") <= -1;
}

function getTagName(t) {
    let n = t.toUpperCase().substr(1).slice(0, -1);
    if (n[0] == "/") {
        return n.substr(1);
    }
    return n;
}

function pass(a, dir) {
    stack = [];
    errTag = null;
    if (!dir) {
        a = a.slice().reverse();
    }
    for (let i = 0; i < a.length; ++i) {
        t = a[i];
        let n = getTagName(t);
        let f = dir == isOpen(t);
        if (f) {
            stack.push(n);
        }
        else {
            let sn = stack.pop();
            if (sn !== n) {
                if (errTag === null) {
                    errTag = t;
                    stack.push(sn);
                }
                else {
                    return {
                        "result": false,
                        "errTag": null
                    };
                }
            }
        }
    }
    return {
        "result": true,
        "errTag": errTag
    };
}

function solve(tags) {
    let cnt = tags.reduce((sum, tag) => {
        if (isOpen(tag)) {
            sum.open += 1
        }
        else {
            sum.close += 1
        }
        return sum;
    }, {
        "open": 0,
        "close": 0
    });
    if (cnt.open < cnt.close) {
        return pass(tags, true);
    }
    else {
        return pass(tags, false);
    }
}

function printResult(r) {
    if (r.result && r.errTag) {
        console.log("ALMOST " + r.errTag);
        return
    }
    if (r.result) {
        console.log("CORRECT");
        return
    }
    console.log("INCORRECT");
}


printResult(solve(["<X>", "<Y>", "</Y>", "</X>"]));
printResult(solve(["<X>"]));
printResult(solve(["</X>"]));
printResult(solve(["<HTML>", "<biba>", "</BIBA>", "</KUKA>", "</HTML>"]));
printResult(solve(["<HTML>", "<biba>", "</BIBA>", "<KUKA>", "</HTML>"]));
printResult(solve(["<HTML>", "</KUKA>", "<biba>", "</BIBA>", "</HTML>"]));
printResult(solve(["<HTML>", "<KUKA>", "<biba>", "</BIBA>", "</HTML>"]));
printResult(solve(["<HTML>", "<TAG>", "<button>", "</BUTTON>", "<TAG>", "</html>"]));
printResult(solve(["<X>", "<Y>", "<Z>", "<H>", "<Z>", "</H>", "</Z>", "</Y>", "</X>"]));
printResult(solve(["<X>", "<Y>", "<Z>", "<H>", "</Z>", "</H>", "</Z>", "</Y>", "</X>"]));
printResult(solve(["<c>", "<d>", "<a>", "<a>", "<a>", "</a>", "<e>", "</e>", "</a>", "<c>", "</c>", "</a>", "<a>", "<f>", "</f>", "<a>", "<c>", "</c>", "</a>", "</a>", "</d>", "<c>", "<d>", "<b>", "<d>",  "<b>",  "</b>",  "<b>",   "<e>",   "</e>",  "</b>", "</d>", "</b>", "</d>", "</c>", "</c>"]));
printResult(solve(["<d>", "<a>", "<a>", "<a>", "</a>", "<e>", "</e>", "</a>", "<c>", "</c>", "</a>", "<a>", "<f>", "</f>", "<a>", "<c>", "</c>", "</a>", "</a>", "</d>", "<c>", "<d>", "<b>", "<d>",  "<b>",  "</b>",  "<b>",   "<e>",   "</e>",  "</b>", "</d>", "</b>", "</d>", "</c>", "</c>"]));
printResult(solve(["<c>", "<d>", "<a>", "<a>", "<a>", "<e>", "</e>", "</a>", "<c>", "</c>", "</a>", "<a>", "<f>", "</f>", "<a>", "<c>", "</c>", "</a>", "</a>", "</d>", "<c>", "<d>", "<b>", "<d>",  "<b>",  "</b>",  "<b>",   "<e>",   "</e>",  "</b>", "</d>", "</b>", "</d>", "</c>", "</c>"]));
printResult(solve(["<a>", "<a>", "<a>", "</a>", "<e>", "</e>", "</a>", "<c>", "</c>", "</a>", "<a>", "<f>", "</f>", "<a>", "<c>", "</c>", "</a>", "</a>", "</d>", "<c>", "<d>", "<b>", "<d>",  "<b>",  "</b>",  "<b>",   "<e>",   "</e>",  "</b>", "</d>", "</b>", "</d>", "</c>", "</c>"]));



console.log("\nLarge file test");
console.log(lines.length);
lines.splice(112834, 1);
console.log(lines.length);

console.time("solve");
printResult(solve(lines));
console.timeEnd("solve");