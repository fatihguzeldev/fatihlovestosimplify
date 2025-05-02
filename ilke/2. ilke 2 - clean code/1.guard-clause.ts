interface User {
  country: string;
  age: number;
  hasPaid: boolean;
}

function showContent() {
  console.log("the content");
}

function showCensored() {
  console.log("censored");
}

function manageContent(user: User | null) {
  if (user === null) {
    throw new Error("User is null");
  }

  if (!user.hasPaid) {
    throw new Error("User has no paid subscription.");
  }

  if (user.age < 18) {
    throw new Error("User's age should be higher than 18.");
  }

  if (user.country !== "TR") {
    showCensored();

    return;
  }

  showContent();
}

// if (user !== null) {
//   if (user.hasPaid) {
//     if (user.age >= 18) {
//       if (user.country === "TR") {
//         showContent();
//       } else {
//         showCensored();
//       }
//     } else {
//       throw new Error("User's age should be higher than 18.");
//     }
//   } else {
//     throw new Error("User has no paid subscription.");
//   }
// }
