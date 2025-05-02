// // getValidUser
// const user = await db.users.findById(request.userId);

// if (!user) {
//   throw new Error("user not found");
// }

// if (!user.isActive) {
//   throw new Error("inactive user cannot make payments");
// }

// // ensureBalance
// if (user.balance < request.amount) {
//   throw new Error("insufficient balance");
// }

// // createPayment
// const payment = await db.payments.create({
//   userId: user.id,
//   amount: request.amount,
//   status: "pending",
//   createdAt: new Date(),
// });

// // saveBalance
// await db.users.update(user.id, {
//   balance: user.balance - request.amount,
// });

// // sendLog
// console.log(`[log] payment initiated: ${payment.id} for user ${user.id}`);

// // sendNotification
// await emailService.send(user.email, {
//   subject: "payment received",
//   body: `your payment of ${request.amount} has been processed.`,
// });

async function processPayment(request: PaymentRequest) {
  if (!request.userId || !request.amount || request.amount <= 0) {
    throw new Error("invalid payment request");
  }

  // getValidUser
  const user = await getValidUser(request.userId);

  // ensureBalance
  ensureBalance(user, request.amount);

  // createPayment
  const payment = await createPayment(user.id, request.amount);

  // saveBalance
  await updateUserBalance(user.id, user.balance, request.amount);

  // sendLog
  logPayment(payment.id, user.id);

  // sendNotification
  await notifyUser(user.email, request.amount);

  return { success: true, paymentId: payment.id };
}

async function getValidUser(userId: string) {
  const user = await db.users.findById(userId);
  if (!user) throw new Error("User not found");
  if (!user.isActive) throw new Error("Inactive user cannot make payments");
  return user;
}

function ensureBalance(user: any, amount: number) {
  if (user.balance < amount) {
    throw new Error("Insufficient balance");
  }
}

async function createPayment(userId: string, amount: number) {
  return db.payments.create({
    userId,
    amount,
    status: "PENDING",
    createdAt: new Date(),
  });
}

async function updateUserBalance(
  userId: string,
  currentBalance: number,
  amount: number
) {
  await db.users.update(userId, {
    balance: currentBalance - amount,
  });
}

function logPayment(paymentId: string, userId: string) {
  console.log(`[LOG] Payment initiated: ${paymentId} for user ${userId}`);
}

async function notifyUser(email: string, amount: number) {
  await emailService.send(email, {
    subject: "Payment received",
    body: `Your payment of ${amount} has been processed.`,
  });
}

interface PaymentRequest {
  userId: string;
  amount: number;
}

interface User {
  id: string;
  email: string;
  isActive: boolean;
  balance: number;
}

// mock database
const db = {
  users: {
    findById: async (id: string): Promise<User> => ({
      id,
      email: `user${id}@mail.com`,
      isActive: true,
      balance: 150,
    }),
    update: async (id: string, data: any) =>
      console.log(`[DB] updated user ${id}`, data),
  },
  payments: {
    create: async (data: any) => ({ id: "payment123", ...data }),
  },
};

// mock service
const emailService = {
  send: async (to: string, payload: { subject: string; body: string }) =>
    console.log(`[MAIL] sent to ${to}`, payload),
};
