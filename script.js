
function loadAdjectiveTitleResult(data){
    var titleCategory ="CommonMsg/Byname/BynameAdjective";
    var resulAdjtHtml = "";

    for (const key of Object.keys(data[0][titleCategory])) {
        resulAdjtHtml += "<li>";
        for (let i = data.length - 1; i >= 0; i--) {
            resulAdjtHtml += "<div>"+cleanUp(data[i][titleCategory][key])+"</div>";
        }   
        resulAdjtHtml += "<div>"+key+"</div>";
        resulAdjtHtml += "</li>";
    }
    $("#result_title1").html(resulAdjtHtml);
}

function loadSubjectTitleResult(data){
    var titleCategory ="CommonMsg/Byname/BynameSubject";
    var isGarbage = (content) => content.toString().indexOf("[group") !== -1;
    var resultSubHtml = "";

    for (const key of Object.keys(data[0][titleCategory])) {
        var hasContent = (langData) => !isGarbage(langData[titleCategory][key]);

            if (data.some(hasContent)) {
                resultSubHtml += "<li>";
                resultSubHtml += "<div>"+key+"</div>";
                for (langData of data) {
                    var displayKey = isGarbage(langData[titleCategory][key]) ? key.slice(0, -1)+'0' : key;
                        resultSubHtml += "<div>"+cleanUp(langData[titleCategory][displayKey])+"</div>";
                }   
                resultSubHtml += "</li>";    
            }
    }
    $("#result_title2").html(resultSubHtml);
}

function loadDataIntoResult(data){
    loadAdjectiveTitleResult(data);
    loadSubjectTitleResult(data);
}

function cleanUp(text){
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