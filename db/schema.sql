DROP DATABASE IF EXISTS employeeManager_db;
CREATE DATABASE employeeManager_db;
USE employeeManager_db;
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary INT NOT NULL,
  department_id INT default 0,
  PRIMARY KEY (id),
  FOREIGN KEY (department_id)
);
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT default 0,
  manager_id INT default 0,
  PRIMARY KEY (id),
  FOREIGN KEY (role_id)
);