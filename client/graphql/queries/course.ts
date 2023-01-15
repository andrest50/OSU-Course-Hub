import { gql } from '@apollo/client';

export const COURSES = gql`
	query courses {
		courses {
			id
			department
			number
		}
	}
`;

export const COURSE = gql`
	query course($courseID: Float!) {
		course(courseID: $courseID) {
			id
			department
			number
		}
	}
`;

export const COURSE_PROFESSORS = gql`
	query courseProfessors($courseID: Float!) {
		professors: courseProfessors(courseID: $courseID) {
			id
			firstName
			lastName
			college
		}
	}
`;
