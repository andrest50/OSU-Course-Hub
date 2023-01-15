import { gql } from '@apollo/client';

export const STUDENTS = gql`
	query students {
		students {
			ONID
			likedCommentIDs
			dislikedCommentIDs
		}
	}
`;

export const STUDENT = gql`
	query student($ONID: String!) {
		student(ONID: $ONID) {
			ONID
			likedCommentIDs
			dislikedCommentIDs
		}
	}
`;
