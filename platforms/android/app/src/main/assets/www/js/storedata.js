document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    document.getElementById('tasksbtn').addEventListener('click', loadData);
    document.getElementById('newtaskbtn').addEventListener('click', newtask);
    $("#categories").on("pageload", loadCat());
    $("#tasks").on("pageload", loadData);
    var msg;
}
function newtask() {
    $("#date").val("");
    $("#time-2").val("");
    let text = document.getElementById("textarea-4").value;
    document.getElementById("textarea-5").value=text;
    $("#category").val("");
    $("#msg").val("");
    document.getElementById('photo').src = "img/gallery.png";
    document.getElementById('photo').style = "width:10%";
    $("#saveedit").html("<button class='ui-btn' id='save'>Speichern</button>");
    $("body").pagecontainer("change", "#newtask");
    document.getElementById('save').addEventListener('click', saveData);
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
        alert("Aufgabe erstellt");
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
              var content="<tr><th>Kategorie</th><td>" + results.rows.item(i).kategorie + "</td></tr> .\
                            <tr><th>Datum</th><td>" + results.rows.item(i).datum + "</td></tr> .\
                            <tr><th>Uhrzeit</th><td>" + results.rows.item(i).uhrzeit + "</td></tr> .\
                            <tr><th>Aufgabe</th><td>" + results.rows.item(i).text + "</td></tr>";
              $("#task-table").html(content);
              if(results.rows.item(i).bildlink!="") {
                  var bild = "<tr><th>Bild</th><td><a href='" + results.rows.item(i).bildlink + "' data-rel='popup' data-position-to='window'><img class='img-responsive' style='width:90%; height: auto; margin: 0 auto' src='" + results.rows.item(i).bildlink + "'></a></td></tr>";
                  $("#task-table").append(bild);
                  $("#showpopup").html("<img src='" + results.rows.item(i).bildlink + "'>");
              }

         /*     msg = "<h1>Kategorie: " + results.rows.item(i).kategorie + "</h1><h2>Datum: " + results.rows.item(i).datum + "</h2><h2>Uhrzeit: " + results.rows.item(i).uhrzeit + "</h2><h3>Aufgabe: " + results.rows.item(i).text + "</h3> ";
              document.querySelector('#zeig').innerHTML =  msg;
              document.getElementById('zeigephoto').src = results.rows.item(i).bildlink;*/
           }
           $("#edit").html("<button class='ui-btn' id='edittask' onclick = 'calledit(\"" + id + "\")'>Bearbeiten</button>");
           $("#delete").html("<button class='ui-btn' id='loeschen' onclick = 'deletetask(\"" + id + "\")'>Löschen</button>");
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

function calledit(id) {
    var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
    db.transaction(function (tx) {
    tx.executeSql('SELECT * FROM LOGS WHERE id=?', [id], function (tx, results) {
       var len = results.rows.length, i; 
       for (i = 0; i < len; i++) { 
          let datum = results.rows.item(i).datum;
          let uhrzeit = results.rows.item(i).uhrzeit;
          let text = results.rows.item(i).text;
          let kategorie = results.rows.item(i).kategorie;
          let bildlink = results.rows.item(i).bildlink;
          $("#date").val(datum);
          $("#time-2").val(uhrzeit);
          $("#textarea-5").val(text);
          $("#category").val(kategorie);
          $("#msg").val(datum);
          if(bildlink != "") {
            document.getElementById('photo').src = bildlink;
            document.getElementById('photo').style = "width:90%";
          } else {

          }
          
          $("body").pagecontainer("change", "#newtask");
          $("#saveedit").html("<button class='ui-btn' id='edittask' onclick = 'edittask(\"" + id + "\")'>Änderungen speichern</button>");
       }}, null);
    })  
}
function edittask(id) {
    var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
    var datum = document.getElementById("date").value;
        var uhrzeit = document.getElementById("time-2").value;
        var text = document.getElementById("textarea-5").value;
        var kategorie = document.getElementById("category").value;
        var bildlink = document.getElementById("msg").textContent;
    db.transaction(function (tx) {
        tx.executeSql("UPDATE LOGS SET datum='"+ datum + "', uhrzeit='" + uhrzeit + "', text='" + text + "', kategorie='" + kategorie + "', bildlink='" + bildlink + "' WHERE id=?", [id], function (tx, results) {     
        }, null);
        alert("Aufgabe bearbeitet")
        $("body").pagecontainer("change", "#tasks");
        loadData();
    })
}

    
function saveCat(id){
    
    let db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024); 
    let catid = "#newcat" + id;
    let popupid = "#popupcat" + id;
    
    let newCat = $(catid).val();
    if(newCat != '') {
        db.transaction(function (tx) {   
            tx.executeSql('CREATE TABLE IF NOT EXISTS CATS (id INTEGER PRIMARY KEY AUTOINCREMENT, kategorie)'); 
            let kategorie = newCat;
            tx.executeSql('INSERT INTO CATS (kategorie) VALUES (?)', [kategorie]);//testen, ob array
            msg = '<p>Log message created and row inserted.</p>'; 
        })
        $('#categorylist').append('<li>' + newCat + '</li>');
        $('#category').append('<option value = ' + newCat + ' selected="selected" >' + newCat + '</option>');
        $(catid).val('');
        $(popupid).popup( "close" );
        if(id==1){
            $('#category').selectmenu("refresh", true); 
        }
        alert("Kategorie gespeichert"); 
        } else {
            alert('Bitte einen Kategorienamen eingeben');
        }
    }
        
    function loadCat(){
        let db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
        document.querySelector('#categorylist').innerHTML =  "";
        document.querySelector('#category').innerHTML =  "";
        db.transaction(function (tx) { 
            tx.executeSql('SELECT * FROM CATS', [], function (tx, results) { 
               let len = results.rows.length, i; 
               for (i = 0; i < len; i++) { 
                $('#categorylist').append('<li>' + results.rows.item(i).kategorie + '</li>');
                $('#category').append('<option value = ' + results.rows.item(i).kategorie + ' selected="selected" >' + newCat + '</option>');
               }
            }); 
         })
    };

    
