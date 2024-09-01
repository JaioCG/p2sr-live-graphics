var splitTimes = [];
var playerCount = 2;

nodecg.listenFor('trgg-startwebsocket', (twitchNames) => {
    for (let i = 1; i <= playerCount; i++) {
        $(`#p${i}-delta`).html("-");
        $(`#stats-p${i}-pb`).html("-");
        $(`#stats-p${i}-delta`).html("-");
        $(`#stats-p${i}-sob`).html("-");
        $(`#stats-p${i}-bpt`).html("-");
        $(`#stats-p${i}-timesave`).html("-");
    }
});

var comparison = "1v1";

for (let player = 1; player <= playerCount; player++) {
    // TheRun.gg Split Messages
    nodecg.listenFor(`trgg-p${player}split`, (data) => {
        console.log(`Data received from Player ${player}: ${data.user}`);
        console.log(`Currently on split ${data.currentSplitIndex}`);

        while (splitTimes.length < player) {
            splitTimes.push([]);
        }
        if (splitTimes[player - 1].length != data.numSplits) {
            splitTimes[player - 1] = new Array(data.numSplits);
        }
        let ourSplitTimes = splitTimes[player - 1];
        if (data.currentSplitIndex < 1) {
            ourSplitTimes = new Array(data.numSplits);
        } else {
            if (data.currentSplitIndex < data.numSplits) {
                ourSplitTimes[data.currentSplitIndex] = data.currentTime;
            }
        }

        console.log(ourSplitTimes);

        $(`#stats-p${player}-pb`).html(msToTime(data.pb));
        $(`#stats-p${player}-delta`).html(addPlus(msToTime(data.delta)));
        addDeltaColor(data.delta, document.getElementById(`stats-p${player}-delta`));
        $(`#stats-p${player}-sob`).html(msToTime(data.sob));
        $(`#stats-p${player}-bpt`).html(msToTime(data.pb ? data.bpt : null));
        $(`#stats-p${player}-timesave`).html(addPlus(msToTime(data.mapTimesave)));
        addDeltaColor(Math.max(0, data.mapTimesave), document.getElementById(`stats-p${player}-timesave`)); // < 0 timesave is gold

        $(`#p${player}-delta`).html("-");
        switch (comparison) {
            case "1v1":
                let otherPlayer = player == 1 ? 2 : 1;
                while (splitTimes.length < otherPlayer) {
                    splitTimes.push([]);
                }
                let otherSplitTimes = splitTimes[otherPlayer - 1];

                let commonLength = Math.max(ourSplitTimes.length, otherSplitTimes.length);
                ourSplitTimes = [...ourSplitTimes, ...new Array(commonLength - ourSplitTimes.length)];
                otherSplitTimes = [...otherSplitTimes, ...new Array(commonLength - otherSplitTimes.length)];

                let lastIndex = ourSplitTimes.findLastIndex((e, i) => e && otherSplitTimes[i]);
                console.log("Lowest split: " + lastIndex);

                let delta = calculateDelta(ourSplitTimes[lastIndex], otherSplitTimes[lastIndex]);
                $(`#p${player}-delta`).html(addPlus(msToTime(delta)));
                $(`#p${otherPlayer}-delta`).html(addPlus(msToTime(-delta)));

                addDeltaColor(delta, document.getElementById(`p${player}-delta`));
                addDeltaColor(-delta, document.getElementById(`p${otherPlayer}-delta`));

                console.log(`P${player} Delta: ${delta}`);
                
                break;
        }
    });
}

function calculateDelta(thisPlayer, otherPlayer) {
    return thisPlayer - otherPlayer;
}

function addDeltaColor(delta, deltaElement) {
    if (!delta) {
        return;
    } else if (delta < 0) {
        deltaElement.style.color = 'var(--green)';
    } else if (delta == 0) {
        deltaElement.style.color = 'var(--gold)';
    } else if (delta == "-") {
        return;
    } else {
        deltaElement.style.color = 'var(--red)';
    }
}

function addPlus(duration) {
    if (duration.includes("-"))
        return duration;

    return "+" + duration;
}

// Util function to display milliseconds as readable format (H:MM:SS:s)
function msToTime(duration) {
    if (!duration) return "-";
    duration = Math.round(duration / 100) * 100; // round to tenth
    
    // Handle negative times (green on splits)
    if (duration < 0) return "-" + msToTime(-duration);

    var milliseconds = Math.floor((duration % 1000) / 100);
    var seconds = Math.floor((duration / 1000) % 60);
    var minutes = Math.floor((duration / (1000 * 60)) % 60);
    var hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    minutes = minutes.toString().padStart(2, "0");
    seconds = seconds.toString().padStart(2, "0");
  
    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}
