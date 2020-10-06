const viewer = require("./viewer");

////////////////////////////////

const universes = ["listen"];

const origin = {"geospatiality": [49.864716, 4.349014], "temporality": (Date.now()/1000)};
const filter = {"geospatiality": { ratio: 20036, distance : 10000, direction : [60, 90]}, "temporality":{ ratio: 31556952, distance : 3600*24*30, direction : 1 }};

const step = 10;
let total = 0;

////////////////////////////////

viewer.init(universes, origin , filter, step, function(result) {

    for(let object of result)
        console.log(object.key);

    console.log("\nTotal : " + (total += result.length) + " | Queries : " + view.queries + " | Response ~" + Math.floor(view.unique/view.queries) + " bytes\n");

    if(result.length >= step) {

        if(total < step*20) {

            view.more();
        } else {

            redis.quit();
        }
    } else {

        redis.quit();
    }
});
