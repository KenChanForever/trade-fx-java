import React, { Component } from "react";
import { Row, Col, Table, Card, Tag, Progress } from "antd";
import { connect } from "react-redux";
import Header from "../components/header/Header";
import * as Actions from '../actions/TradeAction';
import SockJsClient from 'react-stomp';
const styles = {
  row: {
    padding: "15px",
    width: "100%",
  },
  titleStyle: {
    maxWidth: 400,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap"
  },
  actionButton: {
    marginRight: 5
  },
  ace: {
    height: "65vh"
  },
  antCard: {
    height: 920
  }
};

const PENDING = "PENDING";
const SUCCESS = "SUCCESS";
const FAILURE = "FAILURE";
class MainContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      tradeData: [],
      isViewerCopyButton: false,
      curRec: null,
      openAddDialog: false,
      editorContent: ""
    };
  }

  componentDidMount() {
    this.fetchList();
  }

  fetchList = () => {
    this.setState({
      loading: true,
    });
    this.props.dispatch(Actions.fetchAllTrades()).then(() => {
      this.setState({
        loading: false,
        tradeData: this.props.tradeData,
      });
    });
  };



  handleUpdateStatus = (vo) => {
    let { tradeData } = this.state;
    tradeData.forEach(trade => {
      // matched
      if (trade.id === vo.tradeId) {
        console.log("handleUpdateStatus");
        trade.status = vo.status;
        trade.progress = vo.progress;
      }
    });

    this.setState({
      tradeData,
    });
  };

  handleCreateTrade = (trade) => {

    console.log("handleCreateTrade");
    let { tradeData } = this.state;
    tradeData.unshift(trade);
    this.setState({
      tradeData,
    });
  };

  render() {
    const { curRec } = this.state;
    const columns = [
      {
        title: 'User Id',
        dataIndex: 'userId',
        key: 'userId',
        render: text => <a>{text}</a>,
      },
      {
        title: 'Currency From/To',
        key: 'currencyFrom/To',
        dataIndex: '',
        render: (text, rec) => (
            <span>
              <Tag color={"red"} key={rec.currencyFrom}>
                  {rec.currencyFrom.toUpperCase()}
              </Tag>
              /
              <Tag color={"green"} key={rec.currencyTo}>
                  {rec.currencyTo.toUpperCase()}
              </Tag>
            </span>
        )
      },
      {
        title: 'Selling/Buying(Amt)/Rate',
        dataIndex: '',
        key: 'Selling/Buying(Amt)/Rate',
        render: (text, rec) => (
            <span>
              {rec.amountSell}/{rec.amountBuy}/{rec.rate}
            </span>
        )
      },
      {
        title: 'Time placed',
        dataIndex: 'timePlaced',
        key: 'timePlaced',
      },
      {
        title: 'Originating country',
        dataIndex: 'originatingCountry',
        key: 'originatingCountry',
      },
      {
        title: 'Logs with failed reasons',
        dataIndex: '',
        key: 'logs',
        render: text => <span>N/A</span>,
      },
      {
        title: 'status',
        dataIndex: 'status',
        key: 'status',
        render: (status, rec) => {
          let color = 'red';
          if (status == PENDING) color = 'grey';
          else if (status == SUCCESS) color = 'green';

          return (
              <div>
                <Progress
                    percent={rec.status === PENDING ? (rec.progress || 0) : 100}
                    size="small"
                    status={rec.status === FAILURE ? "exception" : "active"}
                />
                <Tag color={color} key={status}>
                  {status.toUpperCase()}
                </Tag>
              </div>
          );
        }
      },
    ];

    return (
      <div className="root">
        <Header
          title={"Trade FX"}
          style={{ position: "fixed", height: "64px" }}
        />
        <div className="container">
          <div
            className="container-main"
            style={{ backgroundColor: "rgb(242,243,242)" }}
          >
            <Row style={styles.row}>
              <Col span={24}>
                <Card bordered={false} style={styles.antCard}>
                  <Row style={styles.row}>

                    <Table
                      columns={columns}
                      dataSource={this.state.tradeData}
                      loading={this.state.loading}
                      rowKey={(rec)=> rec.id}
                      pagination={{defaultPageSize: 10}}
                    />
                  </Row>
                </Card>
              </Col>

            </Row>
          </div>
        </div>

        <SockJsClient url='http://123.203.53.232:5000/websocket-trade/'
                      topics={['/topic/update-status', '/topic/create-trade']}
                      onConnect={() => {
                        console.log("connected")}}
                      onDisconnect={() => {
                          console.log("Disconnected")}}
                      onMessage={(msg, topic) => {
                            console.log(topic);
                            if (topic === '/topic/update-status') {
                              console.log("here update-status");
                              this.handleUpdateStatus(msg);
                            } else if (topic === '/topic/create-trade') {
                              console.log("here create-trade");
                              this.handleCreateTrade(msg);
                            }

                            console.log(msg);
                      }}
                      />
      </div>
    );
  }
}
function mapStateToProps(state) {
  const tradeState = state.get('trade');
  console.log(tradeState.get('fetchList'));
  const tradeData = tradeState.get('fetchList') instanceof Array ? tradeState.get('fetchList') : [];
  console.log(tradeData);
  return {
    tradeData,
    // snippetData1: [
    //   {
    //     "userId": "134256",
    //     "currencyFrom": "EUR",
    //     "currencyTo": "GBP",
    //     "amountSell": 1000,
    //     "amountBuy":  747.10,
    //     "rate": 0.7471,
    //     "timePlaced": "2018-01-24 10:27:44",
    //     "originatingCountry": "FR",
    //     "status": "PENDING",
    //   },
    //   {
    //     "userId": "134256",
    //     "currencyFrom": "EUR",
    //     "currencyTo": "HKD",
    //     "amountSell": 1000,
    //     "amountBuy":  747.10,
    //     "rate": 0.7471,
    //     "timePlaced": "2018-01-25 10:27:44",
    //     "originatingCountry": "FR",
    //     "status": "SUCCESS",
    //   },
    //   {
    //     "userId": "134568",
    //     "currencyFrom": "EUR",
    //     "currencyTo": "GBP",
    //     "amountSell": 1000,
    //     "amountBuy":  747.10,
    //     "rate": 0.7471,
    //     "timePlaced": "2018-01-26 10:27:44",
    //     "originatingCountry": "FR",
    //     "status": "FAILURE",
    //   },

    // ],
  };
}

/**
 * id
 * title
 * code
 * isDeleted
 *
 * */
MainContainer.defaultProps = {
  tradeData: [],
}

export default connect(mapStateToProps)(MainContainer);
