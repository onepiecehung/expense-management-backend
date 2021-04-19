"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLeapYear = exports.randomNumberBothIncluded = exports.randomNumberExcluded = void 0;
function randomNumberExcluded(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
exports.randomNumberExcluded = randomNumberExcluded;
function randomNumberBothIncluded(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
exports.randomNumberBothIncluded = randomNumberBothIncluded;
function isLeapYear(year) {
    return new Date(year, 1, 29).getDate() === 29;
}
exports.isLeapYear = isLeapYear;
