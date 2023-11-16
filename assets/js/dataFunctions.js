const localeKey = 'l';
const defaultLocale = 'en'

const getLocale = () => {
    const locale = localStorage.getItem(localeKey)
    if (!locale) {
        setLocale(defaultLocale)
        return defaultLocale
    }

    return locale
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
    // <p>Afwerking werkt<p><ul class="b"><li>Tegel werkt</li><li>Schilderen werkt</li><li>Gips werkt</li></ul></p></p>
}

$(document).ready(function () {
    $.getJSON(getDataFile(), function (data) {
        fillStaticText(data)

        fillWorks(data)
    });
});