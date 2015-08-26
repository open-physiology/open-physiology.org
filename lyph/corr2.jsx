var rbs = ReactBootstrap;
var Grid = rbs.Grid;
var Row = rbs.Row;
var Col = rbs.Col;
var Button = rbs.Button;
var Well = rbs.Well;
var TabbedArea = rbs.TabbedArea;
var TabPane = rbs.TabPane;
var PageHeader = rbs.PageHeader;
var Panel = rbs.Panel;
var Popover = rbs.Popover;
var Input = rbs.Input;
var ButtonInput = rbs.ButtonInput;
var Tooltip = rbs.Tooltip;
var Table = rbs.Table;
var ListGroup = rbs.ListGroup;
var ListGroupItem = rbs.ListGroupItem;
var Label = rbs.Label;
var Badge = rbs.Badge;
var OverlayTrigger = rbs.OverlayTrigger;
var Jumbotron = rbs.Jumbotron;

var CorrelationEditForm = React.createClass({
  clicked: function(e){
    var id = this.refs.idbox;
    var pbmd = this.refs.pbmd;
    var vars = this.refs.vars;
    var cmnt = this.refs.cmnt;

    if ( pbmd.getValue().trim() === '' ) {
      alert('Please enter a pubmed ID');
      return;
    }

    if ( vars.getValue().trim() === '' ) {
      alert('Please list at least one variable for the correlation')
      return;
    }

    var url = 'http://open-physiology.org:5055/makecorrelation/';
    url += '?pubmed='+encodeURIComponent(pbmd.getValue().trim());

    if ( cmnt.getValue().trim() !== '' ) {
      url += '&comment='+encodeURIComponent(cmnt.getValue().trim());
    }

    var elim_linebreaks = vars.getValue().trim().replace(/\n/g, " ");
    var varsstr = elim_linebreaks.split(",").map(function(currentValue,index,array){
      return currentValue.trim();
    }).join(",");

    url += '&vars=' + encodeURIComponent(varsstr);

    if ( this.props.embedded )
      url += '&id=' + encodeURIComponent(id.getValue().trim());

    var that=this;

    $.ajax({
      "url": url,
      "dataType": "jsonp",
      "success": function(){
        getAllCorrelations();

        if ( !that.props.embedded )
          $('.corrEditField').val('');
        else
          that.props.inside.setState({'editing': false});
      }
    });
  },
  render: function(){
    var initId, initVars, initPbmd, initCmnt, classnm, varclassnm, footer, btnTxt;

    if ( this.props.embedded )
    {
      initId = this.props.id;
      initVars = this.props.variables;
      initPbmd = this.props.pubmed;
      initCmnt = this.props.comment !== null ? this.props.comment : '';
      btnTxt = 'Edit';
      classnm = 'EmbeddedField';
      varclassnm = 'EmbeddedField';
      footer = <div></div>;

      initVars = '';
      var fFirst = false;
      for ( var key in this.props.variables )
      {
        var val = this.props.variables[key];

        if ( fFirst )
          initVars += ',';
        else
          fFirst = true;

        if ( val.type === 'located measure' )
          initVars += val['quality'] + ' of ' + val['location'];
        else
          initVars += val['clindex'];
      }
    }
    else
    {
      initId = 'New';
      initVars = '';
      initPbmd = '';
      initCmnt = '';
      btnTxt = 'Create';
      classnm = 'corrEditField';
      varclassnm = 'annot_lyphs corrEditField';
      footer = <div>&raquo; <a href='http://open-physiology.org:5055/get_csv/?what=correlations'>Get correlations.csv</a></div>
    }

    return(
      <div>
        <Input disabled ref='idbox' type='text' label='Correlation ID' bsSize='large' className={classnm} defaultValue={initId}/>
        <Input ref='pbmd' type='text' label='Pubmed ID' className={classnm} defaultValue={initPbmd}/>
        <Input ref='vars' type='textarea' label='Variables (comma-separated)' className={varclassnm} defaultValue={initVars}/>
        <Input ref='cmnt' label='Comment' type='textarea' className={classnm} defaultValue={initCmnt}/>
        <ButtonInput value={btnTxt} block onClick={this.clicked}/>
        {footer}
      </div>
    );
  }
});

var CorrelationList = React.createClass({
  render:function() {
    return(
      <div id='corrlist' />
    );
  }
});

var ClindexList = React.createClass({
  render:function() {
    return(
      <div id='clindexlist' />
    );
  }
});

var LeftSide = React.createClass({
  render: function(){
    return(
      <Panel header={<h1>Correlation Maker</h1>} bsStyle='primary'>
        <CorrelationEditForm embedded={false}/>
      </Panel>
    );
  }
});

var RightSide = React.createClass({
  searchClicked: function(e){
    var srch=this.refs.theInput.getValue().trim();

    if ( srch === '' )
      return;

    var url = "http://open-physiology.org:5055/lyphs_by_prefix/?prefix=";
    url += encodeURIComponent( srch );

    $.ajax({
      "url": url,
      "dataType": "jsonp",
      "success": this.refs.results.gotResults        
    });
  },
  render: function(){
    return(
      <Panel header={<h2>Tools</h2>} bsStyle='info'>
        <TabbedArea defaultActiveKey={1}>
          <TabPane eventKey={1} tab='LyphSearch'>
            <Input className='lyphsearchinput' ref='theInput' type='text' bsSize='large' label='Search lyphs' />
            <Button block onClick={this.searchClicked}>Search</Button>
            <LyphSearchResults ref='results'/>
          </TabPane>
          <TabPane eventKey={2} tab='Clindices'>
            <Input type='text' label='Clindex ID (blank = new)' bsSize='large' />
            <Input type='text' label='Label'/>
            <Input type='text' label='Pubmed IDs (optional)'/>
            <Input type='text' label='Parent IDs (blank = no parents)'/>
            <Button block onClick={this.clindexClicked}>Edit/Create</Button>
            <ClindexList/>
          </TabPane>
        </TabbedArea>
      </Panel>
    );
  }
});

var MiddleSide = React.createClass({
  render: function(){
    return(
      <Panel header={<h2>Correlations</h2>} bsStyle='info'>
        <CorrelationList />
      </Panel>
    );
  }
});

var MainContent = React.createClass({
  render: function(){
    return(
      <Grid fluid={true}>
        <Row>
          <Col lg={3}>
            <LeftSide />
          </Col>
          <Col lg={6}>
            <MiddleSide />
          </Col>
          <Col lg={3}>
            <RightSide />
          </Col>
        </Row>
      </Grid>
    );
  }
});


var LyphSearchResults = React.createClass({
  gotResults: function(results) {
    this.setState({'results': results});
  },
  getInitialState: function() {
    return {'results': null};
  },
  render: function() {
    if ( this.state.results === null || this.state.results.length === 0 )
      return (<div />);

    if ( this.state.results.length === 0 ) {
      return (
        <Panel bsStyle='danger' header='No results'>
          No lyphs matched your search.
        </Panel>
      );
    }

    return (
      <div>
      {
        this.state.results.map( function( object, i )
        {
          return (
            <Lyph data={object} />
          );
        })
      }
      </div>
    );
  }
});

//React.render(mainPage, document.getElementById("main"));
React.render(<MainContent/>, document.getElementById("main"));
//React.render(<mainPage/>, document.getElementById("main"));

$(function(){
  $('.panel').css({height: '100vh', "margin-bottom": 0, "overflow": "auto"});

  getAllCorrelations();
  getAllClindices();
});
