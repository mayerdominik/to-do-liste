document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    document.getElementById('save').addEventListener('click', saveData);
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
        alert("Aufgabe gespeichert");
     }) 
} 
function loadData() {
    var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
    $("#status").text("");
    db.transaction(function (tx) { 
        tx.executeSql('SELECT * FROM LOGS', [], function (tx, results) { 
           var len = results.rows.length, i; 
           msg = "<p>Anzahl der Aufgaben: " + len + "</p>"; 
           document.querySelector('#status').innerHTML +=  msg;
           
           for (i = 0; i < len; i++) { 
              msg = "<li><a onclick='showtask(\"" + results.rows.item(i).id + "\")'>" + results.rows.item(i).datum + " " + results.rows.item(i).uhrzeit + " " + results.rows.item(i).text + " "+ results.rows.item(i).kategorie + "</a></li>";
              document.querySelector('#table').innerHTML +=  msg;
            //  document.querySelector('#status').innerHTML += "<img src='img/trashcan.png' class='img-responsive' style='width:2%' onclick = 'deletetask(\"" + results.rows.item(i).id + "\")'\>";
           }
        }, null); 
     })
}
function showtask(id) {
    var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);

    db.transaction(function (tx) { 
        tx.executeSql('SELECT * FROM LOGS WHERE id=?', [id], function (tx, results) { 
            var len = results.rows.length, i; 
           
           for (i = 0; i < len; i++) { 
              msg = "<p" + results.rows.item(i).text + "\")'>" + results.rows.item(i).datum + " " + results.rows.item(i).uhrzeit + " " + results.rows.item(i).text + " "+ results.rows.item(i).kategorie + "</p>";
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
        location.reload();
    })
    
    
};
