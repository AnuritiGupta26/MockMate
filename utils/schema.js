import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const MockInterview = pgTable("MockInterview", {
  id: serial("id").primaryKey(),
  jsonMockResp: text("jsonMockResp").notNull(),
  jobPosition: varchar("jobPosition").notNull(),
  jobDesc: varchar("jobDesc").notNull(),
  jobExperience: varchar("jobExperience").notNull(),
  createdBy: varchar("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow(), // Auto timestamps
  mockId: varchar("mockId").notNull(),
});

export const UserAnswer=pgTable('userAnswer',{
  id: serial("id").primaryKey(),
  mockId: varchar("mockId").notNull(),
  question:varchar('question').notNull(),
  correctAns:text('correctAns'),
  userAns:text('userAns'),
  feedback:text('feedback'),
  rating: varchar("rating", { length: 10 }), 
  createdAt:varchar('createdAt'),
});