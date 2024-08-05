// Update commentary info
var commentaryRep = nodecg.Replicant("commentary");
commentaryRep.on("change", function(newVal) {
    document.getElementById("commentary-1").innerHTML = newVal[0];
    document.getElementById("commentary-2").innerHTML = newVal[1];
    document.getElementById("commentary-3").innerHTML = newVal[2];
});

// Update runner info
var runnersRep = nodecg.Replicant("runners");
runnersRep.on("change", function(newVal) {
    document.getElementById("player-1").innerHTML = newVal[0];
    document.getElementById("player-2").innerHTML = newVal[1];
});