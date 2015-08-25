$(function() {
    $( ".lyphsearchinput" ).autocomplete({
        source: function( request, response ) {
            var serachPrefix = "";
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
                        if (data[i].name === null) continue;

                        var combinedlabel =data[i].id + " - " + data[i].name.toTitleCase();
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

function append_lyph( id )
{
  var annot_lyphs = document.getElementsByClassName("annot_lyphs")[0];
  var variables = annot_lyphs.value.trim();

  if ( has_open_paren( variables ) )
  {
    if ( endsWith( variables, "," ) )
      variables += " " + id;
    else
      variables += ", " + id;

    annot_lyphs.value = variables;
    return;
  }

  if ( variables.length === 0 )
  {
    annot_lyphs.value = "??? of " + id;
    return;
  }

  if ( endsWith( variables, "," ) )
  {
    annot_lyphs.value = variables + " ??? of " + id;
    return;
  }

  if ( endsWith( variables, "of" ) )
  {
    annot_lyphs.value = variables + " " + id;
    return;
  }

  annot_lyphs.value = variables + " of " + id; 
}
