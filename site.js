//1. отобразить html-форму после загрузки страницы
//2. при нажатии на "Or click here to read a random article" - открывать новую страницу с рандомной статьей из wiki
//3. при сабмите формы отображать список результатов поиска из wiki
//3.1 из инпута брать введенные пользователем данные и передать из в url для запроса в api
//3.2 сходить в api
//3.2.1 если api не работает, отобразить "Something went wrong. Please, try again."
//4. если ошибок нет, вставить список результатов в ".results-block_content"

function start() {
    $(".search-form").on('submit', function(e) {
        e.preventDefault();

        var title = $(".search-form_target").val();

        getSearchResults(title);
    });
}

var getSearchResults = function(title) {
    var wikiApiUrl = "https://en.wikipedia.org/w/api.php";

    $.ajax({
        url: wikiApiUrl,
        dataType: "jsonp",
        jsonp: "callback",
        data: {
            "action": "query",
            "formatversion": "2",
            "generator": "prefixsearch",
            "gpslimit": "10",
            "prop": "pageimages|pageterms",
            "piprop": "thumbnail",
            "pithumbsize": "50",
            "pilimit": "10",
            "redirects": '',
            "wbptterms": "description",
            "format": "json",
            "gpssearch": title
        },
        error: function (jqXHR, textStatus, errorThrown) {
            $('.error-message').html('Something went wrong. Please, try again.')
        },
        success: function(data) {
            $('.error-message').html('');
            displayResults(data);
        }
    });
};

function displayResults(data) {
    clearSearchResults();
    if (data.query) {
        data.query.pages.forEach(function(data) {
            addArticle(data);
        });
    } else {
        $('.error-message').html("We didn't find any info. Please, try again")
    }
}

function addArticle(data) {

    var articleBlock = $('<a />').attr('class','article');
    articleBlock.attr('href', 'http://en.wikipedia.org/?curid=' + data.pageid);
    articleBlock.attr('target', '_blank');

    var thumbnailElementBlock = $('<div />').attr('class', 'article_image');
    var thumbnailElement = $('<img>');
    if (data.thumbnail) {
        thumbnailElement.attr('src', data.thumbnail.source);
    } else {
        thumbnailElement.attr('src', 'https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-128.png');
    }
    thumbnailElementBlock.append(thumbnailElement);
    articleBlock.append(thumbnailElementBlock);
    $('#results-block').append(articleBlock);

    var articleTitleElement = $('<p />').attr('class', 'article_title').text(data.title);
    articleBlock.append(articleTitleElement);

    if (data.terms) {
        var articleDescriptionElement = $('<p />').attr('class', 'article_description').text(data.terms.description[0]);
        articleBlock.append(articleDescriptionElement);
    }
}

function clearSearchResults() {
    $("#results-block").empty();
    $(".search-form_target").val('');
}

$(document).ready(function(){
    start();
});