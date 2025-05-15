import axiosInstance from "./axiosInstance";

const API_TEAMS_BASE_PATH = "/api/teams";

/**
 * Creates a new project within a team.
 * Corresponds to: POST /api/teams/{teamId}/projects (createProject)
 * @param {number|string} teamId - The ID of the team.
 * @param {object} projectCreateRequest - The project creation data (e.g., { projectName: "New Project" }).
 * @returns {Promise<ProjectCreateResponse>}
 */
export const createProject = async (teamId, projectCreateRequest) => {
  const response = await axiosInstance.post(
    `${API_TEAMS_BASE_PATH}/${teamId}/projects`,
    projectCreateRequest
  );
  return response.data;
};

/**
 * Fetches detailed information about a specific project.
 * Corresponds to: GET /api/teams/{teamId}/projects/{projectId} (findProjectDetail)
 * @param {number|string} teamId - The ID of the team.
 * @param {number|string} projectId - The ID of the project.
 * @returns {Promise<ProjectDetailResponse>}
 */
export const findProjectDetail = async (teamId, projectId) => {
  const response = await axiosInstance.get(
    `${API_TEAMS_BASE_PATH}/${teamId}/projects/${projectId}`
  );
  return response.data;
};

/**
 * Deletes a specific project.
 * Corresponds to: DELETE /api/teams/{teamId}/projects/{projectId} (deleteProject)
 * @param {number|string} teamId - The ID of the team.
 * @param {number|string} projectId - The ID of the project.
 * @returns {Promise<void>}
 */
export const deleteProject = async (teamId, projectId) => {
  await axiosInstance.delete(
    `${API_TEAMS_BASE_PATH}/${teamId}/projects/${projectId}`
  );
};

/**
 * Updates the name of a specific project.
 * Corresponds to: PATCH /api/teams/{teamId}/projects/{projectId} (updateProjectName)
 * @param {number|string} teamId - The ID of the team.
 * @param {number|string} projectId - The ID of the project.
 * @param {object} projectUpdateNameRequest - The project name update data (e.g., { projectName: "Updated Project Name" }).
 * @returns {Promise<ProjectUpdateNameResponse>}
 */
export const updateProjectName = async (
  teamId,
  projectId,
  projectUpdateNameRequest
) => {
  const response = await axiosInstance.patch(
    `${API_TEAMS_BASE_PATH}/${teamId}/projects/${projectId}`,
    projectUpdateNameRequest
  );
  return response.data;
};
