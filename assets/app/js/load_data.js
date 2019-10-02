/*!
 * Dissertation_Explorer v1.0.0
 * Author - Robbie Fraleigh, PhD - The Pennsylvania State University
 * Licensed under Apache v2 (https://www.apache.org/licenses/LICENSE-2.0)
 */
$(function() {

    var data_promises = [];
    const data_files = [
        "data/etd.json", //Datafile or list of datafiles
    ];
    data_files.forEach(function (file) {
        data_promises.push(d3.json(file))
    });

    var app_data = {}; // Build Application Data via Promises
    return Promise.all(data_promises).then(function (data) {
        app_data['data'] = data
        return app_data; //Merge List of Lists
    }).then(function (data) {
        setTimeout(function () {
            application("#application", app_data);
        }, 50);
    })
});
