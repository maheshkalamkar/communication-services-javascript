import { ChatClient } from '@azure/communication-chat';
import { AzureCommunicationTokenCredential } from '@azure/communication-common';

// Your unique Azure Communication service endpoint
let endpointUrl = 'https://chatandmessagingpoc.communication.azure.com';
// The user access token generated as part of the pre-requisites
let userAccessToken = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEwNiIsIng1dCI6Im9QMWFxQnlfR3hZU3pSaXhuQ25zdE5PU2p2cyIsInR5cCI6IkpXVCJ9.eyJza3lwZWlkIjoiYWNzOjA4MTk3MDQ4LTNiNGEtNDUzYi1hM2UzLTcxZTJmYWY1MThhMl8wMDAwMDAxMi00YTQ2LWU3ZjktNTRiNy1hNDNhMGQwMDkxNDQiLCJzY3AiOjE3OTIsImNzaSI6IjE2NTY0MjExNzIiLCJleHAiOjE2NTY1MDc1NzIsImFjc1Njb3BlIjoiY2hhdCx2b2lwIiwicmVzb3VyY2VJZCI6IjA4MTk3MDQ4LTNiNGEtNDUzYi1hM2UzLTcxZTJmYWY1MThhMiIsImlhdCI6MTY1NjQyMTE3Mn0.QKRnrfIQNeyFKIVOdmnSxADy38sF5XxYuddY1ti65NzcDeF_6fH7_ZsG0FdPRb5q4JbF2j8EZhEIJP2diK0Ri2zVpBV5bSbYEFnBl5Uc6abIFEsipimOpC2iP58yYD3-Vg9vqF_Hyqg81wHI6M2JqK0LWsL4OM9IQhbkiN5XnUqTdJRG1x9cpPyAGeo6uFf_fjKK2v-gg86gAU3gSg9kPX20DS_v2ws1Bm21YXNPo2RcqvwL-OBG6-BJRh8lK4etzjG3TI2bXSvUo61J-v0mvfRyTZJv8p-oFe87wdNdfUyAMe-c_bKleCK3WmB7hMYY0cmDIx3Rg-Nl64c_nSG0Bw';

let chatClient = new ChatClient(endpointUrl, new AzureCommunicationTokenCredential(userAccessToken));
console.log('Azure Communication Chat client created!');

async function createChatThread() {
    const createChatThreadRequest = {
        topic: "Calling Application"
    };
    const createChatThreadOptions = {
        participants: [
            {
                id: { communicationUserId: 'maheshkalamkar@gmail.com' },
                displayName: 'Mahesh'
            }
        ]
    };
    const createChatThreadResult = await chatClient.createChatThread(
        createChatThreadRequest,
        createChatThreadOptions
    );
    const threadId = createChatThreadResult.chatThread.id;
    return threadId;
}

createChatThread().then(async threadId => {
    console.log(`Thread created:${threadId}`);

    // <Get a chat thread client>
    let chatThreadClient = chatClient.getChatThreadClient(threadId);
    console.log(`Chat Thread client for threadId:${threadId}`);

    // <List all chat threads>
    const threads = chatClient.listChatThreads();
    for await (const thread of threads) {
        console.log(`Chat Thread item:${thread.id}`);
    }

    // <Receive chat messages from a chat thread>
    chatClient.startRealtimeNotifications();
    chatClient.on("chatMessageReceived", async (e) => {
        console.log("Notification chatMessageReceived!");
    });

    // <Send a message to a chat thread>
    const sendMessageRequest =
    {
        content: 'Hello Kalyani! Can you share the deck for the conference?'
    };
    let sendMessageOptions =
    {
        senderDisplayName: 'Jack',
        type: 'text'
    };

    const sendChatMessageResult = await chatThreadClient.sendMessage(sendMessageRequest, sendMessageOptions);
    const messageId = sendChatMessageResult.id;

    // <LIST MESSAGES IN A CHAT THREAD>
    const messages = chatThreadClient.listMessages();
    for await (const message of messages) {
        console.log(`Chat Thread message id:${message.id}`);
    }

    // <Add a user as a participant to the chat thread>
    const addParticipantsRequest =
    {
        participants: [
            {
                id: { communicationUserId: 'kalyani@maheshkalamkar@gmail' },
                displayName: 'Kalyani'
            }
        ]
    };
    await chatThreadClient.addParticipants(addParticipantsRequest);

    // <List users in a chat thread>
    const participants = chatThreadClient.listParticipants();
    for await (const participant of participants) {
        console.log(`participants in thread:${participant.id.communicationUserId}`);
    }

    // <Remove user from a chat thread>
    await chatThreadClient.removeParticipant({ communicationUserId: '<NEW_PARTICIPANT_USER_ID>' });
    const users = chatThreadClient.listParticipants();
    for await (const user of users) {
        console.log(`participants in thread available:${user.id.communicationUserId}`);
    }
});