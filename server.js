const mysql = require("mysql");
const { prompt } = require("inquirer");
const consoletable = require("console.table");
const logo = require('asciiart-logo');


// create the connection information for the sql database
const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "employeeManager_db"
});

// connect to the mysql server and sql database
connection.connect(err => {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    printLogo();

});

const printLogo = () => {

    console.log(logo({
        name: 'Employee Manager',
        font: '3D-ASCII',
        lineChars: 5,
        padding: 1,
        margin: 1,
        borderColor: 'grey',
        logoColor: 'white',
        textColor: 'grey',
    })
        .emptyLine()
        .right('version 1.0.0')
        .emptyLine()
        .render()
    );


    start();
};

// function which prompts the user for what action they should take
const start = async () => {

    await
        prompt({
            name: "action",
            type: "list",
            message: "Would you like to do?",
            choices: [
                "view all employees",
                "view all employees by department",
                "view all employees by manager",
                "add employee",
                "delete employee",
                "update employee role",
                "update employee manager",
                "view all roles",
                "add role",
                "view all departments",
                "add department",
                "quit application"
            ]
        })
            .then(answer => {
                // based on answer, either call the bid or the post functions
                switch (answer.action) {
                    case "view all employees":
                        viewAllEmployees();
                        break;

                    case "view all employees by department":
                        viewByDept();
                        break;

                    case "view all employees by manager":
                        viewByMgr();
                        break;

                    case "add employee":
                        addEmployee();
                        break;

                    case "delete employee":
                        deleteEmployee();
                        break;

                    case "update employee role":
                        updateRole();
                        break;

                    case "update employee manager":
                        updateMgr();
                        break;

                    case "view all roles":
                        viewAllRoles();
                        break;

                    case "add role":
                        addRole();
                        break;

                    case "view all departments":
                        viewAllDepts();
                        break;

                    case "add department":
                        addDept();
                        break;

                    case "quit application":
                        end();
                        break;
                }
            });
};

// VIEW ALL


const viewAllDepts = () => {
    const query = `SELECT * FROM department`
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("");
        console.table(res);
    }
    );
    start();
};

const viewAllRoles = () => {
    const query = `SELECT role.id, role.title, role.salary, name AS department FROM role INNER JOIN department ON (role.department_id = department.id)`;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("");
        console.table(res);
    });
    start();
};

const viewAllEmployees = () => {
    const query =
        `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name,' ',manager.last_name) AS manager FROM employee
     INNER JOIN role on employee.role_id = role.id 
     INNER JOIN department on department_id = department.id   
     LEFT JOIN employee manager ON manager.id = employee.manager_id;
     `;

    connection.query(query, (err, res) => {
        if (err) throw err;
        console.log("");
        console.table(res);
    });
    start();
};

const viewByDept = () => {
    prompt([
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
    WHERE department.name=?;
    `;
        connection.query(query, [answer.deptName], (err, res) => {
            if (err) throw err;
            console.log("");
            console.table(res);

        });
        start();
    }
    );
}

const viewByMgr = async () => {
    await prompt([
        {
            type: "input",
            name: "mgrName",
            message: "Please enter the full name of the manager you would like to search by"
        }

    ]).then(answer => {
        const query = `SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name AS department, CONCAT(manager.first_name,' ',manager.last_name) AS manager FROM employee
    INNER JOIN role on employee.role_id = role.id 
    INNER JOIN department on department_id = department.id   
    LEFT JOIN employee manager ON manager.id = employee.manager_id
    WHERE manager.name=?;
    `;
        connection.query(query, [answer.mgrName], (err, res) => {
            if (err) throw err;
            console.log("");
            console.table(res);
            start();
        })

    }
    );
}

// ADD DEPT, ROLE, EMPLOYEE FUNCTIONS 

const addDept = async () => {
    await prompt([
        {
            type: "input",
            name: "deptID",
            message: "Please enter new department id"
        },
        {
            type: "input",
            name: "deptName",
            message: "Please enter new department name"
        }
    ]).then(answer => {

        const query = "INSERT INTO department (id, name) SET ?, ?";

        connection.query(
            query, [answer.deptID, answer.deptName], (err, res) => {
                if (error) throw err;
                console.log("New department added!");

            }
        );
        start();
    });
};

const addRole = async () => {
    connection.query("SELECT * FROM departments", (err, results) => {
        if (err) throw err;

        await prompt([
            {
                type: "input",
                name: "title",
                message: "Please enter department name"
            },
            {
                type: "input",
                name: "salary",
                message: "Please enter department name"
            },
            {
                type: "input",
                name: "deptID",
                message: "Please enter the department ID"
            },
        ]).then(answer => {

            const query = "INSERT INTO role (title, salary, department_id AS id FROM department) SET ?, ?, ?";

            connection.query(
                query, [answer.title, answer.salary, answer.deptID], (err, res) => {
                    if (error) throw err;
                    console.log("role added!");
                    start();
                }
            );

        });
    })
};

const addEmployee = async () => {


    await prompt([
        {
            type: "input",
            name: "firstname",
            message: "Please enter first name"
        },
        {
            type: "input",
            name: "lastname",
            message: "Please enter last name"
        },
        {
            type: "input",
            name: "roleID",
            message: "Please enter the correct role ID"
        },
        {
            type: "input",
            name: "managerID",
            message: "Please enter the correct role ID",
        }

    ]).then(answer => {

        const query = "INSERT INTO employee (first_name, last_name, role_id AS id FROM role, manager_id as id from employee) SET ?, ?, ?";

        connection.query(
            query, [answer.firstname, answer.lastname, answer.roleID, answer.managerID], (err, res) => {
                if (error) throw err;
                console.log("employee added!");

            }
        );
        start();
    });


};

// UPDATE 

// const employeeList = () => {
//     const query = `SELECT employee.id, CONCAT(employee.first_name, " ", employee.last_name) FROM employee`;
//     connection.query(query, (err, res) => {
//         if (err) throw err;
//         console.log("");

//     })
// };

const updateRole = async () => {

    await prompt([
        {
            type: "number",
            name: "employeeID",
            message: "Which employee role would you like to update?"
        }, {
            type: "number",
            name: "roleID",
            message: "Please enter desired role id to update employee role"
        }
    ]).then(answer => {
        const query = "UPDATE employee SET role_id = ? WHERE employee.id = ?";
        connection.query(
            query, [answer.roleID, answer.employeeID],
            (err, res) => {
                if (error) throw err;
                console.log("role updated!");
                start();
            }
        )
    })

}
// const updateMgr = () => {


//         inquirer.prompt([
//             {
//                 type: "rawlist",
//                 name: "employeeID",
//                 choices: viewAllEmployees(),
//                 // () => {
//                 //     let employeeArray = [],
//                 //     for (let i = 0; i < results.length; i++) {
//                 //         employeeArray.push(results[i].id);
//                 //     }
//                 //     return employeeArray
//                 // },
//                 message: "Which employee's manager would you like to update?"
//             }, {
//                 type: "rawlist",
//                 name: "managerID",
//                 choices: viewAllEmployees(),
//                 // () => {
//                 //     let employeeArray = [],
//                 //     for (let i = 0; i < results.length; i++) {
//                 //         employeeArray.push(results[i].id);
//                 //     }
//                 //     return employeeArray
//                 message: "Please select new manager"
//             }
//         ]).then()
//         const query = "UPDATE employee SET manager_id = ? WHERE manager.id = ?";
//         connection.query(
//             query, [answer.managerID, answer.employeeID],
//             (err, res) => {
//                 if (error) throw err;
//                 console.log("manager updated!");
//                 start();
//             }
//         )
//     }

// DELETE

const deleteEmployee = async () => {

    await prompt({
        type: "input",
        name: "employeeID",
        message: "Enter id of employee you'd like to delete"
    }).then(answer => {
        const query = "DELETE FROM employee WHERE id ?";
        connection.query(query, [answer.employeeID], (err, res) => {
            if (err) throw err;
            console.log("");
            console.log("Deleted employee");
        });
        start();
    });

}

const end = () => {
    console.log("End connection");
    connection.end();
}