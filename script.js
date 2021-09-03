// Reseplanerare: 8e479caa-3d38-43f3-92e4-a3a31940e466
// Stolptidtabeller 2: b6df87b8-91e5-43c3-8fb5-971c5e17bf69
// SL Platsuppslag: 9e6f46dfd2514e50bfbc23f288feab9f
// Realtidsinfo 4: c2730165f1dc43bba7246aae0e7baa13

//Liljeholmen Reseplanerare(Plats): https://api.resrobot.se/v2/location.name?key=8e479caa-3d38-43f3-92e4-a3a31940e466&input=liljeholmen&format=json&maxNo=7
//Liljeholmen Stolptidtabell: https://api.resrobot.se/v2/departureBoard?key=b6df87b8-91e5-43c3-8fb5-971c5e17bf69&id=740004046&maxJourneys=10&format=json

function buttonSearch()
{
    var destination = document.getElementById("hallplatsID").value; //Cors policy!
    let distance = document.getElementById("distanceID").value;
    fetch(`https://cors-anywhere.herokuapp.com/https://api.resrobot.se/v2/location.name?key=8e479caa-3d38-43f3-92e4-a3a31940e466&input=${destination}&format=json&maxNo=7`)

        .then((resp) => resp.json())
        .then(function (data) {
            document.getElementById("autocomplete").innerHTML = data.StopLocation[0].name; //Reveals Station Name for finality
            let hpid = data.StopLocation[0].id; //Takes Station ID
            Departures(hpid, distance); //Calls on Station's Departure Board and pushes forth Distance
            setInterval( function() {Departures(hpid, distance);}, 60000); //Interval Timer for Departure Board
        })
}

function stationName()//Reveals Selected Station Name on change ('Autocomplete')
{
    var destination = document.getElementById("hallplatsID").value; //Repeated in order to continue fetch
    fetch(`https://cors-anywhere.herokuapp.com/https://api.resrobot.se/v2/location.name?key=8e479caa-3d38-43f3-92e4-a3a31940e466&input=${destination}&format=json&maxNo=7`)

        .then((resp) => resp.json())
        .then(function (data) {
            document.getElementById("autocomplete").innerHTML = data.StopLocation[0].name; //Sets Name
        })
}

//Liljeholmen ID = 740004046 
//https://api.resrobot.se/v2/location.name?key=8e479caa-3d38-43f3-92e4-a3a31940e466&input=liljeholmen&format=json&maxNo=7
function Departures(hpid, distance) // Fetches data from the station's departureboard
{ 
    var cellList = document.getElementById("table-gen"); //Unordered List
    cellList.innerHTML = ""; //Clean upon Input
    fetch(`https://cors-anywhere.herokuapp.com/https://api.resrobot.se/v2/departureBoard?key=b6df87b8-91e5-43c3-8fb5-971c5e17bf69&id=${hpid}&maxJourneys=10&format=json`)
    .then(resp => resp.json())
    .then(data => 
    {
        data.Departure.forEach(result => 
        {
            // In order, Departure Time Calculation, then calling Table-Gen 
            var today = new Date();
            var dep = new Date(Date.parse(`${result.date}T${result.time}`))
            var diffMs = (dep - today) //Checks the difference in ms
            var minutes = Math.floor(diffMs / 60000); //Minutes contains the calculated amount of minutes before Departure.
            var depdis = departedDistance(minutes, distance); // Checks if user can reach the station or not
            tablegen(result, minutes, cellList, depdis); //Departures List Generator
        }
        )
    })
}
function departedDistance(minutes, distance) //Compares distance in min to departure
{
    if(Math.floor(minutes - distance) < 0)
    {
        return `Nope!`
    }
    else
    {
        return `Börja dra om ${Math.floor(minutes - distance)} min!`
    }
}

function tablegen(result, minutes, cellList, depdis){
        for (let i = 1; i <= 1; i++) {
        var cell = document.createElement("li"); // ListItems


        cell.innerHTML = `Linje: ${result.transportNumber} / Åker Till: ${result.direction} / Avgång: ${minutes} min <br>
        Kan du hinna dit?: ${depdis}`;
        cell.style.color = "gold";
        cell.style.backgroundColor = "black"
        cell.style.padding = "5px"
        cellList.appendChild(cell);
        }
}
