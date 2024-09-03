// Element definitions
var comm1 = $('#commentary-1');
var comm2 = $('#commentary-2');
var comm3 = $('#commentary-3');
var clock = $('#clock');

// Update commentary from dashboard
nodecg.listenFor('updateCommentary', (names) => {
    comm1.html(names.comm1);
    comm2.html(names.comm2);
    comm3.html(names.comm3);
});

// Live clock
setInterval(() => {
    clock.html(luxon.DateTime.now().toLocaleString(luxon.DateTime.DATETIME_MED_WITH_WEEKDAY));
}, 1000);