const http = require('node:http');
const cluster = require('node:cluster');
const os = require('node:os');

const numCPUs = os.cpus().length;

if (cluster.isMaster) {
    console.log(`Number of CPUs: ${numCPUs}`);
    console.log(`master process ${process.pid} is running`);

    // Fork workers.
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
    });
} else {
    console.log(`worker ${process.pid} is running`);

    http.createServer((req, res) => {
        switch (req.url) {
            case '/':
                res.write("This is Homepage");
                break;
            case '/users':
                for (let i = 0; i <= 9000000000; i++) {}
                res.write("This is User page");
                break;
            default:
                res.write("404 Not Found");
                break;
        }
        res.end();
    }).listen(8004, () => {
        console.log("server Started");
    });
}