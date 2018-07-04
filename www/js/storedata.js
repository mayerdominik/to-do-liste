document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    document.getElementById('tasksbtn').addEventListener('click', loadData);
    document.getElementById('newtaskbtn').addEventListener('click', newtask);
    document.getElementById('lade').addEventListener('click', loadDatacat);
    document.getElementById('seecategories').addEventListener('click', showcategories);
    $("#tasks").on("pageload", loadData);
    document.getElementById("cat").addEventListener('click', saveCat1);
    document.getElementById("cat2").addEventListener('click', saveCat2);
}
function newtask() {
    $("#date").val("");
    $("#time-2").val("");
    $("#category").empty();
    let text = document.getElementById("textarea-4").value;
    document.getElementById("textarea-5").value=text;
    $("#category").val("");
    $("#msg").val("");
    var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024); 
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM CATS', [], function (tx, results) {
            var len = results.rows.length, i;
            for(i=0;i<len;i++) {
                let content = "<option value='" + results.rows.item(i).kategorie + "'>" + results.rows.item(i).kategorie + "</option>";
                $("#category").append(content);
            }
            $("#category").selectmenu("refresh");
        }, null);
    })
    document.getElementById('photo').src = "img/gallery.png";
    document.getElementById('photo').style = "width:10%";
    $("#saveedit").html("<button class='ui-btn' id='save'>Remind Me</button>");
    $("body").pagecontainer("change", "#newtask");
    document.getElementById('save').addEventListener('click', saveData);
}
function saveData() {
    var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024); 
    var datum = document.getElementById("date").value;
    var uhrzeit = document.getElementById("time-2").value;
    var text = document.getElementById("textarea-5").value;
    var kategorie = document.getElementById("category").value;
    if(datum==""||uhrzeit==""||text==""||kategorie=="") {
        alert("Bitte füllen Sie alle Felder aus.");
    } else {
        db.transaction(function (tx) {   
        tx.executeSql('CREATE TABLE IF NOT EXISTS LOGS (id INTEGER PRIMARY KEY AUTOINCREMENT, datum integer, uhrzeit integer, text, kategorie, bildlink)'); 
        var datum = document.getElementById("date").value;
        var uhrzeit = document.getElementById("time-2").value;
        var text = document.getElementById("textarea-5").value;
        var kategorie = document.getElementById("category").value;
        var bildlink = document.getElementById("msg").textContent;
        tx.executeSql('INSERT INTO LOGS (datum, uhrzeit, text, kategorie, bildlink) VALUES (?, ?, ?, ?, ?)', [datum, uhrzeit, text, kategorie, bildlink]);
        tx.executeSql("SELECT * FROM LOGS", [], function (tx, results) {
            var id = results.rows.length;
            add_reminder(id, datum, text, uhrzeit, kategorie);
        })
        msg = '<p>Log message created and row inserted.</p>'; 
        document.querySelector('#status').innerHTML =  msg;
        loadData();
        $("body").pagecontainer("change", "#tasks"); 
        alert("Aufgabe erstellt");
     })
} }
function add_reminder(id, datum, text, uhrzeit, kategorie) {
    cordova.plugins.notification.local.schedule({
        id: id,
        title: kategorie,
        text: text,
        trigger: { at: new Date(datum + " " + uhrzeit) }
    });
    
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
function loadDatacat() {
    var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
    $("#tasklist").html("");
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM CATS', [], function (tx, results) {
            var len = results.rows.length, i;
            var message = "Anzahl der Kategorien: " + len;
            $("#message").text(message);
            for (i=0; i < len; i++) {
                var content = "<li><a onclick='showcattasks(\"" + results.rows.item(i).kategorie + "\")'>" + results.rows.item(i).kategorie + "</a></li>";
                $("#tasklist").append(content);
            }
            $("body").pagecontainer("change", "#filterbycategories");
            $("#tasklist").listview("refresh");
        }, null);
    })
}

function showcattasks(kategorie) {
    $("#table").html("");
    $("#status").text("");
    var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
    db.transaction(function(tx) {
        tx.executeSql('SELECT * FROM LOGS WHERE kategorie=?', [kategorie], function (tx, results) {
            var len=results.rows.length, i;
            var msg = "<h2>Kategorie: " + kategorie +"</h2></br><h3>Anzahl der Aufgaben: " + len +"</h3>";
            $("#status").html(msg);
            for(i=0; i < len; i++) {
                var content = "<li><a onclick='showtask(\"" + results.rows.item(i).id + "\")'><h2>" + results.rows.item(i).text + "</h2></a><a onclick='deletetask(\"" + results.rows.item(i).id + "\")'></a></li>";
                $('#table').append(content);
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
    cordova.plugins.notification.local.cancel(id, function() {
    });
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
        add_reminder(id, datum, text, uhrzeit, kategorie);
    db.transaction(function (tx) {
        tx.executeSql("UPDATE LOGS SET datum='"+ datum + "', uhrzeit='" + uhrzeit + "', text='" + text + "', kategorie='" + kategorie + "', bildlink='" + bildlink + "' WHERE id=?", [id], function (tx, results) {     
        }, null);
        alert("Aufgabe bearbeitet")
        showtask(id);
    })
}

    
function showcategories () {
    $("#categorylist").html("");
    $("#mess").html("");
    let db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024); 
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM CATS', [], function (tx, results) {
            var len = results.rows.length, i;
            var message = "<h2>Anzahl der Kategorien: " + len + "</h2>";
            $("#mess").html(message);
            for (i=0; i < len; i++) {
                var content = "<li><a onclick='showcattasks(\"" + results.rows.item(i).kategorie + "\")'>" + results.rows.item(i).kategorie + "</a><a onclick='deletecategory(\"" + results.rows.item(i).id + "\")'></a></li>";
                $("#categorylist").append(content);
            }
            $("body").pagecontainer("change", "#categories");
            $("#categorylist").listview("refresh");
        }, null);
    })
}

function saveCat1() {
    var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
    var newCat = $("#newcat1").val();
    var catexists;
    db.transaction(function (tx){
        tx.executeSql('SELECT * FROM CATS WHERE kategorie=?', [newCat], function (tx, results){
        if(results.rows.length>0){
            catexists=true;
        } 
        else{
            catexists=false;
        }
        if(catexists){
            alert("Die eingegebene Kategorie existiert bereits");
        }
        else{
            if(newCat == "") {
                $("#dialog").text("Bitte Kategorienamen eingeben");
            } else {
                db.transaction(function (tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS CATS (id INTEGER PRIMARY KEY AUTOINCREMENT, kategorie,  CONSTRAINT name_unique UNIQUE (kategorie))');
                tx.executeSql('INSERT INTO CATS (kategorie) VALUES (?)', [newCat]);
                })
                $("#popupcat1").popup( "close" );
                alert("Kategorie gespeichert");
                newtask();
            }
        }
    }, null)
})
}

function saveCat2(){
    var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
    var newCat = $("#newcat2").val();
    var catexists;
    db.transaction(function (tx){
        tx.executeSql('SELECT * FROM CATS WHERE kategorie=?', [newCat], function (tx, results){
        if(results.rows.length>0){
            catexists=true;
        } 
        else{
            catexists=false;
        }
    if(catexists){
        alert("Die eingegebene Kategorie existiert bereits");
    }
    else{
        if(newCat != "") {
            db.transaction(function (tx) {   
                tx.executeSql('CREATE TABLE IF NOT EXISTS CATS (id INTEGER PRIMARY KEY AUTOINCREMENT, kategorie ,  CONSTRAINT name_unique UNIQUE (kategorie))'); 
                tx.executeSql('INSERT INTO CATS (kategorie) VALUES (?)', [newCat]);//testen, ob array
                msg = '<p>Log message created and row inserted.</p>'; 
            })
            $("#popupcat2").popup( "close" );
            alert("Kategorie gespeichert");
            showcategories();
            }
            else {
                alert("Bitte Kategorienamen eingeben");
            }
        }
    }, null)
})

    }
function check(name) {
    var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM LOGS WHERE kategorie=?', [name], function (tx, results) {
            var items = results.rows.length;
            if(items>0) {
                return true;
            } else {
                return false;
            }
        }, null);
})}

function deletecategory(id) {
    var db = openDatabase('mydb', '1.0', 'Test DB', 2 * 1024 * 1024);
    db.transaction(function (tx) {
        tx.executeSql('SELECT kategorie FROM CATS WHERE id=?', [id], function (tx, results) {
            var len = results.rows.length, i;
            for(i=0;i<len;i++) {
                var wert=results.rows.item(i).kategorie;
            }
            tx.executeSql('SELECT * FROM LOGS WHERE kategorie=?', [wert], function (tx, results) {
                var leng = results.rows.length, i;
                if(leng>0) {
                    alert("Bitte erledigen Sie zuerst die Aufgaben, die dieser Kategorie zugeordnet sind.")
                } else {
                    db.transaction(function (tx) {
                        tx.executeSql('DELETE FROM CATS WHERE id=?', [id], function (tx, results) {
                        }, null);
                        alert("Kategorie gelöscht")
                        showcategories();
                    })
                }
            })
        }, null); 
    })   
};

    
