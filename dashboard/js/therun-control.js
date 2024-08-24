// Variables to use for later
var twitchNames = [];
var trggServerStatus = false;

// Element selectors
var player1 = $('#p1-name');
var player2 = $('#p2-name');
var p1twitch = $('#p1-twitch');
var p2twitch = $('#p2-twitch');

// Speedcontrol nonsense
var runDataActiveRun = nodecg.Replicant('runDataActiveRun', 'nodecg-speedcontrol');
runDataActiveRun.on('change', (runData) => {
	if (runData) {
        player1.html(runData.teams[0].players[0].name);
        player2.html(runData.teams[1].players[0].name);
        p1twitch.html(runData.teams[0].players[0].social.twitch);
        p2twitch.html(runData.teams[1].players[0].social.twitch);

        twitchNames = [runData.teams[0].players[0].social.twitch, runData.teams[1].players[0].social.twitch];
    }
});

// Start websocket connection
function trggStart() {
    if (!trggServerStatus) {
        console.log('Starting therun.gg websocket connection');
        nodecg.sendMessage('trgg-startwebsocket', twitchNames);
        $('#websocket-status').html('🟢 Websocket Connection ONLINE');
        trggServerStatus = true;

        $('#p1-split').html("-");
        $('#p1-pb').html("-");
        $('#p1-delta').html("-");
        $('#p1-sob').html("-");
        $('#p1-bpt').html("-");
        $('#p1-timesave').html("-");
        $('#p2-split').html("-");
        $('#p2-pb').html("-");
        $('#p2-delta').html("-");
        $('#p2-sob').html("-");
        $('#p2-bpt').html("-");
        $('#p2-timesave').html("-");
    } else {
        console.error('Websocket connection already active');
    }
}

// Stop websocket connection
function trggStop() {
    if (trggServerStatus) {
        console.log('Stopping therun.gg websocket connection');
        nodecg.sendMessage('trgg-stopwebsocket');
        $('#websocket-status').html('🔴 Websocket Connection OFFLINE');
        trggServerStatus = false;
    } else {
        console.error('Websocket connection already inactive');
    }
}

// TheRun.gg Split Messages
nodecg.listenFor('trgg-p1split', (data) => {
    console.log(`Data recieved from Player 1: ${data.user}`);

    $('#p1-split').html(data.currentSplitIndex);
    $('#p1-pb').html(msToTime(data.pb));
    $('#p1-delta').html(msToTime(data.delta));
    $('#p1-sob').html(msToTime(data.sob));
    $('#p1-bpt').html(msToTime(data.bpt));
    $('#p1-timesave').html(msToTime(data.mapTimesave));
});
nodecg.listenFor('trgg-p2split', (data) => {
    console.log(`Data recieved from Player 2: ${data.user}`);

    $('#p2-split').html(data.currentSplitIndex);
    $('#p2-pb').html(msToTime(data.pb));
    $('#p2-delta').html(msToTime(data.delta));
    $('#p2-sob').html(msToTime(data.sob));
    $('#p2-bpt').html(msToTime(data.bpt));
    $('#p2-timesave').html(msToTime(data.mapTimesave));
});

// Util function to display milliseconds as readable format (H:MM:SS:s)
function msToTime(duration) {
    // Handle negative times (green on splits)
    if (duration < 0) return "-" + msToTime(-duration);

    var milliseconds = Math.floor((duration % 1000) / 100);
    var seconds = Math.floor((duration / 1000) % 60);
    var minutes = Math.floor((duration / (1000 * 60)) % 60);
    var hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}