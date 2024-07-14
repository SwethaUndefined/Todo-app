import React from "react";
import TodoList from "../components/todoList";
import { Row, Col } from "antd";
import "./dashboard.css";

const Dashboard = () => {
  return (
    <section className="dashboard-section">
      <Row>
        <Col span={24} xs={24} lg={24} sm={24} md={24}>
          <TodoList />
        </Col>
      </Row>
    </section>
  );
};

export default Dashboard;


