const db = require('../service/db')

exports.getStudents = (req, res, next) => {
    db.query("SELECT * FROM student", (error, result) => {
        if (error) res.status(404).json(error);
        res.status(200).json(result.rows)
    })
}

exports.getStudentById = (req, res, next) => {
    const id = req.params.id;
    db.query('SELECT * FROM student WHERE id = $1', [id]).then((student) => {
        res.status(200).json(student.rows[0])
    }).catch((err) => {
        res.status(404).json({ message: err })
    })
}

exports.addStudent = (req, res, next) => {

    const { name, email, age, dob } = req.body;
    db.query('SELECT * FROM student WHERE email = $1', [email]).then((existEmail) => {
        if (existEmail.rows.length > 0) {
            res.status(404).json({ message: 'Email already exists!' })
        } else {
            db.query('INSERT INTO student (name, email, age, dob) VALUES ($1, $2, $3, $4) RETURNING id', [name, email, age, dob])
                .then((result) => {
                    res.status(201).json({ message: "Student added successfully", insertId: result.rows[0].id });
                }).catch((err) => {

                    res.status(404).json({ message: err, success: false })
                })
        }
    }).catch(err => {
        console.log(err)
    })

}

exports.deleteById = (req, res, next) => {
    const id = req.params.id
    db.query('DELETE FROM student WHERE id = $1', [id]).then((result) => {

        if (result.command === "DELETE" && result.rowCount === 1) {
            res.status(201).json({ message: "Student deleted successfully." });
        } else {
            res.status(201).json({ message: "No such record." })
        }

    }).catch(err => {
        res.status(404).json({ message: err, success: false })
    })
}

exports.updateStudentById = (req, res, next) => {
    const id = req.params.id

    const { name, email, age, dob } = req.body;

    db.query('UPDATE student SET name = $1, email = $2, age = $3, dob = $4 WHERE id = $5', [name, email, age, dob, id]).then((result) => {

        if (result.command === "UPDATE" && result.rowCount === 1) {
            res.status(201).json({ message: "Student updated successfully." });
        } else {
            res.status(201).json({ message: "No such record." })
        }

    }).catch(err => {
        res.status(404).json({ message: err, success: false })
    })

}

exports.addCoursesInStudent = (req, res, next) => {
    const id = req.params.id
    db.query('UPDATE student SET courses = $1 WHERE id = $2', [req.body.courses, id]).then(result => {
        res.status(200).json({ message: "Courses added" })
    }).catch(err => {
        res.status(404).json({ message: err, success: false })
    })

}

exports.updateIndexsOfCourses = (req, res, next) => {
    const id = req.params.id;
    const { courses, index } = req.body;

    db.query('UPDATE student SET courses[$1] = $2 WHERE id =$3', [index, courses, id]).then(result => {
        res.status(200).json({ result })
    }).catch(err => {
        res.status(404).json({ message: err, success: false })
    })

}

exports.appedInCourse = (req, res, next) => {
    const id = req.params.id;
    const course = req.body.course;

    // db.query('SELECT * FROM student WHERE $1 = ANY(courses)', [course]).then(result => {
    //     result.rows.map(row => {
    //         if (row === id) console.log(true)
    //     })
    //     res.status(200).json()
    // }).catch(err => {
    //     res.status(404).json({ message: err, success: false })
    // })

    db.query('UPDATE student SET courses = array_append(courses, $1) WHERE id = $2 RETURNING *', [course, id]).then(result => {
        res.status(200).json(result.rows[0])
    }).catch(err => {
        res.status(404).json({ message: err, success: false })
    })
}

exports.removeCourse = (req, res, next) => {
    const id = req.params.id
    const course = req.body.course

    db.query("SELECT array_remove(courses, $1) FROM student WHERE id = $2", [course, id]).then(result => {
        if (result.rows.length) {

            const updated_array = result.rows[0]['array_remove']
            db.query("UPDATE student SET courses = $1 WHERE id = $2", [updated_array, id]).then(updateResult => {
                res.status(200).json({ message: "Array Updated!" })
            })
        } else {
            res.status(404).json({ message: "No such record" })
        }

    }).catch(err => {
        res.status(404).json({ message: err, success: false })
    })
}