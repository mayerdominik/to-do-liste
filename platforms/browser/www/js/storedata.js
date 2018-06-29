document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    document.getElementById('save').addEventListener('click', saveData);
    document.getElementById('showData').addEventListener('click', loadData);
    var msg;
}
function saveData() {
    var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024); 
    db.transaction(function (tx) {   
        tx.executeSql('CREATE TABLE IF NOT EXISTS LOGS (id INTEGER PRIMARY KEY AUTOINCREMENT, datum integer, uhrzeit integer, text, kategorie)'); 
        var datum = document.getElementById("date").value;
        var uhrzeit = document.getElementById("time-2").value;
        var text = document.getElementById("textarea-5").value;
        var kategorie = document.getElementById("category").value;
        tx.executeSql('INSERT INTO LOGS (datum, uhrzeit, text, kategorie) VALUES (?, ?, ?, ?)', [datum, uhrzeit, text, kategorie]); 
        msg = '<p>Log message created and row inserted.</p>'; 
        document.querySelector('#status').innerHTML =  msg; 
     }) 
} 
function loadData() {
    var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024); 
    db.transaction(function (tx) { 
        tx.executeSql('SELECT * FROM LOGS', [], function (tx, results) { 
           var len = results.rows.length, i; 
           msg = "<p>Found rows: " + len + "</p>"; 
           document.querySelector('#status').innerHTML +=  msg;
  
           for (i = 0; i < len; i++) { 
              msg = "<a onclick='showtask(\"" + results.rows.item(i).id + "\")'>" + results.rows.item(i).datum + " " + results.rows.item(i).uhrzeit + " " + results.rows.item(i).text + " "+ results.rows.item(i).kategorie + "</b></p></a>";
              document.querySelector('#status').innerHTML +=  msg;
           } 
        }, null); 
     });
}
function showtask(id) {
    var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);

    db.transaction(function (tx) { 
        tx.executeSql('SELECT * FROM LOGS WHERE id=?', [id], function (tx, results) { 
            var len = results.rows.length, i; 
           
           for (i = 0; i < len; i++) { 
              msg = "<p" + results.rows.item(i).text + "\")'>" + results.rows.item(i).datum + " " + results.rows.item(i).uhrzeit + " " + results.rows.item(i).text + " "+ results.rows.item(i).kategorie + "</p>";
              document.querySelector('#zeig').innerHTML =  msg;
           }
           $("body").pagecontainer("change", "#onetask"); 
        }, null); 
     })
    };