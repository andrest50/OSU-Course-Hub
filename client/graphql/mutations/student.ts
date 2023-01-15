import { gql } from '@apollo/client';

export const CREATE_STUDENT = gql`
	mutation createStudent($ONID: String!) {
		createStudent(ONID: $ONID) {
			ONID
		}
	}
`;

export const DELETE_STUDENT = gql`
	mutation deleteStudent($ONID: String!) {
		deleteStudent(ONID: $ONID)
	}
`;
