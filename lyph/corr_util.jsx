function getAllCorrelations( ) {
  $.ajax({
    "url": "http://open-physiology.org:5055/all_correlations/",
    "dataType": "jsonp",
    "success": function(result) {
      var correlations = (
        <ListGroup>
        { result.map( function(object, i) {
          return (
            <Correlation
              id={object["id"]}
              key={object["id"]}
              pubmed={object["pubmed"]["id"]}
              comment={object["comment"]}
              variables={object["variables"]}
            />
          );
        })}
        </ListGroup>
      );

      React.render( correlations, document.getElementById('corrlist') );
    }
  });
}

function getAllClindices( ) {
  $.ajax({
    "url": "http://open-physiology.org:5055/all_clinical_indices/",
    "dataType": "jsonp",
    "success": function(result) {
      var clindices = (
        <ListGroup>
        {
          result['results'].map( function( object, i ) {
            return <ClindexInList data={object} />
          })
        }
        </ListGroup>
      );

      React.render( clindices, document.getElementById('clindexlist') );
    }
  });
}
