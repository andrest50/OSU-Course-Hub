"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourseResolver = void 0;
const class_validator_1 = require("class-validator");
const type_graphql_1 = require("type-graphql");
const Course_1 = require("../entity/Course");
const util_1 = require("../util");
let CourseInput = class CourseInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], CourseInput.prototype, "department", void 0);
__decorate([
    type_graphql_1.Field(),
    class_validator_1.Length(3),
    __metadata("design:type", String)
], CourseInput.prototype, "number", void 0);
CourseInput = __decorate([
    type_graphql_1.InputType()
], CourseInput);
let CourseResolver = class CourseResolver {
    course() {
        return __awaiter(this, void 0, void 0, function* () {
            return Course_1.Course.find({});
        });
    }
    createCourse({ department, number }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(department in util_1.Departments)) {
                return [
                    {
                        field: 'department',
                        message: 'department not valid',
                    },
                ];
            }
            return Course_1.Course.create({ department, number }).save();
        });
    }
};
__decorate([
    type_graphql_1.Query(() => [Course_1.Course]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CourseResolver.prototype, "course", null);
__decorate([
    type_graphql_1.Mutation(() => Course_1.Course),
    __param(0, type_graphql_1.Arg('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CourseInput]),
    __metadata("design:returntype", Promise)
], CourseResolver.prototype, "createCourse", null);
CourseResolver = __decorate([
    type_graphql_1.Resolver()
], CourseResolver);
exports.CourseResolver = CourseResolver;
//# sourceMappingURL=course.js.map