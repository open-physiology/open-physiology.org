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
var Input = rbs.Input;
var ButtonInput = rbs.ButtonInput;
var Tooltip = rbs.Tooltip;
var Table = rbs.Table;
var ListGroup = rbs.ListGroup;
var ListGroupItem = rbs.ListGroupItem;
var Label = rbs.Label;
var Badge = rbs.Badge;
var OverlayTrigger = rbs.OverlayTrigger;

var CorrelationEditForm = React.createClass({
  render: function(){
    return(
      <div>
        <Input type='text' label='Correlation ID (blank ID = new correlation)' bsSize='large'/>
        <Input type='text' label='Pubmed ID' />
        <Input type='textarea' label='Variables (comma-separated)' />
        <Input type='textarea' label='Comment' />
        <ButtonInput value='Annotate' block />
        &raquo; <a href='http://open-physiology.org:5055/get_csv/?what=correlations'>Get correlations.csv</a>
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

var LeftSide = React.createClass({
  render: function(){
    return(
      <Panel header={<h1>Correlation Editor</h1>} bsStyle='primary'>
        <CorrelationEditForm />
      </Panel>
    );
  }
});

var RightSide = React.createClass({
  render:function(){
    return(
      <Panel header={<h2>Tools</h2>} bsStyle='info'>
        <TabbedArea defaultActiveKey={1}>
          <TabPane eventKey={1} tab='LyphSearch'>Contents of Tab1</TabPane>
          <TabPane eventKey={2} tab='Clindices'>Contents of Tab2</TabPane>
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
          <Col lg={4}>
            <LeftSide />
          </Col>
          <Col lg={5}>
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

//React.render(mainPage, document.getElementById("main"));
React.render(<MainContent/>, document.getElementById("main"));
//React.render(<mainPage/>, document.getElementById("main"));

$(function(){
  $('.panel').css({height: '100vh', "margin-bottom": 0, "overflow": "auto"});

  getAllCorrelations();
});
