import StudentInfo from '../../components/StudentInfo';
import 'bootstrap/dist/css/bootstrap.min.css';
import Head from 'next/head';
import React, {useState, useEffect} from 'react';
import Header from '../../components/Header';
import TestingAPI from '../../components/TestingAPI';
import { ApolloClient, getApolloContext, useQuery } from '@apollo/client';
import {STUDENTS, STUDENT} from 'utils/graphql';
import { useRouter } from 'next/router'

export default function Professor() {
	const router = useRouter();
	/*const [queryId, setQueryId] = useState(null)
	useEffect(() => {
		if(router && router.query) {
		setQueryId(router.query.id)
		}
	}, [router]);
	console.log(queryId);*/
	const {ONID} = router.query;
	console.log(ONID);
    /*const {data} = useQuery(COURSE, {
        variables: {courseID: id},
    });
	console.log(data);
	const course = null;
	if(data){
		course = data.course.course;
		console.log(course);
	}*/
	const { loading, error, data } = useQuery(STUDENTS);
	if (error) {
		return <div>Error</div>;
	} else if (loading) {
		return <div>Loading...</div>;
	}	
	console.log(data);
	var student = null;
	if(data){
		const students = data.students.filter(student => student.ONID == ONID);
		student = students[0];
	}
	if(student){
		return (
			<>
				<Head>
					<title>OSU Course Hub</title>
					<link rel='icon' href='/favicon.png' />
				</Head>
				<Header searchbarToggled={false} />
				<StudentInfo student={student}/>
				{/*<TestingAPI professors={data.professors}/>*/}     
			</>
		);
	}
	else {
		return (
			<div>
				<h3>404 Error: Page does not exist</h3>
			</div>
		)
	}
}

/*export async function getStaticPaths() {
	const { data } = await apolloClient.query({
		query: PROFESSORS,
	});
	const paths = data.professors.map((professor) => `professor/${professor.id}`);
	console.log(paths);
    return {
      paths,
      fallback: false
    }
}*/