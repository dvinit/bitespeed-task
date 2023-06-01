# bitespeed-task
https://bitespeed.notion.site/Bitespeed-Backend-Task-Identity-Reconciliation-53392ab01fe149fab989422300423199

To run this project , system should have nodejs and mysql installed. 

In terminal run:
node index.js

Then make post requests to localhost:3000/api/identify with json body as specified in above link.

This service is also hosted online, to test it visit link: https://bitespeed-task-identify.onrender.com/api/identify . 
Make get and post requests to test the service. 
Use the json body similar to 
{
"email" : "vinit@hotmail.com",
"phoneNumber" : "+9183838"
}
Try linking numbers, mails and see the responses. 
