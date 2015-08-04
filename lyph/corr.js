  var rightdivstate = "lyphsearch";

  function reset_inputs()
  {
    g("annot_pubmed").value="";
    g("annot_lyphs").value="";
    g("edit_id").value="";
    g("commentbox").value="";
  }

  function lyphsearch()
  {
    var srch = g("lyphsearch").value.trim();
    if ( srch === "" )
      return;
    var url = "http://open-physiology.org:5055/lyphs_by_prefix/?prefix=";
    url += encodeURIComponent( srch );

    $.ajax(
    {
      "url": url,
      "dataType": "jsonp",
      "success": function(result)
      {
        if ( result.hasOwnProperty("Error") )
        {
          alert("Error: " + result["Error"]);
          return;
        }

        var html = "";
        for ( var i = 0; i < result.length; i++ )
        {
          html += "<h4>ID: " + result[i]["id"] + "</h4>";
          if ( result[i]["name"] !== null )
            html += "<span>" + recase(result[i]["name"]) + "</span>" + "<br>";
          if ( result[i]["template"] !== null )
          {
            html += "<span>Template: " + result[i]["template"]["id"];
            if ( result[i]["template"]["name"] !== null )
              html += " (" + recase(result[i]["template"]["name"]) + ")";

            html += "</span>"
          }
          html += "</id>";
        }
        g("searchresults").innerHTML = html;
        g("lyphsearch").value="";
      }
    });
  }

  function annotate()
  {
    var pubmedbox = g("annot_pubmed");
    var lyphsbox = g("annot_lyphs");
    var editidbox = g("edit_id");
    var commentbox = g("commentbox");

    if ( pubmedbox.value.trim() === "" )
    {
      alert("Please indicate a Pubmed ID");
      return;
    }

    if ( lyphsbox.value.trim() === "" )
    {
      alert("Please indicate a comma-separated list of lyphs");
      return;
    }

    var url = "http://open-physiology.org:5055/makecorrelation/";
    url += "?pubmed=" + encodeURIComponent(pubmedbox.value.trim());

    if ( commentbox.value.trim() !== "" )
      url += "&comment=" + encodeURIComponent(commentbox.value.trim());

    var elim_linebreaks = lyphsbox.value.replace(/\n/g, " ");

    var lyphsstr = elim_linebreaks.split(",").map(function(currentValue,index,array)
    {
      return currentValue.trim();
    }).join(",");

    url += "&vars=" + encodeURIComponent(lyphsstr);

    var editid = editidbox.value.trim();

    if ( editid !== "" )
      url += "&id=" + encodeURIComponent(editid);

    $.ajax(
    {
      "url": url,
      "dataType": "jsonp",
      "success": function(result)
      {
        if ( result.hasOwnProperty("Error") )
        {
          alert("Error: " + result["Error"]);
          return;
        }

        if ( editid !== "" )
          get_all_correlations();
        else
        {
          var html = bulk_annot_to_html(result);
          g("bulk_annot_list").innerHTML = html + "<br>" + g("bulk_annot_list").innerHTML;
        }

        reset_inputs();
      }
    });
  }

  function g(x){ return document.getElementById(x); }

  function get_all_correlations( )
  {
    $.ajax(
    {
      "url": "http://open-physiology.org:5055/all_correlations/",
      "success": function(result)
      {
        var annotlist = "";
        
        for ( var i = 0; i < result.length; i++ )
          annotlist += bulk_annot_to_html( result[i] ) + "<br>";
        
        document.getElementById("bulk_annot_list").innerHTML = annotlist;
      },
      "dataType": "jsonp"
    });
  }

  $(function()
  {
    get_all_correlations();
    get_clindices();
  });

  function variable_to_html( x )
  {
    if ( x["type"] === "clinical index" )
    {
      if ( x["clindex"] === x["clindex label"] )
        return x["clindex"];
      else
        return x["clindex label"] + " (" + x["clindex"] + ")";
    }
    else if ( x["type"] === "located measure" )
    {
      var retval = recase(x["quality"]) + " of ";

      if ( x["location name"] !== null && x["location name"].trim() !== "" )
        retval += recase(x["location name"]);
      else
        retval += "Lyph " + x["location"];

      return retval;
    }
    return "(Unknown?)";
  }

  function edit_correlation( corr_id, corr_pubmed, corr_comment, corr_vars )
  {
    g("edit_id").value = corr_id;
    g("annot_pubmed").value = corr_pubmed;
    g("annot_lyphs").value = corr_vars;
    g("commentbox").innerHTML = corr_comment;
  }

  function edit_correlation_link( x )
  {
    var retval = "edit_correlation(\"";
    retval += x["id"] + "\",\"";
    retval += x["pubmed"]["id"] + "\",\"";
    retval += (x["comment"]!==null ? escape_html(escape_html(x["comment"])) : "") + "\",\"";

    for ( var i = 0; i < x["variables"].length; i++ )
    {
      if ( i > 0 )
        retval += ",";

      if ( x["variables"][i]["type"] === "clinical index" )
        retval += x["variables"][i]["clindex"];
      else
        retval += x["variables"][i]["quality"] + " of " + x["variables"][i]["location"];
    }

    retval += "\")";

    return retval;
  }

  function bulk_annot_to_html( x )
  {
    var retval = "";
    retval += "<div>";
    retval += "<h4 style='margin-left:10px'>Correlation " + x["id"];
    
    retval += " (PMID: " + x["pubmed"]["id"] + ")</h4>";

    if ( x["comment"] === null )
      retval += "(No Comment) ";
    else
      retval += "(<a href='javascript:void(0)' onclick='show_comment(\"" + x["id"] + "\")'>Show Comment</a>) ";

    retval += "(<a onclick='" + edit_correlation_link(x) + "' href='javascript:void(0)'>Edit</a>) ";
    retval += "(<a onclick='delete_correlation(" + x["id"] + ")' href='javascript:void(0)'>Delete</a>)";

    if ( x["comment"] !== null )
      retval += "<div id='comment" + x["id"] + "' style='display:none;background:#CCEBFF'>" + escape_html(x["comment"]) + "</div>";

    retval += "<ul>";
    var valind;
    for ( valind = 0; valind < x["variables"].length; valind++ )
      retval += "<li>"+variable_to_html(x["variables"][valind])+"</li>";
    retval += "</ul>";

    retval += "</div>";
    return retval;
  }

  function show_comment( id )
  {
    $('#comment' + id).show(250);
  }

  function escape_html( str )
  {
    return $('<div>').text(str).html();
  }

  function delete_correlation( id )
  {
    $.ajax(
    {
      dataType: "jsonp",
      url: "http://open-physiology.org:5055/delete_correlation/?corr="+id,
      success: function( data )
      {
        get_all_correlations();
      }
    });

    return false;
  }

  $(function() {

    $( "#lyphsearch" ).autocomplete({
        source: function( request, response ) {
            var serachPrefix = "";
//                console.log(request.term.split(" - ")[1]);
            if (request.term.indexOf(" - ") > -1)
                serachPrefix  =request.term.split(" - ")[1];
            else
                serachPrefix  = request.term
            $.ajax({
                url: "http://open-physiology.org:5055/lyphs_by_prefix/?prefix=" + serachPrefix ,
                dataType: "jsonp",
                data: {
                    q: request.term
                },
                success: function( data ) {

                    var returnedLyphs = [];

                    for (var i =0; i < data.length; i ++) {
                        var combinedlabel =data[i].id + " - " + recase(data[i].name);
                        returnedLyphs.push({label:combinedlabel, id:data[i].id});

                    }

                    response(returnedLyphs);
                }
            });
        },
        minLength: 0,
        select: function( event, ui ) {
            append_lyph( ui.item.id );
    },
        open: function() {
            $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
        },
        close: function() {
            $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
        }
    });
});

function endsWith( string, suffix )
{
  return string.indexOf(suffix, string.length - suffix.length) !== -1;
}

function append_lyph( id )
{
  var variables = g("annot_lyphs").value.trim();

  if ( has_open_paren( variables ) )
  {
    if ( endsWith( variables, "," ) )
      variables += " " + id;
    else
      variables += ", " + id;

    g("annot_lyphs").value = variables;
    return;
  }

  if ( variables.length === 0 )
  {
    g("annot_lyphs").value = "??? of " + id;
    return;
  }

  if ( endsWith( variables, "," ) )
  {
    g("annot_lyphs").value = variables + " ??? of " + id;
    return;
  }

  if ( endsWith( variables, "of" ) )
  {
    g("annot_lyphs").value = variables + " " + id;
    return;
  }

  g("annot_lyphs").value = variables + " of " + id; 
}

function recase( x )
{
  return x.toTitleCase();
}

function has_open_paren( x )
{
  var lparens = 0;

  for ( var i = 0; i < x.length; i++ )
  {
    if ( x.charAt(i) === '(' )
      lparens++;
    else if ( x.charAt(i) === ')' )
      lparens--;
  }

  return Boolean( lparens > 0 );
}

function switch_right_div()
{
  if ( rightdivstate === "lyphsearch" )
  {
    $('#rightdiv').css('display', 'none');
    $('#clindexdiv').css('display', 'block');
    rightdivstate = "clindex";
  }
  else
  {
    $('#rightdiv').css('display', 'block');
    $('#clindexdiv').css('display', 'none');
    rightdivstate = "lyphsearch";
  }
}

function clindexbutton()
{
  var labelbox = g("clindexlabelbox");
  var idbox = g("clindexidbox");
  var pubmedsbox = g("clindexpubmedsbox");
  var parentsbox = g("clindexparentsbox");

  if ( labelbox.value.trim() === "" )
    return;

  var url = "http://open-physiology.org:5055/";

  if ( idbox.value.trim() === "" )
    url += "make_clinical_index/?label=";
  else
    url += "edit_clinical_index/?label=";

  url += encodeURIComponent( labelbox.value.trim() );

  if ( pubmedsbox.value.trim() !== "" )
    url += "&pubmeds=" + encodeURIComponent( pubmedsbox.value.trim() );

  url += "&parents=" + encodeURIComponent( parentsbox.value.trim() );

  if ( idbox.value.trim() !== "" )
    url += "&index=" + encodeURIComponent( idbox.value.trim() );

  $.ajax(
  {
    "url": url,
    "dataType": "jsonp",
    "success": function(result)
    {
      if ( result.hasOwnProperty("Error") )
      {
        alert( "Error: " + result["Error"] );
        return;
      }

      labelbox.value = "";
      idbox.value = "";
      pubmedsbox.value = "";

      get_clindices();
    }
  });
}

function get_clindices()
{
  $.ajax(
  {
    "url": "http://open-physiology.org:5055/all_clinical_indices/",
    "dataType": "jsonp",
    "success": function(result)
    {
      var html = "";
      result = result["results"];

      for ( var i = 0; i < result.length; i++ )
        html += clindex_to_html( result[i] );

      g("clindices_list").innerHTML = html;
    }
  });
}

function clindex_to_html( ci )
{
  var html = "<h4>" + ci["index"] + "</h4>";
  html += "<span>" + escape_html(ci["label"]) + "</span>";

  if ( ci["pubmeds"].length !== 0 )
  {
    html += "<div>Pubmeds:<ul>";

    for ( var i = 0; i < ci["pubmeds"].length; i++ )
      html += "<li>" + escape_html( ci["pubmeds"][i] ) + "</li>";

    html += "</ul></div>";
  }

  if ( ci["parents"].length != 0 )
  {
    for ( var i = 0; i < ci["parents"].length; i++ )
      html += "<div>&raquo Child of " + ci["parents"][i] + "</div>"
  }

  return html;
}

function encodeHtmlEntity(str)
{
  var buf = [];
  for (var i=str.length-1;i>=0;i--) {
    buf.unshift(['&#', str[i].charCodeAt(), ';'].join(''));
  }
  return buf.join('');
};

