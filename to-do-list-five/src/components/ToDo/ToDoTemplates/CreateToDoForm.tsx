import styled from 'styled-components'
import { v4 as uuidv4 } from 'uuid'
import { Button } from '../../../bits/Button.styled'
import { ErrorMessage } from '../../../bits/ErrorMessage.styled'
import { InputSection } from '../../../bits/InputSection.styled'
import { CreateToDoContainer } from '../ToDoStyles/CreateToDoContainer.styled'
import { putFile, createToDo } from '../../../utils'
import React, { useState, useContext } from 'react'
import { ToDo } from '../../../types'
import AuthContext from '../../../WithAuth/context'

const initialFormState = { name: '', description: '', attachmentName: '', s3Reference: '', sub: '' }

const InputSectionWithTopMargin = styled(InputSection)`
    margin-top: 16px;
`

interface CreateToDoFormProps {
    onCreateStart: (state: boolean) => void
    onTodosCreated: (todos: ToDo[]) => void
    toDos: ToDo[]
}

const CreateToDoForm: ({ onCreateStart, onTodosCreated, toDos }: CreateToDoFormProps) => JSX.Element = ({
    onCreateStart,
    onTodosCreated,
    toDos,
}: CreateToDoFormProps) => {
    const { currentUser } = useContext(AuthContext)
    const [formState, setFormState] = useState(initialFormState)
    const [selectedFile, setSelectedFile] = useState<File>()
    const [createToDoErrors, setCreateToDoErrors] = useState({ text: '', file: '' })
    const [formErrors, setFormErrors] = useState({ name: '', description: '' })

    const addTodo = async () => {
        onCreateStart(true)
        const errors = {
            name: formState.name.length === 0 ? 'To-do list item must have a name' : '',
            description: formState.description.length === 0 ? 'To-do list item must have a description' : '',
        }
        if (errors.name || errors.description) {
            setFormErrors(errors)
        } else {
            try {
                // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                const todo = { ...formState, sub: currentUser?.attributes?.sub! }

                const newToDo = await createToDo(todo)

                // if the user attached a file, upload it to the S3 bucket
                if (selectedFile) {
                    try {
                        await putFile(formState.s3Reference, selectedFile)
                    } catch (error) {
                        setCreateToDoErrors({ ...createToDoErrors, file: error as string })
                    }
                }
                onTodosCreated([newToDo, ...toDos])
                setFormState(initialFormState)
                setSelectedFile(undefined)
            } catch (error) {
                console.error(error)
                setCreateToDoErrors({ ...createToDoErrors, text: 'Error creating new to-do list item' })
            }
        }
        onCreateStart(false)
    }

    const attachFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        // create a uuid for the file to reference in DynamoDB *and* S3, plus the correct file type extension

        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
        const fileName = event.target.files?.[0].name!

        // retrieving it from file.type doesn't work because it's stored as image/jpeg and I need .jpg
        const fileType = event.target.files?.[0].name!.split('.')[1]

        const fileRef = uuidv4() + '.' + fileType
        setFormState({ ...formState, attachmentName: fileName!, s3Reference: fileRef })
        setSelectedFile(event.target.files?.[0])
    }

    return (
        <CreateToDoContainer>
            <h2>Create to-do:</h2>
            <InputSection>
                <label htmlFor="name">Name</label>
                <input
                    id="name"
                    value={formState.name}
                    onChange={event => {
                        setFormState({ ...formState, name: event.target.value })
                        setFormErrors({ ...formErrors, name: '' })
                    }}
                />
                <ErrorMessage>{formErrors.name}</ErrorMessage>
            </InputSection>
            <InputSection>
                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    value={formState.description}
                    onChange={event => {
                        setFormState({ ...formState, description: event.target.value })
                        setFormErrors({ ...formErrors, description: '' })
                    }}
                />
                <ErrorMessage>{formErrors.description}</ErrorMessage>
            </InputSection>
            <InputSection>
                <label htmlFor="file">Attach a file (optional)</label>
                <input type="file" id="file" onChange={attachFile} />
            </InputSection>
            <InputSectionWithTopMargin>
                <Button primary onClick={addTodo}>
                    Create to do
                </Button>
            </InputSectionWithTopMargin>
            <ErrorMessage>{createToDoErrors.text}</ErrorMessage>
            <ErrorMessage>{createToDoErrors.file}</ErrorMessage>
        </CreateToDoContainer>
    )
}

export default CreateToDoForm
