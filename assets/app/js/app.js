/*!
 * Dissertation_Explorer v1.0.0
 * Author - Robbie Fraleigh, PhD - The Pennsylvania State University
 * Licensed under Apache v2 (https://www.apache.org/licenses/LICENSE-2.0)
 */
function application(selector,dataset){
    var data = dataset['data'][0];
    console.log(data)
    // var ip_dict = dataset['ip_dict'][0]
    console.log('Data', data);
    var cf = crossfilter(data),
        all = cf.groupAll();

    dc.dataCount(".dc-data-count")
        .dimension(cf)
        .group(all);

     //--------- STYLES -----------------
    var pixels_per_row = 22;
    var label_offset = -10;

    build_app_card('keyword','',['num_sort','alpha_sort','refresh','searchbar'])
    build_app_card('keyword_drill','',['num_sort','alpha_sort','refresh','searchbar'])

    build_app_card('committee','',['num_sort','alpha_sort','refresh','searchbar'])
    build_app_card('committee_drill','',['num_sort','alpha_sort','refresh','searchbar'])

    build_app_card('program','',['num_sort','alpha_sort','refresh','searchbar'])
    build_app_card('author','',['num_sort','alpha_sort','refresh','searchbar'])
    build_app_card('degree_type','Degree Type',['num_sort','alpha_sort','refresh'])
    build_app_card('degree_desc','Degree Description',['num_sort','alpha_sort','refresh'])

    build_app_card('date','Defense Date',['refresh'])

    var data_dict = {};
    data_dict = dim_grp__keyword(cf,data_dict,'keyword')
    data_dict = dim_grp__keyword(cf,data_dict,'keyword_drill')

    data_dict = dim_grp__committee(cf,data_dict,'committee')
    data_dict = dim_grp__committee(cf,data_dict,'committee_drill')

    data_dict = dim_grp__program(cf,data_dict,'program')
    data_dict = dim_grp__author(cf,data_dict,'author')

    data_dict = dim_grp__date(cf,data_dict,'date')

    data_dict = dim_grp__year(cf,data_dict,'year')

    data_dict = dim_grp__degree_type(cf,data_dict,'degree_type')
    data_dict = dim_grp__degree_desc(cf,data_dict,'degree_desc')

    data_dict['keyword']['row_chart'] = build_simple_rowchart(
                                                        "#keyword .chart",
                                                        data_dict["keyword"]['dim'],
                                                        data_dict["keyword"]['grp_n'],
                                                        pixels_per_row,
                                                        label_offset
                                                        );
    data_dict['keyword_drill']['row_chart'] = build_simple_rowchart(
                                                        "#keyword_drill .chart",
                                                        data_dict["keyword_drill"]['dim'],
                                                        data_dict["keyword_drill"]['grp_n'],
                                                        pixels_per_row,
                                                        label_offset
                                                        );

    data_dict['committee']['row_chart'] = build_simple_rowchart(
                                                        "#committee .chart",
                                                        data_dict["committee"]['dim'],
                                                        data_dict["committee"]['grp_n'],
                                                        pixels_per_row,
                                                        label_offset
                                                        );
    data_dict['committee_drill']['row_chart'] = build_simple_rowchart(
                                                        "#committee_drill .chart",
                                                        data_dict["committee_drill"]['dim'],
                                                        data_dict["committee_drill"]['grp_n'],
                                                        pixels_per_row,
                                                        label_offset
                                                        );

    data_dict['program']['row_chart'] = build_simple_rowchart(
                                                        "#program .chart",
                                                        data_dict["program"]['dim'],
                                                        data_dict["program"]['grp'],
                                                        pixels_per_row,
                                                        label_offset
                                                        );

    data_dict['author']['row_chart'] = build_simple_rowchart(
                                                        "#author .chart",
                                                        data_dict["author"]['dim'],
                                                        data_dict["author"]['grp_n'],
                                                        pixels_per_row,
                                                        label_offset
                                                        );

    data_dict['degree_type']['row_chart'] = build_simple_rowchart(
                                                        "#degree_type .chart",
                                                        data_dict["degree_type"]['dim'],
                                                        data_dict["degree_type"]['grp'],
                                                        pixels_per_row,
                                                        label_offset
                                                        );
    data_dict['degree_desc']['row_chart'] = build_simple_rowchart(
                                                        "#degree_desc .chart",
                                                        data_dict["degree_desc"]['dim'],
                                                        data_dict["degree_desc"]['grp'],
                                                        pixels_per_row,
                                                        label_offset
                                                        );


    data_dict['date']['bar_options'] = barchart_options_template_simple(data_dict,'date')
    data_dict['date']['bar_options']['height'] = 115;

    data_dict['date']['bar_options']['xlabel'] = 'Date';
    data_dict['date']['bar_options']['ylabel'] = 'Records';
    data_dict['date']['bar_options']['interval'] = d3.timeYears;

    data_dict['date']['bar_chart'] = build_simple_time_barchart(
                                                        "#date .chart",
                                                        data_dict["year"]['dim'],
                                                        data_dict["year"]['grp'],
                                                        data_dict['date']['bar_options']
                                                    );






    //Search Functionality
    Object.keys(data_dict).forEach(function(key){
        if (data_dict[key]['type']==='simple'){
            var limited_grp;
            if (Object.keys(data_dict[key]).indexOf('grp_n')==-1){
                limited_grp = data_dict[key]['grp']
            }
            else{
                limited_grp = data_dict[key]['grp_n']
            }
            d3.select('#'+key+' #search_bar')
                    .on("keyup",function (){test_search(data_dict[key]['grp'],
                    limited_grp,
                    data_dict[key]['row_chart'],
                    this.value,
                    key)});
        }
    });

    var dataTable = dc.dataTable(".dc-table-graph");
    var datatable_fields = [];
    var column_lookup = [
        // {'link': 'Link'},
        {'author-program': 'Author'},
        // {'committee': 'Committee'},
        // {'year': 'Year'},
        // {'keywords':'Keywords'},
        {'content':'Title/Abstract'}
        // {'records':'Records'},
        // {'ask':'Message Ask'},
        // {'concepts':'Expertise'}
    ];

    column_lookup.forEach(function (d) {
        datatable_fields.push({
            label: Object.values(d)[0],
            field_name: Object.keys(d)[0],
            sort_state: "ascending"
        })
    });

    var filter_dim = data_dict['year']['dim'];
    var sort_by = 'year';
    var highlighted = data_dict['keyword']['grp'].all().map(function(d){return d.key.toLowerCase()})
    data_dict['datatable'] = {'datatable':dataTable}
    data_dict['datatable']['datatable'] = update_datatable(data_dict['datatable']['datatable'], "dc-table-graph", cf, datatable_fields, filter_dim, sort_by,highlighted,[]);





    dc.renderAll();

    data_dict['date']['bar_chart']
        .x(d3.scaleTime()
            .domain([new Date(d3.timeParse('%Y')('1999')), new Date(d3.timeParse('%Y')('2021'))])
            .range([new Date(d3.timeParse('%Y')('1999')), new Date(d3.timeParse('%Y')('2021'))])
        )


    dc.redrawAll();
    minimize_card('#keyword-card')
    minimize_card('#committee-card')
    minimize_card('#program-card')
    minimize_card('#author-card')

    //Drill Down Charts
    drill_down_interaction(data_dict,'keyword','keyword_drill')
    drill_down_interaction(data_dict,'committee','committee_drill')

    // Icon Interactivity
    icon_interactivity(data_dict,'keyword')
    icon_interactivity(data_dict,'keyword_drill')
    icon_interactivity(data_dict,'committee')
    icon_interactivity(data_dict,'committee_drill')
    icon_interactivity(data_dict,'program')
    icon_interactivity(data_dict,'date')
    icon_interactivity(data_dict,'author')

    d3.select("#committee-card i.zmdi-window-minimize").dispatch('click');
    d3.select("#author-card i.zmdi-window-minimize").dispatch('click');

    d3.select('#table-graph').style('max-height','900px').style('overflow','auto')

    /*data_dict = record_button(data_dict,'keyword', 'detail-keyword')

    function record_button(data_dict,div,key){
        d3.selectAll('.'+key).on('click',function(){
            if (d3.select(this).classed('selected')===false){
                d3.select(this).classed('selected',true)
                d3.select(this).classed('btn-primary',false).classed('btn-outline-primary',true)

            }


            var limited_grp;
            var selected_keyword = d3.select(this).property('id').replace('detail-','');
            var selected_value = data_dict[div]['grp'].all().filter(function(d){return d.key===selected_keyword})[0].value;

            var current_filters = data_dict[div]['row_chart'].filters();


            if (Object.keys(data_dict[div]).indexOf('grp_n')==-1){
                limited_grp = data_dict[div]['grp']
            }
            else{
                limited_grp = data_dict[div]['grp_n']
            }

            //Add to Keywords Group if not already there
            if (limited_grp.all().filter(function(e){return e.key==selected_keyword}).length==0){
                limited_grp = group_append(limited_grp,{'key':selected_keyword,'value':selected_value})}




            data_dict[div]['row_chart'].group(limited_grp).filter(d3.select(this).property('id').replace('detail-',''))
            dc.redrawAll()
        })
        return data_dict
    }*/

}