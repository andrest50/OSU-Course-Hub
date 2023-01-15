import { gql } from '@apollo/client';

export const COURSE_TEXTBOOKS = gql`
	query courseTextbooks($courseID: Float!) {
		textbooks: courseTextbooks(courseID: $courseID) {
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
