document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    document.getElementById('save').addEventListener('click', saveData);
    document.getElementById('tasksbtn').addEventListener('click', loadData);
    var msg;
}
function saveData() {
    var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024); 
    db.transaction(function (tx) {   
        tx.executeSql('CREATE TABLE IF NOT EXISTS LOGS (id INTEGER PRIMARY KEY AUTOINCREMENT, datum integer, uhrzeit integer, text, kategorie, bildlink)'); 
        var datum = document.getElementById("date").value;
        var uhrzeit = document.getElementById("time-2").value;
        var text = document.getElementById("textarea-5").value;
        var kategorie = document.getElementById("category").value;
        var bildlink = document.getElementById("msg").textContent;
        tx.executeSql('INSERT INTO LOGS (datum, uhrzeit, text, kategorie, bildlink) VALUES (?, ?, ?, ?, ?)', [datum, uhrzeit, text, kategorie, bildlink]); 
        msg = '<p>Log message created and row inserted.</p>'; 
        document.querySelector('#status').innerHTML =  msg;
        loadData();
        $("body").pagecontainer("change", "#tasks"); 
     })
} 
function loadData() {
    var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
    $("#table>li").remove();
    $("#status").text("");
    db.transaction(function (tx) { 
        tx.executeSql('SELECT * FROM LOGS', [], function (tx, results) { 
           var len = results.rows.length, i; 
           msg = "<p>Anzahl der Aufgaben: " + len + "</p>"; 
           document.querySelector('#status').innerHTML +=  msg;
           
           for (i = 0; i < len; i++) { 
              msg = "<li><a onclick='showtask(\"" + results.rows.item(i).id + "\")'><h2>" + results.rows.item(i).text + "</h2></a><a onclick='deletetask(\"" + results.rows.item(i).id + "\")'></a></li>";
              $('#table').append(msg);
              //document.querySelector('#table').innerHTML += "<img src='img/trashcan.png' class='img-responsive' style='width:2%' onclick = 'deletetask(\"" + results.rows.item(i).id + "\")'\>";
           }
           
           $("body").pagecontainer("change", "#tasks"); 
           $("#table").listview("refresh");
        }, null); 
     })
}
function showtask(id) {
    var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);

    db.transaction(function (tx) { 
        tx.executeSql('SELECT * FROM LOGS WHERE id=?', [id], function (tx, results) { 
            var len = results.rows.length, i; 
           
           for (i = 0; i < len; i++) { 
              msg = "<h1>Kategorie: " + results.rows.item(i).kategorie + "</h1><h2>Datum: " + results.rows.item(i).datum + "</h2><h2>Uhrzeit: " + results.rows.item(i).uhrzeit + "</h2><h3>Aufgabe: " + results.rows.item(i).text + "</h3> ";
              document.querySelector('#zeig').innerHTML =  msg;
              document.getElementById('zeigephoto').src = results.rows.item(i).bildlink;
           }
           document.getElementById("delete").innerHTML= "<a data-role='button' id='loeschen' onclick = 'deletetask(\"" + id + "\")'>Löschen<\a></br></br>";
           $("body").pagecontainer("change", "#onetask"); 
        }, null); 
     })
    }
function deletetask(id) {
    var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
    db.transaction(function (tx) {
        tx.executeSql('DELETE FROM LOGS WHERE id=?', [id], function (tx, results) {
            
        }, null);
        alert("Aufgabe gelöscht")
        $("body").pagecontainer("change", "#tasks");
        loadData();
    })
    
    
};
