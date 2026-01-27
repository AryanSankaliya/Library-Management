const mongoose = require('mongoose');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const TEST_PORT = 5001;

async function getValidEmail() {
    console.log("Connecting to DB to find a user...");
    await mongoose.connect(process.env.MONGO_URI);
    const User = require('./models/User'); // Assuming path relative to backend folder
    const user = await User.findOne();
    await mongoose.disconnect();
    if (!user) {
        throw new Error("No users found in database to test with.");
    }
    console.log("Found test user:", user.email);
    return user.email;
}

function startServer() {
    console.log("Starting temporary server on port " + TEST_PORT + "...");
    const serverProcess = spawn('node', ['index.js'], {
        cwd: __dirname,
        env: { ...process.env, PORT: TEST_PORT }
    });

    serverProcess.stdout.on('data', (data) => {
        console.log(`Server: ${data}`);
    });

    serverProcess.stderr.on('data', (data) => {
        console.error(`Server Error: ${data}`);
    });

    return serverProcess;
}

function sendOtpRequest(email) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify({ email });
        const options = {
            hostname: 'localhost',
            port: TEST_PORT,
            path: '/library/otp/send-otp',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = http.request(options, (res) => {
            let responseBody = '';
            res.on('data', (chunk) => responseBody += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(responseBody));
                } else {
                    reject(new Error(`Status ${res.statusCode}: ${responseBody}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(data);
        req.end();
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runVerify() {
    let serverProcess;
    try {
        const email = await getValidEmail();

        serverProcess = startServer();

        // Wait for server to start
        await sleep(5000);

        console.log("Sending OTP request...");
        const result = await sendOtpRequest(email);
        console.log("Result:", result);

        if (result.success) {
            console.log("✅ Verification SUCCESS: OTP sent successfully.");
        } else {
            console.error("❌ Verification FAILED:", result.message);
        }

    } catch (error) {
        console.error("❌ Error during verification:", error.message);
    } finally {
        if (serverProcess) {
            console.log("Stopping temporary server...");
            serverProcess.kill();
        }
        process.exit(0);
    }
}

runVerify();
