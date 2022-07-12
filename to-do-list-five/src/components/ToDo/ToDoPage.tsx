import React, { useContext, useEffect, useState } from 'react'
import { ErrorMessage } from '../../bits/ErrorMessage.styled'
import { ToDo } from '../../types'
import { fetchToDos, getFileAndAssignToTodo } from '../../utils'
import AuthContext from '../../WithAuth/context'
import Spinner from '../Spinner'
import ToDoList from './ToDoList'
import CreateToDoForm from './ToDoTemplates/CreateToDoForm'
import { ToDoPageContainer } from './ToDoStyles/ToDoPageContainer.styled'

const ToDoPage: () => JSX.Element = () => {
    const [showSpinner, setShowSpinner] = useState(true)
    const [toDos, setToDos] = useState<ToDo[]>([])
    const [failedToFetchDataError, setFailedToFetchDataError] = useState('')
    const { currentUser } = useContext(AuthContext)

    useEffect(() => {
        if (currentUser) {
            const fetchData = async (): Promise<void> => {
                setShowSpinner(true)
                try {
                    const todos = await fetchToDos()
                    // TODO make this work serverside when we end up doing cloud stuffs
                    // filter to-dos so only logged in user's shown
                    const filteredToDos = todos.filter((todo: ToDo) => todo.sub === currentUser?.attributes?.sub)

                    // if the item has a file associated with it, add link to download from S3
                    for (let todo of filteredToDos) {
                        if (todo.s3Reference) {
                            todo = await getFileAndAssignToTodo(todo)
                        }
                    }
                    setToDos(filteredToDos)
                } catch (error) {
                    console.error(error)
                    setFailedToFetchDataError('Error retrieving user data')
                }
                setShowSpinner(false)
                setFailedToFetchDataError('')
            }
            fetchData()
        }
    }, [currentUser])

    return showSpinner ? (
        <Spinner />
    ) : (
        <ToDoPageContainer>
            <h1>Welcome {currentUser?.username}!</h1>
            <CreateToDoForm onCreateStart={setShowSpinner} onTodosCreated={setToDos} toDos={toDos} />
            <ToDoList toDos={toDos} loadingSomething={setShowSpinner} updateTodos={setToDos} />
            <ErrorMessage>{failedToFetchDataError}</ErrorMessage>
        </ToDoPageContainer>
    )
}

export default ToDoPage
