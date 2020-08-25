const inquirer = require('inquirer');
const emitter = require('events').EventEmitter.defaultMaxListeners = 0;
const consoleTable = require('console.table');
const logo = require('asciiart-logo');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "!27ComptonRd",
    database: "employeeManager_db"
});

connection.connect(err => {
    if (err) throw err;
    printLogo();
    start();
});

const printLogo = () => {

    console.log(logo({
        name: 'Employee Manager',
        font: '3D-ASCII',
        lineChars: 3,
        padding: 1,
        margin: 1,
        borderColor: 'grey',
        logoColor: 'blue',
        textColor: 'grey',
    })
        .emptyLine()
        .right('version 1.0.0')
        .emptyLine()
        .render()
    );

}

// function which prompts the user for what action they should take
const start = async () => {

    await inquirer.prompt({
        name: "action",
        type: "list",
        message: "Would you like to do?",
        choices: [
            "Add departments, roles or employees",
            "View departments, roles or employees",
            "Update employee role",
            "Delete department, role or employee",
            "Quit application",
        ]
    })
        .then(answer => {

            switch (answer.action) {
                case "Add departments, roles or employees":
                    add();
                    break;

                case "View departments, roles or employees":
                    view();
                    break;

                case "Update employee role":
                    updateRole();
                    break;

                case "Delete department, role or employee":
                    deleteIt();
                    break;

                case "Quit application":
                    quit();
                    break;
                default: quit();
            }
        });
}



const add = async () => {

    await inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to add?",
        choices: [

            "add department",
            "add role",
            "add employee",
            "Quit application"

        ]
    })

        .then(answer => {

            switch (answer.action) {

                case "add department":
                    addDept();
                    break;

                case "add role":
                    addRole();
                    break;

                case "add employee":
                    addEmployee();
                    break;
                case "Quit application":
                    quit();
                    break;
                default: quit();
            }
        });
}

const view = async () => {

    await inquirer.prompt({
        name: "action",
        type: "list",
        message: "Would you like to do?",
        choices: [

            "view all departments",
            "view all roles",
            "view all employees",
            "view all employees by department"

        ]
    })
        .then(answer => {

            switch (answer.action) {

                case "view all departments":
                    viewAllDepts();
                    break;

                case "view all roles":
                    viewAllRoles();
                    break;

                case "view all employees":
                    viewAllEmployees();
                    break;

                case "view all employees by department":
                    viewByDept();
                    break;
                case "Quit application":
                    quit();
                    break;
                default: quit();
            }
        });
}

const deleteIt = async () => {

    await inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to delete?",
        choices: [

            "delete a department",
            "delete a role",
            "delete an employee",
            "Quit application"
        ]
    })
        .then(answer => {

            switch (answer.action) {

                case "delete a department":
                    deleteDepartment();
                    break;

                case "delete a role":
                    deleteRole();
                    break;

                case "delete an employee":
                    deleteEmployee();
                    break;

                case "Quit application":
                    quit();
                    break;
                default: quit();
            }
        });
}
// VIEW functions

const viewAllDepts = () => {
    const query = `SELECT * FROM department`
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("============================================ \n");
        console.table(res);
        console.log("============================================ \n");
        start();
    });


}

const viewAllRoles = () => {
    const query = `SELECT role.id, role.title, role.salary, name AS department FROM role INNER JOIN department ON (role.department_id = department.id)`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("============================================ \n");
        console.table(res);
        console.log("============================================ \n");
        start();
    });

}

const viewAllEmployees = () => {
    const query =
        `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name,' ',manager.last_name) AS manager FROM employee
     INNER JOIN role on employee.role_id = role.id 
     INNER JOIN department on department_id = department.id   
     LEFT JOIN employee manager ON manager.id = employee.manager_id;
     `;

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("============================================ \n");
        console.table(res);
        console.log("============================================ \n");
        start();
    });

};

const viewByDept = () => {
    inquirer.prompt([
        {
            type: "input",
            name: "deptName",
            message: "Please enter department name you would like to search"
        }
    ]).then(answer => {
        const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name,' ',manager.last_name) AS manager FROM employee
    INNER JOIN role on employee.role_id = role.id 
    INNER JOIN department on department_id = department.id   
    LEFT JOIN employee manager ON manager.id = employee.manager_id
    WHERE department.name=?`;
        connection.query(query, [answer.deptName], (err, res) => {
            if (err) throw err;

            console.log("============================================ \n");
            console.table(res);
            console.log("============================================ \n");
            start();
        });

    });

}

// ADD functions

const addDept = async () => {
    await inquirer.prompt([

        {
            type: "input",
            name: "name",
            message: "Please enter new department name"
        }
    ]).then(answer => {

        const query = `INSERT INTO department SET ?`;

        connection.query(
            query,
            {
                name: answer.name
            },
            (err, res) => {
                if (err) throw err;
                console.log(" New department added! \n ");
                start();
            });

    });


}

const addRole = async () => {

    await inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "Please enter role name"
        },
        {
            type: "input",
            name: "salary",
            message: "Please enter salary for new role"
        },
        {
            type: "input",
            name: "deptID",
            message: "Please enter the department ID"
        },
    ]).then(res => {

        const query = `INSERT INTO role SET ?`;

        connection.query(query, {
            title: res.title,
            salary: res.salary,
            department_ID: res.deptID
        }, (err, res) => {
            if (err) throw err;
            console.log("Role added! \n");
            console.log("Return to main menu \n");
            start();
        });

    })


}

const addEmployee = async () => {

    await inquirer.prompt([

        {
            type: "input",
            name: "firstname",
            message: "Please enter new employee first name"
        },
        {
            type: "input",
            name: "lastname",
            message: "Please enter new employee last name"
        },
        {
            type: "input",
            name: "roleID",
            message: "Please enter the correct role ID"
        },
        {
            type: "input",
            name: "managerID",
            message: "Please enter the correct manager ID",
        }
    ]).then(answer => {

        const query = "INSERT INTO employee SET ?";
        connection.query(
            query,
            {
                first_name: answer.firstname,
                last_name: answer.lastname,
                role_id: answer.roleID,
                manager_id: answer.managerID
            },
            (err, res) => {
                if (err) throw err;
                console.log("Employee added! \n");
                console.log("Return to main menu \n");
                start();
            });

    });

}

const updateRole = async () => {
    await inquirer.prompt([
        {
            type: "input",
            name: "employeeID",
            message: "Which employee would you like to update?"
        }, {
            type: "input",
            name: "roleID",
            message: "Please enter the role ID you would like to allocate to the employee"
        }
    ]).then(answer => {
        const query = `UPDATE employee SET role_id = ? WHERE id = ?`;
        connection.query(
            query, [answer.roleID, answer.employeeID],
            (err, res) => {
                if (err) throw err;
                console.log("Role updated! \n");
                console.log("Return to main menu \n");
                start();

            });

    });

};

//DELETE functions

const deleteDepartment = async () => {

    await inquirer.prompt({
        type: "input",
        name: "deptID",
        message: "Enter id of the department you'd like to delete"
    })
        .then(answer => {
            const query = "DELETE FROM department WHERE id = ?";
            connection.query(query, [answer.deptID], (err, res) => {
                if (err) throw err;
                console.log("Department deleted \n");
                console.log("Return to main menu \n");
                start();
            });

        });

};

const deleteRole = async () => {

    await inquirer.prompt({
        type: "input",
        name: "roleID",
        message: "Enter id of role you'd like to delete"
    }).then(answer => {
        const query = "DELETE FROM role WHERE id = ?";
        connection.query(query, [answer.roleID], (err, res) => {
            if (err) throw err;
            console.log("Role deleted \n");
            console.log("Return to main menu \n");
            start();
        });

    });

};

const deleteEmployee = async () => {

    await inquirer.prompt({
        type: "input",
        name: "employeeID",
        message: "Enter id of employee you'd like to delete"
    }).then(answer => {
        const query = "DELETE FROM employee WHERE id = ?";
        connection.query(query, [answer.employeeID], (err, res) => {
            if (err) throw err;
            console.log("Employee deleted \n");
            console.log("Return to main menu \n");
            start();
        });

    });

};

const quit = () => {
    connection.end(function (err) {
        if (err) {
            return console.log('error:' + err.message);
        }
        console.log('Close the database connection.');
    })
};
