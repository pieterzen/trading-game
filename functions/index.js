const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// Get the entire game session data
exports.getGameSession = functions.https.onCall(async (data, context) => {
  const snapshot = await admin.database().ref('gameSession').once('value');
  return snapshot.val();
});

// Update a trading post's currency
exports.updateCurrency = functions.https.onCall(async (data, context) => {
  const { postId, amount } = data;
  
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
exports.updateInventory = functions.https.onCall(async (data, context) => {
  const { postId, itemId, quantity } = data;
  
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
exports.startGame = functions.https.onCall(async (data, context) => {
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
exports.endGame = functions.https.onCall(async (data, context) => {
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
