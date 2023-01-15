import { gql } from '@apollo/client';

export const PROFESSORS = gql`
	query professors {
		professors {
			id
			firstName
			lastName
			college
		}
	}
`;

export const PROFESSOR = gql`
	query professor($professorID: Float!) {
		professor(professorID: $professorID) {
			id
			firstName
			lastName
			college
		}
	}
`;

export const PROFESSOR_COURSES = gql`
	query professorCourses($professorID: Float!) {
		courses: professorCourses(professorID: $professorID) {
			id
			department
			number
		}
	}
`;

export const HIGHEST_RATED_PROFESSORS = gql`
	query highestRatedProfessors {
		professors: highestRatedProfessors {
			id
			firstName
			lastName
			college
		}
	}
`;
