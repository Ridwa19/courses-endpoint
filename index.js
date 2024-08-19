const Joi = require('joi'); // Corrected the typo from 'jio' to 'joi'
const express = require('express');
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

const courses = [
    { id: 1, name: 'course 1' },
    { id: 2, name: 'course 2' }
];

// GET all courses
app.get('/api/courses', (req, res) => {
    res.send(courses);
});

// GET a single course by ID
app.get('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('Course not found');
    res.send(course);
});

// POST a new course
app.post('/api/courses', (req, res) => {
    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    
    const course = {
        id: courses.length + 1,
        name: req.body.name
    };
    courses.push(course);
    res.status(201).send(course);
});

// PUT to update an existing course
app.put('/api/courses/:id', (req, res) => {
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if (!course) return res.status(404).send('Course not found');

    const { error } = validateCourse(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    course.name = req.body.name;
    res.send(course);
});

// DELETE a course by ID
app.delete('/api/courses/:id', (req, res) => {
    const courseIndex = courses.findIndex(c => c.id === parseInt(req.params.id));
    if (courseIndex === -1) return res.status(404).send('Course not found');

    const deletedCourse = courses.splice(courseIndex, 1);
    res.send(deletedCourse[0]);
});

// Validation function using Joi
function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });
    return schema.validate(course);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
