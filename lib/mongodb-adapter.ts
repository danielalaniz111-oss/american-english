import type { Adapter, AdapterUser, AdapterAccount, AdapterSession, VerificationToken } from "next-auth/adapters"
import { ObjectId } from "mongodb"
import { getDb } from "./db"

export function MongoDBAdapter(): Adapter {
  return {
    async createUser(user) {
      const db = await getDb()
      const now = new Date()
      const result = await db.collection("users").insertOne({
        ...user,
        _id: new ObjectId(),
        role: 'USER',
        createdAt: now,
        updatedAt: now,
      })
      const createdUser = await db.collection("users").findOne({ _id: result.insertedId })
      if (!createdUser) throw new Error("Failed to create user")
      return {
        id: createdUser._id.toString(),
        email: createdUser.email,
        emailVerified: createdUser.emailVerified || null,
        name: createdUser.name || null,
        image: createdUser.image || null,
      }
    },

    async getUser(id) {
      const db = await getDb()
      const user = await db.collection("users").findOne({ _id: new ObjectId(id) })
      if (!user) return null
      return {
        id: user._id.toString(),
        email: user.email,
        emailVerified: user.emailVerified || null,
        name: user.name || null,
        image: user.image || null,
      }
    },

    async getUserByEmail(email) {
      const db = await getDb()
      const user = await db.collection("users").findOne({ email })
      if (!user) return null
      return {
        id: user._id.toString(),
        email: user.email,
        emailVerified: user.emailVerified || null,
        name: user.name || null,
        image: user.image || null,
      }
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const db = await getDb()
      const account = await db.collection("accounts").findOne({
        provider,
        providerAccountId,
      })
      if (!account) return null
      const user = await db.collection("users").findOne({ _id: new ObjectId(account.userId.toString()) })
      if (!user) return null
      return {
        id: user._id.toString(),
        email: user.email,
        emailVerified: user.emailVerified || null,
        name: user.name || null,
        image: user.image || null,
      }
    },

    async updateUser(user) {
      const db = await getDb()
      const { id, ...rest } = user
      await db.collection("users").updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...rest, updatedAt: new Date() } }
      )
      const updated = await db.collection("users").findOne({ _id: new ObjectId(id) })
      if (!updated) throw new Error("Failed to update user")
      return {
        id: updated._id.toString(),
        email: updated.email,
        emailVerified: updated.emailVerified || null,
        name: updated.name || null,
        image: updated.image || null,
      }
    },

    async deleteUser(userId) {
      const db = await getDb()
      await db.collection("users").deleteOne({ _id: new ObjectId(userId) })
    },

    async linkAccount(account) {
      const db = await getDb()
      await db.collection("accounts").insertOne({
        ...account,
        _id: new ObjectId(),
        userId: new ObjectId(account.userId),
      })
      return account as AdapterAccount
    },

    async unlinkAccount({ providerAccountId, provider }) {
      const db = await getDb()
      await db.collection("accounts").deleteOne({
        provider,
        providerAccountId,
      })
    },

    async createSession({ sessionToken, userId, expires }) {
      const db = await getDb()
      await db.collection("sessions").insertOne({
        _id: new ObjectId(),
        sessionToken,
        userId: new ObjectId(userId),
        expires,
      })
      return { sessionToken, userId, expires }
    },

    async getSessionAndUser(sessionToken) {
      const db = await getDb()
      const session = await db.collection("sessions").findOne({ sessionToken })
      if (!session) return null
      const user = await db.collection("users").findOne({ _id: new ObjectId(session.userId.toString()) })
      if (!user) return null
      return {
        session: {
          sessionToken: session.sessionToken,
          userId: session.userId.toString(),
          expires: session.expires,
        },
        user: {
          id: user._id.toString(),
          email: user.email,
          emailVerified: user.emailVerified || null,
          name: user.name || null,
          image: user.image || null,
        },
      }
    },

    async updateSession(session) {
      const db = await getDb()
      await db.collection("sessions").updateOne(
        { sessionToken: session.sessionToken },
        { $set: session }
      )
      return session as AdapterSession
    },

    async deleteSession(sessionToken) {
      const db = await getDb()
      await db.collection("sessions").deleteOne({ sessionToken })
    },

    async createVerificationToken(token) {
      const db = await getDb()
      await db.collection("verification_tokens").insertOne({
        ...token,
        _id: new ObjectId(),
      })
      return token as VerificationToken
    },

    async useVerificationToken({ identifier, token }) {
      const db = await getDb()
      const result = await db.collection("verification_tokens").findOneAndDelete({
        identifier,
        token,
      })
      if (!result) return null
      return {
        identifier: result.identifier,
        token: result.token,
        expires: result.expires,
      }
    },
  }
}
