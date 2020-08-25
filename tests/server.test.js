// const server = require('../db/connection');

// test('adds 1 + 2 to equal 3', () => {
//     expect(1 + 2).toBe(3);
// });

// test('can connect to the database', (done) => {

//     const connection = server.createConnection();
//     connection.connect(() => {
//         expect(connection.state).toBe("connected");
//         done();
//     });

// });



// test('can query employee table', (done) => {

//     const connection = server.createConnection();
//     connection.connect(() => {
//         connection.query("SELECT * FROM employee", (err, res) => {
//             expect(err).toBeNull();
//             expect(res).not.toBeNull();
//             done();
//         }
//         );

//     });

// });

// test('can query all roles', (done) => {

//     const query = `SELECT role.id, role.title, role.salary, name AS department FROM role INNER JOIN department ON (role.department_id = department.id)`;

//     const connection = server.createConnection();
//     connection.connect(() => {
//         connection.query(query, (err, res) => {
//             expect(err).toBeNull();
//             expect(res).not.toBeNull();
//             const data = res.map(element => [{ Id: element.id, Title: element.title }]);
//             console.log(data);
//             done();
//         }
//         );

//     });

// });