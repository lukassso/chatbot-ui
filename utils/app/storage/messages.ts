import {Conversation, Message} from '@/types/chat';
import {StorageType} from '@/types/storage';

import {localSaveConversations} from './documentBased/local/conversations';
import {
    rdbmsCreateMessages,
    rdbmsDeleteMessages,
    rdbmsUpdateMessages,
} from './rdbms/messages';

export const storageCreateMessages = (
    storageType: StorageType,
    selectedConversation: Conversation,
    newMessages: Message[],
    allConversations: Conversation[],
) => {
    const messages = selectedConversation.messages;
    const updatedMessages = [...messages, ...newMessages];

    const updatedConversation: Conversation = {
        ...selectedConversation,
        messages: updatedMessages,
    };

    const updatedConversations = allConversations.map((c) => {
        if (c.id === updatedConversation.id) {
            return updatedConversation;
        }

        return c;
    });

    if (storageType === StorageType.RDBMS) {
        rdbmsCreateMessages(selectedConversation.id, newMessages);
    } else {
        localSaveConversations(updatedConversations);
    }

    return {
        single: updatedConversation,
        all: updatedConversations,
    };
};

export const storageUpdateMessages = (
    storageType: StorageType,
    selectedConversation: Conversation,
    updatedMessages: Message[],
    allConversations: Conversation[],
) => {
    // Creating a new array that replaces the old messages with the updated messages
    const updatedMessageList = selectedConversation.messages.map((message) => {
        const updatedMessage = updatedMessages.find((m) => m.id === message.id);
        if (updatedMessage) {
            return updatedMessage;
        }
        return message;
    });

    const updatedConversation: Conversation = {
        ...selectedConversation,
        messages: updatedMessageList,
    };

    const updatedConversations = allConversations.map((c) => {
        if (c.id === updatedConversation.id) {
            return updatedConversation;
        }

        return c;
    });

   if (storageType === StorageType.RDBMS) {
        rdbmsUpdateMessages(updatedMessages);
    } else {
        localSaveConversations(updatedConversations);
    }

    return {
        single: updatedConversation,
        all: updatedConversations,
    };
};

export const storageDeleteMessages = (
    storageType: StorageType,
    messageIds: string[],
    selectedConversation: Conversation,
    allMessages: Message[],
    allConversations: Conversation[],
) => {
    // Creating a new array of messages that does not include the deleted messages
    const updatedMessages = allMessages.filter(
        (message) => !messageIds.includes(message.id),
    );

    const updatedConversation: Conversation = {
        ...selectedConversation,
        messages: updatedMessages,
    };

    const updatedConversations = allConversations.map((c) => {
        if (c.id === updatedConversation.id) {
            return updatedConversation;
        }

        return c;
    });

   if (storageType === StorageType.RDBMS) {
        rdbmsDeleteMessages(messageIds);
    } else {
        localSaveConversations(updatedConversations);
    }

    return {
        single: updatedConversation,
        all: updatedConversations,
    };
};
