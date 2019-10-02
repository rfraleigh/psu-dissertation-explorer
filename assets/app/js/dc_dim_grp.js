/*!
 * Dissertation_Explorer v1.0.0
 * Author - Robbie Fraleigh, PhD - The Pennsylvania State University
 * Licensed under Apache v2 (https://www.apache.org/licenses/LICENSE-2.0)
 */
/**
 * Builds Dim/Grp for time-related parameters
 *
 * @param {number} cf Primary Crossfilter Variable
 * @param {object} data_dict Master Dictionary of Crossfilter Dim/Grp Components
 * @param {string} div HTML ID tag for Component
 * @returns {object} data_dict Master Dictionary of Crossfilter Dim/Grp Components
 */

function dim_grp__keyword(cf, data_dict,div) {
    data_dict[div] = {
        'format': 'list',
        'div': div,
        'display_title': 'Keywords',
        'type':'simple'

    };

    data_dict[div]['dim'] = cf.dimension(function (d) {
        if (typeof d['meta_keywords'] == "undefined") return "";
        return d['meta_keywords']
    }, true);

    data_dict[div]['grp'] = data_dict[div]['dim'].group();
    data_dict[div]['grp_n'] = remove_empty_text_bins(group_top_n(data_dict[div]['grp'],50));

    console.log(div, data_dict[div]['grp'].all())
    console.log(div, data_dict[div]['grp_n'].all())

    return data_dict
}

function dim_grp__committee(cf, data_dict,div) {
    data_dict[div] = {
        'format': 'list',
        'div': div,
        'display_title': 'Committee',
        'type':'simple'

    };

    data_dict[div]['dim'] = cf.dimension(function (d) {
        if (typeof d['meta_committee'] == "undefined") return "";
        return d['meta_committee']
    }, true);

    data_dict[div]['grp'] = data_dict[div]['dim'].group();
    data_dict[div]['grp_n'] = remove_empty_text_bins(group_top_n(data_dict[div]['grp'],50));

    console.log(div, data_dict[div]['grp'].all())
    console.log(div, data_dict[div]['grp_n'].all())

    return data_dict
}

function dim_grp__program(cf, data_dict,div) {
    data_dict[div] = {
        'format': 'list',
        'div': div,
        'display_title': 'Program',
        'type':'simple'

    };

    data_dict[div]['dim'] = cf.dimension(function (d) {
        if (typeof d['meta_program'] == "undefined") return "";
        return d['meta_program']
    }, false);

    data_dict[div]['grp'] = data_dict[div]['dim'].group();
    data_dict[div]['grp_n'] = remove_empty_text_bins(group_top_n(data_dict[div]['grp'],50));

    console.log(div, data_dict[div]['grp'].all())
    console.log(div, data_dict[div]['grp_n'].all())

    return data_dict
}

function dim_grp__author(cf, data_dict,div) {
    data_dict[div] = {
        'format': 'string',
        'div': div,
        'display_title': 'Author',
        'type':'simple'

    };

    data_dict[div]['dim'] = cf.dimension(function (d) {
        if (typeof d['meta_author'] == "undefined") return "";
        return d['meta_author'].split(',')[0]
    }, false);

    data_dict[div]['grp'] = data_dict[div]['dim'].group();
    data_dict[div]['grp_n'] = remove_empty_text_bins(group_top_n(data_dict[div]['grp'],50));

    console.log(div, data_dict[div]['grp'].all())
    console.log(div, data_dict[div]['grp_n'].all())

    return data_dict
}

function dim_grp__degree_type(cf, data_dict,div) {
    data_dict[div] = {
        'format': 'string',
        'div': div,
        'display_title': 'Degree Type',
        'type':'simple'

    };

    data_dict[div]['dim'] = cf.dimension(function (d) {
        if (typeof d['detail_degree_type'] == "undefined") return "";
        return d['detail_degree_type'].split(',')[0]
    }, false);

    data_dict[div]['grp'] = data_dict[div]['dim'].group();

    console.log(div, data_dict[div]['grp'].all())

    return data_dict
}
function dim_grp__degree_desc(cf, data_dict,div) {
    data_dict[div] = {
        'format': 'string',
        'div': div,
        'display_title': 'Degree Description',
        'type':'simple'

    };

    data_dict[div]['dim'] = cf.dimension(function (d) {
        if (typeof d['detail_degree_description'] == "undefined") return "";
        return d['detail_degree_description'].split(',')[0]
    }, false);

    data_dict[div]['grp'] = data_dict[div]['dim'].group();

    console.log(div, data_dict[div]['grp'].all())

    return data_dict
}
function dim_grp__date(cf, data_dict,div) {
    data_dict[div] = {
        'format': 'string',
        'div': div,
        'display_title': 'Date',
        'type':'simple'

    };

    data_dict[div]['dim'] = cf.dimension(function (d) {
        if (typeof d['detail_defense_date'] == "undefined") return "";
        var parse_date = d3.timeParse('%B %d, %Y')(d['detail_defense_date'])
        // var format_date = d3.timeFormat('%B, %Y')(parse_date)
        // var parse_date = d3.timeParse('%B, %Y')(d3.timeFormat('%B, %Y')(d3.timeParse('%B %d, %Y')))
        return parse_date
    }, false);

    data_dict[div]['grp'] = remove_empty_text_bins(data_dict[div]['dim'].group());

    console.log(div, data_dict[div]['grp'].all())

    return data_dict
}

function dim_grp__year(cf, data_dict,div) {
    data_dict[div] = {
        'format': 'string',
        'div': div,
        'display_title': 'Year',
        'type':'simple'

    };

    data_dict[div]['dim'] = cf.dimension(function (d) {
        if (typeof d['year'] == "undefined") return "";
        var parse_date = d3.timeParse('%Y')
        return parse_date(d['year'])
    }, false);

    data_dict[div]['grp'] = data_dict[div]['dim'].group();

    console.log(div, data_dict[div]['grp'].all())

    return data_dict
}




// Extra Grp Functions
function remove_empty_text_bins(source_group) {
    return {
        all: function () {
            return source_group.all().filter(function (d) {
                return d.key !== "" && d.key !== null;
            });
        }
    };
}
function group_top_n(source_group,n) {
    return {
        all: function () {
            return source_group.top(n).filter(function (d) {
                return ( d.key != "-1" & d.key!='others');
            });
        }
    };
}
function group_append(source_group,append_list) {
                return {
                    all: function () {
                        return source_group.all().concat(append_list)
                    }
                };
            }
