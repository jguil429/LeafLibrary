const {DateTime} = require("luxon");

function normalizeDate(date) {
    const [year, month, day] = date.split('-');
    return new Date(year, month - 1, day);
}
function formatDate(date) {
    const dateObject = new Date(date);
    const month = (dateObject.getMonth() + 1).toString();
    const day = dateObject.getDate().toString();
    const year = dateObject.getFullYear();
    return`${month}/${day}/${year}`;
}

function getHTMLDefaultDate(date) {
    const dateObject = new Date(date);
    return dateObject.toISOString().split('T')[0];
}

function setDefaultISOStringFields(date) {
    const providedDateString = `${DateTime.fromJSDate(date)}`.split('T')[0];
    const currentTimeString = `${DateTime.now()}`.split('T')[1];
    return `${providedDateString}T${currentTimeString}`;
}

module.exports = {
    normalizeDate,
    formatDate,
    getHTMLDefaultDate,
    setDefaultISOStringFields
};