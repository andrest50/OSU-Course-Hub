import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Card } from 'react-bootstrap';
import { Student, CommentType } from '../utils/types';

interface Props {
	comments: CommentType[];
	student: Student;
}

const StudentInfo: React.FC<Props> = props => {
	const { student, comments } = props;

	return (
		<Card className='mt-5 mb-4 p-4 w-75'>
			<h3>ONID: {student.ONID}</h3>
			<h5>Comments: {comments.length}</h5>
			<h5>Liked comments: {student.likedCommentIDs ? student.likedCommentIDs.length : 0}</h5>
			<h5>
				Disliked comments:{' '}
				{student.dislikedCommentIDs ? student.dislikedCommentIDs.length : 0}
			</h5>
		</Card>
	);
};

export default StudentInfo;
