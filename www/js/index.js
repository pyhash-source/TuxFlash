document.addEventListener('deviceready', onDeviceReady, false);

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('createList').addEventListener('click', addDataToListTable);
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('seeDB').addEventListener('click', logTableColumns);
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('updateDisplay').addEventListener('click', updateDisplay);
});

function onDeviceReady() {
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

    let db = window.sqlitePlugin.openDatabase({
        name: "mydb.db",
        location: "default",
    });

    db.transaction(function(tx) {
        tx.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name='mytable'", [],
            function(tx, res) {
                // Check if the table exists
                if (res.rows.length === 0) {
                    // Create the table if it doesn't exist
                    tx.executeSql(
                        "CREATE TABLE lists (id INTEGER PRIMARY KEY AUTOINCREMENT, listName TEXT)", [],
                        function() {
                            alert("Table created successfully");
                        },
                        function(error) {
                            alert("Error creating table: " + error.message);
                        }
                    );
                }
            },
            function(error) {
                alert("Error querying database: " + error.message);
            }
        );
    });

}




//-----------------------------database functions----------------------------
function addDataToListTable() {
    var db = window.sqlitePlugin.openDatabase({
        name: "mydb.db",
        location: "default",
    });

    db.transaction(function(tx) {
        tx.executeSql(
            "INSERT INTO lists (listName) VALUES (?)", ["Liste de test"],
            function() {
                alert("Data inserted successfully");
            },
            function(error) {
                console.log("Error inserting data: " + error.message);
            }
        );

    });

}

function logTableColumns() {
    console.log("At least I'm entering the function...");
    var db = window.sqlitePlugin.openDatabase({
        name: "mydb.db",
        location: "default",
    });

    db.transaction(function(tx) {
        tx.executeSql(
            "SELECT * FROM lists", [],
            function(tx, res) {
                var len = res.rows.length;
                for (var i = 0; i < len; i++) {
                    var row = res.rows.item(i);
                    console.log("Row " + (i + 1) + ":");
                    for (var key in row) {
                        console.log(key + ": " + row[key]);
                    }
                }
            },
            function(error) {
                console.log("Error querying table: " + error.message);
            }
        );
    });

}


function updateDisplay() {
    var db = window.sqlitePlugin.openDatabase({
        name: "mydb.db",
        location: "default",
    });

    db.transaction(function(tx) {
        tx.executeSql(
            "SELECT * FROM lists", [],
            function(tx, res) {
                var len = res.rows.length;
                var listeResultats = [];
                //cette liste contient pour chaque deck une sous liste composée du titre du deck et son index dans la bd
                for (var i = 0; i < len; i++) {
                    var row = res.rows.item(i);
                    listeToAppend = [null, null]
                    for (var key in row) {
                        if (key == 'id') {
                            listeToAppend[0] = row[key]
                        } else if (key == 'listName') {
                            listeToAppend[1] = row[key];
                        }
                    }
                    listeResultats.push(listeToAppend)
                }
                //a partir d'ici on a toutes les infos dont on a besoin dans listeResultats
                var toClear = document.getElementById("displayLists");
                toClear.innerHTML = ""; // Empty the div

                // for (let i = 0; i <= listeResultats.length - 1; i++) {
                //     // Create a new element
                //     var newButton = document.createElement("button");
                //     var br = document.createElement("br");

                //     // Set the button's text content and value
                //     newButton.textContent = listeResultats[i][1];
                //     newButton.value = listeResultats[i][0];
                //     newButton.className = "buttonDeck"
                //         // newButton.title = "Button Title";
                //     var targetDiv = document.getElementById("displayLists");
                //     targetDiv.appendChild(newButton);
                //     targetDiv.appendChild(br);

                // }

                for (let i = 0; i <= listeResultats.length - 1; i++) {
                    var newButton = document.createElement("button");
                    var br = document.createElement("br");

                    newButton.textContent = listeResultats[i][1];
                    newButton.value = listeResultats[i][0];
                    newButton.className = "buttonDeck";

                    // Add a click event listener to the button
                    newButton.addEventListener("click", function() {
                        var buttonName = listeResultats[i][1];
                        // Encode the button name in the URL parameter
                        var encodedButtonName = encodeURIComponent(buttonName);
                        // Navigate to the other page with the button name as a parameter
                        window.location.href = "html/seeDeck.html?buttonName=" + encodedButtonName;
                    });

                    var targetDiv = document.getElementById("displayLists");
                    targetDiv.appendChild(newButton);
                    targetDiv.appendChild(br);
                }


            },
            function(error) {
                console.log("Error querying table: " + error.message);
            }
        );
    });

}



//--------------------------popup windows-------------
var popupButton = document.getElementById("popupCreateDeckButton");
var popupContainer = document.getElementById("popupCreateDeckContainer");

popupButton.addEventListener("click", function() {
    popupContainer.style.display = "block";
});

popupContainer.addEventListener("click", function(event) {
    if (event.target === popupContainer) {
        popupContainer.style.display = "none";
    }
});

//-----------------logic regarding popup cards-----------
var createDeckButton = document.getElementById("popupCreateDeckValidateButton");
var createDeckTextArea = document.getElementById("popupCreateDeckTextArea");

createDeckButton.addEventListener("click", function() {
    var deckName = createDeckTextArea.value;
    var db = window.sqlitePlugin.openDatabase({
        name: "mydb.db",
        location: "default",
    });

    db.transaction(function(tx) {
        tx.executeSql(
            "INSERT INTO lists (listName) VALUES (?)", [deckName],
            function() {
                createDeckTextArea.value = ""
                popupContainer.style.display = "none";
                updateDisplay()

            },
            function(error) {
                console.log("Error inserting data: " + error.message);
            }
        );

    });
});