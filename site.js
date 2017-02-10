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
    if (data.query) {
        data.query.pages.forEach(function(data) {
            addArticle(data);
        });
    } else {
        $('.error-message').html("We didn't find any info. Please, try again")
    }
}

function addArticle(data) {

    var resultsBlock = document.getElementById('results-block');
    var articleBlock = document.createElement('a');
    var pageId = data.pageid;
    articleBlock.classList.add('article');
    articleBlock.href = 'http://en.wikipedia.org/?curid=' + pageId;
    articleBlock.target = '_blank';

    var articleThumbnail = data.thumbnail;
    var thumbnailElementBlock = document.createElement('div');
    thumbnailElementBlock.classList.add('article_image');
    var thumbnailElement = document.createElement('img');
    if (articleThumbnail) {
        thumbnailElement.src = articleThumbnail.source;
    } else {
        thumbnailElement.src = 'https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-image-128.png';
    }
    thumbnailElementBlock.appendChild(thumbnailElement);
    articleBlock.appendChild(thumbnailElementBlock);
    resultsBlock.appendChild(articleBlock);

    var articleText = document.createElement('div');
    articleText.classList.add('article_text');

    var articleTitle = data.title;
    var articleTitleElement = document.createElement('p');
    articleTitleElement.innerText = articleTitle;
    articleTitleElement.classList.add('article_title');
    articleBlock.appendChild(articleTitleElement);

    if (data.terms) {
        var articleDescription = data.terms.description[0];
        var articleDescriptionElement = document.createElement('p');
        articleDescriptionElement.innerText = articleDescription;
        articleDescriptionElement.classList.add('article_description');
        articleBlock.appendChild(articleDescriptionElement);
    } else {
        console.log("ololo")
    }
}

function clearSearchResults() {
    $("#result-block").empty();
    $(".search-form_target").val('');
}

$(document).ready(function(){
    start();
});