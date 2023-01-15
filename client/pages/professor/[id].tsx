import { useQuery } from '@apollo/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import Error from 'next/error';
import Head from 'next/head';
import { useRouter } from 'next/router';
import React, { useState, useEffect, ReactElement } from 'react';
import { Container, Button } from 'react-bootstrap';
import { PROFESSOR } from '../../graphql/queries/professor';
import { COMMENTS } from '../../graphql/queries/comment';
import Comment from '../../components/Comment';
import Header from '../../components/Header';
import Info from '../../components/Info';
import { CommentData, ProfessorType, CommentType } from '../../utils/types';
import AddComment from '../../components/AddComment';

const ProfessorComments = ({
	professorComments,
	propAllComments,
	updateComments,
	updateAllComments,
}) => {
	const [comments, setComments] = useState(professorComments);
	const [allComments, setAllComments] = useState(propAllComments);
	const [show, setShow] = useState(false);

	useEffect(() => {
		setComments(professorComments.slice());
		setAllComments(propAllComments.slice());
	}, [professorComments, propAllComments]);

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
		const updatedComments = comments.filter(comment => commentID != parseInt(comment['id']));
		updateComments(updatedComments);
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

const ProfessorPage = (): ReactElement => {
	const router = useRouter();
	const { loading, data } = useQuery<ProfessorType>(PROFESSOR, {
		variables: {
			professorID: /^\d+$/.test(router.query.id as string)
				? parseInt(router.query.id as string)
				: null,
		},
		skip: !router.query.id,
	});

	const { loading: loadingAllComments, data: dataAllComments } = useQuery<CommentData>(COMMENTS);

	const [professor, setProfessor] = useState<any>();
	const [comments, setComments] = useState<any>([]);
	const [allComments, setAllComments] = useState<any>([]);

	useEffect(() => {
		if (data) {
			setProfessor(data.professor);
		}
		if (dataAllComments) {
			setAllComments(dataAllComments.comments);
			setComments(
				dataAllComments.comments.filter(
					comment => comment.professorID === parseInt(router.query.id as string)
				)
			);
		}
	}, [data, dataAllComments]);

	if (loading || loadingAllComments || !router.query.id) {
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
				professorComments={comments}
				propAllComments={allComments}
				updateComments={setComments}
				updateAllComments={setAllComments}
			/>
		</>
	);
};

export default ProfessorPage;
