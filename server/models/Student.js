"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var StudentSchema = new mongoose_1.Schema({
    studentId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    exam: { type: String, required: true },
    password: { type: String, required: true },
    timeElapsed: { type: String, default: '00:00:00' },
    riskScore: { type: Number, default: 0 },
    status: {
        type: String,
        enum: ['active', 'flagged', 'high-risk', 'offline'],
        default: 'offline'
    }
}, {
    timestamps: true
});
exports.default = mongoose_1.default.model('Student', StudentSchema);
