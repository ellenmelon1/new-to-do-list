import { API, graphqlOperation } from 'aws-amplify'
import { updateTodo, createTodo, deleteTodo } from './graphql/mutations'
import * as t from 'io-ts'
import * as e from 'fp-ts/Either'
import { listTodos } from './graphql/queries'
import { ToDo } from './types'
import { toDoSchema } from './types'
import { Storage } from 'aws-amplify'

const updateToDoResponse = t.type({ data: t.type({ updateTodo: toDoSchema }) })
export const updateToDo = async (id: string, description: string) => {
    const todoDetails = {
        id: id,
        description: description,
    }
    const updatedToDoData = await API.graphql(graphqlOperation(updateTodo, { input: todoDetails }))

    const maybeToDoData = updateToDoResponse.decode(updatedToDoData)
    if (e.isLeft(maybeToDoData)) {
        throw Error("updated to-do data returned from database isn't shaped as expected")
    }
    const updatedTodo = maybeToDoData.right.data.updateTodo
    return updatedTodo
}

// const fetchToDoResponse = t.type({ data: t.type({ listTodos: t.type({ items: t.array(toDoSchema) }) }) })
export const fetchToDos = async () => {
    // fetch all to-dos from DynamoDB
    const listTodosResponse = await API.graphql(graphqlOperation(listTodos)) as any

    // check returned data is of the expected shape
    // const maybeToDoData = fetchToDoResponse.decode(listTodosResponse)
    // if (e.isLeft(maybeToDoData)) {
    //     throw Error("to-do list items returned from database aren't shaped as expected")
    // }
    // const todos = maybeToDoData.right.data.listTodos.items
    return listTodosResponse.data.listTodos.items
}

const createToDoResponse = t.type({ data: t.type({ createTodo: toDoSchema }) })
export const createToDo = async (todo: ToDo) => {
    const newToDo = await API.graphql(graphqlOperation(createTodo, { input: todo }))

    const maybeNewToDoData = createToDoResponse.decode(newToDo)
    if (e.isLeft(maybeNewToDoData)) {
        throw Error("to-do data returned from database isn't shaped as expected")
    }
    const returnToDo = maybeNewToDoData.right.data.createTodo
    return returnToDo
}

const deleteToDoResponse = t.type({ data: t.type({ deleteTodo: toDoSchema }) })
export const deleteToDo = async (toDoId: string) => {
    const toDoDetails = { id: toDoId }

    const deletedToDo = await API.graphql(graphqlOperation(deleteTodo, { input: toDoDetails }))

    const maybeDeleteToDoData = deleteToDoResponse.decode(deletedToDo)
    if (e.isLeft(maybeDeleteToDoData)) {
        throw Error("deleted to-do item data returned from database isn't shaped as expected")
    }

    const returnToDoId = maybeDeleteToDoData.right.data.deleteTodo.id
    return returnToDoId
}

export const getFileAndAssignToTodo = async (incomingTodo: ToDo) => {
    const newToDoWithLink = { ...incomingTodo }
    try {
        const link = await Storage.get(incomingTodo.s3Reference)

        // check the returned link is a string as expected
        const expectedLink = t.string
        const maybeLink = expectedLink.decode(link)

        // if it isn't, set the fileError key
        if (e.isLeft(maybeLink)) {
            newToDoWithLink.fileError = 'failed to retrieve link to file'
            return newToDoWithLink
        }
        newToDoWithLink.fileLink = maybeLink.right

        return newToDoWithLink
    } catch (err) {
        newToDoWithLink.fileError = 'failed to retrieve link to file'
        return newToDoWithLink
    }
}

export const putFile = async (s3Reference: string, selectedFile: File) => {
    try {
        await Storage.put(s3Reference, selectedFile)
    } catch (error) {
        throw new Error('Error attaching file')
    }
}
