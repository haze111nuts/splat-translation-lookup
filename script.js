function loadDataIntoResult(){
    var titleAdjDatObjectEN = dataEN["CommonMsg/Byname/BynameAdjective"];
    var titleAdjDatObjectJP = dataJP["CommonMsg/Byname/BynameAdjective"];
    var titleAdjDatObjectCH = dataCH["CommonMsg/Byname/BynameAdjective"];

    var resulAdjtHtml = "";
    for (const [key, value] of Object.entries(titleAdjDatObjectEN)) {
        resulAdjtHtml += "<li>";
        resulAdjtHtml += "<div>"+key+"</div>";
        resulAdjtHtml += "<div>"+value+"</div>";
        resulAdjtHtml += "<div>"+getRidOfRuby(titleAdjDatObjectJP[key])+"</div>";
        resulAdjtHtml += "<div>"+titleAdjDatObjectCH[key]+"</div>";
        resulAdjtHtml += "</li>";
      }
    $("#result_title1").html(resulAdjtHtml);

    var titleSubDatObjectEN = dataEN["CommonMsg/Byname/BynameSubject"];
    var titleSubDatObjectJP = dataJP["CommonMsg/Byname/BynameSubject"];
    var titleSubDatObjectCH = dataCH["CommonMsg/Byname/BynameSubject"];
    var resultSubHtml = "";
    for (const [key, value] of Object.entries(titleSubDatObjectEN)) {
        if(value.indexOf("[group") === -1){
            resultSubHtml += "<li>";
            resultSubHtml += "<div>"+key+"</div>";
            resultSubHtml += "<div>"+value+"</div>";
            resultSubHtml += "<div>"+getRidOfRuby(titleSubDatObjectJP[key])+"</div>";
            resultSubHtml += "<div>"+titleSubDatObjectCH[key]+"</div>";
            resultSubHtml += "</li>";
        }
      }
    $("#result_title2").html(resultSubHtml);
}

function getRidOfRuby(text){
    return text.replace(/\s*\[.*?\]\s*/g, '');
}

// search code ref: https://stackoverflow.com/questions/10686008/building-a-quick-search-box-with-jquery
$(document).ready(function () {

    loadDataIntoResult();
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