
function loadAdjectiveTitleResult(data){
    var titleAdjDatObjectEN = data[0]["CommonMsg/Byname/BynameAdjective"];
    var titleAdjDatObjectJP = data[1]["CommonMsg/Byname/BynameAdjective"];
    var titleAdjDatObjectCH = data[2]["CommonMsg/Byname/BynameAdjective"];

    var resulAdjtHtml = "";
    for (const [key, value] of Object.entries(titleAdjDatObjectEN)) {
        resulAdjtHtml += "<li>";
        resulAdjtHtml += "<div class='ch'>"+titleAdjDatObjectCH[key]+"</div>";
        resulAdjtHtml += "<div class='jp'>"+getRidOfRuby(titleAdjDatObjectJP[key])+"</div>";
        resulAdjtHtml += "<div class='en'>"+value+"</div>";
        resulAdjtHtml += "<div class='id'>"+key+"</div>";
        resulAdjtHtml += "</li>";
      }
    $("#resultAdj").html(resulAdjtHtml);
}

function loadSubjectTitleResult(data){
    var titleSubDatObjectEN = data[0]["CommonMsg/Byname/BynameSubject"];
    var titleSubDatObjectJP = data[1]["CommonMsg/Byname/BynameSubject"];
    var titleSubDatObjectCH = data[2]["CommonMsg/Byname/BynameSubject"];

    var resultSubHtml = "";
    for (const [key, value] of Object.entries(titleSubDatObjectEN)) {
        if(value.indexOf("[group") === -1){
            resultSubHtml += "<li>";
            resultSubHtml += "<div class='id'>"+key+"</div>";
            resultSubHtml += "<div class='en'>"+value+"</div>";
            resultSubHtml += "<div class='jp'>"+getRidOfRuby(titleSubDatObjectJP[key])+"</div>";
            resultSubHtml += "<div class='ch'>"+titleSubDatObjectCH[key]+"</div>";
            resultSubHtml += "</li>";
        }
      }
    $("#resultSub").html(resultSubHtml);
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

function setUpBannerTitleClickEvents(){
    $('.bannerPreview .title span:first-child').html(selectedAdj[curLangIndex]+" ");
    $('.bannerPreview .title span:last-child').html(selectedSub[curLangIndex]);

    $('#resultAdj').on('click','li', function(event){
        selectedAdj=[];
        for (const lang of langList) {
            selectedAdj.push($(this).find("."+lang).text());
        }
        var adjWithSpace = curLangIndex==0 ? selectedAdj[curLangIndex]+" " : selectedAdj[curLangIndex];
        $('.bannerPreview .title span:first-child').html(adjWithSpace);
        $(this).addClass("selectedItem");
        $(this).siblings().removeClass("selectedItem");        
    });

    $('#resultSub').on('click','li', function(event){
        selectedSub=[];
        for (const lang of langList) {
            selectedSub.push($(this).find("."+lang).text());
        }
        $('.bannerPreview .title span:last-child').html(selectedSub[curLangIndex]);
        $(this).addClass("selectedItem");
        $(this).siblings().removeClass("selectedItem");
    });
}

function setUpBannerLangEvents(){
    $('.next').click(function(event){
        curLangIndex = curLangIndex < 2? curLangIndex+1 : 0;
        swapTitleLang();
    });

    $('.prev').click(function(event){
        curLangIndex = curLangIndex <= 0 ? 2 : curLangIndex-1;
        swapTitleLang();
    });
}

function swapTitleLang(){
    var adj = curLangIndex==0? selectedAdj[curLangIndex]+" ":selectedAdj[curLangIndex]; 
    $('.bannerPreview .title span:first-child').html(adj);
    $('.bannerPreview .title span:last-child').html(selectedSub[curLangIndex]);
    $('.bannerPreview .title').css("font-family","'Splat-text', '"+fontList[curLangIndex]+"'");    
}

var fontList = ["","Kurokane","DFPT_AZ5"]
var selectedAdj = ["Splatlandian","バンカラな","蠻頹的"]
var selectedSub = ["Youth","若者","年輕人"]
var langList = ['en','jp','ch'];
var curLangIndex = 0;

// search code ref: https://stackoverflow.com/questions/10686008/building-a-quick-search-box-with-jquery
$(document).ready(function () {

    getData();
    setUpBannerTitleClickEvents();
    setUpBannerLangEvents();

    $('#comboBoxAdj').bind('keydown keypress keyup change', function() {
        var search = this.value.toLowerCase();
        var $li = $("#resultAdj li").hide();
        $li.filter(function() {
            return $(this).text().toLowerCase().indexOf(search) >= 0;
        }).show();
    });

    $('#comboBoxSub').bind('keydown keypress keyup change', function() {
        var search = this.value.toLowerCase();
        var $li = $("#resultSub li").hide();
        $li.filter(function() {
            return $(this).text().toLowerCase().indexOf(search) >= 0;
        }).show();
    });
    
});