// Element definitions
var comm1Name = document.getElementById('comm-1-name');
var comm1Pronouns = document.getElementById('comm-1-pronouns');
var comm2Name = document.getElementById('comm-2-name');
var comm2Pronouns = document.getElementById('comm-2-pronouns');
var comm3Name = document.getElementById('comm-3-name');
var comm3Pronouns = document.getElementById('comm-3-pronouns');

// Update commentary
document.getElementById('submit-comms').addEventListener('click', function() {
    let comm1, comm2, comm3;

    if (comm1Pronouns.value === '') {
        comm1 = comm1Name.value;
    } else {
        comm1 = `${comm1Name.value} (${comm1Pronouns.value})`;
    }
    if (comm2Pronouns.value === '') {
        comm2 = comm2Name.value;
    } else {
        comm2 = `${comm2Name.value} (${comm2Pronouns.value})`;
    }
    if (comm3Pronouns.value === '') {
        comm3 = comm3Name.value;
    } else {
        comm3 = `${comm3Name.value} (${comm3Pronouns.value})`;
    }

    console.log(comm1, comm2, comm3);

    nodecg.sendMessage('updateCommentary', {
        comm1: comm1,
        comm2: comm2,
        comm3: comm3
    });
});