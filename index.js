// // export const handler = async (event) => {
// //   // TODO implement
// //   const response = {
// //     statusCode: 200,
// //     body: JSON.stringify('Hello from Lambda!'),
// //   };
// //   return response;
// // };
// const randomBytes = require('crypto').randomBytes;
// const AWS = require('aws-sdk');
// const ddb = new AWS.DynamoDB.DocumentClient();

// const fleet = [
    
//     {
//         email : 'vpurijal@gmu.edu',
//         areas_of_interest: 'Machine learning',
//         first_name: 'meghana',
//         last_name: 'purijala',
//         telephone_number: '5715674099'
//     },
// ];

// exports.handler = (event, context, callback) => {
//     if (!event.requestContext.authorizer) {
//       errorResponse('Authorization not configured', context.awsRequestId, callback);
//       return;
//     }

//     const studentId = toUrlString(randomBytes(16));
//     console.log('Received event (', studentId, '): ', event);

//     // Because we're using a Cognito User Pools authorizer, all of the claims
//     // included in the authentication token are provided in the request context.
//     // This includes the username as well as other attributes.
//     // const username = event.requestContext.authorizer.claims['cognito:username'];

//     // The body field of the event in a proxy integration is a raw string.
//     // In order to extract meaningful values, we need to first parse this string
//     // into an object. A more robust implementation might inspect the Content-Type
//     // header first and use a different parsing strategy based on that value.
//     const requestBody = JSON.parse(event.body);

//     const pickupLocation = requestBody.PickupLocation;

//     const unicorn = findUnicorn(pickupLocation);

//     recordRide(studentId, unicorn).then(() => {
//         // You can use the callback function to provide a return value from your Node.js
//         // Lambda functions. The first parameter is used for failed invocations. The
//         // second parameter specifies the result data of the invocation.

//         // Because this Lambda function is called by an API Gateway proxy integration
//         // the result object must use the following structure.
//         callback(null, {
//             statusCode: 201,
//             body: JSON.stringify({
//                 studentId: studentId,
//                 Unicorn: unicorn,
//                 Eta: '30 seconds',
//             }),
//             headers: {
//                 'Access-Control-Allow-Origin': '*',
//             },
//         });
//     }).catch((err) => {
//         console.error(err);

//         // If there is an error during processing, catch it and return
//         // from the Lambda function successfully. Specify a 500 HTTP status
//         // code and provide an error message in the body. This will provide a
//         // more meaningful error response to the end client.
//         errorResponse(err.message, context.awsRequestId, callback)
//     });
// };

// // This is where you would implement logic to find the optimal unicorn for
// // this ride (possibly invoking another Lambda function as a microservice.)
// // For simplicity, we'll just pick a unicorn at random.
// function findUnicorn(pickupLocation) {
//     console.log('Finding unicorn for ', pickupLocation.Latitude, ', ', pickupLocation.Longitude);
//     return fleet[Math.floor(Math.random() * fleet.length)];
// }

// function recordRide(rideId, username, unicorn) {
//     return ddb.put({
//         TableName: 'student_db',
//         Item: {
//             studentId: studentId,
//             Unicorn: unicorn,
//             RequestTime: new Date().toISOString(),
//         },
//     }).promise();
// }

// function toUrlString(buffer) {
//     return buffer.toString('base64')
//         .replace(/\+/g, '-')
//         .replace(/\//g, '_')
//         .replace(/=/g, '');
// }

// function errorResponse(errorMessage, awsRequestId, callback) {
//   callback(null, {
//     statusCode: 500,
//     body: JSON.stringify({
//       Error: errorMessage,
//       Reference: awsRequestId,
//     }),
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//     },
//   });
// }
// import require("aws-sdk");
const AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const data = JSON.parse(event.body);

    const params = {
        TableName: 'student_db',
        Item: {
            id: context.awsRequestId,
            first_name: data.first_name,
            last_name: data.last_name,
            telephone_number: data.telephone,
            email: data.email,
            areas_of_interest: data.raffle,
           // resume: data.resume // This should be a link if you're using a service like S3
        }
    };

    try {
        await ddb.put(params).promise();
        return { statusCode: 200, body: 'Data saved successfully!' };
    } catch (error) {
        return { statusCode: 500, body: error.toString() };
    }
};
