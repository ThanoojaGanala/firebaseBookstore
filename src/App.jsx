import { useState, useEffect } from 'react';
import { AgGridReact } from 'ag-grid-react';
import './App.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import AddTodo from './AddBook';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

function App() {
  const [todos, setTodos] = useState([]);

  const columnDefs = [
    { field: 'title', sortable: true, filter: true},
    { field: 'author', sortable: true, filter: true},
    { field: 'year', sortable: true, filter: true},
    { field: 'isbn', sortable: true, filter: true},
    { field: 'price', sortable: true, filter: true},
    {
      headerName:'',
      field:'id',
      width:90,
      cellRenderer: params =>
      <IconButton onClick={() => deleteTodo(params.value)} size="small" color="error">
        <DeleteIcon />
      </IconButton>
    }
  ]

  useEffect(() => {
    fetchBooks();
  }, [])


  const fetchBooks = () => {
    fetch(`https://bookstore-390bb-default-rtdb.europe-west1.firebasedatabase.app/books/.json`)
    .then(response => response.json())
    .then(data => addKeys(data))
    .catch(err => console.error(err))
  }

  const addKeys = (data) => {
    const keys = Object.keys(data)
    const valueKeys = Object.values(data).map((item, index) =>
    Object.defineProperty(item, 'id', {value:keys[index]}));
    setTodos(valueKeys);
  }

  const addTodo = (newTodo) => {
    fetch(`https://bookstore-390bb-default-rtdb.europe-west1.firebasedatabase.app/books/.json` ,
    {
        method: 'POST',
        body: JSON.stringify(newTodo)
    })
    .then(response => fetchBooks())
    .catch(err => console.error(err))
  }

  const deleteTodo = (id) => {
    fetch(`https://bookstore-390bb-default-rtdb.europe-west1.firebasedatabase.app/books/${id}.json`,
    {
      method: 'DELETE',
    })
    .then(response => fetchBooks())
    .catch(err => console.error (err))
  }



  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5">
            Book Store
          </Typography>
        </Toolbar>
      </AppBar>
      <AddTodo addTodo={addTodo}/>
      <div className="ag-theme-material" style={{height: 400, width: 1100}}> 
      <AgGridReact 
          rowData={todos}
          columnDefs={columnDefs}
        />
      </div>
    </>
  )
}

export default App
