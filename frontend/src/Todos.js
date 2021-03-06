import { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {DragDropContext,Draggable,Droppable} from "react-beautiful-dnd"
import {
  Container,
  Typography,
  Button,
  Icon,
  Paper,
  Box,
  TextField,
  Checkbox,
} from "@material-ui/core";
// import { response } from "../../backend/src/api";

const useStyles = makeStyles({
  addTodoContainer: { padding: 10 },
  addTodoButton: { marginLeft: 5 },
  todosContainer: { marginTop: 10, padding: 10 },
  todoContainer: {
    borderTop: "1px solid #bfbfbf",
    marginTop: 5,
    "&:first-child": {
      margin: 0,
      borderTop: "none",
    },
    "&:hover": {
      "& $deleteTodo": {
        visibility: "visible",
      },
    },
  },
  todoTextCompleted: {
    textDecoration: "line-through",
  },
  deleteTodo: {
    visibility: "hidden",
  },
});



function Todos() {
  
  const classes = useStyles();
  const [todos, setTodos] = useState([]);
  const [newTodoText, setNewTodoText] = useState("");
  const [newdate, setnewdate] = useState("");
  const [newtime, setnewtime] = useState("");
  //todos.sort(byDate)
  useEffect(() => {
    fetch("https://todoslss.herokuapp.com/")
      .then((response) => response.json())
      .then((todos) => setTodos(todos));
  }, [setTodos]);

  

  function addTodo(text,date, time) {
    fetch("https://todoslss.herokuapp.com/", {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ text,date ,time}),
    })
      .then((response) => response.json())
      .then((todo) => setTodos([...todos, todo]));
    setNewTodoText("");
    setnewdate("");
    setnewtime("");
  }
  
  function toggleTodoCompleted(id) {
    fetch(`https://todoslss.herokuapp.com/${id}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({
        completed: !todos.find((todo) => todo.id === id).completed,
      }),
    }).then(() => {
      const newTodos = [...todos];
      const modifiedTodoIndex = newTodos.findIndex((todo) => todo.id === id);
      newTodos[modifiedTodoIndex] = {
        ...newTodos[modifiedTodoIndex],
        completed: !newTodos[modifiedTodoIndex].completed,
      };
      setTodos(newTodos);
      
    });
  }
 
  function deleteTodo(id) {
    fetch(`https://todoslss.herokuapp.com/${id}`, {
      method: "DELETE",
    }).then(() => setTodos(todos.filter((todo) => todo.id !== id)));
  }
  
  

  const handleDragEnd = (results) =>{
    if(!results.destination) return;
    let temptodos= [...todos]
    let [selectedrow] = temptodos.splice(results.source.index,1)
    temptodos.splice(results.destination.index,0,selectedrow)
    setTodos(temptodos)
    // console.log(temptodos)
    // console.log(results)


  }
  // for sorting the lists
  function byDate(a, b) {
    //chronologically by year, month, then day
    return new Date(a.date).valueOf() - new Date(b.date).valueOf(); //timestamps
    
  }
 function swap() {
  let swaptodos = [...todos]
  setTodos(swaptodos.sort(byDate))
 }
  //console.log(todos.sort(by));
    return (  
      <DragDropContext onDragEnd={(results) => handleDragEnd(results)}>
        
        <Container maxWidth="md" style={{
        backgroundColor: 'yellow'
      
      }} >
        
        <Typography variant="h3" component="h1" gutterBottom>
        Todos
      </Typography>
      <Paper className={classes.addTodoContainer}>
        <Box display="flex" flexDirection="row">
          <Box flexGrow={2}>
         
           
            <TextField
         
        placeholder ='Task name'
         value={newTodoText}
         onKeyPress={(event) => {
           if (event.key === "Enter") {
             addTodo(newTodoText);
           }
         }}
         onChange={(event) => setNewTodoText(event.target.value)}
           />   
           <TextField
         
         type='date'
          value={newdate}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              addTodo(newdate);
            }
          }}
          onChange={(event) => setnewdate(event.target.value)}
            />   
            <TextField
         
         type='time'
          value={newtime}
          onKeyPress={(event) => {
            if (event.key === "Enter") {
              addTodo(newtime);
            }
          }}
          onChange={(event) => setnewtime(event.target.value)}
            />   
            
            
          
          </Box>

          <Button
            className={classes.addTodoButton}
            startIcon={<Icon>add</Icon>}
            onClick={() => addTodo(newTodoText,newdate,newtime)}
          >
            Add
          </Button>
          <Button
            className={classes.addTodoButton}
            startIcon={<Icon>add</Icon>}
            onClick={() => swap()}
          >
           SORT
          </Button>
    

        </Box>
      </Paper>
      { todos.length > 0 && (
          <Droppable droppableId="draggable-1">
          {(provided) =>  (<div 
            ref={provided.innerRef}
            {...provided.droppableProps}  >
              <Box display="flex" flexDirection="column" alignItems="stretch" className={classes.todosContainer}>

                {todos.map(({ id, text,date,time, completed},index) => (
                  
                  <Draggable draggableId={id} index={index} key={id} >
                    
                     { (provided) =>(
                      <div  ref={provided.innerRef}
                      {...provided.draggableProps}>
                     <Box
                    
                
                 key={id}
                  display="flex"
                  flexDirection="row"
                  alignItems="center"
                  className={classes.todoContainer}
                >
                  <Checkbox
                    checked={completed}
                    onChange={() => toggleTodoCompleted(id)}
                  ></Checkbox>
                  <Box {...provided.dragHandleProps} flexGrow={1}>
                    <Typography
                      className={completed ? classes.todoTextCompleted : ""}
                      variant="body1"
                    >
                      Task:{text} | Date:{date} | Time:{time}
                     
                    </Typography>
                  </Box>
                  <Button
                    className={classes.deleteTodo}
                    startIcon={<Icon>delete</Icon>}
                    onClick={() => deleteTodo(id)}
                  >
                    Delete
                  </Button>
                </Box> </div>)}
                    </Draggable>
                  
                ))}{provided.placeholder}
              </Box>
              
            </div>)}
        </Droppable>
        )}

    
      
    </Container>
      </DragDropContext>
      
      

  );
} 
export default Todos;
    