const { v4 } = require('uuid')
const AWS = require('aws-sdk')

// list all tasks
const index = async (event) => {
    // connect to dynamoDB
    const dynamoDb = new AWS.DynamoDB.DocumentClient()

    // get all tasks
    const { Items } = await dynamoDb.scan({
        TableName: 'TaskTable'
    }).promise()

    // response to client side
    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                data: {
                    items: Items
                }
            }
        )
    }
}


// create a new task
const store = async (event) => {
    // connect to dynamoDB
    const dynamoDb = new AWS.DynamoDB.DocumentClient()

    // get the body of the request
    const { title, description } = JSON.parse(event.body)

    const createdAt = new Date().toISOString()
    const updatedAt = new Date().toISOString()
    const id = v4()

    // send to database dynamodb
    const newTask = {
        id,
        title,
        description,
        done: false,
        createdAt,
        updatedAt
    }

    try {
        await dynamoDb.put({
            TableName: 'TaskTable',
            Item: newTask
        }).promise()


        // response to client side
        return {
            statusCode: 201,
            body: JSON.stringify(
                {
                    data: {
                        message: "Task stored successfully",
                        item: newTask
                    }
                }
            )
        }

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: {
                    title: "Could not store the task",
                    detail: "Please try again, if the problem persists contact the administrator"
                }
            })
        }
    }

}

// show a task
const show = async (event) => {
    // connect to dynamoDB
    const dynamoDb = new AWS.DynamoDB.DocumentClient()

    // get the id of the task for the pathParameters
    const { id } = event.pathParameters

    // get the task
    try {
        const { Item } = await dynamoDb.get({
            TableName: 'TaskTable',
            Key: {
                id
            }
        }).promise()

        // response to client side
        return {
            statusCode: 200,
            body: JSON.stringify({
                data: {
                    item: Item
                }
            })
        }

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: {
                    title: "Could not show the task",
                    detail: "Please try again, if the problem persists contact the administrator"
                }
            })
        }
    }


}


// update a task
const update = async (event) => {
    // connect to dynamoDB
    const dynamoDb = new AWS.DynamoDB.DocumentClient()

    // get the id of the task for the pathParameters
    const { id } = event.pathParameters
    // get the body of the request
    const { done } = JSON.parse(event.body)
    const updatedAt = new Date().toISOString()

    try {
        const { Attributes } = await dynamoDb.update({
            TableName: 'TaskTable',
            Key: { id },
            UpdateExpression: 'set done = :done, updatedAt = :updatedAt',
            ExpressionAttributeValues: {
                ':done': done,
                ':updatedAt': updatedAt
            },
            ReturnValues: 'ALL_NEW'
        }).promise()

        // response to client side
        return {
            statusCode: 200,
            body: JSON.stringify(
                {
                    data: {
                        message: "Task updated successfully",
                        item: Attributes
                    }
                }
            )
        }

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: {
                    title: "Could not update the task",
                    detail: "Please try again, if the problem persists contact the administrator"
                }
            })
        }
    }


}

// delete a task
const destroy = async (event) => {
    // connect to dynamoDB
    const dynamoDb = new AWS.DynamoDB.DocumentClient()

    // get the id of the task for the pathParameters
    const { id } = event.pathParameters

    try {
        await dynamoDb.delete({
            TableName: 'TaskTable',
            Key: {
                id
            }
        }).promise()

        // response to client side
        return {
            statusCode: 200,
            body: JSON.stringify({
                data: { message: "Task deleted successfully" }
            })
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: {
                    title: "Could not delete the task",
                    detail: "Please try again, if the problem persists contact the administrator"
                }
            })
        }
    }

}

module.exports = { index, store, show, update, destroy }
