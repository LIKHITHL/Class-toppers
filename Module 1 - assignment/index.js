const express = require  ('express');
const app = express();
const storage = require('node-persist');

storage.init();
// For POST request of adding Student ID in RAW JSON
app.use(express.json());
app.post('/addStudent', (req, res) => {
    const { studentId, studentName, CurrentGPA } = req.body;
    // studentID is a particular Id for each student.
    // studentName is a name of the student.
    // CurrentGPA is grade point of three student.
    storage.setItem(studentId, { studentId, studentName, CurrentGPA });
    res.status(200).send(`
    <div style="background-color: lightgreen; color: green; text-align: center;">
        <h1>Student Added Successfully...!</h1>
    </div>
    `);
});

// Using GET for the student with a particular Id
app.get('/student/:id', async (req, res) => {
    const studentId = req.params.id;
    // This will get the Id from the storage
    const student = await storage.getItem(studentId);

    if (student) {
        res.send(`
        <div style="text-align: center; background-color: rgba(120, 197, 171, 0.795); color: rgba(0,0,0,0.8);">    
        <h1>Student details :- </h1>
        <h4> STUDENT ID :- ${student.studentId}</h4>
        <h4> STUDENT NAME :- ${student.studentName}</h4>
        <h4> CURRENT GPA :- ${student.CurrentGPA}</h4>
        </div>
        `)
    } else {
        res.status(404).send(`
        <div style="background-color: rgba(255, 0, 0, 0.425); color: red; text-align: center;">
        <h1>Student Not Found</h1>
        </div>
        ` );
    }

});

// And we use again GET for having all students
app.get('/allStudents', async (req, res) => {
    const all = await storage.values();
    let myall = `
    <div style="text-align: center; background-color: rgba(120, 197, 171, 0.795); color: rgba(0,0,0,0.8);">
    <h1> This is All Student Details.....!</h1>
    </div>
    `;
    for (let student of all) {
        myall += `
        <div style="text-align: center; background-color: rgba(120, 197, 171, 0.5); color: rgba(0,0,0,0.8);">    
        <h4> STUDENT ID :- ${student.studentId}</h4>
        <h4> STUDENT NAME :- ${student.studentName}</h4>
        <h4> CURRENT GPA :- ${student.CurrentGPA}</h4>
        </div>
        `
    }
    res.send(myall);
});

// Again GET we used to declare the Topper..!
app.get('/topper', async(req,res) => {
    const toppers = await storage.values();
    let highestGPA = 0;
    let topper = 0;

    for(const student of toppers){
        if(student.CurrentGPA > highestGPA) {
            highestGPA = student.CurrentGPA;
            topper = student;
        }
    }

    if (topper) {
        res.send(`
        <div style="text-align: center; background-color: rgba(120, 197, 171, 0.795); color: rgba(0,0,0,0.8);">    
        <h1 style="text-decoration: underline;"> Topper in Class 🎉 </h1>
        <h4> STUDENT ID :- ${topper.studentId}</h4>
        <h4> STUDENT NAME :- ${topper.studentName}</h4>
        <h4> CURRENT GPA :- ${topper.CurrentGPA}</h4>
        </div>
        `)
    } else {
        res.status(404).send(`
        <div style="background-color: rgba(255, 0, 0, 0.425); color: red; text-align: center;">
        <h1> No student in class </h1>
        </div>
        ` );
    }
});

// Server port
app.listen(5000, () => {
    console.log('Server has started..............!');
});