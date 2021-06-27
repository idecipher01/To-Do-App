import Head from "next/head";
import { useState, useEffect } from "react";
import {
  createStyles,
  makeStyles,
  Theme,
} from "@material-ui/core/styles";

import Sidebar from "../../src/components/sidebar";
import AddTodo from "../../src/components/addTodo";
import CompletedTodo from "../../src/components/completed";
import AllTodo from "../../src/components/all-todos";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  })
);

interface task {
  id: number;
  task: string;
  completed:boolean;
}


export default function Home() {
  const classes = useStyles();
  const [todos, setTodos] = useState<task[]>([]);

  const [activeList, setactiveList] = useState("addtodo");

  const getTodos = () =>{
    try {
      let todos = localStorage.getItem("todos");
      if (todos) setTodos(JSON.parse(todos));
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getTodos();
  }, []);

  const changeActiveList = (listname: string) => {
    console.log(listname);
    setactiveList(listname);
  };

  const handleAddTodo = (newTodo:string) => {
    try {
      if (!todos||todos.length===0) {
        let newtodo = {
          id:1,
          task:newTodo,
          completed:false
        }
        let newtodos = [newtodo]
        localStorage.setItem("todos",JSON.stringify(newtodos));
      }
      else{
        let todolist = [...todos]
        let lasttodoId = todolist[todolist.length-1];
        let newtodo = {
          id:lasttodoId.id+1,
          task:newTodo,
          completed:false
        }
        todos.push(newtodo);
        setTodos(todos);
        localStorage.setItem("todos",JSON.stringify(todos));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleComplete = (value:number) =>{
      let todo = todos.filter((t) => {
        if (t.id === value) {
          t.completed = !t.completed;
        }
        return t
      });
      localStorage.setItem("todos",JSON.stringify(todo));
      getTodos();
  }

  const handleDelete = (value:number) => {
    let todo = todos.filter((t) => {
      return t.id !== value
    });
    localStorage.setItem("todos",JSON.stringify(todo));
    getTodos();
  }

  console.log(activeList,'listname')

  return (
    <div className={classes.root}>
      <Head>
        <title> Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Sidebar changeActiveList={changeActiveList} />

      <main className={classes.content}>
        <div className={classes.toolbar} />
        {activeList === "addtodo" ? (
          <AddTodo todolist={todos} handleAddTodo= {handleAddTodo} handleComplete={handleComplete} handleDelete={handleDelete}/>
        ) : activeList === "alltodos" ? (
          <AllTodo todolist={todos} handleComplete={handleComplete}  handleDelete={handleDelete}/>
        ) : (
          <CompletedTodo todolist={todos} handleComplete={handleComplete}   handleDelete={handleDelete}/>
        )}
        {/* <AddTodo todolist={todos} />
        <AllTodo todolist={todos} />
        <CompletedTodo todolist={todos} /> */}
      </main>
    </div>
  );
}
