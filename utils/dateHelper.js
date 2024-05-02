const {DateTime} = require("luxon");

function formatDate(date) {
    const dateTime = DateTime.fromJSDate(new Date(date));
    return dateTime.toFormat("MMMM d, yyyy");
}

function setDefaultISOStringFields(date) {
    const providedDateString = `${DateTime.fromJSDate(date)}`.split('T')[0];
    // console.log(`providedDateString: ${providedDateString}`)
    const currentTimeString = `${DateTime.now()}`.split('T')[1];
    // console.log(`currentTimeString: ${currentTimeString}`)

    console.log(`response from setDefault: ${providedDateString}T${currentTimeString}`);
    return `${providedDateString}T${currentTimeString}`;
}

module.exports = {
    formatDate,
    setDefaultISOStringFields
};