"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var ActivityEventSchema = new mongoose_1.Schema({
    eventId: { type: String, required: true, unique: true },
    studentId: { type: String, required: true, index: true },
    timestamp: { type: Date, required: true },
    type: { type: String, required: true },
    details: { type: String },
    riskScore: { type: Number, default: 0 }
}, {
    timestamps: true
});
// Add indexes for better query performance
ActivityEventSchema.index({ studentId: 1, timestamp: -1 });
exports.default = mongoose_1.default.model('ActivityEvent', ActivityEventSchema);
