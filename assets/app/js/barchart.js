/*!
 * Dissertation_Explorer v1.0.0
 * Author - Robbie Fraleigh, PhD - The Pennsylvania State University
 * Licensed under Apache v2 (https://www.apache.org/licenses/LICENSE-2.0)
 */
function barchart_options_template_simple(data_dict,item){
        var options = {
                'selector':'#application',
                'div_id':item,
                'dim':data_dict[item]['dim'],
                'grp':data_dict[item]['grp'],
                'row_height':25,
                'label_offset':5,
                'ylabel':'Y Label',
                'xlabel':'X Label',
                'scale_type':'linear',
                'interval':d3.timeYears,
                'height':250
                };
        return options
    }

function build_simple_time_barchart(div, dim, grp, options){

    var barchart = dc.barChart(" " + div);

    var date_sort = grp.all().sort(function (a, b) {
        return a.key - b.key
    });
    var min_date = date_sort[0]
    var max_date = date_sort[date_sort.length - 1]

    console.log(options)
    console.log(min_date,max_date)
    barchart
        .width($(div).width())
        .height(options['height'])
        .margins({top: 25, right: 25, bottom: 35, left: 45})
        .yAxis(d3.axisLeft().ticks(3))
        .brushOn(true)
        .elasticX(false)
        .elasticY(true)
        .xAxisLabel(options['xlabel'])
        .yAxisLabel(options['ylabel'])
        .dimension(dim)
        .barPadding(0.1)
        .outerPadding(0.05)
        .group(grp)
        .x(d3.scaleTime().domain([new Date(min_date.key), new Date(max_date.key)]).range([new Date(min_date.key), new Date(max_date.key)]))
        .y(d3.scaleLinear())
        .xAxis(d3.axisBottom())
        .xUnits(options['interval'])

    return barchart
}