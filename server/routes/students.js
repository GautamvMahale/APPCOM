"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var Student_1 = require("../models/Student");
var router = express_1.default.Router();
// Create a new student
router.post('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, name_1, exam, student, savedStudent, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, name_1 = _a.name, exam = _a.exam;
                student = new Student_1.default({
                    studentId: Date.now().toString(),
                    name: name_1,
                    exam: exam,
                    password: name_1, // Password is same as student name by default
                    status: 'offline',
                    timeElapsed: '00:00:00',
                    riskScore: 0
                });
                return [4 /*yield*/, student.save()];
            case 1:
                savedStudent = _b.sent();
                res.status(201).json({
                    id: savedStudent.studentId,
                    name: savedStudent.name,
                    exam: savedStudent.exam,
                    status: savedStudent.status,
                    timeElapsed: savedStudent.timeElapsed,
                    riskScore: savedStudent.riskScore
                });
                return [3 /*break*/, 3];
            case 2:
                error_1 = _b.sent();
                res.status(500).json({ message: 'Error creating student', error: error_1 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get all students
router.get('/', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var students, studentList, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Student_1.default.find({}).sort({ createdAt: -1 })];
            case 1:
                students = _a.sent();
                studentList = students.map(function (student) { return ({
                    id: student.studentId,
                    name: student.name,
                    exam: student.exam,
                    status: student.status,
                    timeElapsed: student.timeElapsed,
                    riskScore: student.riskScore
                }); });
                res.json(studentList);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                res.status(500).json({ message: 'Error fetching students', error: error_2 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Get student by ID
router.get('/:id', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var student, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, Student_1.default.findOne({ studentId: req.params.id })];
            case 1:
                student = _a.sent();
                if (!student) {
                    return [2 /*return*/, res.status(404).json({ message: 'Student not found' })];
                }
                res.json({
                    id: student.studentId,
                    name: student.name,
                    exam: student.exam,
                    status: student.status,
                    timeElapsed: student.timeElapsed,
                    riskScore: student.riskScore
                });
                return [3 /*break*/, 3];
            case 2:
                error_3 = _a.sent();
                res.status(500).json({ message: 'Error fetching student', error: error_3 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Update student status
router.patch('/:id/status', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var status_1, student, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                status_1 = req.body.status;
                return [4 /*yield*/, Student_1.default.findOneAndUpdate({ studentId: req.params.id }, { status: status_1 }, { new: true })];
            case 1:
                student = _a.sent();
                if (!student) {
                    return [2 /*return*/, res.status(404).json({ message: 'Student not found' })];
                }
                res.json({
                    id: student.studentId,
                    name: student.name,
                    exam: student.exam,
                    status: student.status,
                    timeElapsed: student.timeElapsed,
                    riskScore: student.riskScore
                });
                return [3 /*break*/, 3];
            case 2:
                error_4 = _a.sent();
                res.status(500).json({ message: 'Error updating student status', error: error_4 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Update student risk score
router.patch('/:id/risk-score', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var riskScore, student, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                riskScore = req.body.riskScore;
                return [4 /*yield*/, Student_1.default.findOneAndUpdate({ studentId: req.params.id }, { riskScore: riskScore }, { new: true })];
            case 1:
                student = _a.sent();
                if (!student) {
                    return [2 /*return*/, res.status(404).json({ message: 'Student not found' })];
                }
                res.json({
                    id: student.studentId,
                    name: student.name,
                    exam: student.exam,
                    status: student.status,
                    timeElapsed: student.timeElapsed,
                    riskScore: student.riskScore
                });
                return [3 /*break*/, 3];
            case 2:
                error_5 = _a.sent();
                res.status(500).json({ message: 'Error updating student risk score', error: error_5 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
// Verify student credentials
router.post('/verify', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, studentId, password, student, error_6;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, studentId = _a.studentId, password = _a.password;
                return [4 /*yield*/, Student_1.default.findOne({ studentId: studentId })];
            case 1:
                student = _b.sent();
                if (student && password === student.password) {
                    res.json({ valid: true });
                }
                else {
                    res.json({ valid: false });
                }
                return [3 /*break*/, 3];
            case 2:
                error_6 = _b.sent();
                res.status(500).json({ message: 'Error verifying credentials', error: error_6 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
