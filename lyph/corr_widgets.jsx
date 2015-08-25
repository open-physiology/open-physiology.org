var Correlation = React.createClass({
  propTypes: {
    "id": React.PropTypes.string.isRequired,
    "variables": React.PropTypes.array.isRequired,
    "pubmed": React.PropTypes.string.isRequired,
    "comment": React.PropTypes.string
  },
  render: function() {
    return (
      <tr>
        <td>{this.props.id}</td>
        <td>
          <ListGroup>
            {
              this.props.variables.map( function( object, i )
              {
                return (
                  <Variable
                    type = {object["type"]}
                    clindex = {object["clindex"]}
                    clindexLabel = {object["clindex label"]}
                    quality = {object["quality"]}
                    location = {object["location"]}
                    locationName = {object["location name"]}
                  />
                );
              })
            }
          </ListGroup>
        </td>
        <td>{this.props.pubmed}</td>
        <td>...comment...</td>
      </tr>
    );
  }
});

var Clindex = React.createClass({
  propTypes: {
    "id": React.PropTypes.string.isRequired,
    "label": React.PropTypes.string.isRequired
  },
  render: function() {
    return (
      <span>
        {this.props.label}<Badge>{this.props.id}</Badge>
      </span>
    );
  }
});

var LocatedMeasure = React.createClass({
  propTypes: {
    "quality": React.PropTypes.string.isRequired,
    "location": React.PropTypes.string.isRequired,
    "locname": React.PropTypes.string.isRequired
  },
  render: function() {
    return (
      <span>
        {this.props.quality} of {this.props.locname}<Badge>{this.props.location}</Badge>
      </span>
    );
  }
});

var Variable = React.createClass({
  propTypes: {
    "type": React.PropTypes.string.isRequired,
    "clindex": React.PropTypes.string,
    "clindexLabel": React.PropTypes.string,
    "quality": React.PropTypes.string,
    "location": React.PropTypes.string,
    "locationName": React.PropTypes.string
  },
  render: function() {
    var lgi;

    if ( this.props.type === "clinical index" ) {
      lgi = <Clindex id={this.props.clindex} label={this.props.clindexLabel} />
    }
    else {
      lgi = <LocatedMeasure quality={this.props.quality} location={this.props.location} locname={this.props.locationName} />
    }

    return <ListGroupItem>{lgi}</ListGroupItem>
  }
});
