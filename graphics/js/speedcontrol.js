'use strict';
$(() => {
	var speedcontrolBundle = 'nodecg-speedcontrol';
	
	// Element selectors
	var player1 = $('#player-1');
    var player2 = $('#player-2');
    var statsP1name = $('#stats-p1-name');
    var statsP2name = $('#stats-p2-name');
	
	// This is where the information is received for the run we want to display.
	// The "change" event is triggered when the current run is changed.
	var runDataActiveRun = nodecg.Replicant('runDataActiveRun', speedcontrolBundle);
	runDataActiveRun.on('change', (newVal, oldVal) => {
		if (newVal)
			updateSceneFields(newVal);
	});
	
	// Sets information on screen
	function updateSceneFields(runData) {
        let p1name, p2name;

        if (runData.teams[0].players[0].pronouns == undefined) {
            p1name = runData.teams[0].players[0].name;
        } else {
            p1name = `${runData.teams[0].players[0].name} (${runData.teams[0].players[0].pronouns})`;
        }
        if (runData.teams[1].players[0].pronouns == undefined) {
            p2name = runData.teams[1].players[0].name;
        } else {
            p2name = `${runData.teams[1].players[0].name} (${runData.teams[1].players[0].pronouns})`;
        }

		player1.html(p1name);
        player2.html(p2name);
        statsP1name.html(runData.teams[0].players[0].name);
        statsP2name.html(runData.teams[1].players[0].name);
	}
});