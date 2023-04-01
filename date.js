module.exports.getDate = ()=> {
    var today = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric"
    }
    return today.toLocaleString("en-IN", options);
}

module.exports.getDay = ()=> {
    var today = new Date();
    var options = {
        weekday: "long"
    }
    return today.toLocaleString("en-IN", options);
}