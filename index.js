const express = require('express');
const storage = require('node-persist');
const app = express();
app.use(express.json());
const port = 5000;

storage.init();  //storage initialisation

// Posting All Students in Node-Persist
app.post("/student", async(req,res)=>{

    const {student_id,student_name,GPA} = req.body;

    let allStudents = await storage.setItem(student_id.toString(),{student_id,student_name,GPA});

    res.send(`Student added with id ${student_id}`);
})

// Getting All Students stored in node-persist
app.get("/allstudents", async(req,res)=>{

    let allStudents = await storage.values();
    console.log(allStudents);

    let html = `<h1> All Students Data!</h1><br/>`;

    //loop to access all values in storage
    allStudents.forEach((student)=>{
        html+= `<h3>Student ID: ${student.student_id}</h3>
                <h3>Student Name: ${student.student_name}</h3>
                <h3>Student GPA: ${student.GPA}</h3> <br/>`
    });
    res.send(html);
});

// Getting student based on req.params.id
app.get('/student/:id', async(req,res)=>{

    if((await storage.keys()).includes(req.params.id)) {

       let student = await storage.getItem(req.params.id); 

       let html = `<h1>Student Detail</h1><br/>
       <h3>Student ID: ${student.student_id}
       <h3>Student Name: ${student.student_name}
       <h3>Student GPA: ${student.GPA}`

        res.send(html);
    }
    else {
        res.send('<h1>Student not found!</h1>');
    }
});

// To get student with highest GPA
app.get("/topper", async(req,res)=>{

    let allStudents = await storage.values();

    let topperGpa = 0;
    let topper;  // In this variable Topper student will be stored

    allStudents.forEach((student)=>{
            if(student.GPA>topperGpa){
                topperGpa = student.GPA;
                topper = student;
            }
    });

    console.log(topper);

    let html = `<h1>Student Detail</h1><br/>
                <h3>Student ID: ${topper.student_id}
                <h3>Student Name: ${topper.student_name}
                <h3>Student GPA: ${topper.GPA}`

        res.send(html);
});

// If someone types invalid URL, it will show "Invalid URL"
app.use(async(req,res)=>{
    res.status(404).send("Invalid URL");
});

app.listen(port,()=>{console.log(`Server started at Port ${port}`);})
