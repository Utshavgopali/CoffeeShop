import User, { IUser } from "../models/user.model";

export async function findUserByEmail(email: string): Promise<IUser | null> {
  return User.findOne({ email });
}

export async function createUser(name: string, email: string, hashedPassword: string): Promise<IUser> {
  const user = new User({ name, email, password: hashedPassword, provider: "local" });
  return user.save();
}

export async function findUserById(id: string): Promise<IUser | null> {
  return User.findById(id).select("-password");
}

export async function findUserByGoogleId(googleId: string): Promise<IUser | null> {
  return User.findOne({ googleId }).select("+googleId");
}

export async function createGoogleUser(name: string, email: string, googleId: string, avatar?: string): Promise<IUser> {
  const user = new User({ name, email, googleId, avatar, provider: "google" });
  return user.save();
}