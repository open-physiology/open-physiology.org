var Correlation = React.createClass({
  propTypes: {
    "id": React.PropTypes.string.isRequired,
    "variables": React.PropTypes.array.isRequired,
    "pubmed": React.PropTypes.string.isRequired,
    "comment": React.PropTypes.string
  },
  getInitialState: function() {
    return {
      "commentOpen": false,
      "editing": false
    };
  },
  openCommentBox: function(e) {
    this.setState({'commentOpen': true});
  },
  closeCommentBox: function(e) {
    this.setState({'commentOpen': false});
  },
  startEditing: function(e) {
    this.setState({'editing': true, 'commentOpen': false});
  },
  render: function() {
    var header = <span>Correlation {this.props.id} <small>(Pubmed ID: {this.props.pubmed})</small></span>;
    var commentbox;

    if ( this.props.hasOwnProperty("comment") && this.props.comment !== null )
    {
      if ( this.state.commentOpen )
        commentbox = (
          <Jumbotron>
            <h3>Comment:</h3>
            <p>{this.props.comment}</p>
            <span>&raquo; <a href='javascript:void(0)' onClick={this.closeCommentBox}>Hide comment</a></span>
          </Jumbotron>
        );
      else
        commentbox = <span>&raquo; <a href='javascript:void(0)' onClick={this.openCommentBox}>Show Comment</a></span>
    }
    else
      commentbox = <span>&raquo; No comment</span>

    var editlink = (
      <span>
        &raquo;
        <a
          href='javascript:void(0)'
          onClick={this.startEditing}
        >Edit</a>
      </span>
    );

    var editbox;
    if ( this.state.editing )
      editbox = <CorrelationEditForm embedded={true} inside={this} id={this.props.id} variables={this.props.variables} pubmed={this.props.pubmed} comment={this.props.comment} />
    else
      editbox = <div></div>

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
        <div>{commentbox} {editlink}</div>
        {editbox}
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
    return (<span>{this.props.quality} of {this.props.locname} <small>(Lyph {this.props.location})</small></span>);
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

var Lyph = React.createClass({
  render: function()
  {
    return (
      <Panel bsStyle='success' header={this.props.data.name}>
        <Table condensed striped>
          <tbody>
            <tr>
              <td>Lyph ID</td>
              <td>{this.props.data.id}</td>
            </tr>
            <tr>
              <td>FMA ID</td>
              <td>{this.props.data.fma !== null ? this.props.data.fma : 'None'}</td>
            </tr>
            <tr>
              <td>Species</td>
              <td>{this.props.data.species}</td>
            </tr>
          </tbody>
        </Table>
      </Panel>
    );
  }
});

var ClindexInList = React.createClass({
  populate: function() {
    $('.clindexfieldid').val(this.props.data.index);
    $('.clindexfieldlabel').val(this.props.data.label);

    if ( this.props.data.pubmeds.length === 0 )
      $('.clindexfieldpbmd').val('');
    else
      $('.clindexfieldpbmd').val(this.props.data.pubmeds.join(',');

    return false;
  },
  render: function() {
    return (
      <Panel bsStyle='info' header={this.props.data.index}>
        <div>
          {this.props.data.label}
        </div>
        <ul>
          <li>Pubmeds: {this.props.data.pubmeds.length === 0 ? 'None' : this.props.data.pubmeds.join(', ')}</li>
          <li>Parents: {this.props.data.parents.length === 0 ? 'None' : JSON.stringify(this.props.data.parents,null,2)}</li>
          <li>Corr. Count: {this.props.data['correlation count']}</li>
        </ul>
        <span>
          &raquo <a href='javascript:void(0)' onclick={this.populate}>Populate Editor</a>
        </span>
      </Panel>
    );
  }
});
