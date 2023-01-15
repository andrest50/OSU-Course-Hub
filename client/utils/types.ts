export interface CourseType {
	course: Course;
}

export interface CourseData {
	courses: Course[];
}

export interface Course {
	comments: CommentType[];
	department: string;
	id: string;
	number: number;
}

export interface ProfessorType {
	professor: Professor;
}

export interface ProfessorData {
	professors: Professor[];
}

export interface Professor {
	college: string;
	comments: CommentType[];
	firstName: string;
	id: string;
	lastName: string;
}

export interface RecentCommentData {
	recentComments: CommentType[];
}

export interface CommentData {
	comments: CommentType[];
}

export interface CommentType {
	ONID: string;
	anonymous?: boolean;
	baccCore?: boolean;
	campus?: string;
	courseID?: number;
	createdAt: Date;
	difficulty: number;
	dislikes: number;
	gradeReceived?: string;
	id: string;
	likes: number;
	professorID?: number;
	quality: number;
	recommend?: boolean;
	tags: string[];
	text: string;
}

export interface StudentType {
	student: Student;
}

export interface StudentData {
	students: Student[];
}

export interface Student {
	ONID: string;
	dislikedCommentIDs: number[];
	likedCommentIDs: number[];
}
