var langs = ["USen","JPja","TWzh"];

function loadAdjectiveTitleResult(data){
    var titleCategory ="CommonMsg/Byname/BynameAdjective";
    var resulAdjtHtml = "";

    for (const key of Object.keys(data[0][titleCategory])) {
        resulAdjtHtml += "<li class='fade'>";
        for (let i = data.length - 1; i >= 0; i--) {
            resulAdjtHtml += "<div class='"+ langs[i] + "'>"+cleanUpData(data[i][titleCategory][key])+"</div>";
        }   
        resulAdjtHtml += "<div class='id'>"+key+"</div>";
        resulAdjtHtml += "</li>";
      }
    $("#resultAdj").html(resulAdjtHtml);
}

function loadSubjectTitleResult(data){
    var titleCategory ="CommonMsg/Byname/BynameSubject";
    var isGarbage = (content) => content.toString().indexOf("[group") !== -1;
    var resultSubHtml = "";

    for (const key of Object.keys(data[0][titleCategory])) {
        var hasContent = (langData) => !isGarbage(langData[titleCategory][key]);

            if (data.some(hasContent)) {
                resultSubHtml += "<li class='fade'>";
                resultSubHtml += "<div class='id'>"+key+"</div>";
                for (langData of data) {
                    var displayKey = isGarbage(langData[titleCategory][key]) ? key.slice(0, -1)+'0' : key;
                        resultSubHtml += "<div class='"+ langs[data.indexOf(langData)] + "'>"+cleanUpData(langData[titleCategory][displayKey])+"</div>";
                }   
                resultSubHtml += "</li>";    
            }
    }
    $("#resultSub").html(resultSubHtml);
}

function loadDataIntoResult(data){
    loadAdjectiveTitleResult(data);
    loadSubjectTitleResult(data);
    $('div:contains("3000"):not(:has(*))').parent().addClass("selectedItem");
    $('input[id^="comboBox"]').trigger("change");
}

function cleanUpData(text){
    return text.replace(/\s*\[.*?\]\s*/g, '');
}

function getData() {
    var source = "https://raw.githubusercontent.com/Leanny/leanny.github.io/master/splat3/data/language/";
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
        for (const lang of langs) {
            selectedAdj.push($(this).find("."+lang).text());
        }
        var adjWithSpace = curLangIndex==0 ? selectedAdj[curLangIndex]+" " : selectedAdj[curLangIndex];
        $('.bannerPreview .title span:first-child').html(adjWithSpace);
        $(this).addClass("selectedItem");
        $(this).siblings().removeClass("selectedItem");

        adjustLongTitle();
    });

    $('#resultSub').on('click','li', function(event){
        selectedSub=[];
        for (const lang of langs) {
            selectedSub.push($(this).find("."+lang).text());
        }
        $('.bannerPreview .title span:last-child').html(selectedSub[curLangIndex]);
        $(this).addClass("selectedItem");
        $(this).siblings().removeClass("selectedItem");

        adjustLongTitle();
    });
}

function setUpBannerLangEvents(){
    $('.next').click(function(event){
        curLangIndex = curLangIndex < 2? curLangIndex+1 : 0;
        swapTitleLang();
        adjustLongTitle();
    });

    $('.prev').click(function(event){
        curLangIndex = curLangIndex <= 0 ? 2 : curLangIndex-1;
        swapTitleLang();
        adjustLongTitle();
    });
}

function adjustLongTitle(){
    var size;
    var desired_height = 36.8;
    var resizer = $(".title");
    resizer.css("font-size", defaultTitleSize);
    resizer.css("word-spacing", "normal");
    while(resizer.height() > desired_height){
        size = parseInt(resizer.css("font-size"), 10);
        resizer.css("font-size", size - 1);
        resizer.css("word-spacing", -4);
    }
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
var defaultTitleSize = "2.3rem";
var curLangIndex = 0;

function filterSearch(e) {
    var search = this.value.toLowerCase();
    var $li = $(e.data.selector).hide();
    $li.filter(function() {
        return $(this).text().toLowerCase().indexOf(search) >= 0;
    }).show();
};

// search code ref: https://stackoverflow.com/questions/10686008/building-a-quick-search-box-with-jquery
$(document).ready(function () {

    getData();
    setUpBannerTitleClickEvents();
    setUpBannerLangEvents();

    $('#comboBoxAdj').on('keydown keypress keyup change', {selector: "#resultAdj li"}, filterSearch);
    $('#comboBoxSub').on('keydown keypress keyup change', {selector: "#resultSub li"}, filterSearch);    
});