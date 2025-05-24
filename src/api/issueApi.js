import axiosInstance from "./axiosInstance";

const API_ISSUES_BASE_PATH = (teamId, projectId) =>
  `/api/teams/${teamId}/projects/${projectId}/issues`;

/**
 * Creates a new issue within a project.
 * Corresponds to: POST /api/teams/{teamId}/projects/{projectId}/issues (createIssue)
 * @param {number|string} teamId - The ID of the team.
 * @param {number|string} projectId - The ID of the project.
 * @param {object} issueCreateRequest - The issue creation data.
 * @returns {Promise<IssueResponse>}
 */
export const createIssue = async (teamId, projectId, issueCreateRequest) => {
  const response = await axiosInstance.post(
    API_ISSUES_BASE_PATH(teamId, projectId),
    issueCreateRequest
  );
  return response.data;
};

/**
 * Fetches a specific issue.
 * Corresponds to: GET /api/teams/{teamId}/projects/{projectId}/issues/{issueId} (findIssue)
 * @param {number|string} teamId - The ID of the team.
 * @param {number|string} projectId - The ID of the project.
 * @param {number|string} issueId - The ID of the issue.
 * @returns {Promise<IssueResponse>}
 */
export const findIssue = async (teamId, projectId, issueId) => {
  const response = await axiosInstance.get(
    `${API_ISSUES_BASE_PATH(teamId, projectId)}/${issueId}`
  );
  return response.data;
};

/**
 * Updates a specific issue.
 * Corresponds to: PUT /api/teams/{teamId}/projects/{projectId}/issues/{issueId} (updateIssue)
 * @param {number|string} teamId - The ID of the team.
 * @param {number|string} projectId - The ID of the project.
 * @param {number|string} issueId - The ID of the issue.
 * @param {object} issueUpdateRequest - The issue update data.
 * @returns {Promise<IssueResponse>}
 */
export const updateIssue = async (
  teamId,
  projectId,
  issueId,
  issueUpdateRequest
) => {
  const response = await axiosInstance.put(
    `${API_ISSUES_BASE_PATH(teamId, projectId)}/${issueId}`,
    issueUpdateRequest
  );
  return response.data;
};

/**
 * Estimates the story point for an issue.
 * Corresponds to: POST /api/teams/{teamId}/projects/{projectId}/issues/{issueId} (estimateStoryPoint)
 * Note: The OpenAPI spec shows this POST operation without a request body.
 * @param {number|string} teamId - The ID of the team.
 * @param {number|string} projectId - The ID of the project.
 * @param {number|string} issueId - The ID of the issue.
 * @returns {Promise<IssueResponse>}
 */
export const estimateStoryPoint = async (teamId, projectId, issueId) => {
  const response = await axiosInstance.post(
    `${API_ISSUES_BASE_PATH(teamId, projectId)}/${issueId}/story-point`
  );
  return response.data;
};

/**
 * Deletes a specific issue.
 * Corresponds to: DELETE /api/teams/{teamId}/projects/{projectId}/issues/{issueId} (deleteIssue)
 * @param {number|string} teamId - The ID of the team.
 * @param {number|string} projectId - The ID of the project.
 * @param {number|string} issueId - The ID of the issue.
 * @returns {Promise<void>}
 */
export const deleteIssue = async (teamId, projectId, issueId) => {
  await axiosInstance.delete(
    `${API_ISSUES_BASE_PATH(teamId, projectId)}/${issueId}`
  );
};

/**
 * Updates the status of a specific issue.
 * Corresponds to: PATCH /api/teams/{teamId}/projects/{projectId}/issues/{issueId} (updateIssueStatus)
 * @param {number|string} teamId - The ID of the team.
 * @param {number|string} projectId - The ID of the project.
 * @param {number|string} issueId - The ID of the issue.
 * @param {object} issueUpdateStatusRequest - The issue status update data (e.g., { issueStatus: "IN_PROGRESS" }).
 * @returns {Promise<IssueResponse>}
 */
export const updateIssueStatus = async (
  teamId,
  projectId,
  issueId,
  issueUpdateStatusRequest
) => {
  const response = await axiosInstance.patch(
    `${API_ISSUES_BASE_PATH(teamId, projectId)}/${issueId}`,
    issueUpdateStatusRequest
  );
  return response.data;
};
