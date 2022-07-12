import React from 'react'
import { ToDo } from '../../types'
import ToDoCard from './ToDoTemplates/ToDoCard'

interface ToDoListProps {
    toDos: ToDo[]
    loadingSomething: (state: boolean) => void
    updateTodos: (todos: ToDo[] | ((currentToDos: ToDo[]) => ToDo[])) => void
}

const ToDoList: ({ toDos, loadingSomething, updateTodos }: ToDoListProps) => JSX.Element = ({
    toDos,
    loadingSomething,
    updateTodos,
}: ToDoListProps) => {
    if (toDos.length === 0) return <h3>Your to-do list is empty</h3>
    return (
        <div>
            <h2>Your to-do list:</h2>
            {toDos.map((element: ToDo) => (
                <ToDoCard key={element.id} toDo={element} loadingSomething={loadingSomething} updateTodos={updateTodos} toDos={toDos} />
            ))}
        </div>
    )
}

export default ToDoList
