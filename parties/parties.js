const partiesTbody = document.getElementById("party-tbody");

fetch(baseURL + "/parties")
.then(response => response.json())
.then(parties => {
const numberOfVotes = parties.map(party => {
    return party.votes
}).reduce((a, b) => {
    return a + b;
    }, 0)
    parties.forEach(party => {
        createPartyTableRow(party, numberOfVotes)
    });
});


function createPartyTableRow(party, numberOfVotes) {
    const tableRow = document.createElement("tr");
    partiesTbody.appendChild(tableRow);

    const partyTd = document.createElement("td");
    const votesTd = document.createElement("td");
    const votesPercentTd = document.createElement("td");

    partyTd.innerText = party.name;
    votesTd.innerText = party.votes;
    const percentUnformatted = party.votes / numberOfVotes * 100;
    votesPercentTd.innerText = percentUnformatted.toFixed(1);

    tableRow.appendChild(partyTd);
    tableRow.appendChild(votesTd);
    tableRow.appendChild(votesPercentTd);

    partiesTbody.appendChild(tableRow);
}

