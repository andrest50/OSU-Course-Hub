import { useQuery } from '@apollo/client';
import Link from 'next/link';
import React from 'react';
import { CourseData } from '../utils/types';
import { PROFESSOR_COURSES } from '../graphql/queries/professor';

const courseBlock = {
	marginTop: 10,
};

const courseList = {
	marginRight: 10,
	display: 'inline',
};

interface Props {
	id: string;
}

const ProfessorCourses: React.FC<Props> = ({ id }) => {
	const { loading, data } = useQuery<CourseData>(PROFESSOR_COURSES, {
		variables: { professorID: parseInt(id) },
	});

	if (loading || !data) {
		return <></>;
	}
	return (
		<div style={courseBlock}>
			<h4>Courses: </h4>
			{data.courses.length > 0 ? (
				data.courses.map(course => (
					<Link key={course.id} href={`/course/${course.id}`}>
						<p style={courseList}>
							<b>
								{course.department} {course.number}
							</b>
						</p>
					</Link>
				))
			) : (
				<b>N/A</b>
			)}
		</div>
	);
};

export default ProfessorCourses;
