const localeKey = 'l';
const defaultLocale = 'uk'
const defaultSupportedLangs = {
    'uk': 'українська',
    'en': 'англійська',
    'de': 'німецька'
}

const getLocale = () => {
    const locale = localStorage.getItem(localeKey)
    const langs = getSupportedLanguages()

    if (!locale) {
        setLocale(defaultLocale)
        return defaultLocale
    }
    for (const [key, value] of Object.entries(langs)) {
        if (locale === key) {
            return locale
        }
    }
    console.log(langs)
    setLocale(defaultLocale)
    return defaultLocale
}

const setLocale = (l) => {
    localStorage.setItem(localeKey, l)
}

const getDataFile = () => {
    const locale = getLocale()
    return `data/data-${locale}.json`
}

const fillHtml = (cl, text) => {
    // fill text in elements with class "t-<className>" 
    $(`.${`t-${cl}`}`).each(function (index, element) {
        $(element).text(text);
    });
}

const fillStaticText = (data) => {
    for (const [key, value] of Object.entries(data)) {
        if (!key.startsWith("$")) {
            fillHtml(key, value)
        }
    }
}

const fillWorks = (data) => {
    const workSection = data.$works
    if (!workSection)
        return;

    const worksTitleHtml = `<h2>${workSection.worksTitle}</h2>`
    let worksHtml = '<div class="intro--options">'

    $.each(workSection.worksAr, function (i, work) {
        let html = `<p>${work.title}`
        html += '<p><ul class="b">'
        $.each(work.entries, function (i, entry) {
            html += `<li>${entry}</li>`
        })

        html += '</ul></p></p>'

        worksHtml += html
    })

    worksHtml += '</div>'

    const finalHtml = worksTitleHtml + worksHtml

    $('#workSection').html(finalHtml)
}

const fillGallery = (data) => {
    const imgArray = data.$gallery?.imgArray
    if (!imgArray)
        return;

    let finalHtml = ""
    $.each(imgArray, function (i, item) {
        let href = "#"
        let src = item.smallUrl
        let title = item.title
        let text = item.text
        let itemClass = ""
        console.log(item)
        switch (i) {
            case 0:
                itemClass = "slider--item slider--item-left"; break;
            case 1:
                itemClass = "slider--item slider--item-center"; break;
            case 2:
                itemClass = "slider--item slider--item-right"; break;
            default:
                itemClass = "slider--item"
        }
        
        let liHtml = `<li class="${itemClass}"><a href="${href}"><div class="slider--item-image"><img src="${src}" alt="Image"></div><p class="slider--item-title">${title}</p><p class="slider--item-description">${text}</p></a></li>`
        finalHtml += liHtml
    })
    

    $("#gallery").html(finalHtml)
}

const getSupportedLanguages = () => {
    if (localStorage.getItem('supportedLanguages')) {
        return JSON.parse(localStorage.getItem('supportedLanguages'))
    }

    $.get("../../readme.txt", function (data) {
        const lines = data.split('\n');
        const languages = {};

        lines.forEach((line) => {
            const [code, name] = line.split(/\s+/);
            if (code && name) {
                languages[code] = name;
            }
        });

        localStorage.setItem('supportedLanguages', JSON.stringify(languages))
    }, 'text');

    return defaultSupportedLangs
}

const fillLanguages = () => {
    const langs = getSupportedLanguages()

    let finalHtml = '<option value="ua" class="t-chooseLanguage"></option>'
    for (const [key, value] of Object.entries(langs)) {
        finalHtml += `<option value="${key}">${value}</option>`
    }

    $('#languageSelect').html(finalHtml)
}

$(document).ready(function () {
    fillLanguages()

    $.getJSON(getDataFile(), function (data) {
        fillStaticText(data)

        fillWorks(data)

        fillGallery(data)
    });

    $('#languageSelect').change(function () {
        var selectedLanguage = $(this).val();
        setLocale(selectedLanguage)
        location.reload();
    });
});