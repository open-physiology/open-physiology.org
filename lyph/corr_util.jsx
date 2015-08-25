function getAllCorrelations( ) {
  $.ajax({
    "url": "http://open-physiology.org:5055/all_correlations/",
    "dataType": "jsonp",
    "success": function(result) {
      var correlations = (
        <Table bordered condensed hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Variables</th>
              <th>Pubmed</th>
              <th>Comment?</th>
            </tr>
          </thead>
          <tbody>
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
          </tbody>
        </Table>
      );

      React.render( correlations, document.getElementById("corrlist") );
    }
  });
}
