var langs = ["USen","JPja","TWzh"];
var fontList = ["","Kurokane","DFPT_AZ5"];
var selectedAdj = ["","",""];
var selectedSub = ["","",""];
var defaultTitleSize = "2.3rem";
var curLangIndex = 0;

const source = "https://leanny.github.io/splat3/";

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

function loadData(data){
    loadAdjectiveTitleResult(data);
    loadSubjectTitleResult(data);
    sort("id");
    $('div:contains("0194_0")').siblings('.TWzh').css("position","absolute");
}

function cleanUpData(text){
    return text.replace(/\s*\[.*?\]\s*/g, '');
}

function getData() {
    var textSource = source + "data/language/";
    var promises = [];

    for (lang of langs){
        promises.push($.getJSON(textSource+lang+".json"));
    }

    Promise.all(promises)
    .then(data => {
            loadData(data);
            selectionInit();
        });
}

function getBannerImage() {
    var versionSource = source + "versions.json";
    var imgSource = (id) => source + "images/npl/" + id + ".png";
    $.getJSON(versionSource)
    .then(versionData => {
        var latestVersion = versionData[versionData.length-1];
        var bannerIdSource = source + "data/mush/" + latestVersion +"/NamePlateBgInfo.json";
        return $.getJSON(bannerIdSource);
    })
    .then(bannerData => {
        var bannerAsset = bannerData
        .map((bannerInfo) => {
            return {
            source: imgSource(bannerInfo.__RowId),
            textColor: bannerInfo.TextColor
        }
        });
        var bannerHtml = "";
        var specialGold = [
            "Npl_Coop_Season03_Lv03",
            "Npl_Lot_Season01_Lv01",
            "Npl_Lot_Season02_Lv01",
            "Npl_Lot_Season03_Lv01",
            "Npl_Lot_Season04_Lv01"
        ]
        for (const img of bannerAsset) {
            var colorAttr;
            if(specialGold.some( (id) => img.source.indexOf(id) !== -1 )){
                colorAttr = "r='0.2549' g='0.1647' b='0'";
            }else{
                colorAttr = 
                "r='" + img.textColor.R + 
                "' g='" + img.textColor.G + 
                "' b='" + img.textColor.B + "'";
            }
            bannerHtml += "<img src='"+img.source+"' "+ colorAttr +">";
        }
        $(".bannerList").html(bannerHtml);
        $(".bannerList img[src*='Npl_Tutorial00']").addClass("selectedBanner");
    });
}

var modalTop = "50%";
function setUpModalOpenEvent(){
    $('.md-trigger').click(function(event){
        $(".md-modal").css("top", modalTop);
        $(".md-modal").css("opacity", 1);
        setUpBannerClickEvent();
        $(".bannerList").scrollTop(0);
    });
    $(".closeBT").click(modalClose);
}

function modalClose(){
    $(".md-modal").css("top","-"+modalTop);
    $(".md-modal").css("opacity", 0);
}

function setUpBannerClickEvent(){
    $(".bannerList img").click(function(event){
        $(this).addClass("selectedBanner");
        $(this).siblings().removeClass("selectedBanner");
        $(".bannerPreview").children("img").attr("src", $(this).attr('src'));
        $(".bannerPreview").children("div").css("color", 
        "rgb("+ +$(this).attr('r')*255 +
        " " + +$(this).attr('g')*255 +
        " " +  +$(this).attr('b')*255 +
        ")");
        setTimeout(modalClose, 200);
    });
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

function setUpSortResultEvent(){
    $(".sortBT").click(function(event){
        if ($(this).hasClass("sorted")) {
            //if dataList is currently sorted and button is clicked
            sort("id");
            $(this).removeClass("sorted");
        }else{
            $(this).addClass("sorted");
            sort("USen");
            // sort("JPja") TODO: sort by hiragana using ruby
            // sort("TWzh") TODO: sort by chinese using stroke
        }
    })
}

function setUpBannerLangEvents(){
    $('.title').click(function(event){
        curLangIndex = curLangIndex < 2? curLangIndex+1 : 0;
        swapTitleLang();
        adjustLongTitle();
    });
}

//onclick textInput ref : https://stackoverflow.com/questions/6814062/using-javascript-to-change-some-text-into-an-input-field-when-clicked-on
function setUpBannerNameChange(){
    $(".editable span").click(function (event) {
        var span = $(this);
        span.css("display", "none");

        $("<input></input>").insertBefore(span);
        var input = $(this).siblings("input");
        input.val(span.text());
        input.attr("type","text");
        input.attr("size", span.text().length /4 * 3);

        //limit max character of player name
        $(".name input").keydown( function(e){
            limitInputChar(10, input);
        });
        $(".name input").keyup( function(e){
            limitInputChar(10, input);
        });
        $(".number input").keydown( function(e){
            limitInputChar(4, input);
        });
        $(".number input").keyup( function(e){
            limitInputChar(4, input);
            this.value = this.value.replace(/[^0-9\.]/g,'');
        });

        input.keypress(function(e) {
            if(e.which == 13) {
                input.blur();
            }
        });
        input.focus();
        input.blur(function() {
            input.remove();
            span.css("display", "inline");
            span.html(input.val() == "" ? "?" : input.val())
        });
    });

    function limitInputChar(max_chars, el){
        if ( el.val().length > max_chars) { 
            el.val( el.val().substr(0, max_chars));
            //limit max character of player name
            var max_chars = 10;
            $('.name input').keydown( function(e){
                if ($(this).val().length > max_chars) { 
                    $(this).val($(this).val().substr(0, max_chars));
                }
            });
            $('.name input').keyup( function(e){
                if ($(this).val().length > max_chars) { 
                    $(this).val($(this).val().substr(0, max_chars));
                }
            });
            if ($(".name input").val().length >= max_chars) {
                $(this).val($(this).val().substr(0, max_chars));
            }
            $(".name input").keypress(function(e) {
                if(e.which == 13) {
                    input.blur();
                }
            });
            input.focus();
            input.onblur = function() {
                span.parentNode.removeChild(input);
                span.innerHTML = input.value == "" ? "?" : input.value;
                span.style.display = "";
            };
        }
    }
}

function sort(divId) {
    var uls = ["resultAdj","resultSub"];

    for (ulId of uls) {
        var sorted = $($("ul#"+ ulId +" li").toArray().sort(function(a, b){
            var aVal = $(a).find('.'+divId).text();
                bVal = $(b).find('.'+divId).text();
            return aVal.localeCompare(bVal);
        }));
      $("ul#"+ulId).html(sorted);
    }
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

function selectionInit(){
    curLangIndex = 1;
    $('div:contains("3000"):not(:has(*))').parent().trigger("click");
    $('input[id^="comboBox"]').trigger("change");
}

// search code ref: https://stackoverflow.com/questions/10686008/building-a-quick-search-box-with-jquery
function filterSearch(e) {
    var search = this.value.toLowerCase();
    var $li = $(e.data.selector).hide();
    $li.filter(function() {
        return $(this).text().toLowerCase().indexOf(search) >= 0;
    }).show();
};


$(document).ready(function () {
    getData();
    getBannerImage();
    setUpSortResultEvent();
    setUpBannerTitleClickEvents();
    setUpBannerLangEvents();
    setUpModalOpenEvent();
    setUpBannerNameChange();

    $('#comboBoxAdj').on('keydown keypress keyup change', {selector: "#resultAdj li"}, filterSearch);
    $('#comboBoxSub').on('keydown keypress keyup change', {selector: "#resultSub li"}, filterSearch);
});