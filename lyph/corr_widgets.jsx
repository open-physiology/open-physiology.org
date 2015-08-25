const TextWithTooltip = React.createClass({
  render() {
    var tooltip = <Tooltip placement='top'>{this.props.tooltip}</Tooltip>;

    return (
      <OverlayTrigger overlay={tooltip} delayShow={30} delayHide={60}>
        <span>{this.props.children}</span>
      </OverlayTrigger>
    );
  }
});

var Correlation = React.createClass({
  propTypes: {
    "id": React.PropTypes.string.isRequired,
    "variables": React.PropTypes.array.isRequired,
    "pubmed": React.PropTypes.string.isRequired,
    "comment": React.PropTypes.string
  },
  render: function() {
    var header = <span>Correlation {this.props.id} <small>(Pubmed ID: {this.props.pubmed})</small></span>;

    return (
      <Panel header={header}>
        <ul>
        {
          this.props.variables.map( function( object, i ) {
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
        </ul>  
      </Panel>
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
        Clindex {this.props.id}: {this.props.label}
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
    return (<TextWithTooltip tooltip={'Lyph '+this.props.location}>{this.props.locname}</TextWithTooltip>);
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

    return <li>{lgi}</li>;
  }
});
