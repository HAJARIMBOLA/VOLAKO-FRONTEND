import "server-only";
import { backendFetch } from "../backend";
import { withAuth, withAuthRetry } from "./helpers";
import type { Goal } from "../types";

export interface GoalInput {
  name: string;
  targetAmount: number;
  targetDate?: string;
}

export interface GoalContributionInput {
  accountId: number;
  amount: number;
  contributionDate: string;
}

export function getGoals(): Promise<Goal[]> {
  return withAuth((token) => backendFetch<Goal[]>("/api/goals", { accessToken: token }));
}

export function createGoal(input: GoalInput): Promise<Goal> {
  return withAuthRetry((token) => backendFetch<Goal>("/api/goals", { method: "POST", body: input, accessToken: token }));
}

export function updateGoal(id: number, input: GoalInput): Promise<Goal> {
  return withAuthRetry((token) =>
    backendFetch<Goal>(`/api/goals/${id}`, { method: "PUT", body: input, accessToken: token })
  );
}

export function deleteGoal(id: number): Promise<void> {
  return withAuthRetry((token) => backendFetch<void>(`/api/goals/${id}`, { method: "DELETE", accessToken: token }));
}

export function addGoalContribution(goalId: number, input: GoalContributionInput): Promise<Goal> {
  return withAuthRetry((token) =>
    backendFetch<Goal>(`/api/goals/${goalId}/contributions`, { method: "POST", body: input, accessToken: token })
  );
}
