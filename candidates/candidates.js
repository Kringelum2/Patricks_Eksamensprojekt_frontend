const candidateTbody = document.getElementById("candidate-tbdoy");
const newCandidateModal = document.getElementById("new-candidate-modal");
const newCandidateSubmit = document.getElementById("new-candidate-submit");

getCandidates(false);

function getCandidates(candidateUpdated) {
    fetch(baseURL + "/candidates")
        .then(response => response.json())
        .then(candidates => {
            if (candidateUpdated) {
                candidateTbody.innerHTML = "";
            }
            candidates.forEach(createCandidateTableRow);
        });
}

fetch(baseURL + "/parties")
    .then(response => response.json())
    .then(parties => {
        partiesDropdown(parties);
    });

function partiesDropdown(parties) {
    const selectDropdown = document.getElementById("new-candidate-party");

    parties.forEach(party => {
        const optionDropdown = document.createElement("option");
        optionDropdown.innerText = party.name;
        optionDropdown.value = party.id;
        selectDropdown.appendChild(optionDropdown);
    })
}

function createCandidateTableRow(candidate) {
    const tableRow = document.createElement("tr");
    candidateTbody.appendChild(tableRow);

    constructCandidateTableRow(tableRow, candidate);
}

function constructCandidateTableRow(candidateTableRow, candidate) {

    const nameTd = document.createElement("td");
    const partyTd = document.createElement("td");
    const actionTd = document.createElement("td");

    const updateCandidateButton = document.createElement("button");
    updateCandidateButton.className = "button1";
    const acceptUpdateCandidateButton = document.createElement("button");
    acceptUpdateCandidateButton.className = "button1";
    const deleteCandidateButton = document.createElement("button");
    deleteCandidateButton.className = "button1";

    actionTd.appendChild(updateCandidateButton);
    actionTd.appendChild(acceptUpdateCandidateButton);
    actionTd.appendChild(deleteCandidateButton);

    nameTd.innerText = candidate.name;
    partyTd.innerText = candidate.party.name;

    updateCandidateButton.innerText = "Rediger";
    acceptUpdateCandidateButton.innerText = "Gem";
    acceptUpdateCandidateButton.style.display = "none";
    deleteCandidateButton.innerText = "Slet";

    updateCandidateButton.addEventListener("click", () => {
        const nameInput = document.createElement("input");
        const partySelect = document.createElement("select");

        nameInput.value = nameTd.innerText;
        nameTd.innerText = "";

        fetch(baseURL + "/parties")
            .then(response => response.json())
            .then(result => {
                result.forEach(party => {
                    const option = document.createElement("option")
                    option.innerText = party.name;
                    option.value = party.id;
                    partySelect.appendChild(option);
                })
            });

        partySelect.value = partyTd.innerText;
        partyTd.innerText = "";

        nameTd.appendChild(nameInput);
        partyTd.appendChild(partySelect);

        updateCandidateButton.style.display = "none";
        acceptUpdateCandidateButton.style.display = "";
    });

    acceptUpdateCandidateButton.addEventListener("click", () => {
        const partySelect = partyTd.firstChild;
        const candidateToUpdateWith = {
            name: nameTd.firstChild.value,
            party: {
                id: (partyTd.firstChild.value),
            }
        };
        fetch(baseURL + "/candidates/" + candidate.id, {
            method: "PUT",
            headers: {"Content-type": "application/json; charset=UTF-8"},
            body: JSON.stringify(candidateToUpdateWith)
        }).then(response => {
            if (response.status === 200) {

                nameTd.innerHTML = "";
                partyTd.innerHTML = "";


                updateCandidateButton.style.display = "";
                acceptUpdateCandidateButton.style.display = "none";
                return response.json()
            }
        }).then(updatedCandidate => {
           nameTd.innerText = updatedCandidate.name;
           partyTd.innerText = updatedCandidate.party.name;
        })
    });

    deleteCandidateButton.addEventListener("click", () => {
        fetch(baseURL + "/candidates/" + candidate.id, {
            method: "DELETE"
        }).then(response => {
            if (response.status === 200) {
                candidateTableRow.remove();
            } else {
                console.log(response.status);
            }
        })
    });

    candidateTableRow.appendChild(nameTd);
    candidateTableRow.appendChild(partyTd);
    candidateTableRow.appendChild(actionTd);
}

function createCandidate() {
    const candidateToCreate = {

        name: document.getElementById("new-candidate-name").value,
        party: {id: document.getElementById("new-candidate-party").value}
    }
    console.log(candidateToCreate);
    fetch(baseURL + "/candidates", {
        method: "POST",
        headers: {"Content-type": "application/json; charset=UTF-8"},
        body: JSON.stringify(candidateToCreate)
    }).then(response => {
        if (response.status === 200) {
            newCandidateModal.style.display = "none";
            document.getElementById("new-candidate-name").value = "";
            document.getElementById("new-candidate-party").value = "";
            getCandidates(true);
        } else {
            console.log(response);
        }
    });
}


newCandidateSubmit.addEventListener("click", () => createCandidate());

document.getElementById("new-candidate-button").onclick = function () {
    newCandidateModal.style.display = "block";
}

window.onclick = function (event) {
    if (event.target === newCandidateModal) {
        newCandidateModal.style.display = "none";
    }
}

document.getElementsByClassName("close")[0].onclick = function () {
    newCandidateModal.style.display = "none";
}
