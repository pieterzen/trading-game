/**
 * Firebase Functions for Trading Game
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as logger from 'firebase-functions/logger';

// Define interfaces for our function data
interface CurrencyData {
  postId: string;
  amount: number;
}

interface InventoryData {
  postId: string;
  itemId: string;
  quantity: number;
}

admin.initializeApp();

// Get the entire game session data
export const getGameSession = functions.https.onCall(async (request: functions.https.CallableRequest<any>) => {
  logger.info('getGameSession called', { structuredData: true });
  const snapshot = await admin.database().ref('gameSession').once('value');
  return snapshot.val();
});

// Update a trading post's currency
export const updateCurrency = functions.https.onCall(async (request: functions.https.CallableRequest<any>) => {
  const data = request.data as CurrencyData;
  const { postId, amount } = data;
  logger.info('updateCurrency called', { postId, amount, structuredData: true });

  if (typeof postId !== 'string' || typeof amount !== 'number') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with postId (string) and amount (number).'
    );
  }

  await admin.database().ref(`gameSession/tradingPosts/${postId}/currency`).set(amount);
  return { success: true, postId, amount };
});

// Update a trading post's inventory
export const updateInventory = functions.https.onCall(async (request: functions.https.CallableRequest<any>) => {
  const data = request.data as InventoryData;
  const { postId, itemId, quantity } = data;
  logger.info('updateInventory called', { postId, itemId, quantity, structuredData: true });

  if (typeof postId !== 'string' || typeof itemId !== 'string' || typeof quantity !== 'number') {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'The function must be called with postId (string), itemId (string), and quantity (number).'
    );
  }

  const inventoryRef = admin.database().ref(`gameSession/tradingPosts/${postId}/inventory/${itemId}`);

  if (quantity <= 0) {
    // Remove the item if quantity is 0 or negative
    await inventoryRef.remove();
  } else {
    // Update the item quantity
    await inventoryRef.update({ quantity });
  }

  return { success: true, postId, itemId, quantity };
});

// Start a new game session
export const startGame = functions.https.onCall(async (request: functions.https.CallableRequest<any>) => {
  logger.info('startGame called', { structuredData: true });
  const gameSessionRef = admin.database().ref('gameSession');
  const snapshot = await gameSessionRef.once('value');
  const gameSession = snapshot.val() || {};

  const updatedSession = {
    ...gameSession,
    startTime: new Date().toISOString(),
    isActive: true,
    tradingPosts: gameSession.tradingPosts || {}
  };

  // Update all trading posts to be active
  if (updatedSession.tradingPosts) {
    Object.keys(updatedSession.tradingPosts).forEach(postId => {
      updatedSession.tradingPosts[postId].isActive = true;
    });
  }

  await gameSessionRef.update(updatedSession);
  return { success: true };
});

// End the current game session
export const endGame = functions.https.onCall(async (request: functions.https.CallableRequest<any>) => {
  logger.info('endGame called', { structuredData: true });
  const gameSessionRef = admin.database().ref('gameSession');
  const snapshot = await gameSessionRef.once('value');
  const gameSession = snapshot.val() || {};

  const updatedSession = {
    ...gameSession,
    endTime: new Date().toISOString(),
    isActive: false,
    tradingPosts: gameSession.tradingPosts || {}
  };

  // Update all trading posts to be inactive
  if (updatedSession.tradingPosts) {
    Object.keys(updatedSession.tradingPosts).forEach(postId => {
      updatedSession.tradingPosts[postId].isActive = false;
    });
  }

  await gameSessionRef.update(updatedSession);
  return { success: true };
});
