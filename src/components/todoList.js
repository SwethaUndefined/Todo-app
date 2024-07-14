import React, { useState, useEffect } from "react";
import { Row, Col, Typography, Input, Space, List, Button, Checkbox, message } from "antd";
import "./todoList.css";
import { getTodos } from "../api";
import { EditOutlined, DeleteOutlined, PushpinOutlined, PushpinFilled } from "@ant-design/icons";

const TodoList = () => {
  const [todos, setToDos] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [allDone, setAllDone] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const data = await getTodos();
      if (data && data.length > 0) {
        setToDos(data.map(todo => ({ ...todo, isDone: false, isPinned: false })));
      } else {
        message.warning("No tasks found.");
      }
    } catch (error) {
      message.error("Failed to fetch tasks. Please try again later.");
    }
  };
  

  const handleAddTask = () => {
    if (newTask.trim()) {
      setToDos([...todos, { id: Date.now(), title: newTask, isDone: false, isPinned: false }]);
      setNewTask("");
    }
    else{
      message.warning("Enter the Task")
    }
  };

  const handleEditTask = (id, title) => {
    setEditingId(id);
    setEditingValue(title);
  };

  const handleUpdateTask = () => {
    setToDos(todos.map((todo) => (todo.id === editingId ? { ...todo, title: editingValue } : todo)));
    setEditingId(null);
    setEditingValue("");
  };

  const handleDeleteTask = (id) => {
    setToDos(todos.filter((todo) => todo.id !== id));
  };

  const handleMarkAllDone = () => {
    const newAllDone = !allDone;
    setAllDone(newAllDone);
    setToDos(todos.map((todo) => ({ ...todo, isDone: newAllDone })));
  };

  const handleTogglePin = (id) => {
    setToDos(todos.map((todo) => (todo.id === id ? { ...todo, isPinned: !todo.isPinned } : todo)));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      setIsUpdating(true);
      handleUpdateTask();
    }
  };

  const handleBlur = () => {
    if (!isUpdating) {
      handleUpdateTask();
    } else {
      setIsUpdating(false);
    }
  };

  const sortedTodos = [...todos].sort((a, b) => b.isPinned - a.isPinned || a.id - b.id);

  return (
    <section className="main-section">
      <Row gutter={16}>
        <Col span={24}>
          <Typography.Title className="heading">Get Things Done!</Typography.Title>
        </Col>
        <Col span={24}>
          <Space.Compact
            style={{
              width: "100%",
            }}
            className="add-input-col"
          >
            <Input
              value={newTask}
              placeholder="Add the task here..."
              className="add-input"
              onChange={(e) => setNewTask(e.target.value)}
            />
            <Button className="add-btn" onClick={handleAddTask}>
              Add Task
            </Button>
            <Button className="add-btn" onClick={handleMarkAllDone}>
              <Checkbox checked={allDone} />
            </Button>
          </Space.Compact>
        </Col>
        <Col span={24} className="todoListCol">
          <List
            itemLayout="horizontal"
            dataSource={sortedTodos}
            renderItem={(todo) => (
              <List.Item key={todo.id}>
                {editingId === todo.id ? (
                  <Input
                    value={editingValue}
                    onChange={(e) => setEditingValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    onBlur={handleBlur}
                    autoFocus
                    className="todoInput"
                  />
                ) : (
                  <Input
                    value={todo.title}
                    readOnly
                    className={`todoInput ${todo.isDone ? "done" : ""}`}
                    suffix={
                      <Space>
                        <Checkbox
                          checked={todo.isDone}
                          onChange={() =>
                            setToDos(todos.map((t) => (t.id === todo.id ? { ...t, isDone: !t.isDone } : t)))
                          }
                        />
                        {todo.isPinned ? (
                          <PushpinFilled className="icon" onClick={() => handleTogglePin(todo.id)} />
                        ) : (
                          <PushpinOutlined className="icon" onClick={() => handleTogglePin(todo.id)} />
                        )}
                        <EditOutlined className="icon" onClick={() => handleEditTask(todo.id, todo.title)} />
                        <DeleteOutlined className="icon" onClick={() => handleDeleteTask(todo.id)} />
                      </Space>
                    }
                  />
                )}
              </List.Item>
            )}
          />
        </Col>
      </Row>
    </section>
  );
};

export default TodoList;
