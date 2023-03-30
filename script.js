var langs = ["USen","JPja","TWzh"];
var fontList = ["","Kurokane","DFPT_AZ5"];
var selectedAdj = ["","",""];
var selectedSub = ["","",""];
var defaultTitleSize = "2.3rem";
var curLangIndex = 0;

const source = "https://raw.githubusercontent.com/Leanny/leanny.github.io/master/splat3/";

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
}

function initState(){
    $('div:contains("3000"):not(:has(*))').parent().trigger("click");
    $('input[id^="comboBox"]').trigger("change");
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
            loadDataIntoResult(data);
            initState();
        });
}

function getBannerImage() {
    var versionSource = source + "versions.json";
    var imgSource = (id) => source + "images/npl/" + id + ".webp"; // or png
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
        for (const img of bannerAsset) {
            var colorAttr = 
            "r='" + img.textColor.R + 
            "' g='" + img.textColor.G + 
            "' b='" + img.textColor.B + "'";
            bannerHtml += "<img src='"+img.source+"' "+ colorAttr +">";
        }
        $(".bannerList").html(bannerHtml);
    });
}

var modalTop = "50%"
function setUpModalOpenEvent(){
    $('.md-trigger').click(function(event){
        $(".md-modal").css("top", modalTop);
        $(".md-modal").css("opacity", 1);
        $(document.body).addClass("noscroll");
        setUpBannerClickEvent();
    });
    $(".closeBT").click(modalClose);
}

function modalClose(){
    $(".md-modal").css("top","-"+modalTop);
    $(".md-modal").css("opacity", 0);
    $(document.body).removeClass("noscroll");    
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

function setUpBannerLangEvents(){
    $('.title').click(function(event){
        curLangIndex = curLangIndex < 2? curLangIndex+1 : 0;
        swapTitleLang();
        adjustLongTitle();
    });
}

function setupBannerNameChange(){
    document.getElementById('editable').onclick = function(event) {
        var span, input, text;

        // Get the event (handle MS difference)
        event = event || window.event;

        // Get the root element of the event (handle MS difference)
        span = event.target;

        // If it's a span...
        if (span && span.tagName.toUpperCase() === "SPAN") {
            // Hide it
            span.style.display = "none";

            // Get its text
            text = span.innerHTML;

            // Create an input
            input = document.createElement("input");
            input.type = "text";
            input.value = text;
            input.size = Math.max(text.length /4 * 3, 4);         
            span.parentNode.insertBefore(input, span);

            //limit max character of player name
            var max_chars = 10;
            $('.name input').keydown( function(e){
                if ($(this).val().length >= max_chars) { 
                    $(this).val($(this).val().substr(0, max_chars));
                    $(this).addClass("error");
                }
                console.log(playerNameCheck($(this).val()));
            });
            $('.name input').keyup( function(e){
                if ($(this).val().length >= max_chars) { 
                    $(this).val($(this).val().substr(0, max_chars));
                    $(this).removeClass("error");
                }
            });
            if ($(".name input").val().length >= max_chars) {
                $(this).val($(this).val().substr(0, max_chars));
            }
            // Focus it, hook blur to undo
            input.focus();
            input.onblur = function() {
                // Remove the input
                span.parentNode.removeChild(input);

                // Update the span
                span.innerHTML = input.value == "" ? "&nbsp;" : input.value;

                // Show the span again
                span.style.display = "";
            };
        }
    };    
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
    setUpBannerTitleClickEvents();
    setUpBannerLangEvents();
    setUpModalOpenEvent();
    setupBannerNameChange();

    $('#comboBoxAdj').on('keydown keypress keyup change', {selector: "#resultAdj li"}, filterSearch);
    $('#comboBoxSub').on('keydown keypress keyup change', {selector: "#resultSub li"}, filterSearch);    
});