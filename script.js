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
            document.getElementById("autocomplete").innerHTML = data.StopLocation[0].name; //Reveals Station Name
            let hpid = data.StopLocation[0].id; //Takes Station ID
            Departures(hpid, distance); //Calls on Station's Departure Board and pushes forth Distance
            setInterval( function() {Departures(hpid);}, 60000); //Interval Timer for Departure Board
        })
        .catch(function (error) {
            console.log(error);
        })
}

function stationName()//Reveals Selected Station Name on change
{
    var destination = document.getElementById("hallplatsID").value; //Repeated in order to continue fetch
    fetch(`https://cors-anywhere.herokuapp.com/https://api.resrobot.se/v2/location.name?key=8e479caa-3d38-43f3-92e4-a3a31940e466&input=${destination}&format=json&maxNo=7`)

        .then((resp) => resp.json())
        .then(function (data) {
            document.getElementById("autocomplete").innerHTML = data.StopLocation[0].name; //Sets Name
        })
        .catch(function (error) {
            console.log(error);
        })
}

//Liljeholmen ID = 740004046 
//https://api.resrobot.se/v2/location.name?key=8e479caa-3d38-43f3-92e4-a3a31940e466&input=liljeholmen&format=json&maxNo=7
function Departures(hpid, distance) // Fetches data from the station's departureboard
{ 
    fetch(`https://cors-anywhere.herokuapp.com/https://api.resrobot.se/v2/departureBoard?key=b6df87b8-91e5-43c3-8fb5-971c5e17bf69&id=${hpid}&maxJourneys=1&format=json`)
    .then(resp => resp.json())
    .then(data => 
    {
        data.Departure.forEach(result => 
        {
            //Minutes contains the calculated amount of minutes before Departure.
            var minutes = Math.floor(Math.abs(new Date(Date.parse(`${result.Stops.date}T${result.Stops.time}`)) - new Date())/1000/60);
            var depdis = departedDistance(minutes, distance); // Compares distance in min to departure
            var cellList = document.getElementById("table-gen"); //Unordered List
            tablegen(result, minutes, cellList, depdis); //Should Generate Departure Board
        }
        )
    })
}
function departedDistance(minutes, distance) //Compares distance in min to departure
{
    if((Math.floor(minutes - distance)) < 0)
    {
        return `Du hinner ej!`
    }
    else
    {
        return `Om ${Math.floor(minutes - distance)} min!` //Currently can produce NaN
    }
}

function tablegen(result, minutes, cellList, depdis){
        // cellList.innerHTML = ""; //Clean upon Input
        for (let i = 1; i <= 10; i++) {
        var cell = document.createElement("li"); // ListItems


        cell.innerHTML = `Linje: ${result.Stops.transportNumber} / Åker Till: ${result.Stops.direction} / Avgång: ${minutes} min <br>
        När du hinner dit: ${depdis}`;
        cell.style.color = "gold";
        cell.style.backgroundColor = "black"
        cell.style.padding = "5px"
        cellList.appendChild(cell);
        }
}