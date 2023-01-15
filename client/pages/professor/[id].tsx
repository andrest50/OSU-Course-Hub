import { useQuery } from '@apollo/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import Error from 'next/error';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import { PROFESSOR } from 'graphql/queries/professor';
import { COMMENTS } from 'graphql/queries/comment';
import Comment from '../../components/Comment';
import Header from '../../components/Header';
import Info from '../../components/Info';
import { CommentData, ProfessorType, CommentType } from '../../utils/types';
import AddComment from '../../components/AddComment';

const ProfessorComments = ({ prof_comments, all_comments, updateComments, updateAllComments }) => {
	const [comments, setComments] = useState(prof_comments);
	const [allComments, setAllComments] = useState(all_comments);
	const [show, setShow] = useState(false);

	useEffect(() => {
		setComments(prof_comments.slice());
		setAllComments(all_comments.slice());
	}, [prof_comments, all_comments]);

	if (!comments) {
		return <></>;
	}

	const newComment = {
		marginBottom: '30px',
	};

	const addOneComment = (comment: CommentType) => {
		comments.unshift(comment);
		allComments.unshift(comment);
		updateComments(comments);
		updateAllComments(allComments);
	};

	const deleteOneComment = (commentID: number) => {
		const updated_comments = comments.filter(comment => commentID != parseInt(comment['id']));
		updateComments(updated_comments);
	};

	const checkIfStudentHasComment = () => {
		const studentID = window.sessionStorage.getItem('request-onid');

		return comments.filter(comment => comment.ONID == studentID).length == 0 ? false : true;
	};

	return (
		<Container>
			<Button variant='outline-info' onClick={() => setShow(true)} style={newComment}>
				New Comment
			</Button>
			<AddComment show={show} setShow={setShow} addOneComment={addOneComment} />
			<h3>Comments:</h3>
			{comments.map(comment => (
				<Comment key={comment.id} comment={comment} deleteOneComment={deleteOneComment} />
			))}
		</Container>
	);
};

const ProfessorPage = () => {
	const router = useRouter();
	const { loading, data } = useQuery<ProfessorType>(PROFESSOR, {
		variables: {
			professorID: /^\d+$/.test(router.query.id as string)
				? parseInt(router.query.id as string)
				: null,
		},
		skip: !router.query.id,
	});

	const { loading: loading_all_comments, data: data_all_comments } =
		useQuery<CommentData>(COMMENTS);

	const [professor, setProfessor] = useState<any>();
	const [comments, setComments] = useState<any>([]);
	const [allComments, setAllComments] = useState<any>([]);

	useEffect(() => {
		if (data) {
			setProfessor(data.professor);
		}
		if (data_all_comments) {
			setAllComments(data_all_comments.comments);
			setComments(
				data_all_comments.comments.filter(
					comment => comment.professorID === parseInt(router.query.id as string)
				)
			);
		}
	}, [data, data_all_comments]);

	if (loading || loading_all_comments || !router.query.id) {
		return <></>;
	} else if (!data) {
		return <Error statusCode={404} />;
	}

	return (
		<>
			<Head>
				<title>OSU Course Hub</title>
				<link rel='icon' href='/favicon.png' />
			</Head>
			<Header searchbarToggled={true} />
			<Info professor={professor} comments={comments} />
			<ProfessorComments
				prof_comments={comments}
				all_comments={allComments}
				updateComments={setComments}
				updateAllComments={setAllComments}
			/>
		</>
	);
};

export default ProfessorPage;
