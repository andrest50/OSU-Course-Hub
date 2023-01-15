import { gql } from '@apollo/client';

export const COMMENTS = gql`
	query comments {
		comments {
			id
			anonymous
			text
			ONID
			courseID
			professorID
			campus
			recommend
			baccCore
			gradeReceived
			tags
			createdAt
			likes
			dislikes
			quality
			difficulty
		}
	}
`;

export const RECENT_COMMENTS = gql`
	query recentComments {
		recentComments {
			id
			anonymous
			text
			ONID
			courseID
			professorID
			campus
			recommend
			baccCore
			gradeReceived
			tags
			createdAt
			likes
			dislikes
			quality
			difficulty
		}
	}
`;

export const COURSE_COMMENTS = gql`
	query courseComments($courseID: Float!) {
		comments: courseComments(courseID: $courseID) {
			id
			anonymous
			text
			gradeReceived
			ONID
			courseID
			professorID
			recommend
			baccCore
			gradeReceived
			tags
			createdAt
			quality
			difficulty
			likes
			dislikes
		}
	}
`;

export const PROFESSOR_COMMENTS = gql`
	query professorComments($professorID: Float!) {
		comments: professorComments(professorID: $professorID) {
			id
			anonymous
			text
			difficulty
			quality
			ONID
			courseID
			professorID
			campus
			recommend
			baccCore
			gradeReceived
			tags
			createdAt
			likes
			dislikes
		}
	}
`;

export const STUDENT_COMMENTS = gql`
	query studentComments($ONID: String!) {
		comments: studentComments(ONID: $ONID) {
			id
			anonymous
			text
			gradeReceived
			ONID
			courseID
			professorID
			recommend
			baccCore
			gradeReceived
			tags
			createdAt
			quality
			difficulty
			likes
			dislikes
		}
	}
`;
