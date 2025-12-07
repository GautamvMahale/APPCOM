"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var mongoose_1 = require("mongoose");
var dotenv_1 = require("dotenv");
var students_1 = require("./routes/students");
var activities_1 = require("./routes/activities");
// Load environment variables
dotenv_1.default.config();
var app = (0, express_1.default)();
var PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Connect to MongoDB
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ethicproctor';
mongoose_1.default.connect(MONGODB_URI)
    .then(function () {
    console.log('Connected to MongoDB Atlas');
})
    .catch(function (error) {
    console.error('MongoDB connection error:', error);
});
// Routes
app.use('/api/students', students_1.default);
app.use('/api/activities', activities_1.default);
// Health check endpoint
app.get('/api/health', function (req, res) {
    res.json({ status: 'OK', message: 'Server is running' });
});
app.listen(PORT, function () {
    console.log("Server is running on port ".concat(PORT));
});
exports.default = app;
