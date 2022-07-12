import * as t from 'io-ts'

export const toDoSchema = t.intersection([
    t.type({
        name: t.string,
        description: t.string,
        attachmentName: t.string,
        s3Reference: t.string,
    }),
    t.partial({
        fileError: t.string,
        fileLink: t.string,
        id: t.string,
        updatedAt: t.string,
        sub: t.string,
    }),
])
export type ToDo = t.TypeOf<typeof toDoSchema>
