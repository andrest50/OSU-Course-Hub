import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { useQuery, useMutation } from '@apollo/client';
import { CREATE_COURSE, ADD_PROFESSOR_TO_COURSE } from 'graphql/mutations/course';
import { CREATE_PROFESSOR } from 'graphql/mutations/professor';
import { PROFESSORS } from 'graphql/queries/professor';
import { Colleges, Departments } from '../utils/util';
import { ProfessorData } from '../utils/types';
import { useRouter } from 'next/router';

export default function AddCourseOrProfessor() {
	const router = useRouter();
	const [values, setValues] = useState({
		type: 'course',
		department: '',
		number: '',
		firstname: '',
		lastname: '',
		college: '',
		professorId: '',
	});
	const [show, setShow] = useState(false);

	const { loading, data } = useQuery<ProfessorData>(PROFESSORS);

	const [setProfessor] = useMutation(CREATE_PROFESSOR);
	const [setCourse] = useMutation(CREATE_COURSE);
	const [setCourseProfessor] = useMutation(ADD_PROFESSOR_TO_COURSE);

	const handleClose = () => { 
		console.debug("Add page close modal")
		setShow(false);
	};
	const handleShow = () => { 
		console.debug("Add page show modal");
		setShow(true);
	}

	const handleChange = (e: any) => {
		console.debug("Add page form change: ", e, e.target.name, e.target.value);
		setValues({ ...values, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (values.type == 'course') {
			setCourse({ variables: { department: values.department, number: values.number } })
				.then((resp) => {
					console.debug("Course created: ", resp);
					console.log(values.professorId);
					setCourseProfessor({ variables: {
						professorID: parseFloat(values.professorId),
						courseID: parseFloat(resp.data.createCourse.id),
						termTaught: 'Winter',
						yearTaught: 2023,
					} })
						.then((res) => {
							console.debug("Course professor added: ", res)
							router.push(`/course/${resp.data.createCourse.id}`)
						})
				})
				.catch((err) => console.log('Failed to create course with error: ', err));
		} else if (values.type == 'professor') {
			setProfessor({
				variables: {
					firstName: values.firstname,
					lastName: values.lastname,
					college: values.college,
				},
			})
				.then((resp) => {
					console.debug("Professor created: ", resp);
					router.push(`/professor/${resp.data.createProfessor.id}`);
				});
		} else {
			alert('Invalid type error from AddProfessor.tsx');
		}
	};

	if (loading) {
		return <></>
	}

	return (
		<div>
			<Button variant='outline-info' onClick={handleShow}>
				Add Page
			</Button>

			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Add Page</Modal.Title>
				</Modal.Header>

				<Form onSubmit={handleSubmit} className='p-3'>
					<Form.Label>Would you like to add a Professor or Course</Form.Label>
					<Form.Control as='select' name='type' onChange={handleChange} className='mb-3'>
						<option value='course'>Course</option>
						<option value='professor'>Professor</option>
					</Form.Control>

					{values.type == 'course' && (
						<>
							<Form.Label>Department</Form.Label>
							<Form.Control
								as='select'
								name='department'
								onChange={handleChange}
								className='mb-3'
								required
							>
								<option value=''>Select a Department</option>
								{Departments.map((department, idx) => {
									return (
										<option value={department} key={idx}>
											{department}
										</option>
									);
								})}
							</Form.Control>
							<Form.Label>Number</Form.Label>
							<Form.Control
								type='text'
								name='number'
								onChange={handleChange}
								className='mb-3'
								required
							/>
							<Form.Label>Professor</Form.Label>
							<Form.Control
								as='select'
								name='professorId'
								onChange={handleChange}
								className='mb-3'
								required
							>
								<option value=''>Select a Professor</option>
								{data?.professors.map((professor, idx) => {
									return (
										<option value={professor.id} key={idx}>
											{professor.firstName} {professor.lastName}
										</option>
									);
								})}
							</Form.Control>
						</>
					)}

					{values.type == 'professor' && (
						<>
							<Form.Label>First Name</Form.Label>
							<Form.Control
								type='text'
								name='firstname'
								onChange={handleChange}
								className='mb-3'
								required
							/>
							<Form.Label>Last Name</Form.Label>
							<Form.Control
								type='text'
								name='lastname'
								onChange={handleChange}
								className='mb-3'
								required
							/>
							<Form.Label>Colleges</Form.Label>
							<Form.Control
								as='select'
								name='college'
								onChange={handleChange}
								className='mb-3'
								defaultValue='Select Dept'
								required
							>
								<option value=''>Select a College</option>
								{Colleges.map((college, idx) => {
									return (
										<option value={college} key={idx}>
											{college}
										</option>
									);
								})}
							</Form.Control>
						</>
					)}

					<Modal.Footer>
						<Button variant='primary' type='submit'>
							Add Page
						</Button>
					</Modal.Footer>
				</Form>
			</Modal>
		</div>
	);
}
