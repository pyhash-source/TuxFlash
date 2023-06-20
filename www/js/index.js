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

let db;

function onDeviceReady() {

    db = window.sqlitePlugin.openDatabase({
        name: "mydb.db",
        location: "default",
    });
    setTimeout(() => {
        updateDisplay(db)
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
                                tx.executeSql('COMMIT', [], function() {
                                    console.log('Transaction committed');
                                }, function(error) {
                                    console.log('Error committing transaction: ' + error.message);
                                });
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

        initializeApp(db)

    }, 1000);




}

//----------------------------------util------------------------
function initializeApp(db) {

    console.log("-è-è-è-è-è--è-è-è-è-è")
    console.log(db)
        // Attach the event listener to the button
    var createDeckButton = document.getElementById("popupCreateDeckValidateButton");
    var createDeckTextArea = document.getElementById("popupCreateDeckTextArea");
    createDeckButton.addEventListener("click", function() {
        var deckName = createDeckTextArea.value;

        db.transaction(function(tx) {
            tx.executeSql(
                "INSERT INTO lists (listName) VALUES (?)", [deckName],
                function() {
                    tx.executeSql('COMMIT', [], function() {
                        console.log('Transaction committed');
                        createDeckTextArea.value = "";
                        popupContainer.style.display = "none";
                        updateDisplay(db);
                    }, function(error) {
                        console.log('Error committing transaction: ' + error.message);
                    });

                },
                function(error) {
                    console.log("Error inserting data: " + error.message);
                }
            );
        });
    });
}


//-----------------------------database functions----------------------------
function addDataToListTable(db) {

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

function logTableColumns(db) {
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


function updateDisplay(db) {
    console.log("je vais logger les colonnes de la db:")
    logTableColumns(db);

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
// var createDeckButton = document.getElementById("popupCreateDeckValidateButton");
// var createDeckTextArea = document.getElementById("popupCreateDeckTextArea");

// createDeckButton.addEventListener("click", handleCreateDeckButtonClick(db));

// function handleCreateDeckButtonClick(db) {
//     return function() {
//         console.log('je suis dans la fonction qui appelle le listener')
//         console.log(db)
//         var deckName = createDeckTextArea.value;

//         db.transaction(function(tx) {
//             tx.executeSql(
//                 "INSERT INTO lists (listName) VALUES (?)", [deckName],
//                 function() {
//                     createDeckTextArea.value = "";
//                     popupContainer.style.display = "none";
//                     updateDisplay();
//                 },
//                 function(error) {
//                     console.log("Error inserting data: " + error.message);
//                 }
//             );
//         });
//     };
// }

// createDeckButton.addEventListener("click", function() {
//     var deckName = createDeckTextArea.value;

//     db.transaction(function(tx) {
//         tx.executeSql(
//             "INSERT INTO lists (listName) VALUES (?)", [deckName],
//             function() {
//                 createDeckTextArea.value = ""
//                 popupContainer.style.display = "none";
//                 updateDisplay()

//             },
//             function(error) {
//                 console.log("Error inserting data: " + error.message);
//             }
//         );

//     });
// });