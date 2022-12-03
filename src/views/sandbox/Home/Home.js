import React, { useEffect, useState, useRef } from "react";
import { Card, Col, Row, List, Avatar, Drawer } from "antd";
import { flushSync } from "react-dom";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import axios from "axios";
import * as Echarts from "echarts";
import _ from "lodash";
import { NavLink } from "react-router-dom";

const { Meta } = Card;

// import axios from 'axios'
export default function Home() {
  const [viewList, setviewList] = useState([]);
  const [starList, setstarList] = useState([]);
  const [allList, setallList] = useState([]);
  const [visible, setvisible] = useState(false);
  const [pieChart, setpieChart] = useState(false);
  const barRef = useRef();
  const pieRef = useRef();
  useEffect(() => {
    axios
      .get(
        "/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6"
      )
      .then((res) => {
        // console.log(res.data)
        setviewList(res.data);

      });
    localStorage.setItem('xxx','xxx')
  }, []);

  useEffect(() => {
    axios
      .get(
        "/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6"
      )
      .then((res) => {
        // console.log(res.data)
        setstarList(res.data);
      });
  }, []);

  useEffect(() => {
    axios.get("/news?publishState=2&_expand=category").then((res) => {
      
      renderBarView(_.groupBy(res.data, (item) => item.category.label));

      setallList(res.data);
      
     
    });

    return () => {
      window.onresize = null;
    };
  }, []);

  const renderBarView = (obj) => {
    var myChart = Echarts.init(barRef.current);

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: "新闻分类图示",
      },
      tooltip: {},
      legend: {
        data: ["数量"],
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          rotate: "45",
          interval: 0,
        },
      },
      yAxis: {
        minInterval: 1,
      },
      series: [
        {
          name: "数量",
          type: "bar",
          data: Object.values(obj).map((item) => item.length),
        },
      ],
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

    window.onresize = () => {
      // console.log("resize")
      myChart.resize();
    };
  };

//   const renderPieView = () => {
//     //数据处理工作

//     var currentList = allList.filter((item) => item.author === username);
//     var groupObj = _.groupBy(currentList, (item) => item.category.label);
//     var list = [];
//     for (var i in groupObj) {
//       list.push({
//         name: i,
//         value: groupObj[i].length,
//       });
//     }
  
//      var myChart = Echarts.init(pieRef.current);
   
    
//     var option;

//     option = {
//       title: {
//         text: "当前用户新闻分类图示",
//         // subtext: '纯属虚构',
//         left: "center",
//       },
//       tooltip: {
//         trigger: "item",
//       },
//       legend: {
//         orient: "vertical",
//         left: "left",
//       },
//       series: [
//         {
//           name: "发布数量",
//           type: "pie",
//           radius: "80%",
//           data: list,
//           emphasis: {
//             itemStyle: {
//               shadowBlur: 10,
//               shadowOffsetX: 0,
//               shadowColor: "rgba(0, 0, 0, 0.5)",
//             },
//           },
//         },
//       ],
//     };
// myChart.resize({
//   width: 500,
//   height: 400,
// });
//     option && myChart.setOption(option);
//   };
const renderPieView = (obj) => {
  //数据处理工作

  var currentList = allList.filter((item) => item.author === username);
  var groupObj = _.groupBy(currentList, (item) => item.category.label);
  var list = [];
  for (var i in groupObj) {
    list.push({
      name: i,
      value: groupObj[i].length,
    });
  }
  var myChart;
  if (!pieChart) {
    myChart = Echarts.init(pieRef.current);
    setpieChart(myChart);
  } else {
    myChart = pieChart;
  }
  var option;

  option = {
    title: {
      text: "当前用户新闻分类图示",
      // subtext: '纯属虚构',
      left: "center",
    },
    tooltip: {
      trigger: "item",
    },
    legend: {
      orient: "vertical",
      left: "left",
    },
    series: [
      {
        name: "发布数量",
        type: "pie",
        radius: "50%",
        data: list,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: "rgba(0, 0, 0, 0.5)",
          },
        },
      },
    ],
  };

  option && myChart.setOption(option);
};
  const {
    username,
    region,
    role: { roleName },
  } = JSON.parse(localStorage.getItem("token"));
  return (
    <div className="site-card-wrapper">
      <Row gutter={16}>
        <Col span={8}>
          <Card title="用户最常浏览" bordered={true}>
            <List
              size="small"
              // bordered
              dataSource={viewList}
              renderItem={(item) => (
                <List.Item>
                  <NavLink to={`/news-manage/preview/${item.id}`}>
                    {item.label}
                  </NavLink>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="用户点赞最多" bordered={true}>
            <List
              size="small"
              // bordered
              dataSource={starList}
              renderItem={(item) => (
                <List.Item>
                  <NavLink to={`/news-manage/preview/${item.id}`}>
                    {item.label}
                  </NavLink>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            cover={
              <img
                alt="example"
                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
              />
            }
            actions={[
              <SettingOutlined
                key="setting"
                onClick={() => {
flushSync(() => {
 setvisible(true);
 setTimeout(() => {
   // init初始化
   renderPieView();
 }, 1);
});


                     

                
                    
                  
                }}
              />,
              <EditOutlined key="edit" />,
              <EllipsisOutlined key="ellipsis" />,
            ]}
          >
            <Meta
              avatar={
                <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
              }
              title={username}
              description={
                <div>
                  <b>{region ? region : "全球"}</b>
                  <span
                    style={{
                      paddingLeft: "30px",
                    }}
                  >
                    {roleName}
                  </span>
                </div>
              }
            />
          </Card>
        </Col>
      </Row>
      <Drawer
        width="500px"
        title="个人新闻分类"
        placement="right"
        closable={true}
        onClose={() => {
          setvisible(false);
        }}
        open={visible}
      >
        <div
          ref={pieRef}
          style={{
            width: "100%",
            height: "400px",
            marginTop: "30px",
          }}
        ></div>
      </Drawer>

      {/* <div className={style.active}>
        <div
          ref={pieRef}
          style={{
            width: "100%",
            height: "400px",
            marginTop: "300px",
          }}
        ></div>
      </div> */}
      <div
        ref={barRef}
        style={{
          width: "90%",
          height: "300px",
          marginTop: "10px",
          overflow: "hidden",
        }}
      ></div>
      
    </div>
  );
}
