import { gql } from '@apollo/client';


export const CREATE_COURSE = gql`
	mutation createCourse($department: String!, $number: String!) {
		createCourse(input: { department: $department, number: $number }) {
			id
			department
			number
		}
	}
`;

export const ADD_PROFESSOR_TO_COURSE = gql`
	mutation professorInfo(
		$professorID: Float!
		$courseID: Float!
		$termTaught: String!
		$yearTaught: Float!
	) {
		addProfessorToCourse(
			professorID: $professorID
			courseID: $courseID
			termTaught: $termTaught
			yearTaught: $yearTaught
		) {
			id
		}
	}
`;

export const ADD_TEXTBOOK_TO_COURSE = gql`
	mutation addTextbookToCourse(
		$ISBN: String!
		$title: String!
		$author: String!
		$coverImageURL: String
		$edition: Float!
		$copyrightYear: Float!
		$priceNewUSD: Float
		$priceUsedUSD: Float
		$courseID: Float!
		$termUsed: String!
		$yearUsed: Float!
	) {
		addTextbookToCourse(
			input: {
				ISBN: $ISBN
				title: $title
				author: $author
				coverImageURL: $coverImageURL
				edition: $edition
				copyrightYear: $copyrightYear
				priceNewUSD: $priceNewUSD
				priceUsedUSD: $priceUsedUSD
			}
			courseID: $courseID
			termUsed: $termUsed
			yearUsed: $yearUsed
		) {
			ISBN
			title
			author
			coverImageUrl
			edition
			copyrightYear
			priceNewUSD
			priceUsedUSD
		}
	}
`;
