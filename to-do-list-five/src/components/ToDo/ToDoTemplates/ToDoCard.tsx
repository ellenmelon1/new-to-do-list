import React, { useState } from 'react'
import { Button } from '../../../bits/Button.styled'
import { ErrorMessage } from '../../../bits/ErrorMessage.styled'
import { InputSection } from '../../../bits/InputSection.styled'
import { BodyText } from '../../../bits/BodyText.styled'
import { ToDo } from '../../../types'
import { deleteToDo, updateToDo } from '../../../utils'
import { ToDoCard as Container } from '../ToDoStyles/ToDoCard.styled'
import { ToDoButtonsContainer } from '../ToDoStyles/ToDoButtonsContainer.styled'

interface ToDoCardProps {
    toDo: ToDo
    loadingSomething: (state: boolean) => void
    updateTodos: (todos: ToDo[] | ((currentToDos: ToDo[]) => ToDo[])) => void
    toDos: ToDo[]
}

const ToDoCard: ({ toDo, loadingSomething, updateTodos, toDos }: ToDoCardProps) => JSX.Element = ({
    toDo,
    loadingSomething,
    updateTodos,
    toDos,
}: ToDoCardProps) => {
    const [newDescription, setNewDescription] = useState('')
    const [errors, setErrors] = useState({ updateDescriptionError: '', deleteToDoError: '' })
    const [updatingDescription, setUpdatingDescription] = useState(false)

    const updateDescription = async (newDescription: string, toDoId: string) => {
        loadingSomething(true)
        try {
            const updatedToDo = await updateToDo(toDoId, newDescription)
            const currToDosCopy = [...toDos]
            const toDosMinusOutdatedTodo = currToDosCopy.filter(el => el.id !== toDoId)
            updateTodos([...toDosMinusOutdatedTodo, updatedToDo])
            setNewDescription('')
            setErrors({ ...errors, updateDescriptionError: '' })
        } catch (error) {
            console.error(error)
            setErrors({ ...errors, updateDescriptionError: 'Error updating description' })
        }
        loadingSomething(false)
    }

    const handleRemoveToDo = async (toDoId: string) => {
        loadingSomething(true)
        try {
            deleteToDo(toDoId)
            setErrors({ ...errors, updateDescriptionError: '' })
            updateTodos(currToDos => {
                return currToDos.filter(el => el.id !== toDoId)
            })
        } catch (error) {
            console.error(error)
            setErrors({ ...errors, deleteToDoError: 'Error deleting to-do list item' })
        }
        loadingSomething(false)
    }

    return (
        <Container>
            <BodyText>{toDo.name}</BodyText>
            {updatingDescription ? (
                <div>
                    <InputSection>
                        <label htmlFor="newDescription">New description:</label>
                        <textarea id="newDescription" value={newDescription} onChange={event => setNewDescription(event.target.value)} />
                    </InputSection>
                    <Button
                        primary={false}
                        onClick={() => {
                            updateDescription(newDescription, toDo.id!)
                        }}
                    >
                        Update description
                    </Button>
                </div>
            ) : (
                <div>
                    <p>{toDo.description}</p>
                    <a href={toDo.fileLink} download={toDo.attachmentName}>
                        {toDo.attachmentName}
                    </a>
                    <p>{toDo.fileError}</p>
                    <ToDoButtonsContainer>
                        <Button
                            primary={false}
                            onClick={() => {
                                handleRemoveToDo(toDo.id!)
                            }}
                        >
                            Completed
                        </Button>
                        <Button
                            primary={false}
                            onClick={() => {
                                setUpdatingDescription(true)
                            }}
                        >
                            Update description
                        </Button>
                    </ToDoButtonsContainer>
                    <ErrorMessage>{errors.deleteToDoError}</ErrorMessage>
                    <ErrorMessage>{errors.updateDescriptionError}</ErrorMessage>
                </div>
            )}
        </Container>
    )
}

export default ToDoCard
