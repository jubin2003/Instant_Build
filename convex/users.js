import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// export const CreateUser = mutation({
//   args: {
//     name: v.string(),
//     email: v.string(),
//     picture: v.string(),
//     uid: v.string(),
//   },
//   handler: async (ctx, args) => {
//     //if user already exists
//     const user = await ctx.db
//       .query("users")
//       .filter((q) => q.eq(q.field("email"), args.email))
//       .collect();
//     console.log(user);
//     //if not.then add new user
//     if (user?.length === 0) {
//       const result = await ctx.db.insert("users", {
//         name: args.name,
//         email: args.email,
//         picture: args.picture,
//         uid: args.uid,
//       });
//       console.log(result);
//     }
//   },
// });
export const CreateUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    picture: v.string(),
    uid: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first(); // Use .first() since you're expecting one result.

    if (!user) {
      const result = await ctx.db.insert("users", {
        name: args.name,
        email: args.email,
        picture: args.picture,
        uid: args.uid,
        token:50000
      });
      return result; // Return the ID of the newly created user.
    }
    return user._id; // Return the existing user's ID.
  },
});


// Query to fetch user details by email
export const GetUser = query({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first(); // Return the first match.
  },
});
// Mutation to update the token count for a user
export const UpdateToken = mutation({
  args: {
    token: v.number(),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    if (isNaN(args.token) || args.token < 0) {
      throw new Error("Invalid token value. Token must be a valid number and non-negative.");
    }
    const result = await ctx.db.patch(args.userId, {
      token: args.token,
    });
    return result;
  },
});
