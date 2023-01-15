import { gql } from '@apollo/client';

export const CREATE_PROFESSOR = gql`
	mutation professorInfo($firstName: String!, $lastName: String!, $college: String!) {
		createProfessor(input: { firstName: $firstName, lastName: $lastName, college: $college }) {
			id
			firstName
			lastName
			college
		}
	}
`;
