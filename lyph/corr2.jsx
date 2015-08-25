var Grid = ReactBootstrap.Grid;
var Row = ReactBootstrap.Row;
var Col = ReactBootstrap.Col;
var Button = ReactBootstrap.Button;
var Well = ReactBootstrap.Well;
var TabbedArea = ReactBootstrap.TabbedArea;
var TabPane = ReactBootstrap.TabPane;
var PageHeader = ReactBootstrap.PageHeader;
var Panel = ReactBootstrap.Panel;
var Input = ReactBootstrap.Input;
var ButtonInput = ReactBootstrap.ButtonInput;

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
      <p>Correlation list goes here</p>
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
  $('.panel').css({height: '100vh', "margin-bottom": 0});
});
