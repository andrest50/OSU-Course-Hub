import { useQuery } from '@apollo/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Card, Row } from 'react-bootstrap';
import { RecentCommentData } from '../utils/types';
import { RECENT_COMMENTS } from '../graphql/queries/comment';
import RecentCommentTitle from './RecentCommentTitle';

const date = {
	margin: 0,
	color: '#4a4a4a',
};

const RecentComments: React.FC = () => {
	const { loading, data } = useQuery<RecentCommentData>(RECENT_COMMENTS);

	if (loading || !data) {
		return <></>;
	}

	const comments = [...data.recentComments];

	return (
		<div
			style={{
				width: '50%',
				padding: '10px',
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				maxWidth: '1000px',
			}}
			className='border'
		>
			<h4 style={{ textAlign: 'center', padding: '10px' }}>Recent Comments:</h4>
			{comments.length === 0 ? (
				<div>There are no comments yet.</div>
			) : (
				comments.map(comment => (
					<Card
						style={{
							width: '80%',
							maxWidth: '600px',
							padding: '10px',
							marginTop: '10px',
						}}
						bg='light'
						border='dark'
						key={comment.id}
					>
						<Row className='pl-3 pr-4'>
							<RecentCommentTitle
								courseID={comment.courseID}
								professorID={comment.professorID}
							/>
							<Card.Text style={date} className='text-right ml-auto'>
								{new Date(comment.createdAt).toDateString()}
							</Card.Text>
						</Row>
						<br />
						<Card.Text>{comment.text}</Card.Text>
					</Card>
				))
			)}
		</div>
	);
};

export default RecentComments;
