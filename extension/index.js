const LiveWebSocket = require('therungg').LiveWebSocket;

var trggWss = []; // Will hold therun.gg websockets

module.exports = function (nodecg) {
	nodecg.log.info("P2SR bundle booted up!");

    // ListenFor messages from Dashboard
    nodecg.listenFor('trgg-startwebsocket', (twitchNames) => {
        trggStart(twitchNames);
    });
    nodecg.listenFor('trgg-stopwebsocket', () => {
        trggStop();
    });

    // Start Websocket Server function
    function trggStart(twitchNames) {
        console.log(`Starting therun.gg websocket connection for ${twitchNames}`);

        for (let i = 0; i < twitchNames.length; i++) {
            // Start up websockets
            let name = twitchNames[i];
            let trggWs = new LiveWebSocket(name);
            
            // Calls on runner split
            trggWs.onMessage = (data) => {
                let user = safeGetProperty(data, ['user']) || "Unknown";

                let run = safeGetProperty(data, ['run']);
                let splitIndex = safeGetProperty(run, ['currentSplitIndex']) || -1;
                let numSplits = safeGetProperty(run, ['splits', 'length']) || 1;

                let currentTime = safeGetProperty(run, ['currentTime']);
                let splitTime = safeGetProperty(run, ['splits', splitIndex, 'single', 'time']);
                let goldTime = safeGetProperty(run, ['splits', splitIndex, 'single', 'bestAchievedTime']);

                let pb = safeGetProperty(run, ['pb']);
                let sob = safeGetProperty(run, ['sob']);
                let delta = safeGetProperty(run, ['delta']);
                let bpt = safeGetProperty(run, ['bestPossible']);

                let reset = safeGetProperty(run, ['hasReset']);
                if (!run) return;

                // Send message to graphics (graphics/js/therun.js)
                console.log(`Data recieved from ${name}: ${user}, currently on split ${splitIndex}`);
                nodecg.sendMessage(`trgg-p${i + 1}split`, {
                    user: user,
                    currentSplitIndex: splitIndex,
                    currentTime: currentTime,
                    numSplits: numSplits,
                    pb: pb,
                    delta: delta,
                    sob: sob,
                    bpt: bpt,
                    mapTimesave: (!splitTime || !goldTime || reset || (splitIndex >= numSplits)) ?
                        null :
                        splitTime - goldTime
                });
            }

            trggWss.push(trggWs);
        }
    }

    // Stop Websocket Server function
    function trggStop() {
        for (let ws of trggWss) {
            ws?.connection.close();
            ws = null;
        }
    }

    // Run on bootup (just in case)
    trggStop();
};

// Util functions
function safeGetProperty(obj, props) {
    let currentObj = obj;
    for (let i = 0; i < props.length; i++) {
        if (!currentObj) return null;
        if (!(props[i] in currentObj)) return null;
        currentObj = currentObj[props[i]];
    }
    return currentObj;
}
