import React, { useEffect, useState } from "react";
import { PageHeader, Descriptions } from "antd";
import moment from "moment";
import axios from "axios";
import { useMatch } from 'react-router-dom'
export default function NewsPreview() {
    const [newsInfo, setnewsInfo] = useState(null);
    const match = useMatch("/news-manage/preview/:id");
    const auditList = ["未审核", "审核中", "已通过", "未通过"];
    const publishList = ["未发布", "待发布", "已上线", "已下线"];
    const colorList = ['black', 'orange', 'green', 'red']
    
  useEffect(() => {
    // console.log()
   
   
    axios
      .get(`/news/${match.params.id}?_expand=category&_expand=role`)
      .then((res) => {
        setnewsInfo(res.data);
        console.log(res.data);
      });
  }, []);
  return (
    <div>
      {newsInfo && (
        <div>
          <PageHeader
            onBack={() => window.history.back()}
            title={newsInfo.title}
            subTitle={newsInfo.category.title}
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="创建者">
                {newsInfo.author}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss")}
              </Descriptions.Item>
              <Descriptions.Item label="发布时间">
                {newsInfo.publishTime
                  ? moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss")
                  : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="区域">
                {newsInfo.region}
              </Descriptions.Item>
              <Descriptions.Item label="审核状态">
                <span style={{ color: colorList[newsInfo.auditState] }}>
                  {auditList[newsInfo.auditState]}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="发布状态">
                <span style={{ color: colorList[newsInfo.publishState] }}>
                  {publishList[newsInfo.publishState]}
                </span>
              </Descriptions.Item>
              <Descriptions.Item label="访问数量">
                {newsInfo.view}
              </Descriptions.Item>
              <Descriptions.Item label="点赞数量">
                {newsInfo.star}
              </Descriptions.Item>
              <Descriptions.Item label="评论数量">0</Descriptions.Item>
            </Descriptions>
          </PageHeader>
          <div
            style={{ textAlign: "center", fontSize: "20px", padding: "20px" }}
          >
            {newsInfo.label}
          </div>
          <div
            dangerouslySetInnerHTML={{
              __html: newsInfo.content,
            }}
            style={{
              margin: "0 24px",
              border: "0px solid gray",
              overflow: "auto",
            }}
          ></div>
        </div>
      )}
    </div>
  );
   
}

// const match = useMatch("斜杠news-manage斜杠preview斜杠:id");


