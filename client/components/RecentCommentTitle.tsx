import { useQuery } from '@apollo/client';
import { COURSE } from '../graphql/queries/course';
import { PROFESSOR } from '../graphql/queries/professor';

interface Props {
	courseID?: number;
	professorID?: number;
}

const RecentCommentTitle: React.FC<Props> = ({ courseID, professorID }) => {
	const { loading, data } = useQuery(courseID ? COURSE : PROFESSOR, {
		variables: {
			...(courseID && { courseID: courseID }),
			...(professorID && { professorID: professorID }),
		},
	});

	if (loading || !data) {
		return <></>;
	}
	return (
		<div>
			<h5>
				<b>
					{courseID ? `${data.course.department} ${data.course.number}` : null}
					{professorID ? `${data.professor.firstName} ${data.professor.lastName}` : null}
				</b>
			</h5>
		</div>
	);
};

export default RecentCommentTitle;
