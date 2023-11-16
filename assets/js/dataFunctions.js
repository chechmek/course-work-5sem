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
  return `data-${locale}.json`
}

const fillHtml = (cl, text) => {
  // fill text in elements with class "t-<className>" 
  $(`.${`t-${cl}`}`).each(function (index, element) {
    $(element).text(text);
  });
}

$(document).ready(function () {
  $.getJSON(getDataFile(), function (data) {

    console.log(data)

    for(const [key, value] of Object.entries(data)){
      fillHtml(key, value)
    }
  });
});