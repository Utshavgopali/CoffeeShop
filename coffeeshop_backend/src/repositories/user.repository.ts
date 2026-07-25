import User, { IUser } from "../models/user.model";

export async function findUserByEmail(email: string): Promise<IUser | null> {
  return User.findOne({ email }).select("+password");
}

export async function createUser(
  name: string,
  email: string,
  hashedPassword: string
): Promise<IUser> {
  const user = new User({ name, email, password: hashedPassword });
  return user.save();
}

export async function findUserById(id: string): Promise<IUser | null> {
  return User.findById(id); // password excluded by model default (select:false)
}

// Sprint 3: fetch user by id including the password hash (for changePassword).
export async function findUserByIdWithPassword(id: string): Promise<IUser | null> {
  return User.findById(id).select("+password");
}
//   id: string,
//   updates: Partial<Pick<IUser, "name" | "email" | "avatar" | "password">>
// ): Promise<IUser | null> {
//   return User.findByIdAndUpdate(id, { $set: updates }, { new: true });
// }
