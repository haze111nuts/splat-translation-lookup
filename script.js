
function loadAdjectiveTitleResult(data){
    var titleAdjDatObjectEN = data[0]["CommonMsg/Byname/BynameAdjective"];
    var titleAdjDatObjectJP = data[1]["CommonMsg/Byname/BynameAdjective"];
    var titleAdjDatObjectCH = data[2]["CommonMsg/Byname/BynameAdjective"];

    var resulAdjtHtml = "";
    for (const [key, value] of Object.entries(titleAdjDatObjectEN)) {
        resulAdjtHtml += "<li class='fade'>";
        resulAdjtHtml += "<div>"+titleAdjDatObjectCH[key]+"</div>";
        resulAdjtHtml += "<div>"+getRidOfRuby(titleAdjDatObjectJP[key])+"</div>";
        resulAdjtHtml += "<div>"+value+"</div>";
        resulAdjtHtml += "<div>"+key+"</div>";
        resulAdjtHtml += "</li>";
      }
    $("#result_title1").html(resulAdjtHtml);
}

function loadSubjectTitleResult(data){
    var titleSubDatObjectEN = data[0]["CommonMsg/Byname/BynameSubject"];
    var titleSubDatObjectJP = data[1]["CommonMsg/Byname/BynameSubject"];
    var titleSubDatObjectCH = data[2]["CommonMsg/Byname/BynameSubject"];

    var resultSubHtml = "";
    for (const [key, value] of Object.entries(titleSubDatObjectEN)) {
        if(value.indexOf("[group") === -1){
            resultSubHtml += "<li class='fade'>";
            resultSubHtml += "<div>"+key+"</div>";
            resultSubHtml += "<div>"+value+"</div>";
            resultSubHtml += "<div>"+getRidOfRuby(titleSubDatObjectJP[key])+"</div>";
            resultSubHtml += "<div>"+titleSubDatObjectCH[key]+"</div>";
            resultSubHtml += "</li>";
        }
      }
    $("#result_title2").html(resultSubHtml);
}

function loadDataIntoResult(data){
    loadAdjectiveTitleResult(data);
    loadSubjectTitleResult(data);
}

function getRidOfRuby(text){
    return text.replace(/\s*\[.*?\]\s*/g, '');
}

function getData() {
    var source = "https://raw.githubusercontent.com/Leanny/leanny.github.io/master/splat3/data/language/";
    var langs = ["USen","JPja","TWzh"]    
    var promises = [];

    for (lang of langs){
        promises.push($.getJSON(source+lang+".json"));
    }

    Promise.all(promises)
    .then(data => loadDataIntoResult(data));
}



// search code ref: https://stackoverflow.com/questions/10686008/building-a-quick-search-box-with-jquery
$(document).ready(function () {

    getData();
    $('#comboBox_title1').bind('keydown keypress keyup change', function() {
        var search = this.value.toLowerCase();
        var $li = $("#result_title1 li").hide();
        $li.filter(function() {
            return $(this).text().toLowerCase().indexOf(search) >= 0;
        }).show();
    });

    $('#comboBox_title2').bind('keydown keypress keyup change', function() {
        var search = this.value.toLowerCase();
        var $li = $("#result_title2 li").hide();
        $li.filter(function() {
            return $(this).text().toLowerCase().indexOf(search) >= 0;
        }).show();
    });

});