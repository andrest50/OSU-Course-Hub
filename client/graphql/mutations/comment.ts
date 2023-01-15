import { gql } from '@apollo/client';

export const CREATE_COMMENT = gql`
	mutation createComment(
		$anonymous: Boolean
		$text: String!
		$ONID: String!
		$quality: Int!
		$difficulty: Int!
		$professorID: Float
		$courseID: Float
		$campus: String
		$recommend: Boolean
		$baccCore: Boolean
		$gradeReceived: String
		$tags: [String!]!
	) {
		createComment(
			input: {
				anonymous: $anonymous
				text: $text
				ONID: $ONID
				quality: $quality
				difficulty: $difficulty
				professorID: $professorID
				courseID: $courseID
				campus: $campus
				recommend: $recommend
				baccCore: $baccCore
				gradeReceived: $gradeReceived
				tags: $tags
			}
		) {
			id
			anonymous
			text
			ONID
			courseID
			professorID
			difficulty
			quality
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

export const DELETE_COMMENT = gql`
	mutation deleteComment($commentID: Float!) {
		deleteComment(commentID: $commentID)
	}
`;

export const LIKE_COMMENT = gql`
	mutation likeComment($ONID: String!, $commentID: Float!) {
		likeComment(ONID: $ONID, commentID: $commentID) {
			id
			likes
			dislikes
		}
	}
`;

export const DISLIKE_COMMENT = gql`
	mutation dislikeComment($ONID: String!, $commentID: Float!) {
		dislikeComment(ONID: $ONID, commentID: $commentID) {
			id
			likes
			dislikes
		}
	}
`;
