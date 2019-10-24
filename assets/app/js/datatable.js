/*!
 * Dissertation_Explorer v1.0.0
 * Author - Robbie Fraleigh, PhD - The Pennsylvania State University
 * Licensed under Apache v2 (https://www.apache.org/licenses/LICENSE-2.0)
 */
function textfield__link(d,text){
    var dissertation_id =d['header_link'].split('/')[2]
            text += "<span style='font-size:16px;'>" +
                    "<a data-featherlight='#mylightbox' class='modal_link' id='document-"+dissertation_id+"' href='#' >Read More</a>" +
                    "</span><br><br>"
            text += "<span style='font-size:16px;'>" +
                    "<a href='"+d['base_url']+d['header_link']+"' >PSU ETD Page</a>" +
                    "</span><br><br>"
            text += "<span style='font-size:16px;'>" +
                    "<a href='"+d['base_url']+d['meta_link']+"' >Full Text</a>" +
                    "</span>"
    return text;
}
function textfield__author(d,text){
    text += "<span style='font-size:14px;font-weight: bold; '>"+d['meta_author']+"</span><br>"

    if (typeof d['year']!= "undefined") {
        text += "<span style='font-size:14px;font-weight: normal; '>"+d['detail_degree_description']+": " + d['detail_defense_date'] + "</span><br>"
    }

    // text += "<button type='button' class='btn btn-sm btn-outline-primary' " +
    //             "style='font-size:14px;color:black;'>Details</button>\n"
    text += "<a target='_blank' rel='noopener noreferrer' href='"+d['base_url']+d['meta_link']+"' class='btn btn-sm btn-outline-primary' style='font-size:14px;color:black;'>Full Text</a><br><br>"

    d['meta_committee'].forEach(function(person){
        var font_weight = 'normal'
        if (person.indexOf('Advisor')!==-1){
            font_weight = 'bold'
        }
        text += "<span style='font-size:12px;font-weight: "+font_weight+"; '>"+person+"</span><br>"

    });
    text+="<br>"
    d['meta_keywords'].forEach(function(keyword){
        text += "<button type='button' id='detail-"+keyword+"' class='btn btn-sm btn-primary detail-keyword' " +
                "style='font-size:12px;color:white;margin-bottom:5px;'>"+
                toTitleCase(keyword)+
                "</button>\n"
    })
    return text
}
function textfield__keywords(d,text){
    d['meta_keywords'].forEach(function(keyword){
        text += "<button type='button' class='btn btn-sm btn-primary' " +
                "style='font-size:10px;color:white;'>"+
                toTitleCase(keyword)+
                "</button>\n"
    })

    return text
}

function textfield__content(d,text){
    var title = d['header_title']
    text += "<span style='font-size:12px;font-weight: bold; '>"+title+"</span><br>"

    var abstract = d['detail_abstract']

    var description = abstract;
    var highlighted = d['meta_keywords']
            description = replaceAll(description,'\n','<br>')
            // highlighted.forEach(function(keyword){
            //     description = replaceAll(description,keyword,'<mark style="background-color: #FFFF00; font-weight:bold; padding-top:0px;padding-bottom:0px;">'+keyword+'</mark>')
            //     description = replaceAll(description,toTitleCase(keyword),'<mark style="background-color: #FFFF00; font-weight:bold; padding-top:0px;padding-bottom:0px;">'+toTitleCase(keyword)+'</mark>')
            // })
    text += "<p id='description_column' class='reduced' style='font-size:12px;line-height:14px;max-height:400px;'>" +
                description
                "</p>\n"
    return text
}
function update_datatable(dataTable, table_div,crossfilt, datatable_fields,filter_dim,sort_by,highlighted,concept_list){

    // Layout and Inspiration from
    // https://github.com/HamsterHuey/intothevoid.io/blob/master/code/2017/dcjs%20sortable%20table/dcjsSortableTable.html
    // https://github.com/dc-js/dc.js/blob/master/web/examples/table-pagination.html

    //Initialize DataTable
    // var dataTable = dc.dataTable("."+table_div);
    var tableOffset = 0;
    var tablePageSize = 10;

    // Create generating functions for each columns
    function toBaseURL(fullURL){
        return fullURL.replace(/(http(s)?:\/\/)|(\/.*){1}/g, '');
    }
    var columnFunctions = new Array(datatable_fields.length);
    datatable_fields.forEach(function(field,i){
        columnFunctions.splice(i,0,function(d) {
        var text = "";
        if (field['field_name']==='link'){
            text = textfield__link(d,text)
        }
        else if (field['field_name']==='author-program'){
            text = textfield__author(d,text)
        }
        else if (field['field_name']==='keywords'){
            text = textfield__keywords(d,text)
        }
        else if (field['field_name']==='content'){
            text = textfield__content(d,text)
        }

        else{
            text += d[field['field_name']]
        }

        return text
        })
    })  ;

    // Pagination implementation inspired by:
    // https://github.com/dc-js/dc.js/blob/master/web/examples/table-pagination.html
    dataTable
      .width($('div#table-graph').width())
      .height($('div#table-graph').height())
      .dimension(filter_dim)
      .group(function(d) { return "Dummy"}) // Must pass in. Ignored since .showGroups(false)
      .size(Infinity)
      .columns(columnFunctions)
      .showGroups(false)
      .sortBy(function(d){ return d[sort_by]; }) // Initially sort by max_conf column
      .order(d3.descending);
    updateTable();

     d3.selectAll('input#Next').on('click',nextPage);
     d3.selectAll('input#Prev').on('click',prevPage);

    // Programmatically insert header labels for table
    var tableHeader = d3.select("#dc-table-graph .table-header")
      .selectAll("th");

    // Bind data to tableHeader selection.
    tableHeader = tableHeader.data(
      datatable_fields
    );
    // enter() into virtual selection and create new <th> header elements for each table column
    tableHeader = tableHeader.enter()
      .append("th")
        .attr('class',function(d){return d.field_name})
        .style('width',function(d){
            if (d.field_name==='link'){return '150px'}
            else if (d.field_name==='author'){return '250px'}
            else if (d.field_name==='content'){return '350px'}

            else{return '150px'}
        })
        .text(function (d) { return d.label; }) // Accessor function for header titles
        .on("click", tableHeaderCallback);

    // Initialize sort state and sort icon on one of the header columns
    // Highlight "Max Conf" cell on page load
    // This can be done programmatically for user specified column
    tableHeader.filter(function(d) { return d.label === sort_by; })
        .classed("info", true);
    var tableSpans = tableHeader
        .append("span") // For Sort glyphicon on active table headers
        .classed("glyphicon glyphicon-sort-by-attributes-alt", true)
        .style("visibility", "hidden")
        .filter(function(d) { return d.label === sort_by; })
        .style("visibility", "visible")


    dataTable.redraw();


     // updateTable calculates correct start and end indices for current page view
      // it slices and pulls appropriate date for current page from dataTable object
      // Finally, it updates the pagination button states depending on if more records
      // are available
      function updateTable() {
        // Ensure Prev/Next bounds are correct, especially after filters applied to dc charts
        var totFilteredRecs = crossfilt.groupAll().value();
        // Adjust values of start and end record numbers for edge cases
        var end = tableOffset + tablePageSize > totFilteredRecs ? totFilteredRecs : tableOffset + tablePageSize;
        tableOffset = tableOffset >= totFilteredRecs ? Math.floor((totFilteredRecs - 1) / tablePageSize) * tablePageSize : tableOffset;
        tableOffset = tableOffset < 0 ? 0 : tableOffset; // In case of zero entries
        // Grab data for current page from the dataTable object
        dataTable.beginSlice(tableOffset);
        dataTable.endSlice(tableOffset + tablePageSize);
        // Update Table paging buttons and footer text
        d3.select('span#begin')
            .text(end === 0 ? tableOffset : tableOffset + 1); // Correct for "Showing 1 of 0" bug
        d3.select('span#end')
            .text(end);
        d3.select('#Prev.btn')
            .attr('disabled', tableOffset - tablePageSize < 0 ? 'true' : null);
        d3.select('#Next.btn')
            .attr('disabled', tableOffset + tablePageSize >= totFilteredRecs ? 'true' : null);
        d3.select('span#size').text(totFilteredRecs);
        dataTable.redraw();
      }
      // Callback function for clicking "Next" page button
      function nextPage() {
          tableOffset += tablePageSize;
          updateTable();
      }
      // Callback function for clicking "Prev" page button
      function prevPage() {
          tableOffset -= tablePageSize;
          updateTable();
      }
    function tableHeaderCallback(d) {
      // Highlight column header being sorted and show bootstrap glyphicon
      var activeClass = "info";
      d3.selectAll("#dc-table-graph th") // Disable all highlighting and icons
          .classed(activeClass, false)
        .selectAll("span")
          .style("visibility", "hidden"); // Hide glyphicon
      var activeSpan = d3.select(this) // Enable active highlight and icon for active column for sorting
          .classed(activeClass, true)  // Set bootstrap "info" class on active header for highlight
        .select("span")
          .style("visibility", "visible");
      // Toggle sort order state to user desired state
      d.sort_state = d.sort_state === "ascending" ? "descending" : "ascending";
      var isAscendingOrder = d.sort_state === "ascending";
      dataTable
        .order(isAscendingOrder ? d3.ascending : d3.descending)
        .sortBy(function(datum) { return datum[d.field_name]; });
      // Reset glyph icon for all other headers and update this headers icon
      activeSpan.node().className = ''; // Remove all glyphicon classes
      // Toggle glyphicon based on ascending/descending sort_state

        console.log('Active Span', activeClass)
      activeSpan.classed(
        isAscendingOrder ? "glyphicon glyphicon-sort-by-attributes" :
          "glyphicon glyphicon-sort-by-attributes-alt", true);
      updateTable();
      dataTable.redraw();
    }

    return dataTable

}



